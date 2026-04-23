import { Link, useLocation } from "react-router-dom";
import { Home, Grid2X2, ShoppingCart, Heart, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

const MobileBottomNav = () => {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const items = [
    { to: "/", Icon: Home, label: t("nav.home") },
    { to: "/shop", Icon: Grid2X2, label: t("nav.shop") },
    { to: "/cart", Icon: ShoppingCart, label: t("cart.title"), badge: totalItems },
    { to: "/wishlist", Icon: Heart, label: t("nav.wishlist") },
    { to: "/profile", Icon: User, label: t("nav.profile") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-border">
      <div className="flex items-stretch justify-around h-16 px-1 pb-safe">
        {items.map(({ to, Icon, label, badge }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
