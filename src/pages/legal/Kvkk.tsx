import LegalLayout from "@/components/LegalLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

const Kvkk = () => (
  <LegalLayout
    title="KVKK Aydınlatma Metni"
    seoTitle="KVKK Aydınlatma Metni — ComicWall"
    seoDescription="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında ComicWall aydınlatma metni."
    canonicalUrl="/kvkk"
    lastUpdated="22 Nisan 2026"
  >
    <section>
      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla{" "}
        <strong>{SITE_CONFIG.legalName}</strong> tarafından, kişisel verileriniz aşağıda açıklandığı şekilde işlenmektedir.
      </p>
      <ul>
        <li>Ticari Ünvan: {SITE_CONFIG.legalName}</li>
        <li>Adres: {SITE_CONFIG.address}</li>
        <li>MERSİS No: {SITE_CONFIG.mersis}</li>
        <li>Ticaret Sicil No: {SITE_CONFIG.tradeRegistry}</li>
        <li>E-posta: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></li>
      </ul>
    </section>

    <section>
      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li><strong>Kimlik:</strong> ad, soyad, T.C. kimlik no (fatura için)</li>
        <li><strong>İletişim:</strong> e-posta, telefon, adres</li>
        <li><strong>Müşteri işlem:</strong> sipariş, fatura, teslimat, iade bilgileri</li>
        <li><strong>İşlem güvenliği:</strong> IP, oturum, kullanım logları</li>
        <li><strong>Pazarlama:</strong> alışveriş geçmişi, bülten tercihleri</li>
      </ul>
    </section>

    <section>
      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Sözleşmenin kurulması ve ifası (sipariş teslimatı)</li>
        <li>Mal ve hizmet satın alım süreçlerinin yürütülmesi</li>
        <li>Müşteri ilişkilerinin yönetimi, talep ve şikâyetlerin takibi</li>
        <li>Yetkili kurum ve kuruluşlara bildirim yükümlülüklerinin yerine getirilmesi</li>
        <li>Reklam / kampanya / promosyon süreçleri (açık rıza ile)</li>
      </ul>
    </section>

    <section>
      <h2>4. Hukuki Sebepler</h2>
      <p>Kişisel verileriniz KVKK m. 5 kapsamında aşağıdaki hukuki sebeplere dayanarak işlenir:</p>
      <ul>
        <li>Sözleşmenin kurulması veya ifası için gerekli olması (m.5/2-c)</li>
        <li>Hukuki yükümlülüklerimizin yerine getirilmesi (m.5/2-ç)</li>
        <li>Meşru menfaatlerimizin korunması (m.5/2-f)</li>
        <li>Açık rızanız (pazarlama, çerez) (m.5/1)</li>
      </ul>
    </section>

    <section>
      <h2>5. Aktarım</h2>
      <p>
        Verileriniz; kargo şirketleri, ödeme sağlayıcısı (iyzico), muhasebe-fatura entegrasyonu sunucuları, e-posta/SMS
        altyapı sağlayıcıları ve yetkili kamu kurumları ile yurtiçinde paylaşılır. Yurt dışına aktarım ancak açık rızanız
        halinde yapılır.
      </p>
    </section>

    <section>
      <h2>6. Haklarınız (KVKK m. 11)</h2>
      <ul>
        <li>Verinin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşleme amacını ve uygunluğunu öğrenme</li>
        <li>Yurt içi/dışı aktarılan üçüncü kişileri öğrenme</li>
        <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Silinmesini veya yok edilmesini isteme</li>
        <li>Düzeltme/silme işlemlerinin 3. kişilere bildirilmesini isteme</li>
        <li>Münhasıran otomatik sistemlerle analiz edilmesine itiraz etme</li>
        <li>Kanuna aykırı işleme sebebiyle zararın giderilmesini talep etme</li>
      </ul>
      <p>
        Haklarınızı kullanmak için başvurularınızı Veri Sorumlusuna Başvuru Usul ve Esasları Tebliği hükümlerine uygun
        şekilde <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresine iletebilirsiniz.
      </p>
    </section>
  </LegalLayout>
);

export default Kvkk;
