import LegalLayout from "@/components/LegalLayout";

const Cookies = () => (
  <LegalLayout
    title="Çerez Politikası"
    seoTitle="Çerez Politikası — ComicWall"
    seoDescription="ComicWall çerez politikası. Sitemizde kullanılan çerezler, türleri ve kontrol yöntemleri."
    canonicalUrl="/cookies"
    lastUpdated="22 Nisan 2026"
  >
    <section>
      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler, ziyaret ettiğiniz internet siteleri tarafından cihazınıza yerleştirilen küçük metin dosyalarıdır.
        Çerezler sayesinde siteler, kullanıcı tercihlerini hatırlar ve deneyimi kişiselleştirir.
      </p>
    </section>

    <section>
      <h2>2. Kullandığımız Çerez Türleri</h2>
      <ul>
        <li>
          <strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri (oturum, sepet, güvenlik) için gereklidir ve devre
          dışı bırakılamaz.
        </li>
        <li>
          <strong>İşlevsel çerezler:</strong> Dil, tema (dark/light), görüntüleme tercihleri gibi ayarları saklar.
        </li>
        <li>
          <strong>Analitik çerezler:</strong> Ziyaret istatistikleri, sayfa performansı gibi verileri anonim olarak
          toplar (ör. Google Analytics).
        </li>
        <li>
          <strong>Pazarlama çerezleri:</strong> İlginizi çekebilecek reklamların gösterilmesi için kullanılır (açık
          rızanız ile).
        </li>
      </ul>
    </section>

    <section>
      <h2>3. Çerez Kontrolü</h2>
      <p>
        Çerez tercihlerinizi istediğiniz zaman tarayıcınızın ayarlarından yönetebilir, silebilir veya engelleyebilirsiniz.
        Zorunlu çerezlerin devre dışı bırakılması halinde sitenin bazı bölümleri çalışmayabilir.
      </p>
      <ul>
        <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
        <li>Safari: Tercihler → Gizlilik → Çerezleri Yönet</li>
        <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
      </ul>
    </section>

    <section>
      <h2>4. Üçüncü Taraf Çerezleri</h2>
      <p>
        Sitemiz üçüncü taraf hizmet sağlayıcıların (ödeme altyapısı iyzico, analitik platformlar vb.) çerezlerini de
        kullanabilir. Bu çerezler ilgili sağlayıcıların kendi politikalarına tabidir.
      </p>
    </section>

    <section>
      <h2>5. Güncellemeler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir. Güncellenen metin bu sayfada yayımlanır; önemli değişiklikler üyelerimize
        e-posta ile bildirilebilir.
      </p>
    </section>
  </LegalLayout>
);

export default Cookies;
