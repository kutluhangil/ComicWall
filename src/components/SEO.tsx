import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SITE_URL = "https://comicwall.com.tr";
const SITE_NAME = "ComicWall";

const SEO = ({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage = "/og-image.jpg",
  twitterCard = "summary_large_image",
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const fullUrl = `${SITE_URL}${canonicalUrl}`;
  const fullImageUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="tr_TR" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
