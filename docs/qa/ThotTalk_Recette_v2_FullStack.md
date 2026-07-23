# ThotTalk — Recette fonctionnelle v2 (full-stack + temps réel)

**Testeur :** Sylvestre IBOMBO GAKOSSO · **Date :** ____ / ____ / 2026
**Dispositif :** Backend 🚀 + Frontend Vite · Navigateur 1 = compte A · Navigateur 2 (privé) = compte B
Console F12 ouverte des deux côtés : ☐ · Atlas ouvert : ☐ · Terminal serveur visible : ☐

**Rappels :** gravités B/M/m/C · toute erreur rouge console = anomalie · dérouler dans l'ordre.

---

## R1 — Utilisateurs (création, session, profil)

| # | Action | Résultat attendu | ✔/✘ |
|---|---|---|---|
| R1.1 | Nav. 2 : inscrire un compte B neuf (email jamais utilisé) | 201, arrivée sur /chat, username en sidebar | |
| R1.2 | Atlas → `users` | Le document B existe, password hashé `$2b$12$...` | |
| R1.3 | Nav. 2 : se déconnecter puis se réinscrire avec le même email | Bandeau « Ce email est déjà utilisé », reste sur /register | |
| R1.4 | Nav. 2 : login compte B | 200, /chat | |
| R1.5 | Terminal serveur au login de B | Ligne `⚡ socket connecté : <B> (...)` | |
| R1.6 | Nav. 1 : modifier le username de A dans /profile, puis F5 | Changement persisté (PATCH /users/me réel) | |
| R1.7 | Nav. 1 : onglet Network → WS après login | Connexion socket visible, frames qui vivent | |

## R2 — Salons : création et adhésion

