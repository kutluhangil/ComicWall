import LegalLayout from "@/components/LegalLayout";
import { SITE_CONFIG, SHIPPING } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/format";

const ShippingReturns = () => (
  <LegalLayout
    title="Kargo & İade Koşulları"
    seoTitle="Kargo ve İade Koşulları — ComicWall"
    seoDescription="ComicWall kargo süreleri, ücretleri ve 14 gün iade koşulları hakkında bilgilendirme."
    canonicalUrl="/shipping-returns"
    lastUpdated="22 Nisan 2026"
  >
    <section>
      <h2>Kargo Süresi ve Ücreti</h2>
      <ul>
        <li>Siparişler, ödeme onayından sonra 1-2 iş günü içinde hazırlanır ve kargoya verilir.</li>
        <li>Teslimat süresi: Türkiye geneli 3-7 iş günü.</li>
        <li>Kargo firmaları: Yurtiçi Kargo, Aras Kargo, MNG Kargo.</li>
        <li>Kargo ücreti: <strong>{formatPrice(SHIPPING.standardFee)}</strong> — <strong>{formatPrice(SHIPPING.freeThreshold)}</strong> ve üzeri alışverişlerde ücretsiz.</li>
        <li>Kargonuzu "Siparişlerim" sayfasından takip edebilirsiniz.</li>
      </ul>
    </section>

    <section>
      <h2>Hasarlı veya Yanlış Ürün</h2>
      <p>
        Kargo paketinizi teslim alırken hasarlı olduğunu fark ederseniz, paketi kabul etmeyip kargo şirketine tutanak
        tutturun. Hasarlı teslimatlarda ürün, tarafınıza ücretsiz olarak yeniden gönderilir.
      </p>
      <p>
        Yanlış ürün gönderildi ise 7 gün içinde <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresine
        ulaşın; kargo ücreti tarafımızdan karşılanarak değişim yapılır.
      </p>
    </section>

    <section>
      <h2>İade Koşulları (14 Gün Cayma Hakkı)</h2>
      <ul>
        <li>Teslim aldığınız tarihten itibaren 14 gün içinde ücretsiz iade hakkınız vardır.</li>
        <li>İade için <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresine sipariş numaranızla başvurun.</li>
        <li>Ürün orijinal ambalajı ile hasarsız olarak anlaşmalı kargomuzla tarafımıza ulaştırılmalıdır.</li>
        <li>İade kargo ücreti, hatalı/hasarlı ürün haricindeki durumlarda Alıcı'ya aittir.</li>
        <li>Ürün tarafımıza ulaştıktan sonra 14 gün içinde ödeme kanalınıza tam iade yapılır.</li>
      </ul>
    </section>

    <section>
      <h2>Değişim</h2>
      <p>
        Boyut veya ürün değişikliği taleplerinizde ilk iade süreci tamamlanır, ardından yeni sipariş oluşturabilirsiniz.
        Mevcut siparişte doğrudan değişim yapılmaz.
      </p>
    </section>

    <section>
      <h2>İletişim</h2>
      <p>
        Kargo ve iade ile ilgili tüm sorularınız için <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>{" "}
        adresinden veya {SITE_CONFIG.phone} numarasından bize ulaşabilirsiniz.
      </p>
    </section>
  </LegalLayout>
);

export default ShippingReturns;
