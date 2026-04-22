import LegalLayout from "@/components/LegalLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

const Privacy = () => (
  <LegalLayout
    title="Gizlilik Politikası"
    seoTitle="Gizlilik Politikası — ComicWall"
    seoDescription="ComicWall'ın müşteri verilerini nasıl işlediğine, sakladığına ve koruduğuna dair gizlilik politikası."
    canonicalUrl="/privacy"
    lastUpdated="22 Nisan 2026"
  >
    <section>
      <h2>1. Genel</h2>
      <p>
        {SITE_CONFIG.legalName} ("ComicWall", "biz") olarak, kullanıcılarımızın kişisel verilerinin gizliliğine ve
        güvenliğine büyük önem veriyoruz. Bu Gizlilik Politikası, {SITE_CONFIG.url} adresinde yer alan hizmetlerimizi
        kullanırken hangi verilerin toplandığını, nasıl kullanıldığını ve nasıl korunduğunu açıklar.
      </p>
    </section>

    <section>
      <h2>2. Toplanan Veriler</h2>
      <ul>
        <li><strong>Hesap bilgileri:</strong> ad, e-posta adresi, şifre (hashlenmiş).</li>
        <li><strong>Sipariş ve teslimat bilgileri:</strong> ad-soyad, telefon, adres, T.C. kimlik no (fatura için zorunlu hallerde).</li>
        <li><strong>Ödeme bilgileri:</strong> Kart bilgileri ComicWall sunucularında saklanmaz; ödeme sağlayıcı iyzico tarafından PCI DSS uyumlu şekilde işlenir.</li>
        <li><strong>Kullanım verileri:</strong> IP adresi, tarayıcı, cihaz bilgisi, sayfa görüntüleme istatistikleri.</li>
        <li><strong>Çerezler:</strong> Oturum, tercih ve pazarlama çerezleri (bkz. Çerez Politikası).</li>
      </ul>
    </section>

    <section>
      <h2>3. Verilerin Kullanım Amacı</h2>
      <ul>
        <li>Sipariş, teslimat ve faturalandırma işlemlerinin yürütülmesi.</li>
        <li>Müşteri desteği ve iletişim.</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi (vergi mevzuatı, ETBİS vs.).</li>
        <li>Hizmet kalitesinin iyileştirilmesi ve kişiselleştirilmesi.</li>
        <li>İzin vermeniz halinde pazarlama iletişimi (bülten, kampanya).</li>
      </ul>
    </section>

    <section>
      <h2>4. Verilerin Paylaşımı</h2>
      <p>Verileriniz yalnızca aşağıdaki taraflarla, amacın gerektirdiği ölçüde paylaşılır:</p>
      <ul>
        <li>Ödeme sağlayıcısı (iyzico)</li>
        <li>Kargo firmaları (Yurtiçi Kargo, Aras Kargo, MNG vb.)</li>
        <li>Resmi makamların yasal talebi doğrultusunda yetkili kurumlar.</li>
      </ul>
      <p>Verileriniz yurt dışına aktarılması durumunda KVKK m. 9 kapsamında açık rızanız aranır.</p>
    </section>

    <section>
      <h2>5. Veri Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, ilgili mevzuatın öngördüğü süreler (ör. Türk Ticaret Kanunu uyarınca 10 yıl) boyunca
        saklanır; sürenin sonunda anonimleştirilir veya silinir.
      </p>
    </section>

    <section>
      <h2>6. Haklarınız</h2>
      <p>KVKK m. 11 kapsamında; verilerinize erişme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme ve
        zararların giderilmesini talep etme haklarına sahipsiniz. Taleplerinizi <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresine iletebilirsiniz.</p>
    </section>

    <section>
      <h2>7. İletişim</h2>
      <p>
        {SITE_CONFIG.legalName}<br />
        Adres: {SITE_CONFIG.address}<br />
        E-posta: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a><br />
        MERSİS: {SITE_CONFIG.mersis}
      </p>
    </section>
  </LegalLayout>
);

export default Privacy;
