# Website Image Audit & Optimization Plan

**Audit date:** 2026-10-28
**Scope:** Repository source, `public/` image files, Next.js image configuration, and image upload/database code. This is an audit only: no image assets, URLs, or application code were changed.

## 1. Executive summary

- **118 physical image assets** were found under `public/`, totaling **390,374,271 bytes** (**372.29 MiB / approximately 390.4 MB decimal**). This includes the favicon, product uploads, 10 DNG camera originals, and all nested image directories; it excludes videos and text files.
- The complete file-by-file inventory is in [image-audit-inventory.csv](./image-audit-inventory.csv). It includes **118 physical-file rows** plus **4 unresolved source rows**: two missing local URLs, one fixed remote email logo, and the uninspected MongoDB-managed product-image source.
- **54 physical files** have a literal code reference or framework convention. **36 product-upload files** have no literal code reference but may be referenced by MongoDB records. **28 other physical files** have no literal source reference found.
- **Two referenced local paths do not exist** in `public/`: `/images/hero-marina-aerial.jpg` and `/images/shop-tee.jpg`. The first is also used by a destination-page image tile, so that tile is expected to fail to load.
- `public/images/hero.jpg` is **2,730 × 1,536 PNG data** despite its `.jpg` extension. It is the home hero and the raw video poster; the poster path bypasses `next/image`.
- The largest files not referenced by literal code are `public/images/EYC About/EYC_main1.jpg` (**10,800 × 15,000; 44.89 MiB**) and `public/images/Marina/marina2.jpg` (**10,800 × 15,000; 33.44 MiB**). The Marina directory also contains **10 DNG files of about 18.2–18.4 MiB each**. Their actual raw pixel dimensions could not be decoded; the image library exposed only embedded 160 × 90 previews.
- SHA-256 comparison found **9 groups of byte-identical image files** with about **11.43 MiB of duplicate image bytes** beyond one copy per group. This is a storage/static-package opportunity; network savings depend on which duplicate URLs are requested together. Product-image references in MongoDB must be checked before any future deduplication.
- Most site content uses `next/image` with `fill` and parent aspect-ratio/height constraints. There are no authored mobile/tablet image variants in `public/`; Next.js creates optimized responsive candidates when images are rendered with the optimizer. The header/footer logo is explicitly `unoptimized`.
- High-priority performance candidates are the home hero/poster, multi-megabyte page/shop hero sources, eager loading of the footer logo, and incorrect `sizes` for wide gallery tiles. **No production Core Web Vitals, LCP, CLS, network waterfall, or deployed CDN measurements were taken.** The LCP/CLS observations below are code-based risk assessments, not measured results.

## 2. Scope, evidence, and limitations

Inspected:

- Every image-format file below `public/`, including nested galleries and uploads; dimensions, format, aspect ratio, and byte size were read from file metadata where possible.
- TSX, JSX, TypeScript, JavaScript, CSS, and Next.js configuration for `next/image`, `<img>`, CSS image URLs, local paths, external URLs, image imports, metadata references, dynamic image fields, and upload handling.
- The image-related page/component layout rules and their `sizes`, `fill`, `priority`, `loading`, and `unoptimized` props.
- SHA-256 hashes for exact byte-duplicate detection.

Limitations:

- MongoDB was **not queried**. Product documents, image URL-to-file mappings, remotely hosted product images, and current product alt text cannot be verified from this repository-only audit. The database is accessed through [src/db/index.ts](../src/db/index.ts); product image fields are declared in [src/db/schema.ts](../src/db/schema.ts).
- No live browser pages were shared, so the component’s rendered pixel dimensions were not measured in a browser. Recommendations use actual CSS breakpoints, aspect ratios, and `sizes` from source.
- No remote image bytes were fetched. The fixed remote email-logo URL and any HTTPS image URLs stored in MongoDB therefore have **unknown** dimensions and file sizes.
- DNG dimensions are **unknown**. A decoder exposed only an embedded 160 × 90 preview, which is not the camera original’s intrinsic resolution.
- Files with no literal source reference are described as *unreferenced by scanned code*, not proven unused. External links, production database records, or tooling outside this repository could still refer to them.

