import { Globe } from "lucide-react";
import { useLanguage, type Language } from "@/context/LanguageContext";

const options: { value: Language; label: string }[] = [
  { value: "tr", label: "TR" },
  { value: "en", label: "EN" },
];

interface LanguageToggleProps {
  variant?: "pill" | "icon";
}

const LanguageToggle = ({ variant = "pill" }: LanguageToggleProps) => {
  const { language, setLanguage, t } = useLanguage();

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
        aria-label={t("common.language")}
        title={t("common.language")}
        className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-muted/50"
      >
        <Globe className="w-5 h-5" />
        <span className="text-[11px] uppercase tracking-widest font-semibold">{language}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className="inline-flex bg-muted rounded-xl p-0.5 text-[11px] uppercase tracking-widest font-semibold"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLanguage(o.value)}
          aria-pressed={language === o.value}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            language === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
