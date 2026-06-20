# Karyamoni MVP Spec

## 1. MVP Objective

The MVP should prove that Karyamoni can help shoppers make better size decisions before checkout and help IKAS merchants reduce size-related returns.

The first release should focus on a small, believable try-on journey inside the merchant's IKAS store instead of trying to support every clothing type, every body profile, and every CMS platform at once.

## 2. Primary Platform

IKAS is the first platform target. Karyamoni should be built as an IKAS application that merchants can install and activate with minimal effort, ideally close to one-click integration.

Shopify and other CMS builders are out of scope for the first MVP unless they are needed for demos, investor conversations, or technical comparison.

## 3. Primary Clothing Category

Recommended first category: tops, such as t-shirts, shirts, blouses, and sweaters.

Reasoning:

- Tops are common in e-commerce.
- They are easier to explain in a first try-on flow than full outfits.
- Fit concerns are clear: chest, shoulders, length, and general silhouette.
- They can prove the product value before expanding into pants, dresses, outerwear, and multi-item outfits.

## 4. MVP User Segments

### Shopper

The shopper wants to understand whether the selected item will likely fit before buying.

### Merchant

The merchant wants to reduce return rates, increase shopper confidence, and add Karyamoni to product pages with minimal setup work.

### Karyamoni Admin

The Karyamoni team needs to onboard merchants, monitor integrations, review usage, and diagnose failed product mappings.

## 5. In Scope

- IKAS application installation and activation.
- IKAS-first storefront try-on entry point.
- Product page try-on button or embedded entry point.
- Embedded 3D fitting cabin view.
- Basic shopper body profile.
- Size recommendation or fit confidence output.
- Turkish and English UI copy.
- Merchant setup flow.
- Merchant dashboard with activation status.
- Product mapping foundation.
- Basic analytics events.
- Privacy notice and consent for body/profile data.

## 6. Out of Scope

- Native Shopify app.
- Separate shopper website or redirect-based try-on flow.
- Mobile app.
- Full wardrobe management.
- Social sharing.
- Advanced fashion styling.
- All clothing categories.
- Real-time photorealistic body scan.
- Fully automated garment digitization for every merchant product.
- Marketplace for 3D assets.

## 7. Shopper Requirements

### Try-On Entry

- Shopper can start Karyamoni from a product page.
- Entry point should be visible without harming the merchant's existing buy flow.
- Try-on should open inside the merchant store experience, such as a modal, drawer, or embedded panel.
- UI text must support Turkish and English.

### Body Profile

- Shopper can provide simple fit-related information.
- The flow should avoid asking for more information than the MVP needs.
- The experience should explain why body information is needed.
- Consent should be captured before storing or processing personal fit data.

### 3D Fitting Cabin

- Shopper can view the selected product in a fitting environment.
- Shopper can understand the product's likely size/fit.
- Shopper can close the fitting cabin and continue on the same product page.
- The experience should load quickly enough that it does not damage conversion.

### Fit Output

- The MVP should show a clear fit result, such as:
  - Recommended size.
  - Fit confidence.
  - Notes like "tight around chest" or "regular fit".

## 8. Merchant Requirements

### Onboarding

- Merchant can install Karyamoni as an IKAS application.
- Merchant can grant required app permissions during setup.
- Merchant can select default language options.
- Merchant can configure basic brand appearance.

### Product Mapping

- Merchant can see which products are ready for try-on.
- Merchant can see which products need missing data.
- Merchant can activate or deactivate Karyamoni per product.

### Dashboard

- Merchant can see setup status.
- Merchant can see try-on usage.
- Merchant can see early conversion and return-rate indicators once data is available.

## 9. Admin Requirements

- Karyamoni team can review merchants.
- Karyamoni team can inspect integration status.
- Karyamoni team can help map products during early pilots.
- Karyamoni team can view failed try-on sessions and error states.

## 10. Core Events

Track these events from the start:

- Try-on entry viewed.
- Try-on started.
- Body profile started.
- Body profile completed.
- 3D cabin loaded.
- Fit result shown.
- Try-on completed.
- Add to cart after try-on.
- Purchase after try-on, if available.
- Try-on abandoned.
- Try-on error.

## 11. MVP Success Criteria

The MVP is successful if pilot merchants can:

- Install Karyamoni on an IKAS store with minimal setup.
- Add Karyamoni to selected IKAS product pages.
- Get shoppers to complete the try-on flow.
- Collect meaningful try-on engagement data.
- Compare size-related returns before and after activation.
- Understand whether shoppers trust the fit result.

## 12. MVP Release Criteria

- At least one IKAS pilot store can install the Karyamoni app and run it on selected products.
- Turkish and English UI copy is available.
- Shopper flow works inside the merchant storefront on desktop and mobile web.
- Merchant can understand setup status.
- Core analytics events are captured.
- Privacy and consent copy exists.
- Known limitations are documented.

## 13. Key Decisions Needed

- Confirm exact IKAS app installation, permission, product sync, and storefront extension method.
- Decide whether the first fitting model is a fixed avatar, adjustable avatar, or measurement-driven avatar.
- Decide which merchant product data is required.
- Decide how fit confidence will be calculated in the first version.
- Decide whether body profile data is stored, session-only, or user-account based.
