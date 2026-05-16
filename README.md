# boutique-app

Storefront **Next.js 14** pour Kernel — réécriture de l'ancien storefront React.  
Chaque boutique est accessible via son slug : `/[slug]`

---

## Stack

- **Next.js 14** App Router + SSR
- **TypeScript** + **Tailwind CSS**
- Backend séparé : **NestJS**

---

## Structure

```
app/
  layout.tsx
  page.tsx                        # Redirect → kernelsshop.com
  [slug]/
    layout.tsx                    # Fetch store + Navigation + Footer
    page.tsx                      # Homepage boutique
    loading.tsx
    not-found.tsx
    produits/
      page.tsx                    # Catalogue
      loading.tsx
      [productId]/
        page.tsx                  # Fiche produit
        loading.tsx

components/
  shared/
    ProductCard.tsx
  themes/
    minimal/                      # Thème actuel
      Navigation.tsx
      Footer.tsx
      HomePage.tsx
      CataloguePage.tsx
      ProductPage.tsx

lib/
  api.ts                          # Tous les appels backend

types/
  store.ts
  product.ts
```

---

## Installation

```bash
npm install
npm install -D tailwind-scrollbar-hide
```

`.env.local` :

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

```bash
npm run dev   # → http://localhost:3001
```

---

## Points d'attention

**`status` case-sensitive** — si le backend renvoie `"ACTIVE"` au lieu de `"active"`, normaliser dans `lib/api.ts` :

```ts
if (data?.status) data.status = data.status.toLowerCase();
```

**Params asynchrones** — Next.js 15 : toujours `const { slug } = await params`.
