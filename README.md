# boutique-app

Storefront Next.js pour **Kernel** — plateforme SaaS de boutiques e-commerce pour vendeurs en Côte d'Ivoire et zone UEMOA.

Ce projet est la **réécriture du storefront** (anciennement en React) en **Next.js 14 App Router**, avec SSR, SEO et routing dynamique par boutique via le slug.

---

## Contexte

Kernel permet à des vendeurs de créer une boutique en ligne en quelques minutes. Chaque boutique est accessible via son propre slug : `kernelsshop.com/ma-boutique`.

Le flux acheteur est adapté au marché ivoirien :

- Pas de panier ni de paiement en ligne
- Commande directement via **WhatsApp** avec message pré-rempli
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

### Store

Le endpoint `GET /stores/:slug` doit retourner :

```json
{
  "data": {
    "id": "uuid",
    "name": "Yeo Sneakers",
    "slug": "yeo-sneakers",
    "status": "active",
    "isDeleted": false,
    "whatsappNumber": "+2250700000000",
    "logoUrl": "https://...",
    "bannerUrl": "https://...",
    "primaryColor": "#FF6B35",
    "tagline": "Les meilleures sneakers d'Abidjan",
    "description": "...",
    "owner": { "id": "uuid", "phone": "...", "role": "vendor" },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Champs obligatoires** : `name`, `slug`, `status`, `isDeleted`

**Champs optionnels avec fallback** :

- `logoUrl` → initiales du nom en cercle coloré
- `bannerUrl` → dégradé depuis `primaryColor`
- `primaryColor` → `#1A1A1A`
- `tagline` → `"Bienvenue dans notre boutique"`
- `whatsappNumber` → bouton WhatsApp masqué

### Products

Le endpoint `GET /stores/:slug/products` accepte ces query params :

| Param      | Type    | Description                      |
| ---------- | ------- | -------------------------------- |
| `page`     | number  | Pagination                       |
| `limit`    | number  | Nombre de résultats              |
| `featured` | boolean | Produits mis en avant (homepage) |
| `category` | string  | Filtre par catégorie             |
| `search`   | string  | Recherche textuelle              |

---

## Logique commande WhatsApp

Aucun formulaire, aucun backend impliqué. Le bouton "Commander" construit une URL `wa.me` avec un message pré-rempli :

```
Bonjour, je voudrais commander :

🛍️ *Converse All Star*
Couleur : Noir
Taille : 41
Prix : 25 000 FCFA

Merci !
```

Le vendeur reçoit ce message sur WhatsApp et gère la suite manuellement.

---

## Points d'attention

**`status` case-sensitive** : le backend doit renvoyer `"active"` en minuscules. Si ce n'est pas le cas, normaliser dans `lib/api.ts` :

```ts
if (data) data.status = data.status.toLowerCase();
```

**Params asynchrones** : Next.js 15 rend les `params` asynchrones. Toujours utiliser `const { slug } = await params`.

**Deux fetches séparés** : `layout.tsx` et `page.tsx` fetchent le store indépendamment. Next.js déduplique les requêtes identiques via le cache (`revalidate: 60`), donc pas de double appel réseau en pratique.

---

## Prochaines étapes

- [ ] Résoudre le bug `status` case-sensitive (voir section ci-dessus)
- [ ] Ajouter `not-found.tsx` personnalisé par boutique
- [ ] Thème 2 — `bold` (fond sombre, typographie large)
- [ ] Open Graph dynamique par produit (partage WhatsApp/Facebook)
- [ ] Page confirmation post-commande (optionnel)
