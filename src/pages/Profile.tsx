import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { User, LogOut, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name || "");
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ display_name: displayName });
    setSaving(false);
    toast({ title: t("profile.saved") });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user) return null;

  return (
    <>
      <SEO title={`${t("profile.title")} — ComicWall`} description="Your profile" canonicalUrl="/profile" />
      <SiteHeader />
      <main className="pt-24 pb-20 min-h-screen max-w-2xl mx-auto px-5">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-8">{t("profile.title")}</h1>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-bebas text-2xl text-foreground">{profile?.display_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-foreground mb-1.5 block">{t("auth.displayName")}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-foreground mb-1.5 block">{t("auth.email")}</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? t("profile.saving") : t("profile.save")}
            </button>
          </form>

          <div className="border-t border-border pt-6">
            <button
              onClick={handleLogout}
              className="text-destructive hover:text-destructive/80 text-sm uppercase tracking-widest font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("auth.logout")}
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default Profile;
