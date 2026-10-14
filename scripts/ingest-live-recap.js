#!/usr/bin/env node

/**
 * ============================================================================
 * NoSeumCode - Pipeline d'Ingestion Live Discord vers Récapitulatif de Cours
 * ============================================================================
 * Ce script automatise la chaîne de traitement suivante :
 * 1. Extraction et téléversement de la piste audio du live vers Gemini File API.
 * 2. Transcription, filtrage du bruit et structuration didactique (JSON Schema).
 * 3. Envoi atomique du récapitulatif (Chapitre parent + Sous-chapitres + Markdown)
 *    vers l'API NoSeumCode en statut PENDING_APPROVAL.
 *
 * Utilisation :
 *   node scripts/ingest-live-recap.js --course=html-css --file=./live.mp3 [options]
 *
 * Options :
 *   --course, -c        Slug du cours cible (ex: html-css, git-github, javascript)
 *   --file, -f          Chemin du fichier audio ou vidéo (.mp3, .wav, .aac, .mp4, .m4a)
 *   --title, -t         Titre explicite de la session live (optionnel)
 *   --video-url, -v     URL du replay vidéo (Cloudflare R2, Bunny.net, YouTube...)
 *   --api-url           URL de base de l'API NoSeumCode (défaut: http://localhost:8080)
 *   --token             Jeton JWT d'authentification (ROLE_TEACHER ou ROLE_ADMIN)
 *   --dry-run           Génère la structure sans publier vers le backend
 *   --mock              Utilise un jeu de test pédagogique simulé (sans appel Gemini)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// 1. Parsing des arguments de ligne de commande
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    course: null,
    file: null,
    title: null,
    videoUrl: null,
    apiUrl: process.env.NOSEUM_API_URL || 'http://localhost:8080',
    token: process.env.NOSEUM_TOKEN || null,
    dryRun: false,
    mock: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--course=')) {
      options.course = arg.split('=')[1];
    } else if (arg === '-c' && args[i + 1]) {
      options.course = args[++i];
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
    } else if (arg === '-f' && args[i + 1]) {
      options.file = args[++i];
    } else if (arg.startsWith('--title=')) {
      options.title = arg.split('=')[1];
    } else if (arg === '-t' && args[i + 1]) {
      options.title = args[++i];
    } else if (arg.startsWith('--video-url=')) {
      options.videoUrl = arg.split('=')[1];
    } else if (arg === '-v' && args[i + 1]) {
      options.videoUrl = args[++i];
    } else if (arg.startsWith('--api-url=')) {
      options.apiUrl = arg.split('=')[1];
    } else if (arg.startsWith('--token=')) {
      options.token = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--mock') {
      options.mock = true;
    }
  }

  return options;
}

// 2. Détermination du type MIME audio/vidéo
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.mp3': return 'audio/mp3';
    case '.wav': return 'audio/wav';
    case '.aac': return 'audio/aac';
    case '.m4a': return 'audio/m4a';
    case '.ogg': return 'audio/ogg';
    case '.mp4': return 'video/mp4';
    case '.webm': return 'video/webm';
    default: return 'application/octet-stream';
  }
}

// 3. Téléversement de l'audio via l'API Gemini Files
async function uploadToGeminiFiles(filePath, mimeType, apiKey) {
  console.log(`📤 Téléversement du fichier (${(fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)} Mo) vers Gemini File API...`);

  const fileStats = fs.statSync(filePath);
  const fileData = fs.readFileSync(filePath);

  const initRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': fileStats.size.toString(),
      'X-Goog-Upload-Header-Content-Type': mimeType,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file: { display_name: path.basename(filePath) }
    })
  });

  if (!initRes.ok) {
    const errText = await initRes.text();
    throw new Error(`Échec de l'initialisation de l'upload Gemini: ${initRes.status} ${errText}`);
  }

  const uploadUrl = initRes.headers.get('x-goog-upload-url');
  if (!uploadUrl) {
    throw new Error("URL de téléversement Gemini introuvable dans les en-têtes.");
  }

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Length': fileStats.size.toString(),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize'
    },
    body: fileData
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Échec du transfert binaire Gemini: ${uploadRes.status} ${errText}`);
  }

  const fileInfo = await uploadRes.json();
  console.log(`✅ Fichier disponible sur Gemini: ${fileInfo.file.uri} (${fileInfo.file.state})`);
  return fileInfo.file;
}

// 4. Invocation de Gemini pour extraction didactique structurée
async function generateCourseRecapWithGemini(fileUri, mimeType, courseSlug, optionalTitle, apiKey) {
  console.log("🧠 Analyse didactique par Gemini (filtrage du bruit, synthèse et chapitrage)...");

  const prompt = `Tu es un Lead Développeur et Ingénieur Pédagogique Senior de l'école NoSeumCode.
Tu analyses l'enregistrement d'une conférence live Discord sur le cours : "${courseSlug}".

INSTRUCTIONS DIDACTIQUES STRICTES :
1. Ignore tous les bavardages oraux, hésitations, problèmes techniques ("vous m'entendez ?", "j'attends le retour"), pauses ou digressions.
2. Structure la matière en un récapitulatif de cours haute valeur ajoutée, articulé en sous-chapitres logiques et progressifs.
3. Rédige chaque sous-chapitre en pur Markdown standard GitHub, strictement aligné à gauche (ADR-020) :
   - Titres H2 et H3 clairs
   - Notions théoriques clés expliquées avec rigueur
   - Blocs de code complets, propres et commentés (ex: \`\`\`html, \`\`\`css, \`\`\`javascript)
   - Alertes des pièges et erreurs classiques vus en direct
   - Pas de balises HTML non autorisées (car le frontend applique escapeHtml)
4. Assigne à chaque sous-chapitre un horodatage précis (videoTimestampStart) au format HH:MM:SS ou MM:SS correspondant au début de l'explication dans la vidéo.
5. Si un titre de session est fourni ("${optionalTitle || ''}"), utilise-le ou raffine-le. Sinon, génère un titre percutant commençant par "[Replay Live]".`;

  const payload = {
    contents: [
      {
        parts: [
          {
            file_data: {
              file_uri: fileUri,
              mime_type: mimeType
            }
          },
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          sessionTitle: { type: "STRING" },
          summary: { type: "STRING" },
          subChapters: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                position: { type: "INTEGER" },
                videoTimestampStart: { type: "STRING" },
                markdownContent: { type: "STRING" }
              },
              required: ["title", "position", "markdownContent"]
            }
          }
        },
        required: ["sessionTitle", "summary", "subChapters"]
      }
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erreur Gemini API (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const rawText = json.candidates[0].content.parts[0].text;
  return JSON.parse(rawText);
}

// 5. Génération de données pédagogiques simulées (Mode Mock)
function getMockRecap(courseSlug, customTitle, videoUrl) {
  return {
    sessionTitle: customTitle || `[Replay Live] Maîtrise Approfondie & Cas Pratiques — ${courseSlug.toUpperCase()}`,
    summary: `Session de consolidation en direct dédiée à la mise en pratique des concepts clés de ${courseSlug}, aux bonnes pratiques professionnelles et à la résolution des bugs courants.`,
    subChapters: [
      {
        title: "1. Concepts Fondamentaux & Architecture",
        position: 1,
        videoTimestampStart: "00:03:15",
        markdownContent: `## Principes Fondamentaux\n\nLors de cette première partie de session, nous avons décomposé les règles essentielles d'architecture pour garantir un code maintenable et robuste.\n\n### Les 3 piliers à retenir :\n- **Sémantique stricte** : Choisir chaque élément selon son rôle structurel plutôt que son rendu visuel.\n- **Découplage des responsabilités** : Isoler la structure, le style et la logique applicative.\n- **Accessibilité universelle** : Respecter les contrastes normatifs (WCAG AA/AAA) et la navigation clavier.\n\n\`\`\`html\n<!-- Exemple de structure recommandée -->\n<article class="concept-card">\n  <header>\n    <h2>Structuration Sémantique</h2>\n    <p class="tagline">Composant accessible et isolé</p>\n  </header>\n  <main class="concept-body">\n    <p>Contenu principal conforme aux standards industriels.</p>\n  </main>\n</article>\n\`\`\``
      },
      {
        title: "2. Démonstrations en Direct & Débogage",
        position: 2,
        videoTimestampStart: "00:32:40",
        markdownContent: `## Cas Pratiques Résolus en Live\n\nNous avons analysé ensemble plusieurs erreurs fréquentes rencontrées par les étudiants lors des travaux pratiques.\n\n### Piège fréquent : Le décalage de layout (CLS)\nLe Cumulative Layout Shift survient lorsque des éléments graphiques changent de position pendant le rendu.\n\n> **Règle d'or** : Toujours déclarer les attributs explicites \`width\` et \`height\` ou utiliser la propriété CSS \`aspect-ratio\` sur les conteneurs d'images et de bannières.`
      },
      {
        title: "3. Exercice de Consolidation & Défi",
        position: 3,
        videoTimestampStart: "01:18:10",
        markdownContent: `## Défi Autonome de la Semaine\n\nAppliquez les notions vues en conférence en réalisant l'exercice suivant :\n\n1. Reproduire le composant interactif présenté à l'écran sans aucune dépendance externe.\n2. Vérifier la validité HTML5 avec le validateur W3C.\n3. Publier votre solution sur GitHub et poster le lien dans le salon dédié sur Discord.`
      }
    ]
  };
}

// 6. Envoi au Backend NoSeumCode (REST API)
async function sendToNoSeumBackend(recapData, options) {
  const endpoint = `${options.apiUrl}/api/chapters/live-recap`;
  console.log(`🚀 Envoi du récapitulatif vers l'API backend: ${endpoint}...`);

  const payload = {
    courseSlug: options.course,
    sessionTitle: recapData.sessionTitle,
    summary: recapData.summary,
    videoUrl: options.videoUrl,
    subChapters: recapData.subChapters
  };

  const headers = {
    'Content-Type': 'application/json'
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API NoSeumCode (${response.status}): ${errorText}`);
  }

  return await response.json();
}

// 7. Fonction Principale
async function main() {
  const options = parseArgs();

  console.log("==================================================================");
  console.log("   NoSeumCode — Ingestion Live Discord vers Récapitulatif de Cours");
  console.log("==================================================================");

  if (!options.course) {
    console.error("❌ Erreur : Le paramètre --course est requis (ex: --course=html-css).");
    process.exit(1);
  }

  if (!options.file && !options.mock) {
    console.error("❌ Erreur : Le paramètre --file est requis (ou utilisez --mock pour tester sans fichier).");
    process.exit(1);
  }

  let recapData = null;

  if (options.mock) {
    console.log("ℹ️ Mode Mock activé : génération de données simulées...");
    recapData = getMockRecap(options.course, options.title, options.videoUrl);
  } else {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Erreur : La variable d'environnement GEMINI_API_KEY est requise.");
      process.exit(1);
    }

    if (!fs.existsSync(options.file)) {
      console.error(`❌ Fichier introuvable : ${options.file}`);
      process.exit(1);
    }

    const mimeType = getMimeType(options.file);
    const geminiFile = await uploadToGeminiFiles(options.file, mimeType, apiKey);
    recapData = await generateCourseRecapWithGemini(geminiFile.uri, mimeType, options.course, options.title, apiKey);
  }

  console.log("\n--- Récapitulatif Structuré ---");
  console.log(`Titre    : ${recapData.sessionTitle}`);
  console.log(`Résumé   : ${recapData.summary}`);
  console.log(`Sections : ${recapData.subChapters.length} sous-chapitres générés.`);

  if (options.dryRun) {
    console.log("\n[DRY RUN] Résultat JSON généré :");
    console.log(JSON.stringify(recapData, null, 2));
    console.log("\n✅ Traitement terminé avec succès (aucun enregistrement en base).");
    return;
  }

  try {
    const result = await sendToNoSeumBackend(recapData, options);
    console.log("\n🎉 Succès ! Le cours live a été intégré à la plateforme :");
    console.log(`  - Chapitre Racine ID : ${result.parentChapterId}`);
    console.log(`  - Cours               : ${result.courseTitle} (${result.courseSlug})`);
    console.log(`  - Statut              : ${result.status} (en attente de validation enseignant)`);
    console.log(`  - Sous-chapitres créés: ${result.subChaptersCount}`);
    console.log(`  - IDs Sous-chapitres  : ${result.subChapterIds.join(', ')}`);
    console.log("\n👉 Rendez-vous sur le tableau de bord pour relire et approuver le récapitulatif !");
  } catch (err) {
    console.error(`\n❌ Échec de la publication : ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("\n💥 Erreur fatale :", err);
  process.exit(1);
});
