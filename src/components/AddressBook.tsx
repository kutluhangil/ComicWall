import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Check, Edit3, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { TR_CITIES } from "@/data/trCities";

export interface Address {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  invoice_type: string;
  identity_number: string | null;
  company_name: string | null;
  tax_office: string | null;
  tax_number: string | null;
  address_line: string;
  city: string;
  district: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const emptyForm = {
  label: "",
  first_name: "",
  last_name: "",
  phone: "",
  invoice_type: "individual",
  identity_number: "",
  company_name: "",
  tax_office: "",
  tax_number: "",
  address_line: "",
  city: "",
  district: "",
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
      invoice_type: a.invoice_type || "individual",
      identity_number: a.identity_number || "",
      company_name: a.company_name || "",
      tax_office: a.tax_office || "",
      tax_number: a.tax_number || "",
      address_line: a.address_line,
      city: a.city,
      district: a.district || "",
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
      invoice_type: form.invoice_type,
      identity_number: form.invoice_type === "individual" ? (form.identity_number || null) : null,
      company_name: form.invoice_type === "corporate" ? (form.company_name || null) : null,
      tax_office: form.invoice_type === "corporate" ? (form.tax_office || null) : null,
      tax_number: form.invoice_type === "corporate" ? (form.tax_number || null) : null,
      address_line: form.address_line,
      city: form.city,
      district: form.district || null,
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
                {a.invoice_type === "corporate" && a.company_name && (
                  <p className="text-xs font-semibold text-foreground mt-0.5">{a.company_name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {a.address_line}, {a.district ? `${a.district} / ` : ""}{a.city} {a.postal_code} — {a.country}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {a.invoice_type === "corporate" ? "Kurumsal Fatura" : "Bireysel Fatura"}
                  </span>
                  {a.invoice_type === "individual" && a.identity_number && (
                    <span className="text-[9px] font-mono text-muted-foreground">TC: {a.identity_number}</span>
                  )}
                  {a.invoice_type === "corporate" && a.tax_number && (
                    <span className="text-[9px] font-mono text-muted-foreground">VKN: {a.tax_number} ({a.tax_office})</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{a.phone}</p>
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
          <div className="grid grid-cols-1 gap-2">
            <input 
              required 
              type="tel" 
              placeholder={`${t("checkout.phone")} (örn: 05551234567)`} 
              value={form.phone} 
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.startsWith("90")) val = val.substring(2);
                if (val.length > 10) val = val.substring(0, 10);
                setForm({ ...form, phone: val });
              }} 
              className={inputClass} 
            />
          </div>
          
          <div className="bg-muted/40 p-3.5 rounded-xl border border-border space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Fatura Türü</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="radio"
                  name="invoice_type"
                  checked={form.invoice_type === "individual"}
                  onChange={() => setForm({ ...form, invoice_type: "individual" })}
                  className="accent-primary"
                />
                Bireysel
              </label>
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="radio"
                  name="invoice_type"
                  checked={form.invoice_type === "corporate"}
                  onChange={() => setForm({ ...form, invoice_type: "corporate" })}
                  className="accent-primary"
                />
                Kurumsal
              </label>
            </div>
            
            {form.invoice_type === "individual" ? (
              <input
                required
                maxLength={11}
                pattern="[0-9]{11}"
                placeholder="T.C. Kimlik Numarası"
                value={form.identity_number}
                onChange={(e) => setForm({ ...form, identity_number: e.target.value.replace(/\D/g, "") })}
                className={inputClass}
              />
            ) : (
              <div className="space-y-2">
                <input
                  required
                  placeholder="Firma Ünvanı"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    placeholder="Vergi Dairesi"
                    value={form.tax_office}
                    onChange={(e) => setForm({ ...form, tax_office: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Vergi Numarası"
                    value={form.tax_number}
                    onChange={(e) => setForm({ ...form, tax_number: e.target.value.replace(/\D/g, "") })}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          <input required placeholder={t("checkout.address")} value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} className={inputClass} />
          
          <div className="grid grid-cols-2 gap-2">
            <select
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value, district: "" })}
              className={inputClass}
            >
              <option value="">İl Seçin</option>
              {Object.keys(TR_CITIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              required
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              disabled={!form.city}
              className={inputClass}
            >
              <option value="">İlçe Seçin</option>
              {form.city && TR_CITIES[form.city]?.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input required placeholder={t("checkout.postalCode")} value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className={inputClass} />
            <input required readonly placeholder="Türkiye" value="Türkiye" className={`${inputClass} opacity-60`} />
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
