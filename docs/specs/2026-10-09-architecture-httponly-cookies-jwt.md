# Spécification Technique & Architecture : Transition JWT vers Cookies HttpOnly SameSite

_Date : 09 Octobre 2026_  
_Statut : [ACCEPTED] (Prêt pour implémentation au sprint dédié)_  
_Référence : Sprint 26 (Tâche 26.2 / Section 6) — Mitigation OWASP XSS & Sécurisation des Jetons_

---

## 1. Contexte & Modèle de Menace

### Problématique Actuelle (ISSUE-009)
Actuellement, l'application NoSeumCode stocke les jetons JWT dans le `localStorage` du navigateur (`noseum_token`) et les transmet en en-tête HTTP `Authorization: Bearer <token>`. De plus, lors du callback OAuth2 (Google, Discord, GitHub), le jeton est véhiculé dans le fragment d'URL (`#token=...`).

### Risques Identifiés
1. **Vulnérabilité XSS (Cross-Site Scripting)** : Tout script JavaScript s'exécutant sur l'origine frontend (via injection, dépendance npm compromise ou script tiers malveillant) peut accéder directement à `window.localStorage` et exfiltrer le JWT de l'apprenant.
2. **Exposition Historique / Logs (OAuth2 fragment)** : Le token dans le fragment d'URL est accessible par le navigateur, stocké dans l'historique de session et manipulé par le client JavaScript.

### Objectif
Basculer la persistance des jetons d'accès (Access Token) et de rafraîchissement (Refresh Token) vers des cookies de session hautement sécurisés avec les attributs `HttpOnly`, `Secure` et `SameSite=Lax`, rendant tout vol de jeton par XSS techniquement impossible côté client.

---

## 2. Topologie Réseau & Domaine des Cookies

### Cartographie des Hôtes
- **Production Frontend** : `https://noseumcode.fr` (et `https://www.noseumcode.fr`)
- **Staging Frontend** : `https://develop.noseumcode.fr`
- **Backend API (REST & OAuth2)** : `https://api.noseumcode.fr`
- **Local Dev** : Frontend sur `http://localhost:3000`, Backend sur `http://localhost:8080`

### Propriété Same-Site des Sous-Domaines
Selon la spécification RFC 6265bis et les règles des Public Suffix Lists (PSL) :
- `noseumcode.fr` et `api.noseumcode.fr` partagent le même **eTLD+1** (`noseumcode.fr`).
- Les requêtes `fetch()` envoyées de `noseumcode.fr` vers `api.noseumcode.fr` sont considérées comme **Same-Site** (et non Cross-Site).
- L'attribut `Domain=.noseumcode.fr` permet au cookie d'être émis par `api.noseumcode.fr` et transmis automatiquement par le navigateur lors de toutes les requêtes vers `api.noseumcode.fr`, y compris lors de la navigation sur `noseumcode.fr`.

### Paramétrage des Cookies Cibles

| Cookie | Cible | Durée de vie | Path | Domain | Attributs |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `noseum_jwt` | Access Token JWT (HS256) | 1 heure | `/` | `.noseumcode.fr` (prod) | `HttpOnly; Secure; SameSite=Lax` |
| `noseum_refresh_token` | Refresh Token cryptographique | 7 jours | `/api/auth/refresh` | `.noseumcode.fr` (prod) | `HttpOnly; Secure; SameSite=Lax` |

> En environnement de développement local (`localhost`), l'attribut `Domain` est omis (cookie d'hôte), et `Secure` est désactivé si HTTP simple.

---

## 3. Architecture Backend (Spring Boot 4.1 & Spring Security 6)

### 3.1 Résolveur de Token Dual-Mode (`CustomBearerTokenResolver`)
Pour permettre une transition fluide sans rupture de service (backward compatibility avec les clients mobiles, tests unitaires ou requêtes programmatiques), le backend utilisera un `BearerTokenResolver` hybride :
1. Recherche en priorité l'en-tête `Authorization: Bearer <token>`.
2. Si l'en-tête est absent, extrait le token depuis le cookie `noseum_jwt` de la requête HTTP.