## 3. Complete image inventory

Use the CSV for the complete 118-file inventory and unresolved sources. Each row records:

- Project path and filename/URL.
- All source locations found, including repeated uses.
- Source width/height, aspect ratio, actual decoded format, extension, exact bytes, and KiB.
- Rendering method, fold position where determinable, authored responsive variants, and static/dynamic status.
- Current concerns, a recommendation profile, desktop/tablet/mobile dimensions, target aspect ratio, output-size guidance, format, crop guidance, and loading strategy.
- A **Use-specific profile assignments** field for assets reused in differently sized components.

Rows marked `UNKNOWN` are intentionally not guessed. The two missing files, fixed remote email logo, and unresolved MongoDB image source are included as non-file rows.

### Asset totals by directory

| Directory | Files | Total size |
|---|---:|---:|
| `public/images/` (top level) | 16 | 43.77 MiB |
| `public/images/EYC About/` | 12 | 72.07 MiB |
| `public/images/Marina/` | 27 | 229.15 MiB |
| `public/images/Shop/` | 13 | 15.83 MiB |
| `public/images/destinations/` | 7 | 0.46 MiB |
| `public/logo/` | 2 | 0.05 MiB |
| `public/uploads/products/` | 36 | 10.68 MiB |
| `public/uploads/rooms/EYC3/` | 4 | 0.28 MiB |
| `public/favicon.ico` | 1 | 0.004 MiB |
| **Total** | **118** | **372.29 MiB** |

Decoded formats: 62 JPEG, 40 PNG (including the mislabeled `hero.jpg`), 5 WebP, 10 DNG camera originals (the decoder exposed TIFF previews only), and 1 ICO. The ICO contains 16 × 16, 32 × 32, and 48 × 48 icons.

### Largest source files

| File | Intrinsic dimensions | Format | Size | Code use found |
|---|---:|---|---:|---|
| `public/images/EYC About/EYC_main1.jpg` | 10,800 × 15,000 | JPEG | 44.89 MiB | No literal reference |
| `public/images/Marina/marina2.jpg` | 10,800 × 15,000 | JPEG | 33.44 MiB | No literal reference |
| Each of 10 `public/images/Marina/*.DNG` files | Unknown; embedded preview 160 × 90 | DNG RAW | 18.19–18.36 MiB each | No literal reference |
| `public/images/attraction-hero.jpg` | 10,800 × 7,200 | JPEG | 9.06 MiB | Attractions page hero |
| `public/images/hero.jpg` | 2,730 × 1,536 | **PNG data, `.jpg` extension** | 7.87 MiB | Home hero and video poster |
| `public/images/Shop/hero3.jpg` | 3,300 × 4,200 | JPEG | 5.60 MiB | Shop carousel |
| `public/images/destination-hero.jpg` | 4,000 × 2,252 | JPEG | 4.39 MiB | Destination page hero |
| `public/images/Sunlit Exuma Cap and Starfish.png` | 1,672 × 941 | PNG | 3.99 MiB | No literal reference |
| `public/images/getting-here-hero.jpg` | 4,000 × 2,252 | JPEG | 3.63 MiB | Getting-here page hero |
| `public/images/about-hero.jpg` | 4,000 × 2,252 | JPEG | 2.98 MiB | About page hero |

Source file size is not the same as the transferred `next/image` derivative size. The latter was not measured. The video poster is an exception: it references the original `/images/hero.jpg` URL rather than the optimizer URL.

### Exact duplicate image files

These are byte-identical by SHA-256, not merely visually similar. **Nine image groups** account for approximately **11.43 MiB of extra identical bytes**:

