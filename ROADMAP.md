# 🧭 Lagrange — feuille de route

*État mesuré le 31/10/2026.*

## Où on en est

**Version 2.0.0**, branche `main` (14/10/2026). Elle tourne en local sur le MBP, et ses 33
tests sont verts. Elle n'est plus servie en ligne.

| Quand | Ce qui s'est passé |
|---|---|
| 07/2025 | Premier jet (« Système Solaire PREMIUM »), mis en ligne sur le VPS CX32 sous `space.digitoptimmo.fr`. Le VPS est resté sur cette version jusqu'au bout. |
| 01/2026 | Branche `dev` : missions spatiales, astéroïdes képlériens, application Flask modulaire. Jamais déployée. |
| 13-14/10/2026 | Refonte sur `main` par l'agent Mistral Vibe : vraie mécanique de Kepler, points L1-L5, pluie d'astéroïdes avec captures troyennes, three.js embarqué. Le meilleur de `dev` est repris (missions, tour cinématique, app factory sécurisée). |
| 29-30/10/2026 | Retrait du VPS, rapatriement sur le MBP (`~/Applications-JB`), port 5055. |

## La question à trancher d'abord : pour qui ?

Les chantiers qui suivent en dépendent. Lagrange est une très belle démonstration
pédagogique, mais sans public désigné. Trois chemins possibles :

1. **Rester un projet local**, ouvert quand on en a envie. Rien à faire de plus.
2. **La montrer à la famille ou à une classe** : il faut alors la remettre en ligne. Elle
   est **entièrement statique** : le gabarit n'a aucune variable, et le JavaScript n'appelle
   jamais le serveur. Caddy pourrait donc la servir comme simples fichiers, comme la carte
   des monuments, **sans Flask, sans service et sans mémoire occupée** sur le VPS. Ce serait
   beaucoup plus léger que la recette Flask du §4.10 d'Architecture-JB.
3. **En faire une vitrine** (portfolio, démonstration de savoir-faire) : même hébergement,
   plus un nom de domaine choisi et un vrai soin du référencement.

## Petits chantiers d'hygiène

Chacun prend quelques minutes, sans urgence.

- [ ] **Embarquer la police Orbitron** au lieu de la charger depuis Google Fonts. C'est la
  dernière dépendance externe : elle contredit le « aucun CDN », et chaque visite
  transmet l'adresse IP du visiteur à Google, ce qui pose un problème RGPD dès que la page
  est publique. Il suffit de copier les fichiers `woff2` dans `static/`, puis de retirer
  `fonts.googleapis.com` et `fonts.gstatic.com` de la CSP.
- [ ] **Resserrer la CSP de production** : `script-src 'unsafe-inline'` ne sert à rien, la
  page ne contient aucun script en ligne (un seul module externe). L'en-tête
  `X-XSS-Protection` est obsolète et peut partir.
- [x] **Déclarer `pytest`** comme dépendance de développement (31/10) : groupe `dev` de
  `pyproject.toml`. Le `poetry.lock`, périmé depuis le 13/10 (il listait encore pythreejs,
  ipywidgets, numpy…), a été régénéré, et le `.venv` concorde avec lui.
  ⚠ **Sur le MBP, le terminal de VS Code exporte `VIRTUAL_ENV` vers le Python de pyenv** :
  un `poetry install` nu installerait là, et non dans `.venv`. Toujours lancer
  `VIRTUAL_ENV=$PWD/.venv poetry install`.
- [ ] **Faire le ménage des branches sur GitHub** : `dev` (janvier) est entièrement reprise
  dans `main`, et `vibe/relaunch-lagrange-ea092f` pointe sur le même commit que `main`
  (c'est un reste de l'agent). Les deux peuvent être supprimées. **C'est un geste de JB.**

## Idées pour la suite

Elles étaient listées dans le README.

- **Mode « JWST »** : placer soi-même un télescope à L2 et le voir tenir sa position.
- **Potentiel effectif en contours colorés**, pour voir les « puits » de Lagrange au lieu de
  seulement les nommer.
- **Tour guidé narratif « De Copernic à Lagrange »** : le tour cinématique existe déjà, il
  lui manque un récit.
