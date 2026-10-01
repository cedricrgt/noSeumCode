# Rule 23 – Test-Driven Development (TDD) Obligatoire

## 1. Principe Fondateur : TDD par défaut

L'agent a pour instruction stricte de suivre la méthodologie Test-Driven Development (TDD) pour toute nouvelle fonctionnalité, modification de logique métier ou correction de bug (TDD Bug Fixing). Aucun code métier ne doit être écrit sans qu'un test unitaire ou d'intégration ne l'ait préalablement justifié et couvert.

### Directives Cardinales :
- **Red-Green-Refactor strict** : Écrire d'abord le test en fonction des spécifications. Vérifier qu'il échoue (Red). Écrire ensuite le code de production minimal pour faire passer le test (Green). Optimiser et nettoyer le code en s'assurant que le test reste vert (Refactor).
- **Couverture par la preuve** : Le code de production n'est qu'une réponse à une exigence exprimée par un test.
- **Tests comme documentation vivante** : Les tests doivent décrire le comportement métier et les cas aux limites (Edge Cases) de manière lisible (ex: nommage `shouldReturnX_whenY`).

---

## 2. Déroulement Pratique de l'Exécution Agentique

Lorsque l'agent est mandaté pour coder :

1. **Phase de Test (Red)** :
   - Analyser le besoin.
   - Écrire un test unitaire ou d'intégration (Spring Boot Test, JUnit, Mockito) reflétant l'exigence.
   - Démontrer que le test échoue (si possible via exécution locale ou analyse statique).
2. **Phase d'Implémentation (Green)** :
   - Écrire l'implémentation dans la classe cible (Service, Controller, Domain).
   - Ne pas sur-concevoir (YAGNI).
3. **Phase de Refactorisation (Refactor)** :
   - Épurer l'architecture du code, appliquer les principes SOLID.
   - S'assurer de la pertinence et de la performance des méthodes, sans casser le comportement couvert par les tests.

---

## 3. Posture et Application

- **Interdiction de contourner la règle** : Ne jamais proposer d'écrire l'implémentation d'abord puis les tests "plus tard", sauf ordre humain explicite et contraint.
- **Orientation Qualité** : Intégrer les tests de sécurité (OWASP), de validation de flux, et de cas d'erreurs (Exceptions) dès la phase de rédaction des tests.
