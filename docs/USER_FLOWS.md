# Karyamoni User Flows

## 1. Shopper Flow

### Goal

Help the shopper decide whether the selected clothing item is likely to fit before purchase.

### Happy Path

1. Shopper opens an IKAS product page.
2. Shopper sees the Karyamoni try-on entry point near the size selector or add-to-cart area.
3. Shopper opens the embedded Karyamoni try-on experience without leaving the merchant store.
4. Shopper selects language if the store default is not enough.
5. Shopper accepts the privacy notice for body/profile data.
6. Shopper enters basic fit information.
7. Shopper enters the 3D fitting cabin inside a modal, drawer, or embedded panel.
8. Shopper views the selected clothing item.
9. Shopper receives fit guidance.
10. Shopper closes the try-on experience.
11. Shopper selects a size and continues to cart on the same product page.

### Body Profile Step

The MVP should request only the minimum information needed for the first fit result.

Possible fields:

- Height.
- Weight.
- Usual size.
- Chest measurement.
- Shoulder preference or fit preference.
- Gender/body model preference, if needed for avatar selection.

### Fit Result Step

The result should be direct and easy to trust.

Possible output:

- "Recommended size: M"
- "Fit confidence: High"
- "Expected fit: regular around chest, slightly long body length"

### Error and Edge Cases

- Product is not ready for try-on.
- Required size data is missing.
- 3D fitting cabin fails to load.
- Shopper skips body profile.
- Shopper does not consent to body/profile processing.
- Selected item has no supported category.
- Mobile device has poor performance.

## 2. Merchant Flow

### Goal

Let an IKAS merchant install Karyamoni as an application and activate it on selected products with low operational effort.

### Happy Path

1. Merchant finds or receives the Karyamoni IKAS application.
2. Merchant installs the application on the IKAS store.
3. Merchant grants required permissions.
4. Merchant completes Karyamoni setup inside the app experience.
5. Merchant chooses Turkish, English, or both languages.
6. Merchant configures basic brand settings.
7. Merchant reviews imported or synced products.
8. Merchant selects products for Karyamoni.
9. Merchant completes missing fit/product data.
10. Merchant previews the product-page try-on entry.
11. Merchant activates Karyamoni.
12. Merchant monitors usage and impact.

### Product Readiness States

- Ready: product has the required try-on data.
- Missing data: product needs fit, size, or asset data.
- Unsupported: product category is not supported in the MVP.
- Error: integration, data, or rendering issue needs review.
- Live: Karyamoni is active on the product page.

### Merchant Dashboard Sections

- Setup checklist.
- IKAS app installation status.
- Product readiness table.
- Try-on usage metrics.
- Return-rate impact area.
- Support/contact area.

## 3. Karyamoni Admin Flow

### Goal

Support early pilots while the merchant-facing automation is still being validated.

### Happy Path

1. Admin reviews new merchant signup.
2. Admin checks IKAS app installation and permission status.
3. Admin verifies products and supported categories.
4. Admin assists with required product data.
5. Admin validates the embedded try-on entry on the merchant storefront.
6. Admin monitors first shopper sessions.
7. Admin records issues and product feedback.

### Admin Needs

- Merchant list.
- IKAS app integration status.
- Product mapping status.
- Session/error logs.
- Usage analytics.
- Notes for pilot feedback.

## 4. Localization Flow

### Goal

Make Turkish feel native and English ready from the start.

### Requirements

- UI strings should be stored in a translation-friendly format.
- Turkish copy should be written first for the launch market.
- English should not be a rough machine translation.
- Merchant should be able to set default storefront language behavior.
- Shopper-facing consent and privacy copy should be available in both languages.

## 5. Measurement Flow

### Goal

Connect try-on usage to merchant value.

### Basic Funnel

1. Try-on entry shown.
2. Try-on started.
3. Profile completed.
4. 3D cabin loaded.
5. Fit result shown.
6. Shopper closed the embedded try-on experience.
7. Add to cart.
8. Purchase.
9. Return request, when available.

### Early Questions

- Do shoppers open the embedded try-on experience?
- Do they complete the profile step?
- Does try-on increase add-to-cart?
- Does try-on reduce size-related returns?
- Which products perform best with try-on?
