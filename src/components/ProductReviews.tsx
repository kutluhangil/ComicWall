import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, BadgeCheck, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";

interface ReviewRow {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReviews(data as ReviewRow[]);

      const ids = Array.from(new Set(data.map((r: any) => r.user_id)));
      if (ids.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name")
          .in("user_id", ids);
        const map: Record<string, string> = {};
        (profiles || []).forEach((p: any) => {
          map[p.user_id] = p.display_name || "Anonim";
        });
        setDisplayNames(map);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title || "");
      setComment(myReview.comment || "");
    }
  }, [myReview]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: t("product.loginForReview") });
      return;
    }
    setSaving(true);
    try {
      if (myReview) {
        const { error } = await supabase
          .from("product_reviews")
          .update({
            rating,
            title: title || null,
            comment: comment || null,
          })
          .eq("id", myReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("product_reviews").insert({
          user_id: user.id,
          product_id: productId,
          rating,
          title: title || null,
          comment: comment || null,
          is_verified_purchase: false,
        });
        if (error) throw error;
      }
      toast({ title: t("product.reviewSaved") });
      await load();
    } catch (err: any) {
      toast({ title: err?.message || "Yorum kaydedilemedi", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", myReview.id);
    if (error) {
      toast({ title: "Silme başarısız", variant: "destructive" });
      return;
    }
    toast({ title: t("product.reviewDeleted") });
    setRating(5);
    setTitle("");
    setComment("");
    load();
  };

  return (
    <section className="mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-bebas text-3xl tracking-wide text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> {t("product.reviews")}
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating value={averageRating} readOnly />
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{averageRating.toFixed(1)}</span> / 5.0 —{" "}
                {reviews.length} {t("product.basedOn")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {user ? (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-3 sticky top-24">
              <p className="text-xs uppercase tracking-widest font-semibold text-foreground">
                {myReview ? t("product.updateReview") : t("product.writeReview")}
              </p>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("product.rating")}</p>
                <StarRating value={rating} size="lg" onChange={setRating} />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("product.reviewTitle")}
                maxLength={120}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("product.reviewComment")}
                rows={4}
                maxLength={1000}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "..." : myReview ? t("product.updateReview") : t("product.submitReview")}
                </button>
                {myReview && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-muted text-destructive border border-border px-3 py-2.5 rounded-xl hover:bg-destructive/10 transition-colors"
                    aria-label={t("product.deleteReview")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">{t("product.loginForReview")}</p>
              <Link
                to="/login"
                className="inline-block bg-primary text-primary-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                {t("auth.login")}
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Yorumlar yükleniyor...</p>
          ) : reviews.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">{t("product.noReviews")}</p>
            </div>
          ) : (
            reviews.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StarRating value={r.rating} size="sm" readOnly />
                      <span className="text-sm font-semibold text-foreground">{displayNames[r.user_id] || "Anonim"}</span>
                      {r.is_verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                          <BadgeCheck className="w-3 h-3" /> {t("product.verifiedPurchase")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(r.created_at).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {r.title && <h4 className="text-sm font-semibold text-foreground mb-1">{r.title}</h4>}
                {r.comment && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{r.comment}</p>}
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