1. `public/images/marina-1.jpg` = `public/images/EYC About/EYC_main8.jpg` (2.55 MiB extra copy).
2. `public/images/marina-2.jpg` = `public/images/Marina/marina3.jpg` (2.90 MiB).
3. `public/images/stay-room.jpg` = `public/uploads/rooms/EYC3/48633b62-9d49-4706-9521-fea2edf81809.jpg` (90.6 KiB).
4. `public/images/EYC About/EYC_main6.jpg` = `public/images/EYC About/EYC_main12.jpg` (2.89 MiB).
5. Product uploads `388a4f5e-ca4b-4f1f-be35-9802b52dff73.png`, `7c140a0a-7678-47d4-af2c-919482c1b981.png`, and `baafd34b-da55-4bed-a40d-79501cd47ed3.png` (812.7 KiB extra copies).
6. Product uploads `3bf72776-3812-4dbb-b61e-6b1c28a77dea.png`, `b7293fa5-e22c-4484-bb99-8cb572606855.png`, and `e72bd0e5-16d5-4318-8804-e31d54b17731.png` (874.6 KiB).
7. Product uploads `43576d9a-0c84-4900-b729-c861111a370c.png`, `ae83b235-155d-4004-8d8e-142ce6ac3408.png`, and `fb54294b-9120-4bc9-bdea-4458b127e308.png` (825.2 KiB).
8. Product uploads `448663b8-3351-45c2-ae13-db9fac5a3d03.png`, `939a4e50-b7d3-4882-8147-40fd0c106503.png`, and `b9ca4e4e-f989-4fbe-8a40-110392d0316b.png` (388.0 KiB).
9. Product uploads `85dc790f-82ef-413d-9a06-82e7b80a6b47.png` and `ecac6bd0-ea67-4256-bbd8-3fa1264ef4c1.png` (168.3 KiB).

Do not deduplicate product files until MongoDB records and product image order/main-image assignments are reviewed. A separate exact duplicate video pair was detected but is outside the image total.

## 4. Page-by-page image usage map

