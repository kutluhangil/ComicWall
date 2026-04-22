import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Check, Edit3, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";

export interface Address {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  identity_number: string | null;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const emptyForm = {
  label: "",
  first_name: "",
  last_name: "",
  phone: "",
  identity_number: "",
  address_line: "",
  city: "",
  postal_code: "",
  country: "Türkiye",
};

const inputClass =
  "w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

interface AddressBookProps {
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (address: Address) => void;
}

const AddressBook = ({ selectable = false, selectedId, onSelect }: AddressBookProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (!error && data) {
      setAddresses(data as Address[]);
      if (selectable && onSelect && !selectedId && data.length > 0) {
        onSelect(data[0] as Address);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (a: Address) => {
    setEditing(a.id);
    setForm({
      label: a.label,
      first_name: a.first_name,
      last_name: a.last_name,
      phone: a.phone,
      identity_number: a.identity_number || "",
      address_line: a.address_line,
      city: a.city,
      postal_code: a.postal_code,
      country: a.country,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      user_id: user.id,
      label: form.label || "Adres",
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      identity_number: form.identity_number || null,
      address_line: form.address_line,
      city: form.city,
      postal_code: form.postal_code,
      country: form.country,
    };

    if (editing) {
      const { error } = await supabase.from("addresses").update(payload).eq("id", editing);
      if (error) {
        toast({ title: "Adres güncellenemedi", variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase.from("addresses").insert({
        ...payload,
        is_default: addresses.length === 0,
      });
      if (error) {
        toast({ title: "Adres eklenemedi", variant: "destructive" });
        return;
      }
    }

    toast({ title: t("profile.addressSaved") });
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      toast({ title: "Adres silinemedi", variant: "destructive" });
      return;
    }
    toast({ title: t("profile.addressDeleted") });
    load();
  };

  const handleMakeDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    load();
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-3">
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">{t("profile.noAddresses")}</p>
      )}

      {addresses.map((a) => {
        const isSelected = selectable && selectedId === a.id;
        return (
          <div
            key={a.id}
            onClick={selectable ? () => onSelect?.(a) : undefined}
            className={`border rounded-xl p-4 transition-all ${
              selectable ? "cursor-pointer" : ""
            } ${
              isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <p className="text-sm font-semibold text-foreground truncate">{a.label}</p>
                  {a.is_default && (
                    <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {t("profile.default")}
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                </div>
                <p className="text-sm text-foreground">{a.first_name} {a.last_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {a.address_line}, {a.city} {a.postal_code} — {a.country}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.phone}</p>
              </div>
              {!selectable && (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(a)}
                    aria-label={t("profile.editAddress")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    aria-label={t("profile.deleteAddress")}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {!selectable && !a.is_default && (
              <button
                type="button"
                onClick={() => handleMakeDefault(a.id)}
                className="text-xs text-primary hover:underline mt-2"
              >
                {t("profile.makeDefault")}
              </button>
            )}
          </div>
        );
      })}

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-border rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("profile.addAddress")}
        </button>
      ) : (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bebas text-lg tracking-wide text-foreground">
              {editing ? t("profile.editAddress") : t("profile.addAddress")}
            </h4>
            <button type="button" onClick={resetForm} aria-label="Kapat" className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            required
            placeholder={t("profile.addressLabelPlaceholder")}
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder={t("checkout.firstName")} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputClass} />
            <input required placeholder={t("checkout.lastName")} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input required type="tel" placeholder={t("checkout.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            <input maxLength={11} placeholder={t("checkout.identityNumber")} value={form.identity_number} onChange={(e) => setForm({ ...form, identity_number: e.target.value })} className={inputClass} />
          </div>
          <input required placeholder={t("checkout.address")} value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} className={inputClass} />
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder={t("checkout.city")} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            <input required placeholder={t("checkout.postalCode")} value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className={inputClass} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors">
              {t("profile.save")}
            </button>
            <button type="button" onClick={resetForm} className="bg-muted text-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-muted/70 transition-colors">
              İptal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressBook;
