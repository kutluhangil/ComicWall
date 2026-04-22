import LegalLayout from "@/components/LegalLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

const Terms = () => (
  <LegalLayout
    title="Mesafeli Satış Sözleşmesi"
    seoTitle="Mesafeli Satış Sözleşmesi — ComicWall"
    seoDescription="ComicWall mesafeli satış sözleşmesi. Sipariş, teslimat, cayma ve iade koşulları."
    canonicalUrl="/terms"
    lastUpdated="22 Nisan 2026"
  >
    <section>
      <h2>1. Taraflar</h2>
      <p>
        <strong>SATICI:</strong> {SITE_CONFIG.legalName} ("ComicWall") — {SITE_CONFIG.address} — MERSİS: {SITE_CONFIG.mersis}<br />
        <strong>ALICI:</strong> Siparişi veren, sipariş formunda ad, adres ve iletişim bilgileri belirtilen kişidir.
      </p>
    </section>

    <section>
      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu sözleşme; Alıcı'nın, Satıcı'ya ait <a href={SITE_CONFIG.url}>{SITE_CONFIG.url}</a> alan adlı internet
        sitesinden elektronik ortamda siparişini verdiği, sözleşmede belirtilen nitelikleri haiz ve yine sözleşmede
        belirtilen satış bedelindeki mal/hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması
        Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
      </p>
    </section>

    <section>
      <h2>3. Ürün ve Bedel Bilgisi</h2>
      <p>
        Sipariş edilen ürünlerin türü, miktarı, marka/modeli, satış bedeli, ödeme şekli, teslim alacak kişi, teslimat
        adresi, fatura bilgileri ve kargo ücreti, sipariş onay sayfasında ve sipariş onay e-postasında belirtilmiştir.
        Fiyatlara KDV dahildir.
      </p>
    </section>

    <section>
      <h2>4. Teslimat</h2>
      <ul>
        <li>Ürün, Alıcı'nın sipariş sırasında belirttiği adrese, onay tarihinden itibaren en geç 30 gün içinde teslim edilir. Standart teslim süresi 3-7 iş günüdür.</li>
        <li>Teslimat, Satıcı'nın anlaşmalı olduğu kargo firması aracılığıyla gerçekleştirilir.</li>
        <li>Kargo ücreti, 750 TL üzeri siparişlerde Satıcı tarafından karşılanır.</li>
      </ul>
    </section>

    <section>
      <h2>5. Cayma Hakkı</h2>
      <p>
        Alıcı, malı teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong> içerisinde herhangi bir gerekçe
        göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
      </p>
      <p>Cayma hakkının kullanılması için:</p>
      <ul>
        <li>14 günlük süre içinde <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresine yazılı bildirim iletilmelidir.</li>
        <li>Ürün kutusu, ambalajı ve varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız şekilde iade edilmelidir.</li>
        <li>Satıcı, cayma bildiriminin ulaşmasından itibaren 14 gün içinde toplam bedeli iade eder.</li>
      </ul>
    </section>

    <section>
      <h2>6. Cayma Hakkının Kullanılamayacağı Haller</h2>
      <p>Yönetmelik m.15 kapsamında aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
      <ul>
        <li>Tüketicinin istekleri veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan kişiye özel ürünler.</li>
        <li>Teslimden sonra ambalajı açılmış olan, sağlık ve hijyen açısından iadeye uygun olmayan mallar.</li>
      </ul>
    </section>

    <section>
      <h2>7. Uyuşmazlık Çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda Ticaret Bakanlığı'nca her yıl belirlenen parasal sınırlar dahilinde
        Alıcı'nın yerleşim yerindeki Tüketici Hakem Heyetleri, aşan durumlarda Tüketici Mahkemeleri yetkilidir.
      </p>
    </section>

    <section>
      <h2>8. Yürürlük</h2>
      <p>
        Alıcı, sipariş onay sayfasında "Mesafeli Satış Sözleşmesi'ni okudum ve kabul ediyorum" kutucuğunu işaretleyerek
        sözleşmeyi elektronik ortamda onaylamış sayılır. Sözleşme bu andan itibaren yürürlüğe girer.
      </p>
    </section>
  </LegalLayout>
);

export default Terms;
