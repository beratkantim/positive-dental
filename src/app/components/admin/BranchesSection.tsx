import { useState, useEffect } from "react";
import { supabase, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload, type BranchData } from "./shared";

export function BranchesSection() {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BranchData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("branches").select("*").order("sort_order");
    setBranches(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("branches").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteBranch = async (id: string) => {
    if (!confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("branches").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Şubeler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{branches.length} şube kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Şube
        </button>
      </div>

      {showForm && (
        <BranchForm
          branch={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : branches.length === 0 ? (
          <EmptyState icon="📍" title="Şube bulunamadı" desc="Yeni şube eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {branches.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {b.image ? (
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">📍</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{b.name}</p>
                    <Badge color={b.is_active ? "green" : "gray"}>
                      {b.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{b.city} · {b.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(b); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(b.id, b.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {b.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteBranch(b.id)}
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

function BranchForm({ branch, onSave, onCancel }: {
  branch: BranchData | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    slug: branch?.slug || "",
    name: branch?.name || "",
    city: branch?.city || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    email: branch?.email || "",
    map_url: branch?.map_url || "",
    working_hours: branch?.working_hours || "",
    image: branch?.image || "",
    is_active: branch?.is_active ?? true,
    sort_order: (branch as any)?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  // Otomatik slug oluştur
  useEffect(() => {
    if (!branch) {
      setForm(f => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, branch]);

  const save = async () => {
    setSaving(true);
    if (branch?.id) {
      await supabase.from("branches").update(form).eq("id", branch.id);
    } else {
      await supabase.from("branches").insert(form);
    }
    setSaving(false);
    onSave();
  };

  const imageFileName = form.name ? `positivedentalstudio_${slugify(form.name)}` : "";

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{branch ? "Şube Düzenle" : "Yeni Şube"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Şube Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
        <FormField label="Şehir" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
        <FormField label="Telefon" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
        <FormField label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
        <FormField label="Çalışma Saatleri" value={form.working_hours} onChange={v => setForm(f => ({ ...f, working_hours: v }))} />
        <div className="md:col-span-2">
          <FormField label="Adres" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} multiline />
        </div>
        <div className="md:col-span-2">
          <FormField label="Google Maps URL" value={form.map_url} onChange={v => setForm(f => ({ ...f, map_url: v }))} />
        </div>
        <div className="md:col-span-2">
          <ImageUpload
            currentUrl={form.image}
            bucket="branches"
            fileName={imageFileName}
            onUploaded={url => setForm(f => ({ ...f, image: url }))}
            label="Şube Fotoğrafı"
            hint="800x500px, yatay klinik fotoğrafı"
          />
        </div>
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />
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