| Page / feature | Confirmed image usage | Rendering / fold |
|---|---|---|
| **Home `/`** | `hero.jpg`; `marina-docks.jpg`, `stay-room.jpg`, and `dining.jpg` explore cards; MongoDB-backed merchandise; four editorial images (`EYC_main2`, `EYC_main8`, `EYC_main11`, `EYC_main6`). | Hero is above fold, `next/image` fill/priority plus the same original as video poster. Cards and editorial gallery are below fold. Product images are data-driven. |
| **About `/about`** | `about-hero.jpg`; `marina-1.jpg` supporting image. | PageHero is above fold and prioritized; supporting image is below fold. |
| **Attractions `/attractions`** | `attraction-hero.jpg`; the seven destination images are selected by attraction name for the pointer-following hover preview. | Hero is above fold; attraction images load for hover and on the gallery page. |
| **Contact `/contact`** | `contact-hero.jpg`; Open Graph metadata references missing `hero-marina-aerial.jpg`. | Hero is above fold; metadata image is not rendered as page content. |
| **Destination `/destination`** | `destination-hero.jpg`; `marina-docks.jpg`, `dining.jpg`, and `stay-room.jpg` cards; a card references missing `hero-marina-aerial.jpg`. | Hero above fold; four-column content images below fold. Missing card image can 404. |
| **Dining `/dining`** | `dining.jpg` as PageHero and Open Graph image. | Above-fold PageHero. |
| **FAQ `/faq`** | `faq-hero.jpg`; Open Graph metadata references missing `hero-marina-aerial.jpg`. | Hero above fold; missing metadata image is not page content. |
| **Gallery `/gallery`** | PageHero `EYC_main8`; 25 tiles: 10 EYC About photos (`main2–8`, `main10–12`), five Marina images (`marina1`, `marina2-web`, `marina3–5`), seven destination photos, `dining.jpg`, `stay-room.jpg`, and `marina-docks.jpg`. | Hero above fold; tiles below fold. The same assets are used at wide and portrait aspect ratios. |
| **Getting here `/getting-here`** | `getting-here-hero.jpg` as PageHero and Open Graph image. | Above-fold PageHero. |
| **Marina `/marina`** | Hero rotates between top-level `marina-1.jpg` and `marina-2.jpg`; the 15-image Marina strip uses `marina1.jpg`, `marina2-web.jpg`, `marina3.jpg`–`marina15.jpg`; `marina-docks.jpg` is metadata imagery. | First hero slide is prioritized; the second overlapping slide and all carousel slides are in the viewport/DOM. Strip is below fold; lightbox is interaction-only. |
| **Shop `/shop`** | Five `Shop/hero1.jpg`–`hero5.jpeg` slides; product-card images from MongoDB. Open Graph uses missing `/images/shop-tee.jpg`. | Hero carousel above fold; product list below fold. Hidden slides share the visible frame. |
| **Stay `/stay`** | `EYC3/ec6ffba1-7ce6-438b-83ce-d44921d3c672.jpg` hero; room/garden image `EYC3/48633b62-9d49-4706-9521-fea2edf81809.jpg`, bedroom image `EYC3/acbb4d79-0b86-47f3-b0b3-bfa6d9c4c82c.jpg`, and `marina-1.jpg` in the gallery. Open Graph uses the room image. | Hero is above fold and prioritized. Gallery is below fold. The 640 × 439 hero source may be upscaled on wide screens. |
| **Room detail `/stay/[slug]`** | All current room records use `src/data/rooms.ts`’s same `stay-room.jpg` placeholder for room cards/details and social metadata. | First detail image is above fold and prioritized; cards are below fold. Alt text explicitly labels the asset as temporary pending room-specific photography. |
| **Product detail `/shop/[slug]`** | Main/gallery images and Open Graph images come from MongoDB `ProductImage.url` / legacy `product.image`. | Dynamic; main detail image prioritized, thumbnails below it. Data and remote/local status could not be inspected. |
| **Cart and order detail** | Product image URLs from order/cart data render as small thumbnails. | `next/image`, fixed 96 px cart and 56 px order sizes; below fold / transaction content. |
| **Transactional emails** | Hard-coded external logo at `https://exuma-yacht-club-ns7z.vercel.app/logo/EYCflag.png`; order line images use `item.image` as a native `<img>`. | Email clients fetch external images independently; actual remote dimensions and delivery were not checked. |
| **Admin product editor** | Existing uploads and browser-created blob previews render through native `<img>`. Uploads are written to `public/uploads/products/`. | Admin-only. Preview parent reserves a square box; upload server enforces accepted MIME/signature and 5 MiB limit but does not resize or transcode. |
| **Shared chrome** | `EYCflag.png` in header and footer; `favicon.ico` through Next.js file convention. | Header above fold; footer below fold. Logo has explicit dimensions but bypasses `next/image` optimization and is marked priority in both contexts. |

Code references for these flows include [home page](../src/app/page.tsx), [PageHero](../src/components/ui.tsx), [marina hero](../src/components/marina-hero.tsx), [marina slideshow](../src/components/marina-slideshow.tsx), [shop hero](../src/components/shop-hero.tsx), [product gallery](../src/components/product-gallery.tsx), [room data](../src/data/rooms.ts), [image editor](../src/app/admin/products/image-gallery-editor.tsx), and [image upload route](../src/app/api/admin/products/images/route.ts).

## 5. Current versus recommended dimensions and formats

Dimensions below are **recommended source/derivative targets**, not claims about current rendered pixel sizes. Actual CSS dimensions were inferred from layouts; confirm with browser captures before generating crops.