| # | Action | Résultat attendu | ✔/✘ |
|---|---|---|---|
| R2.1 | A : bouton ＋ → créer le salon `recette-v2` | Modale se ferme, salon dans « Mes salons », navigation dedans, A visible seul membre + ♦ owner | |
| R2.2 | Atlas → `rooms` | Document créé : owner = A, members = [A] | |
| R2.3 | A : créer un salon avec un nom déjà pris | Bandeau 409 dans la modale, elle reste ouverte | |
| R2.4 | B : observer sa sidebar (F5 si besoin) | `recette-v2` apparaît dans « À découvrir » avec bouton Rejoindre | |
| R2.5 | B : cliquer Rejoindre | Le salon passe dans « Mes salons » de B, navigation dedans | |
| R2.6 | A : panneau des membres du salon | B apparaît dans la liste (F5 accepté pour l'instant — la liste des membres en temps réel arrive au Lot B5) | |

## R3 — Messages temps réel dans un salon

| # | Action | Résultat attendu | ✔/✘ |
|---|---|---|---|
| R3.1 | A et B dans `recette-v2` : A envoie « test R3.1 » | Chez A : apparition instantanée 🕐 → ✓, UNE seule fois. Chez B : apparition instantanée SANS F5 | |
| R3.2 | B répond « bien reçu » | Chez A : instantané, bulle blanche à gauche avec avatar de B | |
| R3.3 | Échange rapide : 5 messages alternés | Ordre identique dans les deux navigateurs, zéro doublon | |
| R3.4 | Atlas → `messages` | Tous les messages persistés, sender/room corrects | |
| R3.5 | A : naviguer vers un autre salon puis revenir, B envoie un message | Chez A : le message arrive une seule fois (nettoyages join/leave OK) | |
| R3.6 | A : F5 dans le salon | L'historique complet se recharge (REST), ordre chronologique | |
| R3.7 | Envoyer 35+ messages (script socket-client autorisé pour remplir) puis F5 | Seuls les ~30 derniers chargés (pagination page 1) | |
| R3.8 | Couper le backend (Ctrl+C) côté serveur | Bandeau « Reconnexion en cours… » dans les deux navigateurs | |
| R3.9 | Relancer le backend | Bandeau disparaît seul, un message envoyé ensuite circule normalement | |
| R3.10 | A : tenter d'envoyer 2000+ caractères (coller un pavé) | Bloqué à 2000 par le champ (maxLength), rien d'anormal | |

## R4 — Conversations privées

| # | Action | Résultat attendu | ✔/✘ |
|---|---|---|---|
| R4.1 | Créer la conversation A↔B (si pas d'UI dédiée : POST /conversations/with/:userId via Insomnia, puis F5 des sidebars — noter si l'UI manque : évolution à prévoir) | La conversation apparaît dans « Messages privés » des DEUX sidebars | |
| R4.2 | A : ouvrir la conversation, envoyer « privé R4 » | Chez B : arrive en temps réel dans la conversation | |
| R4.3 | Vérifier le titre affiché | Chez A : « B » · Chez B : « A » (chacun voit l'autre) | |
| R4.4 | Refaire le POST /conversations/with (même paire) | Même _id renvoyé (clé canonique), pas de doublon en sidebar | |
| R4.5 | Compte C (script ou 3e contexte) : tenter GET /messages/:convId de la conv A↔B | 403 « Vous ne participez pas… » | |
| R4.6 | Salon : pas de panneau membres sur une conversation | Confirmé (spec Lot 4) | |

## R5 — Quitter, modérer, supprimer

| # | Action | Résultat attendu | ✔/✘ |
|---|---|---|---|
| R5.1 | B : bouton « Quitter » dans `recette-v2` → confirmer | B revient à /chat, le salon retourne dans « À découvrir » chez B | |
| R5.2 | B : re-rejoindre | Accepté (un simple leave n'est pas un ban) | |
| R5.3 | A (owner) : survoler la ligne de B dans le panneau → ✕ Expulser → confirmer | B disparaît de la liste des membres côté A | |
| R5.4 | B : re-rejoindre après le kick simple | Accepté (kick sans ban = avertissement) | |
| R5.5 | A : ⛔ Bannir B → confirmer | B retiré ; Atlas → `rooms` : B dans `bannedUsers` | |
| R5.6 | B : tenter Rejoindre | Message « Vous êtes banni de ce salon » (403), pas d'entrée | |
| R5.7 | Test transfert d'ownership : salon jetable créé par A, B le rejoint, A clique « Quitter » (owner) | A sorti ; Atlas : owner = B désormais ; chez B le ♦ a changé de ligne (F5 accepté) | |
| R5.8 | B (nouvel owner) : bouton « Supprimer » → confirmer | Salon disparu des deux sidebars ; Atlas : room ET ses messages supprimés (cascade) | |
| R5.9 | Vérifier qu'un non-owner ne voit PAS Supprimer ni les boutons ✕/⛔ | Confirmé dans le navigateur de B sur un salon de A | |

## R6 — Anomalies gelées de la v1 (retest)

| # | Origine | Action | Résultat attendu | ✔/✘ |
|---|---|---|---|---|
| R6.1 | A3 (T4.5/T4.6) | Sous 1024 px : bouton 👥, ouvrir PUIS refermer le panneau | Toggle fonctionne dans les deux sens | |
| R6.2 | A4 (doublons) | Rester 2 min dans un salon actif après navigations multiples | Chaque message une seule fois (plus de simulation : que du réel) | |
| R6.3 | T7.3/T7.4 | Déjà fermées à la bascule auth | Reconfirmer d'un F5 avec token supprimé → /login propre | |

---

## Registre des anomalies v2

| ID | Test | Description observée | Gravité | Statut |
|---|---|---|---|---|
| A2-1 | | | | Ouverte |
| A2-2 | | | | Ouverte |
| A2-3 | | | | Ouverte |

## Bilan

Tests : ____ / 41 · Réussis : ____ · Échoués : ____ · Anomalies : B __ M __ m __ C __
**Verdict** : ☐ Recette v2 prononcée (0 B/M) → tests automatisés puis Lot B5
 ☐ Ajournée → corrections puis re-test ciblé
