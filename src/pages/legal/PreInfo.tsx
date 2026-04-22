import LegalLayout from "@/components/LegalLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

const PreInfo = () => (
  <LegalLayout
    title="Ön Bilgilendirme Formu"
    seoTitle="Ön Bilgilendirme Formu — ComicWall"
    seoDescription="Mesafeli Sözleşmeler Yönetmeliği kapsamında ön bilgilendirme formu."
    canonicalUrl="/pre-info"
    lastUpdated="22 Nisan 2026"
  >
    <section>
      <h2>1. Satıcı Bilgileri</h2>
      <ul>
        <li>Ünvan: {SITE_CONFIG.legalName}</li>
        <li>Adres: {SITE_CONFIG.address}</li>
        <li>E-posta: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></li>
        <li>Telefon: {SITE_CONFIG.phone}</li>
        <li>MERSİS: {SITE_CONFIG.mersis}</li>
        <li>Vergi Dairesi / No: {SITE_CONFIG.taxOffice} / {SITE_CONFIG.taxNumber}</li>
      </ul>
    </section>

    <section>
      <h2>2. Sözleşme Konusu Mal/Hizmetin Temel Nitelikleri</h2>
      <p>
        Alıcı'nın {SITE_CONFIG.url} üzerinden seçtiği ürün(ler): poster / duvar sanatı. Ürünlerin temel nitelikleri, satış
        bedeli ve ödeme bilgileri sipariş onay sayfasında yer almaktadır.
      </p>
    </section>

    <section>
      <h2>3. Ödeme ve Teslimat</h2>
      <ul>
        <li>Ödeme, iyzico güvenli ödeme altyapısı üzerinden kredi/banka kartı ile yapılır. Kart bilgileri ComicWall tarafından saklanmaz.</li>
        <li>Teslimat süresi: 3–7 iş günü (Türkiye sınırları içi).</li>
        <li>Kargo ücreti: 750 TL altındaki siparişlerde 49 TL; 750 TL üzeri siparişlerde ücretsizdir.</li>
        <li>Ürün, Alıcı'nın sipariş sırasında belirttiği adrese teslim edilir.</li>
      </ul>
    </section>

    <section>
      <h2>4. Cayma Hakkı</h2>
      <p>
        Alıcı, malı teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde cayma hakkını kullanabilir. Cayma
        bildirimi yazılı olarak <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresine iletilmelidir.
      </p>
      <p>
        Cayma hakkının kullanılması halinde kargo ücreti Alıcı'ya aittir. Ürün bedeli, ürün Satıcı'ya ulaştıktan sonra 14
        gün içinde iade edilir. Ödeme kanalının aynısıyla iade yapılır.
      </p>
    </section>

    <section>
      <h2>5. Uyuşmazlık Çözümü</h2>
      <p>
        Şikâyetlerinizi <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> üzerinden iletebilirsiniz.
        Yasal olarak Ticaret Bakanlığı'nca belirlenen parasal sınırlar dâhilinde Alıcı'nın yerleşim yerindeki Tüketici
        Hakem Heyetleri, aşan durumlarda Tüketici Mahkemeleri yetkilidir.
      </p>
    </section>
  </LegalLayout>
);

export default PreInfo;
