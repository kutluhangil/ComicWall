<div align="center">

<img src="docs/media/hero.svg" alt="ComicWall — premium comic-style art posters" width="100%">

<p>
  <a href="https://comicwall.vercel.app"><img alt="Live" src="https://img.shields.io/badge/live-visit%20the%20shop-ff3d6e?style=for-the-badge&labelColor=120610"></a>
  <img alt="React" src="https://img.shields.io/badge/React-shadcn%2Fui-ffd23f?style=for-the-badge&labelColor=120610">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-auth%20%2B%20edge-3dc8ff?style=for-the-badge&labelColor=120610">
  <img alt="Languages" src="https://img.shields.io/badge/UI-TR%20%2F%20EN-ff3d6e?style=for-the-badge&labelColor=120610">
</p>

<p><em>An e-commerce store for premium, comic-style art posters.<br>
A full shopping flow wrapped in punchy motion, built to turn a wall into a superpower.</em></p>

<a href="https://comicwall.vercel.app"><img src="public/og-image.jpg" alt="ComicWall" width="100%"></a>

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## Features

| | |
|---|---|
| **Immersive UI** | Framer Motion animations, particle effects and a bold comic look. |
| **Shopping flow** | Catalogue, cart, wishlist, checkout and order history. |
| **Payments** | iyzico checkout with callbacks, plus refund requests and processing. |
| **Notifications** | Shipping and contact emails sent from Supabase Edge Functions. |
| **Accounts** | Sign-up, profiles and past orders on Supabase Auth. |
| **Themes and languages** | Dark and light modes, Turkish and English. |
| **Fast** | A Vite SPA with React Query caching. |

<img src="docs/media/divider.svg" width="100%" alt="">

## How it fits together

```mermaid
flowchart LR
  UI[React SPA · shadcn/ui] --> Q[React Query]
  Q --> DB[(Supabase Postgres · RLS)]
  UI --> AUTH[Supabase Auth]
  UI --> PAY[iyzico-create-payment] --> IYZ[iyzico]
  IYZ --> CB[iyzico-callback] --> DB
  DB --> MAIL[send-shipping-notification · send-contact-email]
  UI --> RF[request-refund → process-refund]
```

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**ComicWall**, yüksek kaliteli çizgi roman tarzı posterler satan modern bir e-ticaret sitesi. Ürün kataloğu, sepet, favoriler, ödeme ve sipariş geçmişi tam bir alışveriş akışı olarak çalışıyor; ödemeler iyzico ile alınıyor, kargo ve iletişim e-postaları Supabase Edge Function'larından gidiyor. Açık/koyu tema ve Türkçe/İngilizce arayüzü var.

<img src="docs/media/divider.svg" width="100%" alt="">

## Development

```sh
npm install
npm run dev       # http://localhost:8080
npm run build
supabase functions deploy   # payments, refunds and emails
```

```
src/pages/          shop, product, cart, checkout, orders, account, admin
src/components/     cards, galleries, cart drawer, effects
src/integrations/   Supabase client and types
supabase/           migrations and Edge Functions
```

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>Pow. Your wall just levelled up.</sub>
</div>
