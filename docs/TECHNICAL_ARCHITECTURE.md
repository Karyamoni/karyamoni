# Karyamoni Technical Architecture

## 1. Architecture Goal

Karyamoni should be built as an IKAS app-first virtual try-on service. Merchants should be able to install the IKAS application and activate the try-on experience on their storefront with minimal setup.

The shopper experience should stay inside the merchant's store flow. The MVP architecture should keep platform integration, embedded shopper experience, 3D rendering, merchant management, and analytics modular enough that future CMS support does not require rebuilding the core product.

## 2. Important Assumptions

These assumptions must be validated before implementation:

- IKAS app installation, permission, and storefront extension capabilities need to be confirmed.
- Product data access, storefront placement options, and checkout analytics access may be limited.
- The MVP may need a semi-manual product onboarding process for early merchants.
- 3D garment accuracy will depend on available product measurements and garment assets.
- Privacy and consent requirements may affect how body/profile data is stored.

## 3. High-Level Components

### IKAS App Integration

Application layer installed by the merchant through IKAS.

Responsibilities:

- Handle installation and permissions.
- Sync or access store, product, variant, and size data where available.
- Register storefront placement for the try-on entry point.
- Provide merchant-facing setup entry points.
- Report app installation and activation status.

### Embedded Storefront Try-On

Embedded UI shown on merchant product pages through the IKAS app integration.

Responsibilities:

- Show the try-on entry point.
- Pass product and store context to Karyamoni.
- Open the try-on experience inside the merchant storefront, such as a modal, drawer, or embedded panel.
- Capture basic funnel events.

### Embedded Try-On Experience

Shopper-facing experience served by Karyamoni but rendered inside the merchant store context.

Responsibilities:

- Handle language selection.
- Collect body/profile inputs.
- Display consent and privacy copy.
- Load the 3D fitting cabin.
- Show fit recommendation or fit confidence.

### 3D Fitting Cabin

Rendering layer for avatar, garment, and fitting environment.

Responsibilities:

- Render the selected clothing item.
- Render the avatar or fitting model.
- Support mobile and desktop web.
- Expose loading, success, and error states.

### Merchant App Dashboard

Merchant-facing management area, ideally accessible from the IKAS app flow.

Responsibilities:

- App setup.
- Language and brand settings.
- Product readiness status.
- Product activation controls.
- Usage and impact reporting.

### Admin Console

Internal Karyamoni tool for early operations.

Responsibilities:

- Merchant review.
- Integration diagnostics.
- Product mapping support.
- Error/session inspection.
- Pilot feedback tracking.

### API Layer

Backend service used by the IKAS app integration, embedded try-on experience, merchant dashboard, and admin console.

Responsibilities:

- Authentication.
- Store and merchant management.
- Product mapping.
- Body/profile processing.
- Fit recommendation service.
- Analytics event ingestion.

### Data Layer

Stores product, merchant, session, analytics, and optional profile data.

Responsibilities:

- Merchant records.
- Store configuration.
- Product mappings.
- Size/measurement data.
- Try-on sessions.
- Analytics events.
- Consent records.

## 4. Suggested System Flow

1. Merchant installs the Karyamoni IKAS application.
2. Merchant grants required permissions and completes setup.
3. Merchant activates Karyamoni for selected products.
4. Karyamoni try-on entry appears on the IKAS product page.
5. Shopper starts the embedded try-on experience.
6. Embedded experience sends store and product context to the API.
7. Embedded experience collects body/profile input.
8. API fetches product mapping and size data.
9. 3D fitting cabin renders inside the storefront experience.
10. Fit service returns recommendation or confidence.
11. Analytics events are captured.
12. Shopper closes the try-on experience and continues on the product page.

## 5. Platform Integration Strategy

### IKAS First

The first implementation should be shaped around the IKAS app model. Karyamoni should aim for a merchant experience where installing the app handles store connection, storefront placement, and product data access as automatically as IKAS allows.

IKAS capabilities to evaluate:

- App installation and permission flow.
- Storefront extension or placement options.
- API-based product sync.
- Product, variant, and size chart access.
- App dashboard or embedded admin surface.
- Analytics, checkout, and return data access.

### Future Shopify Support

The architecture should keep platform-specific logic isolated in adapters.

Examples:

- IKAS adapter.
- Shopify adapter.
- Generic CMS adapter.

## 6. Data Model Draft

### Merchant

- ID.
- Business name.
- Contact email.
- Platform.
- Store URL.
- Plan/status.
- Created date.

### Store Configuration

- Merchant ID.
- Platform.
- Storefront language settings.
- Brand settings.
- Embedded try-on settings.
- App installation status.
- Permission status.
- Storefront activation status.

### Product Mapping

- Merchant ID.
- Platform product ID.
- Product category.
- Supported status.
- Size chart data.
- Garment measurement data.
- 3D asset reference, if available.
- Activation status.

### Shopper Session

- Session ID.
- Merchant ID.
- Product ID.
- Locale.
- Consent status.
- Body/profile input status.
- Fit result status.
- Created date.

### Analytics Event

- Event name.
- Session ID.
- Merchant ID.
- Product ID.
- Timestamp.
- Device type.
- Locale.
- Metadata.

## 7. Privacy and Security Notes

- Body/profile data should be treated as sensitive.
- Consent should be explicit before processing profile data.
- The MVP should decide whether profile data is stored or session-only.
- Analytics should avoid unnecessary personal data.
- Merchant data and shopper data should be separated.
- Admin access should be permission controlled.

## 8. Performance Requirements

- Embedded try-on entry should not block product page rendering.
- Try-on entry point should load quickly.
- 3D cabin should show clear loading progress.
- Mobile performance should be tested early.
- Errors should fall back gracefully without blocking checkout.

## 9. Open Technical Questions

- What IKAS app APIs, permission scopes, and storefront extension points are available?
- How close can the real merchant setup get to one-click installation?
- Can Karyamoni access product, variant, size, and inventory data reliably?
- Can conversion and return data be connected automatically?
- What 3D engine will be used for the fitting cabin?
- What garment asset format will be used?
- How will product measurements be collected from merchants?
- How will the first fit recommendation model work?
- What is the minimum body/profile input needed for useful guidance?
