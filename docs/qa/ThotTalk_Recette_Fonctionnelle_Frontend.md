# ThotTalk — Recette fonctionnelle du frontend (v1, sur mocks)

**Projet :** ThotTalk — PFE Software Engineering GOMYCODE
**Testeur :** Sylvestre IBOMBO GAKOSSO
**Date :** ____ / ____ / 2026
**Environnement :** `npm run dev` (Vite) · Navigateur : ______________ · Console F12 ouverte : ☐

## Mode d'emploi

1. Dérouler les tests **dans l'ordre**. Chaque test : exécuter l'action, comparer au résultat attendu, cocher ✔ ou ✘.
2. Toute différence = **anomalie** à consigner dans le registre en fin de document, avec sa gravité :
   **B** = Bloquant · **M** = Majeur · **m** = Mineur · **C** = Cosmétique.
3. Toute erreur rouge en console = anomalie (même si l'écran semble normal). Warning jaune = à noter.
4. Réf. = exigence du cahier des charges couverte par le test.

---

## T1 — Authentification et session

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T1.1 | Ouvrir `/chat` sans être connecté (navigation privée) | Redirection immédiate vers `/login`, sans « flash » de la page chat | FR-02 | |
| T1.2 | Sur `/register` : soumettre le formulaire vide | 4 messages d'erreur sous les champs, aucun envoi | FR-01 | |
| T1.3 | Username de 2 caractères | Erreur « 3 caractères minimum » sous le champ | FR-01 | |
| T1.4 | Email `awa@test` (sans TLD) | Erreur « Format d'email invalide » | FR-01 | |
| T1.5 | Mot de passe de 7 caractères | Erreur « 8 caractères minimum » | FR-01 | |
| T1.6 | Confirmation différente du mot de passe | Erreur « Les mots de passe ne correspondent pas » | FR-01 | |
| T1.7 | Inscription valide | Bouton passe en « Création du compte… », puis arrivée sur `/chat`, username visible dans la sidebar | FR-01 | |
| T1.8 | Se déconnecter (bouton ⏻), puis `/login` avec `erreur@test.com` + mdp valide | Bandeau d'erreur serveur « Identifiants invalides », on reste sur `/login` | FR-02 | |
| T1.9 | Login valide | Bouton « Connexion… » pendant l'attente, puis `/chat` | FR-02 | |
| T1.10 | **F5** sur `/chat` | Toujours connecté, pas de passage par `/login` | FR-02 | |
| T1.11 | Double-clic rapide sur « Se connecter » | Un seul traitement (bouton désactivé pendant la soumission) | — | |
| T1.12 | Déconnexion depuis la sidebar | Retour `/login` ; puis « Précédent » du navigateur → toujours redirigé vers `/login` (pas d'accès au chat) | FR-03 | |

## T2 — Navigation et layout

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T2.1 | Arrivée sur `/chat` connecté | Sidebar lapis + écran de bienvenue ThotTalk à droite | — | |
| T2.2 | Observer la sidebar pendant le chargement | Mention « Chargement… » brève, puis 3 salons et 2 conversations | FR-05 | |
| T2.3 | Vérifier les badges non-lus | Badge or « 3 » sur #général, « 1 » sur Moussa, aucun ailleurs | — | |
| T2.4 | Vérifier les pastilles de présence | Verte sur Moussa, grise sur Binta | FR-07 | |
| T2.5 | Cliquer #projet-react | URL → `/chat/r2`, item en surbrillance lapis clair, en-tête « # projet-react · 3 membres » | FR-05 | |
| T2.6 | **F5** dans le salon | On reste dans #projet-react (URL source de vérité) | — | |
| T2.7 | Bouton « Précédent » du navigateur | Retour à l'écran de bienvenue `/chat` | — | |
| T2.8 | Taper `/chat/inexistant` à la main | Message « Ce salon n'existe pas… » + lien retour fonctionnel ; pas d'écran blanc, pas d'erreur console | — | |
| T2.9 | Naviguer vite : r1 → r2 → r3 → r1 (clics rapides) | Aucune erreur console, le contenu affiché correspond toujours au salon de l'URL | — | |

## T3 — Flux de messages

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T3.1 | Entrer dans #projet-react | « Chargement des messages… » bref, puis l'historique (2 messages) | FR-12 | |
| T3.2 | Vérifier les bulles de l'historique | Awa à gauche (blanc, avatar), Sylvestre à droite (lapis, sans avatar), horodatages affichés | FR-06 | |
| T3.3 | Envoyer « Bonjour ! » | Apparition **instantanée** à droite avec 🕐 « Envoi… », qui devient ✓ après ~0,5 s | FR-06 | |
| T3.4 | Vérifier le champ après envoi | Vidé, prêt pour la saisie suivante | — | |
| T3.5 | Tenter d'envoyer uniquement des espaces | Rien ne part, bouton désactivé | — | |
| T3.6 | Attendre ~8 s dans le salon | « X est en train d'écrire… » en italique pulsé, puis le message de Moussa/Awa apparaît, l'indicateur disparaît | FR-09, FR-06 | |
| T3.7 | Observer le scroll à l'arrivée d'un message | La vue glisse automatiquement vers le bas (animation fluide) | — | |
| T3.8 | Envoyer un texte très long (10+ lignes, coller un paragraphe) | La bulle reste dans sa largeur max (75 % / 60 %), le texte revient à la ligne, pas de débordement horizontal | — | |
| T3.9 | **Test des doublons** : naviguer r1 → r2 → r1 → r2, rester dans r2, attendre un message simulé | Le message apparaît **une seule fois** (nettoyages d'effets corrects) | — | |
| T3.10 | Changer de salon pendant « Chargement des messages… » | Pas d'erreur console, le salon affiché correspond à l'URL finale | — | |
| T3.11 | Envoyer 5 messages d'affilée rapidement | Les 5 apparaissent dans l'ordre, chacun passe de 🕐 à ✓ | FR-06 | |

## T4 — Panneau des membres

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T4.1 | Desktop (≥ 1024 px) : entrer dans #général | Panneau visible à droite : « MEMBRES — 4 · 3 en ligne » | FR-07 | |
| T4.2 | Vérifier l'ordre et les états | En ligne d'abord ; Binta grisée avec pastille grise | FR-07 | |
| T4.3 | Vérifier le losange owner | ♦ or sur Sylvestre dans #général (r1) ; ♦ sur Moussa dans #design (r3) | FR-16/17 (préparation) | |
| T4.4 | Ouvrir une conversation privée (Moussa) | **Pas** de panneau membres, pas de bouton 👥 | — | |
| T4.5 | Réduire sous 1024 px dans un salon | Panneau masqué, bouton 👥 apparu dans l'en-tête | — | |
| T4.6 | Clic 👥 puis re-clic | Le panneau survole le chat, puis se replie | — | |

## T5 — Profil

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T5.1 | Cliquer son bloc utilisateur dans la sidebar | Arrivée sur `/profile`, champs pré-remplis, email affiché non éditable | FR-04 | |
| T5.2 | Observer le bouton « Enregistrer » à l'arrivée | Désactivé (rien n'a été modifié) | — | |
| T5.3 | Modifier le username → bouton | Le bouton s'active | — | |
| T5.4 | Username de 2 caractères | Erreur de validation, pas d'enregistrement | FR-04 | |
| T5.5 | Enregistrer un nouveau username valide, retour au chat | Nouveau nom dans la sidebar **et** sur les prochains messages envoyés | FR-04 | |
| T5.6 | **F5** | Le changement a survécu (persistance) | — | |
| T5.7 | Accéder à `/profile` déconnecté (navigation privée) | Redirection `/login` | — | |

## T6 — Responsive (mobile < 768 px, simulateur F12 ou téléphone)

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T6.1 | `/chat` en mobile | Liste seule, plein écran (pas de zone de bienvenue) | ENF-Compat | |
| T6.2 | Entrer dans un salon | Conversation plein écran, flèche ← dans l'en-tête | ENF-Compat | |
| T6.3 | Flèche ← | Retour à la liste | ENF-Compat | |
| T6.4 | Tester à 320 px de large | Aucun débordement horizontal, textes tronqués proprement (…) | ENF-Compat | |
| T6.5 | Envoyer un message en mobile | Saisie confortable, bouton ➤ atteignable au pouce | ENF-Compat | |
| T6.6 | Login/Register en mobile | Carte lisible, champs utilisables, pas de zoom forcé | ENF-Compat | |

## T7 — Robustesse et console

| # | Action | Résultat attendu | Réf. | ✔/✘ |
|---|---|---|---|---|
| T7.1 | Parcourir toute l'app avec la console ouverte | **Zéro erreur rouge** sur l'ensemble du parcours | — | |
| T7.2 | Relever les warnings jaunes éventuels | Listés dans le registre (StrictMode : doubles logs en dev = normal, ne pas consigner) | — | |
| T7.3 | Supprimer `thottalk_user` du localStorage (onglet Application) puis F5 sur `/chat` | Redirection propre vers `/login`, pas d'écran blanc | — | |
| T7.4 | Mettre un JSON invalide dans `thottalk_user` puis F5 | Comportement à observer et consigner (crash probable → anomalie connue, correction en Phase 7 avec la vraie session JWT) | — | |

---

## Registre des anomalies

| ID | Test | Description observée | Gravité (B/M/m/C) | Statut |
|---|---|---|---|---|
| A1 | | | | Ouverte |
| A2 | | | | Ouverte |
| A3 | | | | Ouverte |
| A4 | | | | Ouverte |
| A5 | | | | Ouverte |

## Bilan de recette

- Tests exécutés : ____ / 46
- Réussis : ____ · Échoués : ____
- Anomalies : B ____ · M ____ · m ____ · C ____
- **Verdict** : ☐ Recette prononcée (aucun B/M ouvert) → ouverture de la Phase 7
  ☐ Recette ajournée → correction des anomalies B/M puis re-test

*Ce document sera annexé au rapport technique (Phase 14) comme preuve de la démarche qualité.*
