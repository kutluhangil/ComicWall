import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useTheme } from "next-themes";

const SiteHeader = () => {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="font-bebas text-3xl tracking-wider text-foreground hover:text-primary transition-colors">
          COMIC<span className="text-primary">WALL</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
          <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors">Collections</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground hover:text-primary transition-colors p-1"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-6 flex flex-col gap-4 text-sm uppercase tracking-widest font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-foreground">Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-foreground">Shop</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)} className="text-foreground">Collections</Link>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
