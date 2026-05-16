# boutique-app

Storefront Next.js pour **Kernel** — plateforme SaaS de boutiques e-commerce pour vendeurs en Côte d'Ivoire et zone UEMOA.

Ce projet est la **réécriture du storefront** (anciennement en React) en **Next.js 14 App Router**, avec SSR, SEO et routing dynamique par boutique via le slug.

---

## Contexte

Kernel permet à des vendeurs de créer une boutique en ligne en quelques minutes. Chaque boutique est accessible via son propre slug : `kernelsshop.com/ma-boutique`.

Le flux acheteur est adapté au marché ivoirien :

- Pas de panier ni de
- Pas paiement en ligne pour le moment
- Paiement à la livraison
- Interface mobile-first

---

## Stack

| Outil                   | Rôle                                           |
| ----------------------- | ---------------------------------------------- |
| Next.js 14 (App Router) | Framework frontend / SSR                       |
| TypeScript              | Typage statique                                |
| Tailwind CSS            | Styles utilitaires                             |
| tailwind-scrollbar-hide | Masquer les scrollbars sur les chips de filtre |

Backend : **NestJS** (projet séparé) exposant une API REST.

---

## Architecture

```
boutique-app/
├── app/
│   ├── layout.tsx                        # Layout racine (html + body + globals.css)
│   ├── page.tsx                          # Route "/" → redirect vers kernelsshop.com
│   └── [slug]/                           # Routes dynamiques par boutique
│       ├── layout.tsx                    # Fetch store + Navigation + Footer
│       ├── page.tsx                      # Homepage boutique
│       ├── loading.tsx                   # Skeleton homepage
│       ├── not-found.tsx                 # Page 404 boutique inactive ou inexistante
│       └── produits/
│           ├── page.tsx                  # Catalogue produits
│           ├── loading.tsx               # Skeleton catalogue
│           └── [productId]/
│               ├── page.tsx              # Fiche produit
│               └── loading.tsx           # Skeleton fiche produit
│
├── components/
│   ├── shared/
│   │   └── ProductCard.tsx              # Carte produit réutilisable (image, prix, variants)
│   └── themes/
│       └── minimal/                     # Thème "Light" (inspiré screenshot Figma)
│           ├── Navigation.tsx           # Header desktop + top bar mobile + bottom nav mobile
│           ├── Footer.tsx               # Footer 3 colonnes avec badge Kernel
│           ├── HomePage.tsx             # Bannière hero + produits vedettes + bandeau WA
│           ├── CataloguePage.tsx        # Grille + recherche + filtres catégories
│           └── ProductPage.tsx          # Images + sélecteurs variants + CTA WhatsApp
│
├── lib/
│   └── api.ts                           # Toutes les fonctions fetch vers le backend NestJS
│
├── types/
│   ├── store.ts                         # StoreData + utilitaires (initiales, WhatsApp URL...)
│   ├── product.ts                       # Product, ProductVariant, ProductImage + utilitaires
│   └── cart.ts                          # (réservé — non utilisé, marché sans panier)
│
└── tailwind.config.ts                   # Config Tailwind + plugin scrollbar-hide
```

---

## Routes

| URL                            | Page                                  |
| ------------------------------ | ------------------------------------- |
| `/`                            | Redirect vers kernelsshop.com         |
| `/[slug]`                      | Homepage de la boutique               |
| `/[slug]/produits`             | Catalogue complet                     |
| `/[slug]/produits/[productId]` | Fiche produit avec sélection variants |

---

## Thèmes

Le système est conçu pour supporter plusieurs thèmes visuels. Chaque thème est un dossier dans `components/themes/` contenant ses propres composants de page.

Actuellement : **1 thème — `minimal`** (design blanc, épuré, mobile-first).

Pour ajouter un thème `bold` :

1. Créer `components/themes/bold/` avec les mêmes composants
2. Ajouter `themeId` dans `StoreData`
3. Dans `[slug]/layout.tsx`, switcher le thème selon `store.themeId`

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

En production, remplacer par l'URL réelle du backend NestJS.

---

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Installer le plugin Tailwind scrollbar
npm install -D tailwind-scrollbar-hide

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer NEXT_PUBLIC_API_URL

# 4. Lancer en développement
npm run dev
```

L'app tourne sur `http://localhost:3001` (3000 étant occupé par NestJS).

---

## Données attendues depuis le backend

## Prochaines étapes

- [ ] Ajouter `not-found.tsx` personnalisé par boutique
- [ ] Thème 2 — `bold` (fond sombre, typographie large)