| Profile / use | Current evidence | Recommended desktop | Tablet | Mobile | Aspect ratio | Maximum delivered size | Format / crop / loading |
|---|---|---:|---:|---:|---|---|---|
| **Home hero** | `hero.jpg`: 2,730 × 1,536; actual PNG; 7.87 MiB. Full viewport; video poster uses raw original. | 1,920 × 1,080 | 1,280 × 900 | 900 × 1,200 only if focal point needs portrait art direction | 16:9 desktop; mobile crop optional | ≤250 KiB desktop / ≤150 KiB mobile | AVIF/WebP; `next/image fill`, `sizes="100vw"`; preload one LCP image. Avoid a simultaneous full-size raw poster transfer. |
| **Standard PageHero** | About, attraction, contact, destination, FAQ, and getting-here heroes are 4,000–10,800 px wide, 2.17–9.06 MiB. | 1,920 × 1,080 | 1,280 × 900 | 900 × 1,200 if crop is necessary | 16:9 desktop; mobile crop only when focal framing requires | ≤250 / ≤150 KiB | AVIF/WebP; `fill`, `sizes="100vw"`; eager/preload only the page hero. |
| **Marina hero** | Two 4,000 × 2,252 JPEGs, 2.55–2.90 MiB each; 46–54vh section. | 1,920 × 1,080 | 1,280 × 900 | 900 × 1,200 optional | 16:9 desktop | ≤250 / ≤150 KiB | AVIF/WebP; preserve boat/vessel focal position; only first active slide should be preloaded. |
| **Shop hero carousel** | Five source images range from 768 × 1,024 to 4,000 × 2,252; one 5.60 MiB. Display box is 3:2, including portrait sources. | 1,600 × 1,067 | 1,200 × 800 | 960 × 640 | 3:2 | ≤180 KiB per delivered slide | AVIF/WebP; crop portrait originals deliberately if product/cap is clipped. Keep later slides lazy and avoid fetching all hidden slides immediately. |
| **Editorial/photo gallery tiles** | EYC gallery sources are mostly 4,000 × 2,252 and 1.88–3.76 MiB; several tile ratios differ. | 1,200 × 900 landscape or 1,200 × 1,500 portrait crop | 960 × 720 or 960 × 1,200 | 750 × 1,000 portrait or 750 × 422 landscape | Per-tile 16:9, 4:3, or 4:5 | ≤200 KiB/card; ≤350 KiB lightbox | AVIF/WebP; use the tile’s actual `sizes`; create an art-directed crop only when an image’s focal subject cannot survive both uses. |
| **Marina carousel and lightbox** | Carousel cards use 4:3; 15 assets vary from 768 × 1,024 to 4,000 × 2,252; larger originals for lightbox. | 1,200 × 900 cards; up to 1,920 × 1,440 lightbox | 960 × 720 | 780 × 585 | 4:3 card; lightbox preserves source ratio | ≤200 KiB card; ≤350 KiB lightbox | AVIF/WebP; lazy-load strip; request the large rendition on lightbox open. |
| **Attraction hover/gallery** | Seven assets are 500–765 px wide; desktop pointer preview is at most 336 px wide and 4:3. Gallery reuses several with 16:9/4:5 crops. | 1,200 × 900 gallery; 672 × 504 preview | 960 × 720 | 780 × 585; 750 × 1,000 gallery crop if required | 4:3 preview; gallery varies | ≤160 KiB preview/card; ≤220 KiB gallery | AVIF/WebP; `sizes="336px"` for preview; lazy and interaction-only. Current source resolution may be limiting on large gallery tiles. |
| **General content cards** | Dining 1,800 × 1,200/379 KiB; shared images appear in multiple card and hero placements. | 1,200 × 900 landscape or 1,200 × 1,500 portrait | 960 × 720 | 780 × 585 or 780 × 975 | Match the specific component: PageHero 16:9; card 3:2/4:5 | ≤180 KiB card; ≤250 KiB hero | AVIF/WebP; split crop recommendations per usage, not per filename. |
| **Room photos** | Stay hero `EYC3/ec6…jpg` is 640 × 439/99.7 KiB; room images range from 360–640 px on the long side. Shared `stay-room.jpg` is explicitly temporary. | 1,600 × 1,200 hero; 1,200 × 800 card | 1,200 × 900 | 900 × 1,125 optional portrait crop | 4:3 hero / 3:2 card | ≤250 KiB hero; ≤160 KiB card | AVIF/WebP; use room-specific imagery when content becomes managed; do not imply the placeholder represents every room. |
| **Product images** | 36 PNG uploads: dimensions roughly 330–502 × 328–724; 10.68 MiB total; product records unavailable. | 1,200 × 1,200 detail; 600 × 600 card | 900 × 900 | 750 × 750; 128 × 128 thumbnail | UI currently square, while homepage feature uses 4:5; preserve source shape where square crops clip products | ≤220 KiB detail; ≤120 KiB card; ≤30 KiB thumbnail | AVIF/WebP; keep PNG only when transparency/edge quality requires it. Re-check `object-cover` crop for apparel. |
| **Logo** | `EYCflag.png`: 1,697 × 1,044/47.2 KiB; unused `EYCflag.webp`: 320 × 197/5.4 KiB. Header displays about 112 × 70; footer about 176 px wide. | 320 × 197 source is adequate for current sizes | Same | Same | 1.625:1 | ≤12 KiB if fidelity allows | WebP or source SVG if available; PNG fallback for alpha. Optimize header; do not preload footer. |
| **Social/OG metadata** | Several OG URLs reuse page hero images; two referenced local OG paths are missing. | 1,200 × 630 | N/A | N/A | 1.91:1 | ≤250 KiB | JPEG/WebP/PNG according to publishing platform support; metadata is not the same rendition as the visible PageHero. |
| **Favicon** | `favicon.ico`: embedded 16/32/48 px; 4.2 KiB. | 16/32/48 embedded | Same | Same | 1:1 | ≤10 KiB | ICO is already appropriate; no change indicated. |

