import type { Locale } from "@/lib/i18n";

type LandingFeature = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  accent: string;
};

type DocsSection = {
  title: string;
  body: string;
  points: string[];
  steps?: string[];
};

export const content: Record<
  Locale,
  {
    nav: {
      playground: string;
      docs: string;
      dashboard: string;
      login: string;
      launch: string;
    };
    home: {
      badge: string;
      title: string;
      lead: string;
      primary: string;
      secondary: string;
      rail: string[];
      heroProduct: string;
      heroButton: string;
      heroResult: string;
      features: LandingFeature[];
      closingTitle: string;
      closingBody: string;
    };
    playground: {
      title: string;
      lead: string;
      productName: string;
      price: string;
      sizeLabel: string;
      start: string;
      profileTitle: string;
      cabinTitle: string;
      resultTitle: string;
      save: string;
      saveHint: string;
      loginToSave: string;
    };
    docs: {
      title: string;
      lead: string;
      sections: DocsSection[];
    };
    login: {
      title: string;
      lead: string;
      google: string;
      whatsapp: string;
      phonePlaceholder: string;
      codePlaceholder: string;
      sendCode: string;
      verify: string;
      devHint: string;
    };
    dashboard: {
      title: string;
      lead: string;
      installStatus: string;
      checklist: string;
      products: string;
      metrics: string;
      impact: string;
    };
  }