```java
public class CookieBearerTokenResolver implements BearerTokenResolver {
    private static final String COOKIE_NAME = "noseum_jwt";
    private final DefaultBearerTokenResolver defaultResolver = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        String headerToken = defaultResolver.resolve(request);
        if (headerToken != null) {
            return headerToken;
        }
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
```

### 3.2 Mitigation CSRF (Cross-Site Request Forgery)
Le passage à des cookies authentifiants nécessite une protection CSRF rigoureuse :
1. **SameSite=Lax** : Bloque l'envoi du cookie sur toutes les requêtes cross-site en méthode POST/PUT/DELETE provenant d'un site tiers.
2. **En-tête personnalisé `X-Requested-With`** : Toutes les requêtes AJAX/fetch frontend doivent inclure `X-Requested-With: XMLHttpRequest`. Le backend rejette en HTTP 403 toute requête mutative (`POST`, `PUT`, `DELETE`, `PATCH`) sans cet en-tête. Un navigateur ne peut pas injecter cet en-tête personnalisé depuis une page tierce sans déclencher un preflight CORS (rejeté par la politique CORS stricte).

### 3.3 Endpoints d'Authentification

#### `POST /api/auth/login` & `POST /api/auth/register`
- Génère le JWT d'accès et le refresh token.
- Injecte `Set-Cookie` via Spring `ResponseCookie` :
  ```java
  ResponseCookie jwtCookie = ResponseCookie.from("noseum_jwt", token)
          .httpOnly(true)
          .secure(isProd)
          .sameSite("Lax")
          .path("/")
          .domain(cookieDomain)
          .maxAge(Duration.ofHours(1))
          .build();
  response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
  ```
- Corps de la réponse : Renvoie uniquement le profil utilisateur `{ "id": "...", "email": "...", "role": "STUDENT" }` sans exposer le JWT dans le corps JSON.

#### Callback OAuth2 (`OAuth2AuthenticationSuccessHandler`)
- Supprime l'encodage du token dans le fragment d'URL.
- Pose les cookies `noseum_jwt` et `noseum_refresh_token` dans les en-têtes de réponse.
- Redirige proprement vers `https://noseumcode.fr/dashboard.html` sans aucun paramètre sensible dans l'URL.

#### `POST /api/auth/logout`
- Révoque le refresh token en base de données PostgreSQL.
- Écrase les cookies en envoyant `Max-Age=0` :
  ```java
  ResponseCookie deleteCookie = ResponseCookie.from("noseum_jwt", "")
          .maxAge(0)
          .path("/")
          .build();
  ```

---

## 4. Architecture Frontend (Vanilla JavaScript)

### 4.1 Orchestration des Requêtes Réseau (`apiFetch`)
Toutes les requêtes de l'application utilisent l'option native `credentials: 'include'` :
```javascript
async function apiFetch(url, options = {}) {
  const defaultOptions = {
    credentials: 'include', // Envoie et reçoit automatiquement les cookies HttpOnly
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Protection anti-CSRF
    }
  };
  return fetch(url, { ...defaultOptions, ...options });
}
```

### 4.2 Détection de Session Utilisateur
- Au chargement du site (`header.js`, `dashboard.js`), au lieu de tester `localStorage.getItem("noseum_token")`, l'application appelle l'endpoint léger `GET /api/auth/me`.
- Si `200 OK` : Session active, les données de profil (nom, rôle, progression) sont stockées en mémoire vive / sessionStorage d'affichage.
- Si `401 Unauthorized` : L'utilisateur est déconnecté, redirection vers le login si la page est protégée.

---

## 5. Matrice de Validation & Déploiement

1. **Phase 1 (Sprint 26 - Cadrage & Durcissement)** :
   - ✅ Conception formelle et validation architecturale (ce document).
   - ✅ Durcissement CORS prod (`app.cors.allowed-origins`).
2. **Phase 2 (Sprint dédié d'implémentation)** :
   - Création de `CookieBearerTokenResolver` et configuration dans Spring Security.
   - Refactorisation de `AuthController`, `OAuth2AuthenticationSuccessHandler` et `AuthService`.
   - Migration de `frontend/js/api.js` (`credentials: 'include'`).
   - Purge de la lecture de `noseum_token` dans `dashboard.js`, `header.js`, `cours.js`.
   - Tests de non-régression E2E Playwright validant la persistance de session sans token dans le `localStorage`.
