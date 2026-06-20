# Karyamoni Website Plan

## 1. Goal

The Karyamoni website should convert IKAS e-commerce owners by showing the product as a premium, embedded virtual try-on application.

The site should be inspired closely by Shopify Editions Spring 2026 in structure and polish: editorial scrolling, sticky section navigation, large product visuals, interactive demos, and compact high-impact feature copy. Karyamoni must keep its own visual identity, colors, assets, and language.

## 2. Website Routes

- `/`: detects locale and redirects to `/tr` or `/en`.
- `/[locale]`: premium editorial landing page.
- `/[locale]/playground`: public guided demo.
- `/[locale]/docs`: public integration documentation.
- `/[locale]/login`: Google and WhatsApp login.
- `/[locale]/dashboard`: protected pilot dashboard.

## 3. Localization

- Turkish and English are supported.
- Locale is detected from `Accept-Language`.
- Manual language switching persists in the `karyamoni_locale` cookie.
- Turkish remains the primary launch market language.

## 4. Design Direction

- Immersive hero with a 3D fitting cabin scene.
- Sticky section rail: Try-On, IKAS App, Playground, Docs, Dashboard, Analytics, Trust.
- Feature sections with large typography, product UI mockups, motion, and concise product claims.
- Distinct Karyamoni palette: ink, lime, coral, clay, paper, mist, moss.
- No Shopify assets, copy, exact colors, or trade dress.

## 5. Playground

The playground is a guided demo that works without login.

It includes:

- Simulated IKAS product page.
- Embedded Karyamoni try-on entry.
- Body/profile input.
- 3D cabin preview.
- Fit result with recommended size, confidence, and fit note.
- Save action that requires login.

## 6. Authentication

The first version supports:

- Google sign-in through Google Cloud OAuth credentials.
- WhatsApp OTP through Twilio Verify using the `whatsapp` channel.
- Secure HttpOnly session for WhatsApp login.
- Rate limiting for OTP start and check endpoints.
- Local development fallback code `000000` when Twilio credentials are not configured.

## 7. Dashboard

The dashboard is a pilot dashboard, not a full merchant admin.

It includes:

- IKAS app installation status.
- Setup checklist.
- Product readiness table.
- Try-on usage metrics.
- Return-rate impact placeholders.

## 8. Technical Defaults

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- next-intl.
- Auth.js / NextAuth for Google OAuth.
- Twilio Verify API for WhatsApp verification.
- Prisma schema targeting PostgreSQL.
- React Three Fiber / Three.js for the 3D cabin preview.
- Framer Motion for editorial motion.

## 9. Acceptance Criteria

- Public landing, playground, docs, and login routes work in Turkish and English.
- Dashboard redirects unauthenticated users to login.
- Playground save action redirects unauthenticated users to login.
- Google login route is wired through Auth.js.
- WhatsApp verification endpoints exist at `/api/auth/whatsapp/start` and `/api/auth/whatsapp/check`.
- Website has a premium editorial presentation and embedded product demo.