> = {
  tr: {
    nav: {
      playground: "Playground",
      docs: "Dokümanlar",
      dashboard: "Dashboard",
      login: "Giriş",
      launch: "IKAS için başlat"
    },
    home: {
      badge: "IKAS mağazaları için sanal deneme kabini",
      title: "Beden kaynaklı iadeleri ürün sayfasında bitirmeye başla.",
      lead:
        "Karyamoni, IKAS mağazanıza tek tık hissinde kurulan ve müşterinin alışveriş akışından çıkmadan kıyafeti 3D kabinde denemesini sağlayan uygulamadır.",
      primary: "Playground'u dene",
      secondary: "Dokümanları incele",
      rail: ["Try-On", "IKAS App", "Playground", "Docs", "Dashboard", "Analytics", "Trust"],
      heroProduct: "Oversize Pamuk Gömlek",
      heroButton: "Karyamoni ile dene",
      heroResult: "Önerilen beden: M · Güven: yüksek",
      features: [
        {
          id: "try-on",
          eyebrow: "Try-On",
          title: "Deneme kabini mağazanın içinde açılır.",
          body:
            "Müşteri ürün sayfasından ayrılmaz. Karyamoni modal, drawer veya gömülü panel olarak çalışır ve satın alma akışını bölmez.",
          stat: "0 yönlendirme",
          accent: "Akış mağazada kalır"
        },
        {
          id: "ikas",
          eyebrow: "IKAS App",
          title: "Kurulum mağaza sahibine basit görünür.",
          body:
            "İlk hedef, IKAS uygulaması ile izinleri almak, ürün verisini senkronize etmek ve seçili ürünlerde deneme girişini otomatik göstermek.",
          stat: "1 kurulum",
          accent: "Yakın tek tık deneyimi"
        },
        {
          id: "playground",
          eyebrow: "Playground",
          title: "Satıcı ürünü daha bağlanmadan hisseder.",
          body:
            "Guided demo, simüle IKAS ürün sayfası, profil adımı, 3D kabin ve fit sonucu ile ürünü anlatmak yerine yaşatır.",
          stat: "3 dakika",
          accent: "Canlı demo hissi"
        },
        {
          id: "docs",
          eyebrow: "Docs",
          title: "Dokümanlar açık, uygulama kontrollü.",
          body:
            "Kurulum, ürün aktivasyonu ve sorun giderme dokümanları herkese açık kalır. Kaydetme ve dashboard için giriş gerekir.",
          stat: "Public",
          accent: "Şeffaf entegrasyon"
        },
        {
          id: "dashboard",
          eyebrow: "Dashboard",
          title: "Pilot mağaza neyin hazır olduğunu görür.",
          body:
            "Dashboard; kurulum durumu, ürün hazırlığı, deneme kullanımı ve iade etkisi için erken sinyalleri tek yüzeyde toplar.",
          stat: "Pilot",
          accent: "Gerçekçi başlangıç"
        },
        {
          id: "analytics",
          eyebrow: "Analytics",
          title: "Her deneme satış etkisine bağlanır.",
          body:
            "Try-on görüntülenme, profil tamamlama, sonuç görme, sepete ekleme ve iade isteği metrikleri ilk günden modellenir.",
          stat: "Funnel",
          accent: "Dönüşüm odaklı"
        },
        {
          id: "trust",
          eyebrow: "Trust",
          title: "Güven, hız ve mahremiyet aynı tasarımda.",
          body:
            "Beden verisi hassas kabul edilir. Açık rıza, hızlı yükleme ve anlaşılır fit sonucu ürünün güven çekirdeğidir.",
          stat: "KVKK",
          accent: "Güvenli deneme"
        }
      ],
      closingTitle: "Karyamoni, mağazanın yanında duran bir site değil; mağazanın içine giren bir uygulama.",
      closingBody: "Website bunu üç şeyle kanıtlar: deneyim, dokümantasyon ve pilot dashboard."
    },
    playground: {
      title: "Guided Playground",
      lead: "IKAS ürün sayfasında Karyamoni'nin nasıl hissettirdiğini demo verilerle deneyin.",
      productName: "Ribana Dokulu Blazer",
      price: "1.890 TL",
      sizeLabel: "Beden",
      start: "Karyamoni ile dene",
      profileTitle: "Fit profilini oluştur",
      cabinTitle: "3D kabin önizlemesi",
      resultTitle: "Fit sonucu",
      save: "Demo ilerlemesini kaydet",
      saveHint: "Kaydetmek için giriş gerekir.",
      loginToSave: "Kaydetmek için giriş yapın"
    },
    docs: {
      title: "Karyamoni Dokümanları",
      lead: "IKAS kurulumu, ürün aktivasyonu ve dashboard kullanımı için açık dokümantasyon.",
      sections: [
        {
          title: "Karyamoni nedir?",
          body: "Karyamoni, doğrudan IKAS mağazanıza kurulan bir sanal deneme uygulamasıdır. Alışveriş yapanlar, ürün sayfasından çıkmadan 3D deneme kabininde kıyafet dener.",
          points: ["Ayrı web sitesi yok", "Mağazanın içinde çalışır", "Türkçe ve İngilizce destek"]
        },
        {
          title: "İade oranlarını neden düşürür?",
          body: "Yanlış beden seçimi, kıyafet iadelerinin en büyük nedenidir. Karyamoni, alışveriş yapanlara ödeme öncesi beden tavsiyesi vererek güvenli alım sağlar.",
          points: ["Yanlış beden iadesi azalır", "Alışverişçi güveni artar", "Deneme sonrası sepete ekleme oranı yükselir"]
        },
        {
          title: "IKAS kurulumu nasıl yapılır?",
          body: "Karyamoni, birkaç adımda IKAS uygulaması olarak kurulur. Geliştirici gerekmez.",
          points: ["IKAS App Store'da bul", "İzinleri bir kez ver", "Ürünler otomatik senkronize olur"],
          steps: [
            "IKAS yönetici panelinizi açın",
            "Uygulamalar → App Store'a gidin",
            "Karyamoni'yi arayın",
            "Kur'a tıklayın ve izinleri onaylayın",
            "Ürünleriniz arka planda senkronize olur"
          ]
        },
        {
          title: "Ürünlerinizi nasıl aktive edersiniz?",
          body: "Hangi ürünlerde deneme butonu gösterileceğini seçin. Her ürün, neye dikkat etmeniz gerektiğini gösteren bir hazırlık durumu gösterir.",
          points: ["Hazır", "Eksik veri", "Desteklenmiyor", "Canlı"]
        },
        {
          title: "Alışveriş yapanlar nasıl kullanır?",
          body: "Ürün sayfasındaki alışveriş yapan deneme butonuna tıklar, temel beden bilgilerini girer ve aynı sayfa içinde beden tavsiyesi alır.",
          points: ["0 yönlendirme", "3 dakika altında", "Net beden sonucu"]
        },
        {
          title: "Dashboard ve analitik",
          body: "Pilot dashboard; kurulum durumunuzu, hazır ürünlerinizi, kaç alışveriş yapanın deneme başlattığını ve erken iade etkisi sinyallerini gösterir.",
          points: ["Kurulum checklist'i", "Deneme kullanım sayısı", "İade etkisi alanı"]
        },
        {
          title: "Gizlilik ve veri",
          body: "Alışveriş yapanların beden bilgisi hassas kabul edilir. Karyamoni, kişisel fit verisini saklamadan önce onay alır ve KVKK gerekliliklerine uyar.",
          points: ["Açık rıza zorunlu", "KVKK uyumlu", "Veri üçüncü taraflara satılmaz"]
        }
      ]
    },
    login: {
      title: "Karyamoni'ye giriş yap",
      lead: "Dashboard ve kaydedilmiş playground için Google veya WhatsApp doğrulaması kullanın.",
      google: "Google ile giriş yap",
      whatsapp: "WhatsApp ile doğrulama",
      phonePlaceholder: "+90 5xx xxx xx xx",
      codePlaceholder: "6 haneli kod",
      sendCode: "Kod gönder",
      verify: "Doğrula ve devam et",
      devHint: "Yerel geliştirmede Twilio değişkenleri yoksa test kodu 000000 kabul edilir."
    },
    dashboard: {
      title: "Pilot Dashboard",
      lead: "IKAS kurulum durumu, ürün hazırlığı, try-on kullanımı ve iade etkisini tek ekranda takip edin.",
      installStatus: "IKAS app durumu",
      checklist: "Kurulum checklist'i",
      products: "Ürün hazırlığı",
      metrics: "Try-on metrikleri",
      impact: "İade etkisi"
    }
  },
  en: {
    nav: {
      playground: "Playground",
      docs: "Docs",
      dashboard: "Dashboard",
      login: "Login",
      launch: "Launch for IKAS"
    },
    home: {
      badge: "Virtual fitting cabin for IKAS stores",
      title: "Start ending size-related returns on the product page.",
      lead:
        "Karyamoni installs into an IKAS store with an app-like setup and lets shoppers try clothing in a 3D cabin without leaving the buying flow.",
      primary: "Try the playground",
      secondary: "Read the docs",
      rail: ["Try-On", "IKAS App", "Playground", "Docs", "Dashboard", "Analytics", "Trust"],
      heroProduct: "Oversized Cotton Shirt",
      heroButton: "Try with Karyamoni",
      heroResult: "Recommended size: M · Confidence: high",
      features: [
        {
          id: "try-on",
          eyebrow: "Try-On",
          title: "The fitting cabin opens inside the store.",
          body:
            "The shopper never leaves the product page. Karyamoni works as a modal, drawer, or embedded panel without interrupting checkout intent.",
          stat: "0 redirects",
          accent: "Store-first flow"
        },
        {
          id: "ikas",
          eyebrow: "IKAS App",
          title: "Setup should feel simple to the merchant.",
          body:
            "The first target is an IKAS application that handles permissions, product data sync, and product-page activation as automatically as IKAS allows.",
          stat: "1 install",
          accent: "Near one-click"
        },
        {
          id: "playground",
          eyebrow: "Playground",
          title: "Merchants feel the product before connecting a store.",
          body:
            "The guided demo simulates an IKAS product page, body profile, 3D cabin, and fit result so the product can be experienced, not explained.",
          stat: "3 minutes",
          accent: "Live-demo energy"
        },
        {
          id: "docs",
          eyebrow: "Docs",
          title: "Docs stay open; app actions stay gated.",
          body:
            "Install, activation, and troubleshooting docs stay public. Saving progress and entering the dashboard require login.",
          stat: "Public",
          accent: "Transparent setup"
        },
        {
          id: "dashboard",
          eyebrow: "Dashboard",
          title: "Pilot stores see what is ready.",
          body:
            "The dashboard brings installation status, product readiness, try-on usage, and early return-impact signals into one pilot surface.",
          stat: "Pilot",
          accent: "Practical start"
        },
        {
          id: "analytics",
          eyebrow: "Analytics",
          title: "Every try-on maps back to merchant value.",
          body:
            "Try-on impressions, profile completion, fit result views, add-to-cart behavior, and return requests are modeled from day one.",
          stat: "Funnel",
          accent: "Conversion linked"
        },
        {
          id: "trust",
          eyebrow: "Trust",
          title: "Trust, speed, and privacy sit in the same design.",
          body:
            "Body data is treated as sensitive. Explicit consent, quick loading, and clear fit results are the trust core of the product.",
          stat: "Privacy",
          accent: "Safer try-on"
        }
      ],
      closingTitle: "Karyamoni is not a site beside the store; it is an app inside the store.",
      closingBody: "The website proves that through experience, documentation, and a pilot dashboard."
    },
    playground: {
      title: "Guided Playground",
      lead: "Try how Karyamoni feels on an IKAS product page with demo data.",
      productName: "Ribbed Texture Blazer",
      price: "$86",
      sizeLabel: "Size",
      start: "Try with Karyamoni",
      profileTitle: "Build your fit profile",
      cabinTitle: "3D cabin preview",
      resultTitle: "Fit result",
      save: "Save demo progress",
      saveHint: "Login is required to save.",
      loginToSave: "Login to save"
    },
    docs: {
      title: "Karyamoni Docs",
      lead: "Open documentation for IKAS installation, product activation, and dashboard usage.",
      sections: [
        {
          title: "What is Karyamoni?",
          body: "Karyamoni is a virtual try-on app that installs directly into your IKAS store. Shoppers try on clothing in a 3D fitting cabin without leaving the product page.",
          points: ["No separate website", "Works inside your store", "Turkish and English support"]
        },
        {
          title: "Why it reduces returns",
          body: "Size confusion is the top reason for clothing returns. Karyamoni gives shoppers a fit result before checkout so they buy with confidence.",
          points: ["Fewer wrong-size returns", "Higher shopper confidence", "More add-to-cart after try-on"]
        },
        {
          title: "How to install on IKAS",
          body: "Karyamoni installs as an IKAS application in a few steps. No developer needed.",
          points: ["Find in IKAS App Store", "Grant permissions once", "Products sync automatically"],
          steps: [
            "Open your IKAS admin panel",
            "Go to Apps → App Store",
            "Search for Karyamoni",
            "Click Install and approve permissions",
            "Your products sync in the background"
          ]
        },
        {
          title: "Activate your products",
          body: "Choose which products show the try-on button. Each product shows a readiness status so you know what needs attention.",
          points: ["Ready", "Missing data", "Unsupported", "Live"]
        },
        {
          title: "How shoppers use it",
          body: "A shopper on your product page clicks the try-on button, enters basic fit information, and gets a size recommendation inside the same page.",
          points: ["0 redirects", "Under 3 minutes", "Clear size result"]
        },
        {
          title: "Dashboard & analytics",
          body: "The pilot dashboard shows your installation status, which products are ready, how many shoppers started a try-on, and early return impact signals.",
          points: ["Setup checklist", "Try-on usage count", "Return impact area"]
        },
        {
          title: "Privacy & data",
          body: "Shopper body information is treated as sensitive. Karyamoni collects consent before storing any personal fit data and complies with KVKK requirements.",
          points: ["Explicit consent required", "KVKK compliant", "No data sold to third parties"]
        }
      ]
    },
    login: {
      title: "Login to Karyamoni",
      lead: "Use Google or WhatsApp verification for the dashboard and saved playground.",
      google: "Continue with Google",
      whatsapp: "Verify with WhatsApp",
      phonePlaceholder: "+1 555 010 0000",
      codePlaceholder: "6-digit code",
      sendCode: "Send code",
      verify: "Verify and continue",
      devHint: "In local development, if Twilio env vars are missing, test code 000000 is accepted."
    },
    dashboard: {
      title: "Pilot Dashboard",
      lead: "Track IKAS install status, product readiness, try-on usage, and return impact from one surface.",
      installStatus: "IKAS app status",
      checklist: "Setup checklist",
      products: "Product readiness",
      metrics: "Try-on metrics",
      impact: "Return impact"
    }
  }
};

export type SiteContent = (typeof content)[Locale];

export function getContent(locale: Locale) {
  return content[locale];
}