The CSV’s per-asset recommendation profiles are matched to each listed use. For a reused image, the filename-level source dimensions stay constant, but output size, crop, and target dimensions differ by component.

## 6. Rendering, responsive behavior, and performance findings

### High-priority findings

1. **Missing images:** `/images/hero-marina-aerial.jpg` is absent but referenced by root Open Graph/Twitter/JSON-LD metadata, Contact/FAQ Open Graph metadata, and the Destination page card. `/images/shop-tee.jpg` is absent but referenced by Shop Open Graph metadata. Fix the asset/path choice after approval; do not guess a replacement.
2. **Home hero transfer risk:** the same 7.87 MiB PNG-content file is rendered through optimized `next/image` and also specified as the original video poster. The raw poster can bypass responsive optimization and may compete with the hero/video for bytes. The file’s `.jpg` extension does not match its PNG content.
3. **Large hero sources:** several visible PageHero images are 2.17–9.06 MiB, and the shop carousel contains multiple 2–5.6 MiB sources. `next/image` can transform local files, but no deployed derivative sizes or transfer waterfall were measured. The shop carousel keeps all five full-size image elements in one above-fold frame; validate whether hidden slides download on initial render.
4. **Unoptimized logo / eager footer:** `Logo` and the footer logo explicitly set `unoptimized`; the 1,697 × 1,044 PNG is used at small display sizes. The logo component and footer also set `priority`, including the below-fold footer image. The unused 320 × 197 WebP is a candidate source, subject to visual/alpha review.
5. **Incorrect `sizes` for spanning gallery items:** [src/app/gallery/page.tsx](../src/app/gallery/page.tsx) uses one `33vw` desktop value even for tiles that span two of three columns, which can select a too-small candidate. [src/components/editorial-gallery.tsx](../src/components/editorial-gallery.tsx) uses `22vw` for non-featured tiles, including a tile that spans the full right-hand grid. Match `sizes` to those actual spans.
6. **Possible remote optimizer failure:** the admin form accepts HTTPS image URLs in product image data ([src/app/admin/actions.ts](../src/app/admin/actions.ts)), and product pages use `next/image`; [next.config.ts](../next.config.ts) has no `images.remotePatterns`. Any externally hosted product image can fail Next’s optimizer unless that host is explicitly allowed or served through an approved local/CDN path.
7. **Upload pipeline stores originals:** [image upload route](../src/app/api/admin/products/images/route.ts) validates MIME/signature and a 5 MiB cap, then writes original bytes to `public/uploads/products/`; it does not normalize dimensions, remove metadata, create responsive renditions, or transcode. Confirm production filesystem persistence and shared cache/CDN behavior before relying on local public-file storage across instances/deployments.

### Other observations

