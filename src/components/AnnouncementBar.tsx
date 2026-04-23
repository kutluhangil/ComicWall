import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface AnnouncementBarProps {
  onDismiss: () => void;
}

const AnnouncementBar = ({ onDismiss }: AnnouncementBarProps) => {
  const { t } = useLanguage();
  return (
    <div className="bg-primary text-primary-foreground text-xs font-medium py-2.5 px-4 flex items-center justify-center gap-2 relative">
      <span>{t("announcement.text")}</span>
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap"
      >
        {t("announcement.cta")} <ArrowRight className="w-3 h-3" />
      </Link>
      <button
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1 rounded"
        aria-label="Kapat"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
