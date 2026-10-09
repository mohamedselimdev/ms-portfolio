import type { Content, L } from "./types";

// Initial CMS content. Only real, verifiable information is included.
// Anything unknown (stats, testimonials, results, live URLs…) starts empty and stays hidden until set from the dashboard.

const l = (en: string, ar: string): L => ({ en, ar });
const empty = l("", "");
const now = "2026-01-01T00:00:00.000Z";
const base = (id: string, order: number) => ({ id, order, status: "published" as const, updatedAt: now });

export function createSeed(): Content {
  return {
    version: 1,
    settings: {
      siteName: l("Mohamed Selim", "محمد سليم"),
      role: l("Full-Stack Web Developer", "مطوّر ويب متكامل"),
      logo: "/images/brand/logo.svg",
      email: "Mohamedosamaegy1@gmail.com",
      whatsapp: "",
      phone: "",
      linkedin: "https://www.linkedin.com/in/mohamed-selim-249109239",
      github: "https://github.com/mohamedselimdev",
      instagram: "https://www.instagram.com/mohamedselim.dev",
      calendlyUrl: "",
      location: l("Yekaterinburg, Russia · Working remotely worldwide", "يكاترينبورغ، روسيا · أعمل عن بُعد مع عملاء من كل مكان"),
      availabilityEnabled: true,
      availabilityText: l("Available for freelance projects", "متاح لمشاريع العمل الحر"),
      responseTime: empty,
      siteVisible: true,
      maintenanceMessage: l("The site is being updated. Please check back soon.", "الموقع قيد التحديث حاليًا. يُرجى العودة قريبًا."),
      resumeUrl: "",
    },
    theme: {
      primary: "#1F6BFF",
      accent: "#3DA5FF",
      background: "#050B18",
      surface: "#0B1428",
      radius: 16,
      glow: 35,
    },
    seo: {
      title: l("Mohamed Selim — Freelance Full-Stack Web Developer", "محمد سليم — مطوّر ويب متكامل مستقل"),
      description: l(
        "Freelance full-stack web developer building fast, bilingual (Arabic/English) websites, web apps, e-commerce stores and APIs with Next.js, React, Node.js and ASP.NET Core.",
        "مطوّر ويب متكامل مستقل، أبني مواقع وتطبيقات ويب ومتاجر إلكترونية وواجهات برمجية سريعة وثنائية اللغة (عربي/إنجليزي) باستخدام Next.js وReact وNode.js وASP.NET Core.",
      ),
      keywords: l(
        "full-stack developer, freelance web developer, Next.js developer, React developer, e-commerce website, web application, Arabic website, RTL",
        "مطور ويب, مطور مواقع مستقل, تصميم مواقع, متجر إلكتروني, تطبيق ويب, Next.js, React, موقع عربي",
      ),
      ogImage: "",
      twitterHandle: "",
    },
    hero: {
      badge: l("Available for freelance projects", "متاح لمشاريع العمل الحر"),
      titleLine1: l("Full-Stack", "مطوّر"),
      titleHighlight: l("Web", "ويب"),
      titleLine2: l("Developer", "متكامل"),
      subtitle: l(
        "I build modern websites, web applications, e-commerce stores and scalable backend systems for businesses and ambitious founders — in English and Arabic.",
        "أبني مواقع حديثة وتطبيقات ويب ومتاجر إلكترونية وأنظمة خلفية قابلة للتوسع للشركات ورواد الأعمال الطموحين — بالعربية والإنجليزية.",
      ),
      techStack: "React, Next.js, TypeScript, Node.js, ASP.NET Core, PostgreSQL",
      primaryCta: l("Start a Project", "ابدأ مشروعك"),
      secondaryCta: l("View My Work", "شاهد أعمالي"),
      image: "/images/profile/portrait-cutout-v3.webp",
      note: l("Turning ideas into powerful web experiences.", "أحوّل الأفكار إلى تجارب ويب قوية."),
      showSignature: true,
    },
    about: {
      eyebrow: l("About me", "من أنا"),
      title: l("Building digital products", "أبني منتجات رقمية"),
      highlight: l("that matter", "تصنع فرقًا"),
      intro: l(
        "I'm Mohamed Selim, a full-stack web developer with a BSc in Software Engineering from Ural Federal University. I help businesses and founders turn ideas into fast, reliable websites and web applications.",
        "أنا محمد سليم، مطوّر ويب متكامل حاصل على بكالوريوس هندسة البرمجيات من جامعة الأورال الفيدرالية. أساعد الشركات ورواد الأعمال على تحويل أفكارهم إلى مواقع وتطبيقات ويب سريعة وموثوقة.",
      ),
      story: l(
        "My work covers the whole stack: responsive interfaces with React and Next.js, backend services and REST APIs with Node.js and ASP.NET Core, relational databases like PostgreSQL and SQLite, and deployment on modern cloud platforms.\n\nI'm a native Arabic speaker who also works in English and Russian, so I build truly bilingual products — proper right-to-left layouts, not just translated text. Alongside freelance work, I'm studying for an MSc in Artificial Intelligence Engineering, which keeps me close to where the web is heading.",
        "يغطي عملي كل طبقات التطوير: واجهات متجاوبة باستخدام React وNext.js، وخدمات خلفية وواجهات REST باستخدام Node.js وASP.NET Core، وقواعد بيانات علائقية مثل PostgreSQL وSQLite، والنشر على منصات سحابية حديثة.\n\nالعربية لغتي الأم وأعمل أيضًا بالإنجليزية والروسية، لذلك أبني منتجات ثنائية اللغة فعلًا — بتخطيط صحيح من اليمين إلى اليسار وليس مجرد نص مترجم. وإلى جانب العمل الحر أدرس الماجستير في هندسة الذكاء الاصطناعي، ما يبقيني قريبًا من مستقبل الويب.",
      ),
      quote: l(
        "For me, development is more than code — it's about solving real problems and turning ideas into real value.",
        "البرمجة بالنسبة لي أكثر من مجرد كود — إنها حل مشكلات حقيقية وتحويل الأفكار إلى قيمة حقيقية.",
      ),
      image: "/images/profile/portrait-v2.webp",
      secondaryImage: "/images/profile/portrait-suit.webp",
      languages: l("Arabic (native) · Russian (B2) · English (B1)", "العربية (اللغة الأم) · الروسية (B2) · الإنجليزية (B1)"),
      degree: l("BSc in Software Engineering", "بكالوريوس هندسة البرمجيات"),
      university: l("Ural Federal University, Russia", "جامعة الأورال الفيدرالية، روسيا"),
      graduationYear: "2025",
    },
    pages: {
      projectsTitle: l("Selected *Projects*", "مشاريع *مختارة*"),
      projectsSubtitle: l(
        "Real projects built with modern technologies, clean code and a focus on performance and user experience.",
        "مشاريع حقيقية مبنية بتقنيات حديثة وكود نظيف مع تركيز على الأداء وتجربة المستخدم.",
      ),
      servicesTitle: l("Professional *Development* Services", "خدمات *تطوير* احترافية"),
      servicesSubtitle: l(
        "Modern, high-performance web solutions tailored to your business goals — from polished frontends to solid backends.",
        "حلول ويب حديثة وعالية الأداء مصممة لأهداف عملك — من واجهات أمامية مصقولة إلى أنظمة خلفية متينة.",
      ),
      contactTitle: l("Turn your idea into a *powerful digital product*", "حوّل فكرتك إلى *منتج رقمي قوي*"),
      contactSubtitle: l(
        "Looking for a reliable full-stack developer for your website, web app or online store? Tell me about your project and let's make it happen.",
        "تبحث عن مطوّر ويب متكامل موثوق لموقعك أو تطبيقك أو متجرك الإلكتروني؟ أخبرني عن مشروعك ولنحوّله إلى واقع.",
      ),
      ctaTitle: l("Have a *project* in mind?", "لديك *مشروع* في بالك؟"),
      ctaSubtitle: l(
        "Let's discuss your idea and turn it into a powerful digital product. I'm available for freelance work.",
        "لنتناقش حول فكرتك ونحوّلها إلى منتج رقمي قوي. أنا متاح للعمل الحر.",
      ),
    },

    // Hidden until real numbers are added from the dashboard.
    stats: [],
    testimonials: [],

    categories: [
      {
        "id": "cat-ecommerce",
        "order": 1,
        "status": "published",
        "updatedAt": "2026-01-01T00:00:00.000Z",
        "slug": "e-commerce",
        "name": {
          "en": "E-Commerce",
          "ar": "متاجر إلكترونية"
        },
        "icon": "shopping-cart"
      },
      {
        "id": "cat-webapp",
        "order": 2,
        "status": "published",
        "updatedAt": "2026-01-01T00:00:00.000Z",
        "slug": "web-apps",
        "name": {
          "en": "Web Apps",
          "ar": "تطبيقات ويب"
        },
        "icon": "app-window"
      },
      {
        "id": "cat-backend",
        "order": 3,
        "status": "published",
        "updatedAt": "2026-01-01T00:00:00.000Z",
        "slug": "backend",
        "name": {
          "en": "Backend & APIs",
          "ar": "الخلفية والواجهات البرمجية"
        },
        "icon": "database"
      },
      {
        "id": "cat-healthcare",
        "order": 4,
        "status": "published",
        "updatedAt": "2026-10-03T01:34:07.959Z",
        "slug": "healthcare",
        "name": {
          "en": "Healthcare",
          "ar": "الرعاية الصحية"
        },
        "icon": "heart"
      }
    ],

    projects: [
      {
        "id": "prj-basaer",
        "order": 1,
        "status": "published",
        "updatedAt": "2026-10-03T01:34:07.959Z",
        "slug": "basaer-medical-center",
        "title": {
          "en": "Basaer Medical Center — Eye Clinic Booking Platform",
          "ar": "مركز بصائر لطب وجراحة العيون — منصة حجز وإدارة"
        },
        "summary": {
          "en": "Bilingual website and full clinic dashboard for an ophthalmology center: online booking with no double-booking, doctor schedules, patient records, staff roles and live new-booking alerts.",
          "ar": "موقع ثنائي اللغة ولوحة إدارة كاملة لمركز طب وجراحة عيون: حجز أونلاين بدون تكرار للمواعيد، جداول الأطباء، ملفات المرضى، صلاحيات الموظفين وتنبيهات فورية بالحجوزات الجديدة."
        },
        "category": "healthcare",
        "image": "/images/projects/basaer/cover.webp",
        "gallery": [
          {
            "src": "/images/projects/basaer/cover.webp",
            "caption": {
              "en": "Website on desktop and mobile",
              "ar": "الموقع على الكمبيوتر والموبايل"
            }
          },
          {
            "src": "/images/projects/basaer/booking.webp",
            "caption": {
              "en": "Step-by-step booking wizard with live summary",
              "ar": "معالج الحجز خطوة بخطوة مع ملخص فوري"
            }
          },
          {
            "src": "/images/projects/basaer/home-en.webp",
            "caption": {
              "en": "English version (LTR)",
              "ar": "النسخة الإنجليزية"
            }
          },
          {
            "src": "/images/projects/basaer/dark.webp",
            "caption": {
              "en": "Dark theme, following the device setting",
              "ar": "المظهر الداكن حسب إعداد الجهاز"
            }
          },
          {
            "src": "/images/projects/basaer/services.webp",
            "caption": {
              "en": "Medical services catalogue",
              "ar": "صفحة الخدمات الطبية"
            }
          },
          {
            "src": "/images/projects/basaer/mobile.webp",
            "caption": {
              "en": "Booking and English homepage on mobile",
              "ar": "الحجز والنسخة الإنجليزية على الموبايل"
            }
          }
        ],
        "stack": "Next.js, React, TypeScript, Tailwind CSS, Prisma, Zod, Cloudflare Workers, Cloudflare D1, Cloudflare R2, Vitest, Playwright",
        "liveUrl": "https://basaercenter.com",
        "githubUrl": "",
        "featured": true,
        "projectStatus": "completed",
        "year": "2026",
        "role": {
          "en": "Full-Stack Developer (design, development & deployment)",
          "ar": "مطوّر ويب متكامل (تصميم وتطوير ونشر)"
        },
        "client": {
          "en": "Basaer Medical Center — eye clinic, 6th of October",
          "ar": "مركز بصائر لطب وجراحة العيون — 6 أكتوبر"
        },
        "timeline": {
          "en": "",
          "ar": ""
        },
        "overview": {
          "en": "Basaer is an ophthalmology and eye-surgery center. I built its bilingual website and the dashboard the clinic runs on every day: patients book online in a few taps, and staff manage appointments, doctors, patients and site content from one place.",
          "ar": "بصائر مركز متخصص في طب وجراحة العيون. بنيت موقعه ثنائي اللغة ولوحة التحكم اللي بيشتغل عليها المركز يوميًا: المريض يحجز أونلاين في خطوات بسيطة، والموظفين يديروا المواعيد والأطباء والمرضى ومحتوى الموقع من مكان واحد."
        },
        "challenge": {
          "en": "The clinic needed reliable online booking without payments — confirmation happens over WhatsApp — while making sure two patients can never take the same slot, and giving receptionists, doctors and managers different levels of access. It also had to run cheaply on serverless infrastructure.",
          "ar": "المركز كان محتاج حجز أونلاين موثوق من غير دفع إلكتروني — التأكيد بيتم على واتساب — مع ضمان إن مفيش مريضين ياخدوا نفس الميعاد، وإعطاء الاستقبال والأطباء والإدارة صلاحيات مختلفة. وكمان يشتغل بتكلفة قليلة على بنية Serverless."
        },
        "solution": {
          "en": "A Next.js 16 app on Cloudflare Workers with D1 (via Prisma) and R2 for uploads. Booking is a guided wizard (service and doctor, then date and time, then patient details) protected by a unique slot key and server-side re-validation, ending with a pre-filled WhatsApp confirmation. The dashboard opens on today's schedule with one-tap status buttons, and includes a calendar, patient records, doctor schedules and blocked days, a waitlist, role-based staff permissions, an audit log, reports and full content management. New bookings trigger a sound and browser notification for staff, and a cron job runs every 5 minutes for scheduled tasks.",
          "ar": "تطبيق Next.js 16 على Cloudflare Workers مع قاعدة بيانات D1 عن طريق Prisma وR2 لرفع الملفات. الحجز معالج خطوة بخطوة (الخدمة والطبيب، ثم اليوم والوقت، ثم بيانات المريض) ومحمي بمفتاح فريد لكل ميعاد وتحقق إضافي على السيرفر، وينتهي برسالة واتساب جاهزة للتأكيد. لوحة التحكم بتفتح على جدول اليوم مع أزرار تغيير الحالة بلمسة، وفيها تقويم وملفات المرضى وجداول الأطباء والأيام المغلقة وقائمة انتظار وصلاحيات موظفين حسب الدور وسجل عمليات وتقارير وإدارة كاملة للمحتوى. الحجوزات الجديدة بتطلع تنبيه صوتي وإشعار للموظفين، ومهمة مجدولة بتشتغل كل 5 دقائق."
        },
        "features": {
          "en": "Arabic (RTL, default) and English website\nGuided booking wizard with live booking summary\nNo double booking: unique slot key + server re-validation\nWhatsApp confirmation instead of online payment\nPatients can look up and manage their appointment\nDoctors, services, offers, reviews, insurance and FAQ pages\nToday's schedule with one-tap appointment status\nAppointments calendar and manual booking for staff\nPatient records with one-tap WhatsApp\nDoctor schedules, blocked days and waitlist\nStaff roles and permissions with audit log\nLive new-booking alerts (sound + browser notifications)\nContent, banners and offers management\nLight and dark themes that follow the device",
          "ar": "موقع بالعربية (افتراضي) والإنجليزية\nمعالج حجز خطوة بخطوة مع ملخص فوري\nمنع تكرار الحجز بمفتاح فريد للميعاد وتحقق على السيرفر\nتأكيد الحجز عبر واتساب بدل الدفع الإلكتروني\nالمريض يقدر يراجع ويدير ميعاده\nصفحات الأطباء والخدمات والعروض والتقييمات والتأمين والأسئلة الشائعة\nجدول اليوم مع تغيير حالة الموعد بلمسة\nتقويم المواعيد وحجز يدوي من الموظفين\nملفات المرضى مع فتح واتساب بلمسة\nجداول الأطباء والأيام المغلقة وقائمة الانتظار\nصلاحيات الموظفين حسب الدور مع سجل العمليات\nتنبيهات فورية بالحجوزات الجديدة (صوت وإشعارات)\nإدارة المحتوى والبانرات والعروض\nمظهر فاتح وداكن حسب إعداد الجهاز"
        },
        "responsibilities": {
          "en": "UI/UX and responsive RTL/LTR implementation\nFrontend and backend development\nDatabase design with Prisma on Cloudflare D1\nBooking logic, roles and permissions\nSecurity hardening (rate limits, CSP, input validation)\nUnit, integration and end-to-end tests\nDeployment on Cloudflare Workers, D1 and R2",
          "ar": "تصميم الواجهات وتنفيذها متجاوبة بالعربي والإنجليزي\nتطوير الواجهة الأمامية والخلفية\nتصميم قاعدة البيانات باستخدام Prisma على Cloudflare D1\nمنطق الحجز والأدوار والصلاحيات\nتأمين النظام (حدود الطلبات وسياسة CSP والتحقق من المدخلات)\nاختبارات الوحدات والتكامل والاختبارات الشاملة\nالنشر على Cloudflare Workers وD1 وR2"
        },
        "results": {
          "en": "",
          "ar": ""
        }
      },
      {
        "id": "prj-hema",
        "order": 2,
        "status": "published",
        "updatedAt": "2026-10-03T01:34:07.959Z",
        "slug": "hema-phone",
        "title": {
          "en": "Hema Phone — Bilingual E-Commerce Store",
          "ar": "هيما فون — متجر إلكتروني ثنائي اللغة"
        },
        "summary": {
          "en": "Live Arabic/English store for a phones & accessories shop: catalog, cart, WhatsApp ordering, maintenance requests and a full admin panel with products, orders, team roles and an analytics dashboard.",
          "ar": "متجر عربي/إنجليزي شغّال لمحل هواتف وإكسسوارات: كتالوج وسلة وطلب عبر واتساب وطلبات صيانة، ولوحة تحكم كاملة للمنتجات والطلبات وصلاحيات الفريق ولوحة تقارير وإحصائيات."
        },
        "category": "e-commerce",
        "image": "/images/projects/hema-phone/cover.webp",
        "gallery": [
          {
            "src": "/images/projects/hema-phone/cover.webp",
            "caption": {
              "en": "Storefront on desktop and mobile",
              "ar": "المتجر على الكمبيوتر والموبايل"
            }
          },
          {
            "src": "/images/projects/hema-phone/products.webp",
            "caption": {
              "en": "Product cards with discounts and stock status",
              "ar": "بطاقات المنتجات مع الخصومات وحالة المخزون"
            }
          },
          {
            "src": "/images/projects/hema-phone/order.webp",
            "caption": {
              "en": "Cart and order confirmation",
              "ar": "السلة وتأكيد الطلب"
            }
          },
          {
            "src": "/images/projects/hema-phone/mobile.webp",
            "caption": {
              "en": "Mobile storefront and product grid",
              "ar": "المتجر وشبكة المنتجات على الموبايل"
            }
          },
          {
            "src": "/images/projects/hema-phone/admin-team.webp",
            "caption": {
              "en": "Admin: team accounts and role-based permissions",
              "ar": "لوحة التحكم: حسابات الفريق والصلاحيات"
            }
          }
        ],
        "stack": "Next.js, React, TypeScript, Tailwind CSS, Drizzle ORM, Zod, Recharts, Cloudflare Workers, Cloudflare D1, Cloudflare R2",
        "liveUrl": "https://hemaphone.net",
        "githubUrl": "",
        "featured": true,
        "projectStatus": "completed",
        "year": "2026",
        "role": {
          "en": "Full-Stack Developer",
          "ar": "مطوّر ويب متكامل"
        },
        "client": {
          "en": "Hema Phone — mobile phones & accessories retailer",
          "ar": "هيما فون — متجر هواتف وإكسسوارات"
        },
        "timeline": {
          "en": "",
          "ar": ""
        },
        "overview": {
          "en": "Hema Phone is a bilingual online store for a mobile phones and accessories shop. Customers browse products, add them to the cart and send the order; the shop confirms by WhatsApp or collects payment on delivery.",
          "ar": "هيما فون متجر إلكتروني ثنائي اللغة لمحل هواتف وإكسسوارات. يتصفح العميل المنتجات ويضيفها للسلة ويرسل الطلب، ثم يؤكد المحل الطلب عبر واتساب أو يتم الدفع عند الاستلام."
        },
        "challenge": {
          "en": "The shop needed to sell online to Arabic-speaking customers without a card payment gateway, while letting the owner and staff manage products, stock, orders, repair requests and homepage banners themselves — each person with only the access they need.",
          "ar": "احتاج المحل إلى البيع أونلاين لعملاء يتحدثون العربية بدون بوابة دفع إلكتروني، مع تمكين المالك والموظفين من إدارة المنتجات والمخزون والطلبات وطلبات الصيانة وإعلانات الصفحة الرئيسية بأنفسهم — ولكل شخص الصلاحيات التي يحتاجها فقط."
        },
        "solution": {
          "en": "I built an RTL-first storefront with an English version, light and dark themes, search, wishlist and cart, plus an order flow that hands off to WhatsApp. Behind it is a role-based admin panel for products, colors and inventory, orders and maintenance, banners, shipping settings and team accounts, backed by SQLite / Cloudflare D1 through Drizzle ORM.",
          "ar": "بنيت واجهة متجر تدعم العربية من اليمين لليسار مع نسخة إنجليزية ومظهر فاتح وداكن وبحث ومفضلة وسلة، مع مسار طلب ينتقل إلى واتساب. وخلفها لوحة تحكم بصلاحيات حسب الدور لإدارة المنتجات والألوان والمخزون والطلبات والصيانة والإعلانات وإعدادات الشحن وحسابات الفريق، مع قاعدة بيانات SQLite / Cloudflare D1 عبر Drizzle ORM."
        },
        "features": {
          "en": "Arabic (RTL) and English storefront\nLight and dark themes\nProduct search, categories, brands and wishlist\nCart with ordering via WhatsApp or cash on delivery\nHome delivery to 27 governorates or pickup from 2 branches\nMaintenance (repair) requests section\nShort product videos on the storefront\nAdmin: products, colors, categories, brands and inventory\nAdmin: orders, maintenance requests, delivery and shipping\nAdmin: reports — visitors, conversion funnel, traffic sources, devices, top products, searches with no results\nPDF / Excel export of reports\nHome banners, storefront settings and branches management\nTeam accounts with role-based permissions",
          "ar": "واجهة متجر بالعربية (RTL) والإنجليزية\nمظهر فاتح وداكن\nبحث عن المنتجات والفئات والبراندات والمفضلة\nسلة مع الطلب عبر واتساب أو الدفع عند الاستلام\nتوصيل لـ 27 محافظة أو استلام من فرعين\nقسم طلبات الصيانة\nفيديوهات قصيرة للمنتجات على المتجر\nلوحة التحكم: المنتجات والألوان والفئات والبراندات والمخزون\nلوحة التحكم: الطلبات وطلبات الصيانة والتوصيل والشحن\nلوحة التحكم: تقارير الزوار ومسار الشراء ومصادر الزيارات والأجهزة والأكثر مشاهدة والبحث بدون نتائج\nتصدير التقارير PDF وExcel\nإدارة البانرات وواجهة المتجر والفروع\nحسابات فريق بصلاحيات حسب الدور"
        },
        "responsibilities": {
          "en": "UI implementation (RTL & LTR)\nFrontend and backend development\nDatabase design with Drizzle ORM on Cloudflare D1\nAdmin panel, analytics and role-based access control\nDeployment on Cloudflare Workers",
          "ar": "تنفيذ الواجهات (RTL وLTR)\nتطوير الواجهة الأمامية والخلفية\nتصميم قاعدة البيانات باستخدام Drizzle ORM على Cloudflare D1\nلوحة التحكم والتقارير والتحكم في الصلاحيات\nالنشر على Cloudflare Workers"
        },
        "results": {
          "en": "",
          "ar": ""
        }
      },
      {
        "id": "prj-portfolio",
        "order": 3,
        "status": "published",
        "updatedAt": "2026-10-09T20:21:25.217Z",
        "slug": "portfolio-cms",
        "title": {
          "en": "Personal Portfolio — Bilingual Site with Built-in CMS",
          "ar": "البورتفوليو الشخصي — موقع ثنائي اللغة بلوحة تحكم"
        },
        "summary": {
          "en": "This website: an English/Arabic portfolio with project case studies, a contact inquiry form and a full admin dashboard that edits every section, running on Cloudflare Workers.",
          "ar": "هذا الموقع: بورتفوليو بالعربية والإنجليزية فيه دراسات حالة للمشاريع ونموذج طلب مشروع ولوحة تحكم كاملة لتعديل كل الأقسام، ويعمل على Cloudflare Workers."
        },
        "category": "web-apps",
        "image": "/images/projects/portfolio/cover.webp",
        "gallery": [
          {
            "src": "/images/projects/portfolio/cover.webp",
            "caption": {
              "en": "Homepage on desktop and mobile",
              "ar": "الصفحة الرئيسية على الكمبيوتر والموبايل"
            }
          },
          {
            "src": "/images/projects/portfolio/arabic.webp",
            "caption": {
              "en": "Arabic version with a true right-to-left layout",
              "ar": "النسخة العربية بتخطيط حقيقي من اليمين لليسار"
            }
          },
          {
            "src": "/images/projects/portfolio/projects.webp",
            "caption": {
              "en": "Projects page with category filters",
              "ar": "صفحة المشاريع مع التصفية حسب التصنيف"
            }
          },
          {
            "src": "/images/projects/portfolio/case-study.webp",
            "caption": {
              "en": "Project case study page",
              "ar": "صفحة دراسة حالة لمشروع"
            }
          },
          {
            "src": "/images/projects/portfolio/contact.webp",
            "caption": {
              "en": "Project inquiry form with validation",
              "ar": "نموذج طلب المشروع مع التحقق من البيانات"
            }
          },
          {
            "src": "/images/projects/portfolio/mobile.webp",
            "caption": {
              "en": "Mobile views in English and Arabic",
              "ar": "شاشات الموبايل بالإنجليزية والعربية"
            }
          }
        ],
        "stack": "Next.js, React, TypeScript, Tailwind CSS, Cloudflare Workers, Cloudflare D1, Cloudflare R2",
        "liveUrl": "https://portfolio.mohamedselim.workers.dev",
        "githubUrl": "https://github.com/mohamedselimdev/ms-portfolio",
        "featured": true,
        "projectStatus": "completed",
        "year": "2026",
        "role": {
          "en": "Full-Stack Developer (design, development & deployment)",
          "ar": "مطوّر ويب متكامل (تصميم وتطوير ونشر)"
        },
        "client": {
          "en": "Personal project",
          "ar": "مشروع شخصي"
        },
        "timeline": {
          "en": "",
          "ar": ""
        },
        "overview": {
          "en": "My own portfolio, built as a real product instead of a static page: every text, image, project and setting on the site is editable from a private dashboard, in both English and Arabic.",
          "ar": "البورتفوليو الخاص بي، مبني كمنتج حقيقي وليس صفحة ثابتة: كل نص وصورة ومشروع وإعداد في الموقع يمكن تعديله من لوحة تحكم خاصة، بالعربية والإنجليزية."
        },
        "challenge": {
          "en": "I wanted to update projects, services and contact details without touching code or redeploying, keep one codebase for two languages with a proper right-to-left layout, and host it without a traditional server or paid database.",
          "ar": "كنت أريد تحديث المشاريع والخدمات وبيانات التواصل دون تعديل الكود أو إعادة النشر، مع قاعدة كود واحدة للغتين بتخطيط صحيح من اليمين لليسار، واستضافته دون سيرفر تقليدي أو قاعدة بيانات مدفوعة."
        },
        "solution": {
          "en": "A Next.js 16 app deployed to Cloudflare Workers. Content lives in Cloudflare D1 and uploaded images in R2. The dashboard is generated from one declarative schema, so every section shares the same forms, validation, publish/draft, reordering and search. Translations come from shared files, and the language is part of the URL. The admin area is protected by a signed session cookie and a PBKDF2 password hash, with server-side validation and rate limiting on login and on the inquiry form.",
          "ar": "تطبيق Next.js 16 منشور على Cloudflare Workers. المحتوى محفوظ في Cloudflare D1 والصور المرفوعة في R2. لوحة التحكم مولّدة من مخطط واحد، فكل الأقسام تشترك في نفس النماذج والتحقق والنشر والمسودات وإعادة الترتيب والبحث. الترجمات من ملفات مشتركة واللغة جزء من الرابط. منطقة الإدارة محمية بكوكي جلسة موقّعة وكلمة سر مشفّرة بـ PBKDF2، مع تحقق على السيرفر وحد لعدد المحاولات في تسجيل الدخول ونموذج الطلبات."
        },
        "features": {
          "en": "English and Arabic with a true RTL layout from shared translation files\nHome, About, Projects, case study, Services and Contact pages\nProject filters and screenshot gallery with lightbox\nProject inquiry form with client and server validation\nAdmin dashboard for every section of the site\nPublish / draft, reorder, search and filter on every list\nMedia library with image uploads to Cloudflare R2\nInquiries inbox with read / replied / archived states\nPrivacy-friendly visitor analytics with no third parties\nSEO: metadata, hreflang, sitemap, generated share image\nTheme colours and maintenance mode editable from the dashboard\nUnknown data (stats, testimonials) stays hidden until filled in",
          "ar": "عربي وإنجليزي بتخطيط RTL حقيقي من ملفات ترجمة مشتركة\nصفحات الرئيسية ومن أنا والمشاريع ودراسة الحالة والخدمات والتواصل\nتصفية المشاريع ومعرض لقطات مع تكبير الصور\nنموذج طلب مشروع مع تحقق في المتصفح وعلى السيرفر\nلوحة تحكم لكل أقسام الموقع\nنشر ومسودات وإعادة ترتيب وبحث وتصفية في كل قائمة\nمكتبة وسائط مع رفع الصور إلى Cloudflare R2\nصندوق للطلبات بحالات مقروء وتم الرد ومؤرشف\nإحصائيات زوار تحترم الخصوصية بدون أطراف خارجية\nتحسين محركات البحث: بيانات وصفية وhreflang وخريطة الموقع وصورة مشاركة مولّدة\nألوان المظهر ووضع الصيانة قابلة للتعديل من اللوحة\nالبيانات غير المعروفة (الإحصائيات والآراء) تبقى مخفية حتى تُملأ"
        },
        "responsibilities": {
          "en": "UI design and responsive RTL/LTR implementation\nFrontend and backend development\nContent model and dashboard built from one schema\nAuthentication, validation and rate limiting\nData layer on Cloudflare D1 and R2\nDeployment to Cloudflare Workers",
          "ar": "تصميم الواجهات وتنفيذها متجاوبة بالعربي والإنجليزي\nتطوير الواجهة الأمامية والخلفية\nنموذج المحتوى ولوحة التحكم المبنية من مخطط واحد\nالمصادقة والتحقق من المدخلات وحد المحاولات\nطبقة البيانات على Cloudflare D1 وR2\nالنشر على Cloudflare Workers"
        },
        "results": {
          "en": "",
          "ar": ""
        }
      },
      {
        "id": "prj-collabflow",
        "order": 4,
        "status": "published",
        "updatedAt": "2026-01-01T00:00:00.000Z",
        "slug": "collabflow",
        "title": {
          "en": "CollabFlow — SaaS Project Management API",
          "ar": "CollabFlow — واجهة برمجية لإدارة المشاريع (SaaS)"
        },
        "summary": {
          "en": "Multi-tenant backend for a team project-management SaaS: JWT auth, workspaces with member roles, and project CRUD on ASP.NET Core 9 and PostgreSQL.",
          "ar": "نظام خلفي متعدد المستأجرين لمنصة SaaS لإدارة مشاريع الفرق: مصادقة JWT ومساحات عمل بأدوار للأعضاء وإدارة المشاريع على ASP.NET Core 9 وPostgreSQL."
        },
        "category": "backend",
        "image": "",
        "gallery": [],
        "stack": "ASP.NET Core 9, C#, Entity Framework Core, PostgreSQL, JWT, Docker",
        "liveUrl": "",
        "githubUrl": "",
        "featured": true,
        "projectStatus": "in-progress",
        "year": "",
        "role": {
          "en": "Backend Developer & Architect",
          "ar": "مطوّر خلفي ومصمم معمارية النظام"
        },
        "client": {
          "en": "Personal product",
          "ar": "منتج شخصي"
        },
        "timeline": {
          "en": "",
          "ar": ""
        },
        "overview": {
          "en": "CollabFlow is a SaaS platform for teams to organise work into workspaces and projects. This phase delivers the REST API that the web app is built on.",
          "ar": "CollabFlow منصة SaaS تساعد الفرق على تنظيم العمل في مساحات عمل ومشاريع. هذه المرحلة تقدم الواجهة البرمجية REST التي يُبنى عليها تطبيق الويب."
        },
        "challenge": {
          "en": "Several teams share one system, so every request has to be scoped to the right workspace and checked against the member's role — without making the API awkward to use.",
          "ar": "عدة فرق تتشارك نظامًا واحدًا، لذلك يجب ربط كل طلب بمساحة العمل الصحيحة والتحقق من دور العضو — دون أن تصبح الواجهة البرمجية معقدة الاستخدام."
        },
        "solution": {
          "en": "A layered ASP.NET Core API (controllers, services, DTOs) with JWT authentication, workspace membership and role management, and project endpoints scoped to workspaces. Entity Framework Core migrations manage the PostgreSQL schema, which already models tasks, comments, attachments, notifications and activity logs. PostgreSQL runs in Docker for local development.",
          "ar": "واجهة ASP.NET Core مقسمة إلى طبقات (Controllers وServices وDTOs) مع مصادقة JWT وإدارة عضوية وأدوار مساحات العمل ونقاط وصول للمشاريع مرتبطة بمساحة العمل. تدير ترحيلات Entity Framework Core مخطط PostgreSQL الذي يشمل المهام والتعليقات والمرفقات والإشعارات وسجل النشاط. وتعمل PostgreSQL داخل Docker للتطوير المحلي."
        },
        "features": {
          "en": "Register, login and current-user endpoints (JWT)\nWorkspaces with members and roles\nAdd, update and remove workspace members\nProject CRUD scoped to workspaces\nData model for tasks, comments, attachments, notifications and activity log\nHealth-check endpoint\nDockerised PostgreSQL",
          "ar": "نقاط تسجيل ودخول والمستخدم الحالي (JWT)\nمساحات عمل بأعضاء وأدوار\nإضافة وتعديل وحذف أعضاء مساحة العمل\nإدارة المشاريع داخل مساحات العمل\nنموذج بيانات للمهام والتعليقات والمرفقات والإشعارات وسجل النشاط\nنقطة فحص حالة الخدمة\nPostgreSQL داخل Docker"
        },
        "responsibilities": {
          "en": "System architecture and API design\nDatabase design and EF Core migrations\nAuthentication and authorization\nBackend implementation",
          "ar": "تصميم معمارية النظام والواجهة البرمجية\nتصميم قاعدة البيانات وترحيلات EF Core\nالمصادقة والتفويض\nتنفيذ النظام الخلفي"
        },
        "results": {
          "en": "",
          "ar": ""
        }
      },
      {
        "id": "prj-ryadom",
        "order": 5,
        "status": "published",
        "updatedAt": "2026-01-01T00:00:00.000Z",
        "slug": "ryadom",
        "title": {
          "en": "Ryadom — Psychological Support Platform",
          "ar": "ريادوم — منصة للدعم النفسي"
        },
        "summary": {
          "en": "A digital platform that makes mental-health support easier to access. My software engineering graduation project, graded 5/5.",
          "ar": "منصة رقمية تسهّل الوصول إلى خدمات الدعم النفسي. مشروع تخرجي في هندسة البرمجيات بتقدير 5/5."
        },
        "category": "web-apps",
        "image": "",
        "gallery": [],
        "stack": "",
        "liveUrl": "",
        "githubUrl": "",
        "featured": true,
        "projectStatus": "completed",
        "year": "2025",
        "role": {
          "en": "Lead Developer & Architect",
          "ar": "المطوّر الرئيسي ومصمم المعمارية"
        },
        "client": {
          "en": "Graduation project — Ural Federal University",
          "ar": "مشروع تخرج — جامعة الأورال الفيدرالية"
        },
        "timeline": {
          "en": "",
          "ar": ""
        },
        "overview": {
          "en": "Ryadom is a digital psychological support platform designed to improve access to mental-health services.",
          "ar": "ريادوم منصة رقمية للدعم النفسي صُممت لتحسين الوصول إلى خدمات الصحة النفسية."
        },
        "challenge": {
          "en": "People looking for psychological help often face barriers before they even reach a specialist. The platform had to feel approachable while handling sensitive user data securely.",
          "ar": "كثيرًا ما يواجه الباحثون عن الدعم النفسي عقبات قبل الوصول إلى المختص. كان على المنصة أن تكون سهلة ومريحة مع التعامل الآمن مع بيانات المستخدمين الحساسة."
        },
        "solution": {
          "en": "I architected the system structure, database schemas and secure authentication flows, built responsive web interfaces, and produced full project documentation to industry standards.",
          "ar": "صممت هيكل النظام ومخططات قاعدة البيانات ومسارات المصادقة الآمنة، وبنيت واجهات ويب متجاوبة، وأعددت توثيقًا كاملًا للمشروع وفق معايير الصناعة."
        },
        "features": {
          "en": "Secure user authentication\nResponsive web interface\nStructured database design\nFull project documentation",
          "ar": "مصادقة آمنة للمستخدمين\nواجهة ويب متجاوبة\nتصميم منظم لقاعدة البيانات\nتوثيق كامل للمشروع"
        },
        "responsibilities": {
          "en": "System architecture\nDatabase schema design\nAuthentication flows\nResponsive UI development\nProject documentation",
          "ar": "معمارية النظام\nتصميم مخطط قاعدة البيانات\nمسارات المصادقة\nتطوير واجهات متجاوبة\nتوثيق المشروع"
        },
        "results": {
          "en": "Defended as a graduation project and graded Excellent (5/5).",
          "ar": "نوقش كمشروع تخرج وحصل على تقدير ممتاز (5/5)."
        }
      }
    ],

    services: [
      {
        ...base("svc-web", 1),
        title: l("Web Development", "تطوير المواقع"),
        description: l("Modern, responsive websites built with clean code and best practices.", "مواقع حديثة ومتجاوبة مبنية بكود نظيف وأفضل الممارسات."),
        icon: "monitor",
        features: l(
          "Custom website development\nResponsive, mobile-first design\nPerformance & SEO optimized\nArabic & English (RTL/LTR)",
          "تطوير مواقع مخصصة\nتصميم متجاوب يبدأ بالهاتف\nتحسين الأداء ومحركات البحث\nعربي وإنجليزي (RTL/LTR)",
        ),
      },
      {
        ...base("svc-webapps", 2),
        title: l("Web Applications", "تطبيقات الويب"),
        description: l("Dashboards, SaaS products and internal tools with real business logic.", "لوحات تحكم ومنتجات SaaS وأدوات داخلية بمنطق عمل حقيقي."),
        icon: "app-window",
        features: l(
          "Admin panels & dashboards\nUser accounts & roles\nReal business workflows\nScalable architecture",
          "لوحات تحكم وإدارة\nحسابات مستخدمين وصلاحيات\nمسارات عمل حقيقية\nمعمارية قابلة للتوسع",
        ),
      },
      {
        ...base("svc-ecom", 3),
        title: l("E-commerce Solutions", "حلول المتاجر الإلكترونية"),
        description: l("Online stores with smooth shopping experiences and easy management.", "متاجر إلكترونية بتجربة تسوق سلسة وإدارة سهلة."),
        icon: "shopping-cart",
        features: l(
          "Custom store development\nCart, checkout & order flow\nProducts & inventory management\nPayment or WhatsApp ordering",
          "تطوير متجر مخصص\nسلة ودفع ومسار طلب\nإدارة المنتجات والمخزون\nدفع إلكتروني أو طلب عبر واتساب",
        ),
      },
      {
        ...base("svc-ui", 4),
        title: l("UI Implementation", "تنفيذ الواجهات"),
        description: l("Pixel-perfect implementation from Figma designs with smooth interactions.", "تنفيذ دقيق لتصاميم Figma مع تفاعلات سلسة."),
        icon: "layout-grid",
        features: l(
          "Figma to responsive code\nClean, semantic markup\nAccessible components\nCross-browser compatibility",
          "تحويل Figma إلى كود متجاوب\nكود نظيف ودلالي\nمكوّنات سهلة الوصول\nتوافق مع جميع المتصفحات",
        ),
      },
      {
        ...base("svc-backend", 5),
        title: l("Backend & API Development", "تطوير الأنظمة الخلفية والواجهات البرمجية"),
        description: l("Robust backends, REST APIs and database design for scalable applications.", "أنظمة خلفية متينة وواجهات REST وتصميم قواعد بيانات لتطبيقات قابلة للتوسع."),
        icon: "database",
        features: l(
          "RESTful API development\nDatabase design & optimization\nAuthentication & authorization\nSecure, scalable architecture",
          "تطوير واجهات RESTful\nتصميم وتحسين قواعد البيانات\nالمصادقة والتفويض\nمعمارية آمنة وقابلة للتوسع",
        ),
      },
      {
        ...base("svc-maint", 6),
        title: l("Maintenance & Optimization", "الصيانة والتحسين"),
        description: l("Keep your website fast, secure and up to date.", "حافظ على موقعك سريعًا وآمنًا ومحدّثًا."),
        icon: "settings",
        features: l(
          "Bug fixes & feature updates\nPerformance optimization\nSecurity improvements\nOngoing support",
          "إصلاح الأخطاء وإضافة الميزات\nتحسين الأداء\nتحسينات الأمان\nدعم مستمر",
        ),
      },
    ],

    process: [
      { ...base("prc-1", 1), icon: "message-square", title: l("Discovery", "الاستكشاف"), description: l("We discuss your goals, requirements and vision to understand your needs.", "نناقش أهدافك ومتطلباتك ورؤيتك لفهم احتياجاتك.") },
      { ...base("prc-2", 2), icon: "file-text", title: l("Plan & Design", "التخطيط والتصميم"), description: l("I plan the structure, choose the right technologies and create a roadmap.", "أخطط للهيكل وأختار التقنيات المناسبة وأضع خارطة طريق.") },
      { ...base("prc-3", 3), icon: "code", title: l("Build", "التطوير"), description: l("I develop your solution with clean, efficient and scalable code, sharing progress along the way.", "أطوّر الحل بكود نظيف وفعّال وقابل للتوسع مع مشاركة التقدم أولًا بأول.") },
      { ...base("prc-4", 4), icon: "rocket", title: l("Launch & Support", "الإطلاق والدعم"), description: l("After testing and your review, we launch — and I stay available for support.", "بعد الاختبار ومراجعتك نُطلق المشروع — وأبقى متاحًا للدعم.") },
    ],

    benefits: [
      { ...base("ben-1", 1), icon: "gem", title: l("High-quality code", "كود عالي الجودة"), description: l("Clean, maintainable and future-proof solutions.", "حلول نظيفة وسهلة الصيانة وجاهزة للمستقبل.") },
      { ...base("ben-2", 2), icon: "users", title: l("Clear communication", "تواصل واضح"), description: l("Regular updates and a transparent process.", "تحديثات منتظمة وعملية شفافة.") },
      { ...base("ben-3", 3), icon: "languages", title: l("Truly bilingual", "ثنائي اللغة فعلًا"), description: l("Native Arabic with proper RTL — plus English.", "العربية لغتي الأم مع RTL صحيح — بالإضافة إلى الإنجليزية.") },
      { ...base("ben-4", 4), icon: "layers", title: l("One developer, full stack", "مطوّر واحد لكل الطبقات"), description: l("Frontend, backend and database handled end to end.", "الواجهة الأمامية والخلفية وقاعدة البيانات من البداية للنهاية.") },
    ],

    faqs: [
      { ...base("faq-1", 1), placement: "both", question: l("What technologies do you work with?", "ما التقنيات التي تعمل بها؟"), answer: l("Mainly TypeScript, React and Next.js on the frontend; Node.js and ASP.NET Core on the backend; PostgreSQL and SQLite for data; plus Tailwind CSS, Docker, Git and Cloudflare.", "أساسًا TypeScript وReact وNext.js للواجهة الأمامية، وNode.js وASP.NET Core للخلفية، وPostgreSQL وSQLite للبيانات، إضافة إلى Tailwind CSS وDocker وGit وCloudflare.") },
      { ...base("faq-2", 2), placement: "both", question: l("Can you handle both frontend and backend?", "هل يمكنك العمل على الواجهة الأمامية والخلفية معًا؟"), answer: l("Yes. I build complete products end to end — interface, API, database and deployment.", "نعم. أبني منتجات كاملة من البداية للنهاية — الواجهة والواجهة البرمجية وقاعدة البيانات والنشر.") },
      { ...base("faq-3", 3), placement: "both", question: l("Do you build Arabic (RTL) websites?", "هل تبني مواقع عربية (RTL)؟"), answer: l("Yes. Arabic is my native language, and I build bilingual sites with real right-to-left layouts, not just translated text.", "نعم. العربية لغتي الأم، وأبني مواقع ثنائية اللغة بتخطيط حقيقي من اليمين لليسار وليس مجرد نص مترجم.") },
      { ...base("faq-4", 4), placement: "both", question: l("How do we get started?", "كيف نبدأ؟"), answer: l("Send a project inquiry with your idea, budget and timeline. I'll reply with questions or a proposal and next steps.", "أرسل طلب مشروع يتضمن فكرتك وميزانيتك والمدة المتوقعة، وسأرد عليك بالأسئلة أو بعرض والخطوات التالية.") },
      { ...base("faq-5", 5), placement: "both", question: l("Do you work with international clients?", "هل تعمل مع عملاء من دول أخرى؟"), answer: l("Yes. I work remotely and communicate in Arabic, English or Russian.", "نعم. أعمل عن بُعد وأتواصل بالعربية أو الإنجليزية أو الروسية.") },
      { ...base("faq-6", 6), placement: "services", question: l("Can you work on an existing project?", "هل يمكنك العمل على مشروع قائم؟"), answer: l("Yes — bug fixes, new features, performance improvements or a gradual redesign.", "نعم — إصلاح الأخطاء أو إضافة ميزات جديدة أو تحسين الأداء أو إعادة تصميم تدريجية.") },
      { ...base("faq-7", 7), placement: "contact", question: l("What if I'm not sure about the requirements yet?", "ماذا لو لم أكن متأكدًا من المتطلبات بعد؟"), answer: l("That's normal. We start with a short discovery conversation and shape the scope together.", "هذا طبيعي. نبدأ بمحادثة استكشافية قصيرة ونحدد نطاق العمل معًا.") },
    ],

    journey: [
      { ...base("jr-1", 1), period: "2021 — 2025", icon: "graduation-cap", title: l("BSc, Software Engineering", "بكالوريوس هندسة البرمجيات"), description: l("Ural Federal University. Graduation project “Ryadom” graded 5/5.", "جامعة الأورال الفيدرالية. مشروع التخرج «ريادوم» بتقدير 5/5.") },
      { ...base("jr-2", 2), period: "2023 — 2024", icon: "server", title: l("DevOps professional retraining", "إعادة تأهيل مهني في DevOps"), description: l("252-hour program in virtualization and cloud computing for business.", "برنامج 252 ساعة في المحاكاة الافتراضية والحوسبة السحابية للأعمال.") },
      { ...base("jr-3", 3), period: "2025 — 2028", icon: "brain", title: l("MSc, AI Engineering", "ماجستير هندسة الذكاء الاصطناعي"), description: l("Ural Federal University — in progress.", "جامعة الأورال الفيدرالية — قيد الدراسة.") },
      { ...base("jr-4", 4), period: "", icon: "briefcase", title: l("Freelance Full-Stack Developer", "مطوّر ويب متكامل مستقل"), description: l("Building websites, web apps and stores for clients.", "أبني مواقع وتطبيقات ويب ومتاجر للعملاء.") },
    ],

    certificates: [
      { ...base("crt-1", 1), year: "2024", title: l("DevOps: Virtualization & Cloud Computing for Business", "DevOps: المحاكاة الافتراضية والحوسبة السحابية للأعمال"), issuer: l("Ural Federal University", "جامعة الأورال الفيدرالية"), detail: l("252 hours", "252 ساعة"), url: "" },
      { ...base("crt-2", 2), year: "2023", title: l("Algorithms: Theory and Practice — Methods", "الخوارزميات: النظرية والتطبيق — الأساليب"), issuer: l("Stepik · Computer Science Center", "Stepik · Computer Science Center"), detail: l("80% · With distinction", "80% · بامتياز"), url: "" },
      { ...base("crt-3", 3), year: "2023", title: l("Information Technologies in Environmental Activity", "تقنيات المعلومات في النشاط البيئي"), issuer: l("Peter the Great St. Petersburg Polytechnic University", "جامعة بطرس الأكبر التقنية في سانت بطرسبرغ"), detail: l("108 hours · 82/100", "108 ساعات · 82/100"), url: "" },
      { ...base("crt-4", 4), year: "2023", title: l("Information Technologies and Services", "تقنيات وخدمات المعلومات"), issuer: l("Ural Federal University", "جامعة الأورال الفيدرالية"), detail: l("81/100", "81/100"), url: "" },
    ],

    skills: [
      ["TypeScript", "typescript", "frontend"],
      ["JavaScript", "javascript", "frontend"],
      ["React", "react", "frontend"],
      ["Next.js", "nextdotjs", "frontend"],
      ["Tailwind CSS", "tailwindcss", "frontend"],
      ["HTML5", "html5", "frontend"],
      ["Node.js", "nodedotjs", "backend"],
      ["ASP.NET Core", "dotnet", "backend"],
      ["C#", "csharp", "backend"],
      ["Python", "python", "backend"],
      ["PostgreSQL", "postgresql", "database"],
      ["SQLite", "sqlite", "database"],
      ["Drizzle ORM", "drizzle", "database"],
      ["Docker", "docker", "devops"],
      ["Cloudflare", "cloudflare", "devops"],
      ["Linux", "linux", "devops"],
      ["Git", "git", "devops"],
      ["GitHub", "github", "devops"],
    ].map(([name, icon, group], i) => ({ ...base(`sk-${i + 1}`, i + 1), name, icon, group: group as "frontend" })),

    principles: [
      { ...base("pr-1", 1), icon: "target", title: l("Problem solver", "حلّال مشكلات"), description: l("I turn complex requirements into simple, reliable solutions.", "أحوّل المتطلبات المعقدة إلى حلول بسيطة وموثوقة.") },
      { ...base("pr-2", 2), icon: "rocket", title: l("Continuous learner", "متعلّم باستمرار"), description: l("Currently studying for an MSc in AI Engineering.", "أدرس حاليًا ماجستير هندسة الذكاء الاصطناعي.") },
      { ...base("pr-3", 3), icon: "users", title: l("Client-focused", "أركّز على العميل"), description: l("Clear communication and honest timelines.", "تواصل واضح ومواعيد صادقة.") },
      { ...base("pr-4", 4), icon: "languages", title: l("Arabic · English · Russian", "عربي · إنجليزي · روسي"), description: l("Comfortable working with clients across regions.", "أعمل بسهولة مع عملاء من مناطق مختلفة.") },
    ],

    navigation: [
      { ...base("nav-home", 1), key: "home", href: "/", label: l("Home", "الرئيسية") },
      { ...base("nav-about", 2), key: "about", href: "/about", label: l("About", "من أنا") },
      { ...base("nav-projects", 3), key: "projects", href: "/projects", label: l("Projects", "المشاريع") },
      { ...base("nav-services", 4), key: "services", href: "/services", label: l("Services", "الخدمات") },
      { ...base("nav-contact", 5), key: "contact", href: "/contact", label: l("Contact", "تواصل") },
    ],

    socials: [
      { ...base("soc-gh", 1), platform: "github", url: "https://github.com/mohamedselimdev", label: "GitHub" },
      { ...base("soc-in", 2), platform: "linkedin", url: "https://www.linkedin.com/in/mohamed-selim-249109239", label: "LinkedIn" },
      { ...base("soc-ig", 3), platform: "instagram", url: "https://www.instagram.com/mohamedselim.dev", label: "Instagram" },
      { ...base("soc-mail", 4), platform: "email", url: "mailto:Mohamedosamaegy1@gmail.com", label: "Email" },
    ],

    media: [
      {
        "id": "m-portrait-cutout",
        "url": "/images/profile/portrait-cutout-v3.webp",
        "name": "portrait-cutout-v3.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": "m-portrait",
        "url": "/images/profile/portrait-v2.webp",
        "name": "portrait-v2.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": "m-portrait-suit",
        "url": "/images/profile/portrait-suit.webp",
        "name": "portrait-suit.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": "m-portrait-street",
        "url": "/images/profile/portrait-street.webp",
        "name": "portrait-street.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": "m-logo",
        "url": "/images/brand/logo.svg",
        "name": "logo.svg",
        "type": "image/svg+xml",
        "size": 0,
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": "m-basaer-cover",
        "url": "/images/projects/basaer/cover.webp",
        "name": "basaer-cover.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-basaer-booking",
        "url": "/images/projects/basaer/booking.webp",
        "name": "basaer-booking.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-basaer-home-en",
        "url": "/images/projects/basaer/home-en.webp",
        "name": "basaer-home-en.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-basaer-dark",
        "url": "/images/projects/basaer/dark.webp",
        "name": "basaer-dark.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-basaer-services",
        "url": "/images/projects/basaer/services.webp",
        "name": "basaer-services.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-basaer-mobile",
        "url": "/images/projects/basaer/mobile.webp",
        "name": "basaer-mobile.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-hema-phone-cover",
        "url": "/images/projects/hema-phone/cover.webp",
        "name": "hema-phone-cover.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-hema-phone-products",
        "url": "/images/projects/hema-phone/products.webp",
        "name": "hema-phone-products.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-hema-phone-order",
        "url": "/images/projects/hema-phone/order.webp",
        "name": "hema-phone-order.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-hema-phone-mobile",
        "url": "/images/projects/hema-phone/mobile.webp",
        "name": "hema-phone-mobile.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-hema-phone-admin-team",
        "url": "/images/projects/hema-phone/admin-team.webp",
        "name": "hema-phone-admin-team.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-03T01:34:07.959Z"
      },
      {
        "id": "m-portfolio-cover",
        "url": "/images/projects/portfolio/cover.webp",
        "name": "portfolio-cover.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-09T20:21:25.217Z"
      },
      {
        "id": "m-portfolio-arabic",
        "url": "/images/projects/portfolio/arabic.webp",
        "name": "portfolio-arabic.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-09T20:21:25.217Z"
      },
      {
        "id": "m-portfolio-projects",
        "url": "/images/projects/portfolio/projects.webp",
        "name": "portfolio-projects.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-09T20:21:25.217Z"
      },
      {
        "id": "m-portfolio-case-study",
        "url": "/images/projects/portfolio/case-study.webp",
        "name": "portfolio-case-study.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-09T20:21:25.217Z"
      },
      {
        "id": "m-portfolio-contact",
        "url": "/images/projects/portfolio/contact.webp",
        "name": "portfolio-contact.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-09T20:21:25.217Z"
      },
      {
        "id": "m-portfolio-mobile",
        "url": "/images/projects/portfolio/mobile.webp",
        "name": "portfolio-mobile.webp",
        "type": "image/webp",
        "size": 0,
        "createdAt": "2026-10-09T20:21:25.217Z"
      }
    ],
    activity: [],
  };
}
