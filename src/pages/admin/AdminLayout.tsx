import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Ticket, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
import SEO from "@/components/SEO";

const navItems = [
  { to: "/admin/dashboard", label: "Panel", icon: LayoutDashboard, end: false },
  { to: "/admin", label: "Siparişler", icon: ShoppingBag, end: true },
  { to: "/admin/products", label: "Ürünler & Stok", icon: Package, end: false },
  { to: "/admin/coupons", label: "Kuponlar", icon: Ticket, end: false },
];

const AdminLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || loading) return;
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [authLoading, loading, user, isAdmin, navigate]);

  if (authLoading || loading || !user || !isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center text-muted-foreground">
        Yükleniyor…
      </main>
    );
  }

  return (
    <>
      <SEO title="Yönetim Paneli — ComicWall" description="ComicWall yönetim paneli" canonicalUrl="/admin" noindex />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="font-bebas text-2xl tracking-wide text-foreground">ComicWall Admin</span>
            </div>
            <NavLink to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Siteye dön
            </NavLink>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
          <nav className="flex flex-wrap gap-2 mb-8">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-xl border transition-colors ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
