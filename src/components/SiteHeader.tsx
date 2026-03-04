import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon, Globe, User, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useTheme } from "next-themes";

const SiteHeader = () => {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="font-bebas text-3xl tracking-wider text-foreground hover:text-primary transition-colors">
          COMIC<span className="text-primary">WALL</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">{t("nav.home")}</Link>
          <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">{t("nav.shop")}</Link>
          <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors">{t("nav.collections")}</Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors p-1.5 rounded-xl bg-muted/50 hover:bg-muted text-xs font-bold uppercase"
            aria-label="Switch language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === "tr" ? "EN" : "TR"}</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-muted/50"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user && (
            <Link to="/wishlist" className="text-foreground hover:text-primary transition-colors p-1.5 hidden sm:block">
              <Heart className="w-5 h-5" />
            </Link>
          )}

          <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors p-1.5">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors p-1.5">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex bg-primary text-primary-foreground px-4 py-1.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors">
              {t("nav.login")}
            </Link>
          )}

          <button className="md:hidden text-foreground p-1.5" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/50 px-6 py-8 flex flex-col gap-5 text-base uppercase tracking-widest font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">{t("nav.home")}</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">{t("nav.shop")}</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">{t("nav.collections")}</Link>
          {user && (
            <>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">{t("nav.wishlist")}</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">{t("nav.profile")}</Link>
            </>
          )}
          {!user && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-primary font-bold">{t("nav.login")}</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
