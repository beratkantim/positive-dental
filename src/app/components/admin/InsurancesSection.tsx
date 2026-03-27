import { useState, useEffect } from "react";
import { supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload } from "./shared";

interface Insurance {
  id: string;
  name: string;
  logo: string;
  description: string;
  discount_rate: number;
  is_active: boolean;
  sort_order: number;
}

export function InsurancesSection() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Insurance | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("insurances").select("*").order("sort_order");
    setInsurances(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("insurances").update({ is_active: !val }).eq("id", id);
    await logAction("toggle_active", "insurances", id, `Sigorta ${!val ? "aktif" : "pasif"} yapıldı`);
    load();
  };

  const deleteInsurance = async (id: string) => {
    if (!confirm("Bu sigortayı silmek istediğinize emin misiniz?")) return;
    await supabase.from("insurances").delete().eq("id", id);
    await logAction("delete", "insurances", id, "Sigorta silindi");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Sigortalar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{insurances.length} sigorta kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Sigorta
        </button>
      </div>

      {showForm && (
        <InsuranceForm
          insurance={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : insurances.length === 0 ? (
          <EmptyState icon="🛡️" title="Sigorta bulunamadı" desc="Yeni sigorta eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {insurances.map(ins => (
              <div key={ins.id} className="flex items-center gap-4 p-4">
                <img src={ins.logo || "https://via.placeholder.com/48"} alt={ins.name}
                  className="w-12 h-12 rounded-xl object-contain bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{ins.name}</p>
                    {ins.discount_rate > 0 && (
                      <Badge color="amber">%{ins.discount_rate} İndirim</Badge>
                    )}
                    <Badge color={ins.is_active ? "green" : "gray"}>
                      {ins.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{ins.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(ins); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(ins.id, ins.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {ins.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteInsurance(ins.id)}
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

function InsuranceForm({ insurance, onSave, onCancel }: {
  insurance: Insurance | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: insurance?.name || "",
    logo: insurance?.logo || "",
    description: insurance?.description || "",
    discount_rate: insurance?.discount_rate || 0,
    is_active: insurance?.is_active ?? true,
    sort_order: insurance?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    if (insurance?.id) {
      await supabase.from("insurances").update(payload).eq("id", insurance.id);
      await logAction("update", "insurances", insurance.id, `Sigorta güncellendi: ${payload.name}`);
    } else {
      await supabase.from("insurances").insert(payload);
      await logAction("create", "insurances", "", `Sigorta eklendi: ${payload.name}`);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{insurance ? "Sigorta Düzenle" : "Yeni Sigorta"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Sigorta Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="İndirim Oranı (%)" value={String(form.discount_rate)} onChange={v => setForm(f => ({ ...f, discount_rate: Number(v) }))} type="number" />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />

        <div className="md:col-span-2">
          <ImageUpload
            currentUrl={form.logo}
            bucket="insurances"
            fileName={form.name ? slugify(form.name) : ""}
            onUploaded={url => setForm(f => ({ ...f, logo: url }))}
            label="Logo"
            hint="200x80px, şeffaf arka plan (PNG)"
          />
        </div>

        <div className="md:col-span-2">
          <FormField label="Açıklama" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline />
        </div>

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
