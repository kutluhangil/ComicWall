import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG, SHIPPING } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/format";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const FAQ = () => {
  const { t, language } = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>("0-0");
  const isEn = language === "en";

  const groups: FaqGroup[] = [
    {
      title: "Sipariş & Kargo",
      items: [
        {
          q: "Siparişim ne zaman kargoya verilir?",
          a: "Ödeme onayından sonra 1–2 iş günü içinde kargoya teslim ediyoruz. Teslimat Türkiye genelinde 3–7 iş günü sürer. Kargo takip numarası SMS ve e-posta ile tarafınıza iletilir.",
        },
        {
          q: "Kargo ücreti ne kadar?",
          a: `Standart kargo ücreti ${formatPrice(SHIPPING.standardFee)}. ${formatPrice(SHIPPING.freeThreshold)} ve üzeri alışverişlerinizde kargo ücretsizdir.`,
        },
        {
          q: "Hangi kargo firmasıyla gönderiyorsunuz?",
          a: "Yurtiçi Kargo, Aras Kargo ve MNG Kargo ile çalışıyoruz. Bölgenize göre en uygun firma otomatik olarak seçilir.",
        },
        {
          q: "Siparişimi nasıl takip edebilirim?",
          a: "Üye girişi yaptıktan sonra 'Siparişlerim' sayfasından sipariş durumunuzu ve kargo takip numaranızı görebilirsiniz.",
        },
      ],
    },
    {
      title: "Ürünler & Baskı",
      items: [
        {
          q: "Posterler hangi kağıda basılıyor?",
          a: "Posterlerimiz 250 gsm mat fotoğraf kağıdına, müze kalitesinde pigment mürekkeple basılır. Renkler canlı, detaylar net ve dayanıklıdır.",
        },
        {
          q: "Hangi boyutlar mevcut?",
          a: "Tüm posterlerimiz 10×15 cm, 13×18 cm ve 20×30 cm olmak üzere üç farklı boyutta sunulmaktadır. Koleksiyon setlerinde aynı boyut tercih edilir.",
        },
        {
          q: "Posterler çerçeveli mi geliyor?",
          a: "Hayır, posterler çerçevesiz olarak gönderilir. Kendi tarzınıza göre çerçeveleyebilir veya duvara doğrudan yapıştırabilirsiniz.",
        },
        {
          q: "Tasarımlar orijinal mi?",
          a: "Evet. Tüm tasarımlar yapay zeka destekli araçlarla ComicWall tarafından özgün olarak üretilir. Hiçbir lisanslı karakter veya telifli materyal kullanılmaz.",
        },
      ],
    },
    {
      title: "İade & Değişim",
      items: [
        {
          q: "İade hakkım var mı?",
          a: "Evet. Ürünü teslim aldığınız tarihten itibaren 14 gün içinde koşulsuz iade hakkınız vardır. İade için destek ekibimizle iletişime geçmeniz yeterlidir.",
        },
        {
          q: "Hasarlı ürün geldi, ne yapmalıyım?",
          a: `Paketi kargo görevlisinin yanında açın ve hasar varsa teslim almayın, tutanak tutturun. Ardından ${SITE_CONFIG.email} adresine fotoğraflarla birlikte ulaşın; ücretsiz yenileme sağlarız.`,
        },
        {
          q: "Boyut değişikliği yapabilir miyim?",
          a: "Değişim işlemlerinde öncelikle mevcut sipariş iade edilir, ardından doğru boyutta yeni sipariş oluşturmanız gerekir. Doğrudan değişim yapılmamaktadır.",
        },
      ],
    },
    {
      title: "Ödeme & Güvenlik",
      items: [
        {
          q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          a: "iyzico altyapısı üzerinden tüm kredi ve banka kartlarını kabul ediyoruz. Taksit seçenekleri bankanıza göre değişiklik gösterebilir.",
        },
        {
          q: "Kart bilgilerim güvende mi?",
          a: "Evet. Ödemeler 256-bit SSL şifreleme ile iyzico'nun PCI-DSS sertifikalı altyapısı üzerinden alınır. ComicWall kart bilgilerinizi görmez veya saklamaz.",
        },
        {
          q: "Fatura alabilir miyim?",
          a: "Her siparişte e-arşiv fatura düzenlenir ve sipariş tamamlandığında e-postanıza otomatik olarak iletilir. Kurumsal fatura talepleri için iletişime geçebilirsiniz.",
        },
      ],
    },
    {
      title: "Hesap & Üyelik",
      items: [
        {
          q: "Üye olmadan sipariş verebilir miyim?",
          a: "Sipariş takibini kolaylaştırmak ve iade süreçlerini hızlandırmak için üye girişi zorunludur. Ücretsiz üyelik yalnızca birkaç saniye sürer.",
        },
        {
          q: "Şifremi unuttum, ne yapmalıyım?",
          a: "Giriş sayfasında 'Şifremi Unuttum' bağlantısına tıklayarak e-posta adresinize sıfırlama bağlantısı isteyebilirsiniz.",
        },
        {
          q: "Hesabımı nasıl silerim?",
          a: `Hesap silme talebinizi ${SITE_CONFIG.email} adresine göndermeniz yeterlidir. KVKK kapsamındaki haklarınız için Gizlilik Politikası sayfamızı inceleyebilirsiniz.`,
        },
      ],
    },
  ];

  return (
    <>
      <SEO
        title={isEn ? "Frequently Asked Questions — ComicWall" : "Sıkça Sorulan Sorular — ComicWall"}
        description={
          isEn
            ? "Answers to common ComicWall questions: shipping, returns, payment, product quality and membership."
            : "ComicWall hakkında sıkça sorulan sorular: kargo, iade, ödeme, ürün kalitesi ve üyelik hakkında tüm cevaplar."
        }
        canonicalUrl="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: groups.flatMap((g) =>
            g.items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            }))
          ),
        }}
      />
      <SiteHeader />
      <main className="pt-[var(--header-h)] pb-20 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{t("faq.badge")}</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{t("faq.title")}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("faq.desc")}</p>
        </motion.div>

        <div className="space-y-10">
          {groups.map((group, gi) => (
            <section key={group.title}>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-primary" />
                <h2 className="font-bebas text-2xl tracking-wide text-foreground">{group.title}</h2>
              </div>
              <div className="space-y-2">
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const open = openKey === key;
                  return (
                    <div key={key} className="bg-card border border-border rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenKey(open ? null : key)}
                        aria-expanded={open}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                      >
                        <span className="text-sm sm:text-base font-medium text-foreground">{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-card border border-border rounded-2xl p-6 sm:p-8 text-center">
          <Mail className="w-6 h-6 text-primary mx-auto mb-3" />
          <h3 className="font-bebas text-2xl tracking-wide text-foreground mb-2">{t("faq.notFound")}</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            {t("faq.supportHours")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t("faq.contactCta")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default FAQ;
