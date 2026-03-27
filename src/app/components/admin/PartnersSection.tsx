import { useState, useEffect } from "react";
import { supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload } from "./shared";

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  discount_rate: number;
  is_active: boolean;
  sort_order: number;
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("partners").select("*").order("sort_order");
    setPartners(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("partners").update({ is_active: !val }).eq("id", id);
    await logAction("toggle_active", "partners", id, `Kurum ${!val ? "aktif" : "pasif"} yapıldı`);
    load();
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Bu kurumu silmek istediğinize emin misiniz?")) return;
    await supabase.from("partners").delete().eq("id", id);
    await logAction("delete", "partners", id, "Kurum silindi");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Anlaşmalı Kurumlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{partners.length} kurum kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Kurum
        </button>
      </div>

      {showForm && (
        <PartnerForm
          partner={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : partners.length === 0 ? (
          <EmptyState icon="🏢" title="Kurum bulunamadı" desc="Yeni kurum eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {partners.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <img src={p.logo || "https://via.placeholder.com/48"} alt={p.name}
                  className="w-12 h-12 rounded-xl object-contain bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{p.name}</p>
                    {p.discount_rate > 0 && (
                      <Badge color="amber">%{p.discount_rate} İndirim</Badge>
                    )}
                    <Badge color={p.is_active ? "green" : "gray"}>
                      {p.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{p.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(p); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(p.id, p.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {p.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deletePartner(p.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function PartnerForm({ partner, onSave, onCancel }: {
  partner: Partner | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: partner?.name || "",
    logo: partner?.logo || "",
    description: partner?.description || "",
    discount_rate: partner?.discount_rate || 0,
    is_active: partner?.is_active ?? true,
    sort_order: partner?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    if (partner?.id) {
      await supabase.from("partners").update(payload).eq("id", partner.id);
      await logAction("update", "partners", partner.id, `Kurum güncellendi: ${payload.name}`);
    } else {
      await supabase.from("partners").insert(payload);
      await logAction("create", "partners", "", `Kurum eklendi: ${payload.name}`);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{partner ? "Kurum Düzenle" : "Yeni Kurum"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Kurum Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="İndirim Oranı (%)" value={String(form.discount_rate)} onChange={v => setForm(f => ({ ...f, discount_rate: Number(v) }))} type="number" />

        <div className="md:col-span-2">
          <ImageUpload
            currentUrl={form.logo}
            bucket="partners"
            fileName={form.name ? slugify(form.name) : ""}
            onUploaded={url => setForm(f => ({ ...f, logo: url }))}
            label="Logo"
            hint="200x80px, şeffaf arka plan (PNG)"
          />
        </div>

        <div className="md:col-span-2">
          <FormField label="Açıklama" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline />
        </div>

        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
          İptal
        </button>
      </div>
    </Card>
  );
}
