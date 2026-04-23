import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon, User, Heart, Package, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import LanguageToggle from "@/components/LanguageToggle";
import AnnouncementBar from "@/components/AnnouncementBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import BackToTop from "@/components/BackToTop";

const ANNOUNCEMENT_KEY = "comicwall.announcementDismissed";

const SiteHeader = () => {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [announcementDismissed, setAnnouncementDismissed] = useState(() => {
    try { return localStorage.getItem(ANNOUNCEMENT_KEY) === "1"; } catch { return false; }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navLink = (path: string) =>
    `transition-colors border-b-2 pb-0.5 ${
      isActive(path)
        ? "text-foreground border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent hover:border-foreground/20"
    }`;

  const dismissAnnouncement = () => {
    setAnnouncementDismissed(true);
    try { localStorage.setItem(ANNOUNCEMENT_KEY, "1"); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => {
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(header);
    return () => obs.disconnect();
  }, [announcementDismissed]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
      setQuery("");
    } else {
      navigate("/shop");
    }
  };

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/50">
        {!announcementDismissed && (
          <AnnouncementBar onDismiss={dismissAnnouncement} />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="font-bebas text-3xl tracking-wider text-foreground hover:text-primary transition-colors">
            COMIC<span className="text-primary">WALL</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <Link to="/" className={navLink("/")}>{t("nav.home")}</Link>
            <Link to="/shop" className={navLink("/shop")}>{t("nav.shop")}</Link>
            <Link to="/collections" className={navLink("/collections")}>{t("nav.collections")}</Link>
            <Link to="/faq" className={navLink("/faq")}>{t("nav.faq")}</Link>
            {user && (
              <Link to="/orders" className={navLink("/orders")}>{t("nav.orders")}</Link>
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="text-foreground hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-muted/50"
              aria-label={t("nav.search")}
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex">
              <LanguageToggle />
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-muted/50"
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              to="/wishlist"
              className={`transition-colors p-1.5 hidden sm:block ${isActive("/wishlist") ? "text-primary" : "text-foreground hover:text-primary"}`}
              aria-label={t("nav.wishlist")}
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors p-1.5" aria-label={t("cart.title")}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors p-1.5" aria-label={t("nav.profile")}>
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex bg-primary text-primary-foreground px-4 py-1.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors">
                {t("nav.login")}
              </Link>
            )}

            <button className="md:hidden text-foreground p-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border/50 bg-background/90 backdrop-blur-2xl">
            <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button type="submit" className="text-xs uppercase tracking-widest font-bold text-primary hover:underline">
                {t("nav.search")}
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/50 px-6 py-8 flex flex-col gap-5 text-base uppercase tracking-widest font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)} className={`transition-colors ${isActive("/") ? "text-primary" : "text-foreground hover:text-primary"}`}>{t("nav.home")}</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className={`transition-colors ${isActive("/shop") ? "text-primary" : "text-foreground hover:text-primary"}`}>{t("nav.shop")}</Link>
            <Link to="/collections" onClick={() => setMenuOpen(false)} className={`transition-colors ${isActive("/collections") ? "text-primary" : "text-foreground hover:text-primary"}`}>{t("nav.collections")}</Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)} className={`transition-colors ${isActive("/faq") ? "text-primary" : "text-foreground hover:text-primary"}`}>{t("nav.faq")}</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className={`transition-colors ${isActive("/contact") ? "text-primary" : "text-foreground hover:text-primary"}`}>{t("nav.contact")}</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className={`transition-colors ${isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"}`}>{t("about.title")}</Link>
            {user && (
              <>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors flex items-center gap-2"><Heart className="w-4 h-4" /> {t("nav.wishlist")}</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors flex items-center gap-2"><Package className="w-4 h-4" /> {t("nav.orders")}</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-primary transition-colors flex items-center gap-2"><User className="w-4 h-4" /> {t("nav.profile")}</Link>
              </>
            )}
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-primary font-bold">{t("nav.login")}</Link>
            )}
            <div className="pt-2 border-t border-border/50">
              <LanguageToggle />
            </div>
          </div>
        )}
      </header>

      <MobileBottomNav />
      <BackToTop />
    </>
  );
};

export default SiteHeader;
