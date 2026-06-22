import { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

/**
 * Mounts site analytics in one place:
 *  - Vercel Analytics (always)
 *  - Google Analytics 4 (only when VITE_GA_ID is set)
 *
 * SSR-safe: gtag injection is guarded behind a `document` check inside useEffect.
 */
const Analytics = () => {
  useEffect(() => {
    if (!GA_ID || typeof document === "undefined") return;
    if (document.getElementById("ga-gtag")) return;

    const script = document.createElement("script");
    script.id = "ga-gtag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    const inline = document.createElement("script");
    inline.id = "ga-init";
    inline.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`;
    document.head.appendChild(inline);
  }, []);

  return <VercelAnalytics />;
};

export default Analytics;