- **No CSS background images** or CSS `url(...)` image references were found. No direct source imports of static image files were found; local images are mostly URL strings.
- Visible pages use `next/image` extensively. Most image cards reserve space through aspect-ratio wrappers; hero sections reserve height through CSS. The admin preview is contained by a square parent. These patterns reduce evidence for image-driven CLS; no measured CLS result is available.
- Most `next/image` instances use `fill` and `sizes`. The `PageHero`/home full-width `sizes="100vw"` values align with full-width layouts. The ShopHero’s `58vw` desktop estimate is likely high for its roughly half-width column, causing avoidable candidate overfetch.
- Below-fold card/gallery images generally rely on default lazy loading. Hero elements use `priority`; in the installed Next.js 16.4.3 docs, `priority` is deprecated in favor of `preload`. After approval, use the current API intentionally and reserve preload for the true LCP/above-fold image only.
- The marina strip duplicates its 15-slide group in the DOM for the looping effect. Browser cache may prevent duplicate transfers for identical URLs, but initial image request behavior should be checked in a network waterfall.
- `product-card.tsx`, `product-gallery.tsx`, cart/order thumbnails, and room components supply fallbacks for dynamic alt text. Product upload alt text can be empty in admin data, but site components generally fall back to the product name. Fixed static site images have descriptive alt text; decorative/duplicate slides use empty alt text.
- The fixed remote email logo uses a Vercel deployment hostname. Email product thumbnails are native `<img>` tags and can be blocked by email clients; no email-client network test was performed.
- `next.config.ts` does not define custom image formats, quality, remote patterns, or cache policy. Any CDN cache behavior is deployment-specific and cannot be inferred from this repository.

### Likely LCP/CLS risks (not measured)

- **Likely LCP candidate:** the homepage full-viewport hero/video poster. The hero is explicitly prioritized, but the unoptimized poster URL may be a second large transfer. Other PageHero routes are also plausible LCP candidates because they are large above-fold images.
- **Potential unnecessary bandwidth:** overlapping shop slides and the footer logo are high-priority review points. Confirm with browser Network panel before changing carousel behavior.
- **CLS:** no clear production-page image-induced CLS is established from source. Fixed aspect-ratio containers and explicit image geometry exist on most image cards. The audit did not measure font/layout shifts or live component behavior.

## 7. Images with no confirmed code use

Confidence here means confidence that the scanned repository has no literal reference—not proof the asset is safe to remove. **Do not delete or relocate these in the audit phase.**

| Location | Assets with no literal use | Confidence / caveat |
|---|---|---|
| `public/images/` | `bqhfh0bg_antigua_625x300_12_May_25.webp`, `hero-poster.webp`, `shop-hero-4.webp`, `shop-hero.webp`, `Sunlit Exuma Cap and Starfish.png` | High for no literal source reference; external links or future use remain possible. |
| `public/images/EYC About/` | `EYC_main1.jpg`, `EYC_main9.jpg` | High for no literal reference. `EYC_main1.jpg` is a 44.89 MiB, 10,800 × 15,000 JPEG. |
| `public/images/Marina/` | `marina2.jpg`; all 10 `DJI_*.DNG` files | High for no literal reference. `marina2.jpg` is 33.44 MiB; DNG dimensions remain unknown. |
| `public/images/Shop/` | `Shop1.jpg`, `Shop2.jpeg`–`Shop8.jpeg` | High for no literal reference; distinct from the five `hero*` assets used by ShopHero. |
| `public/logo/` | `EYCflag.webp` | High for no literal reference; likely an alternate logo rendition, but visual/alpha equivalence was not established. |
| `public/uploads/rooms/EYC3/` | `796f7993-970c-4ca2-b597-2fbec533b578.jpg` | No literal route reference. A database assignment was not found or checked. |
| `public/uploads/products/` | All 36 UUID-named PNGs have no literal path reference. | **Unresolved, not classified as unused.** MongoDB product records may reference these URLs; database mapping was not inspected. |

## 8. Recommended responsive image and storage strategy

1. **Static editorial imagery:** keep approved originals as source assets, but publish responsive derivatives through `next/image` or an image CDN. Use AVIF/WebP for photographic delivery and keep existing source masters only where needed.
2. **Art direction:** use a mobile crop only when composition/focal-point checks show `object-cover` cannot preserve the subject—especially full-screen hero imagery and portrait merchandise photos displayed in a 3:2 frame. Do not generate a mobile variant for every asset by default.
3. **Correct `sizes`:** derive sizes from the actual content container and grid spans. Update the gallery’s spanning tiles and ShopHero estimate after a browser capture. For fixed hover previews and cart/order thumbnails, keep their small fixed-size declarations.
4. **LCP loading:** load one actual above-fold hero eagerly/preloaded per page. Keep all gallery, card, footer, hidden carousel, and off-screen images lazy unless a measured interaction requires earlier fetch. In Next.js 16, use `preload` rather than deprecated `priority` where preload is justified.
5. **Admin uploads:** retain a durable source/master outside an ephemeral local deployment filesystem, store product records as stable storage/CDN URLs, generate responsive delivery sizes, validate dimensions/pixel count as well as file type/size, and require or derive useful alt text. Preserve transparent product art where needed.
6. **Remote URLs:** either disallow arbitrary remote hosts in product records or configure narrow `remotePatterns` for approved hosts. Avoid broad remote-host allowlists. Consider serving approved product media through a managed image CDN with explicit transformation and cache policy.
7. **Database mapping and deduplication:** before pruning or consolidating UUID images, export/read product records and inventory references, including main-image status/order. Preserve one stable URL per content object and update every record before any later cleanup.
8. **Archive-only masters:** do not serve DNG originals or enormous unused photography as page assets. After owner confirmation, keep raw masters in archival/object storage and publish approved web renditions.
9. **Caching:** set and verify immutable cache headers for versioned/static derivatives and a deliberate cache policy for uploaded content. Confirm cache invalidation/versioning and persistence on the actual deployment platform; repository configuration alone does not establish CDN behavior.

## 9. Prioritized optimization plan

### Critical

- **None classified as Critical.** The two broken local image references are High priority; no live outage or measured LCP failure was established.

### High

1. Identify the intended local assets for `/images/hero-marina-aerial.jpg` and `/images/shop-tee.jpg`; restore correct references/assets only after approval. Re-test the Destination tile and all social metadata.
2. Approve an optimized home hero/poster strategy: normalize the mislabeled PNG-content `hero.jpg`, avoid the raw 7.87 MiB poster competing with the optimized image, and verify one LCP request in a browser waterfall.
3. Create appropriately sized AVIF/WebP hero derivatives for the used page/shop/marina heroes; keep crops focused and within the per-profile size budgets above.
4. Correct `sizes` for wide gallery and editorial-gallery spanning tiles; verify the generated `srcset` candidate matches measured card widths.
5. Review the admin upload and MongoDB URL design: responsive derivative generation, approved external hosts, durable storage, and cache policy.

### Medium

1. Remove the `unoptimized` and below-fold `priority` behavior from the footer logo after confirming the smaller WebP preserves the mark; keep header loading appropriate to its above-fold role.
2. Confirm exact duplicate image groups against MongoDB/room usage, then consolidate stable URLs only with complete reference updates. Storage reduction ceiling from exact image duplicates is about 11.43 MiB.
3. Ask the content owner to map the 28 unreferenced non-product assets. If confirmed archival, move them out of the web-publication bundle only in a separately approved change.
4. Replace generic `stay-room.jpg` placeholder assignments with approved room-specific images when content is available; preserve their explicit temporary alt description until then.
5. Inspect the shop carousel network waterfall and consider deferring non-active slides; confirm interaction/accessibility before modifying behavior.

### Low

1. Keep the existing multi-size favicon as-is.
2. Perform post-change browser checks at representative mobile/tablet/desktop widths, image focal crops, alt text, image optimizer status, and cache headers.
3. Run real-user or lab Core Web Vitals after implementation; record LCP/CLS and image transfer bytes rather than inferring them from source alone.

## Approval gate

This deliverable is an audit and plan only. **No images, URLs, source code, or configuration were modified.** Wait for approval before implementing any optimization, changing a referenced asset, or cleaning up files.
