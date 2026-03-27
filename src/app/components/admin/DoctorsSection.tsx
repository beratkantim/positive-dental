import { useState, useEffect } from "react";
import { supabase, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload, type Doctor } from "./shared";

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("doctors").select("*").order("sort_order");
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("doctors").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteDoctor = async (id: string) => {
    if (!confirm("Bu doktoru silmek istediğinize emin misiniz?")) return;
    await supabase.from("doctors").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Doktorlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{doctors.length} doktor kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Doktor
        </button>
      </div>

      {showForm && (
        <DoctorForm
          doctor={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : doctors.length === 0 ? (
          <EmptyState icon="👨‍⚕️" title="Doktor bulunamadı" desc="Yeni doktor eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {doctors.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 p-4">
                <img src={doc.photo || "https://via.placeholder.com/48"} alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{doc.name}</p>
                    <Badge color={doc.branch === "adana" ? "indigo" : "amber"}>
                      {doc.branch_label}
                    </Badge>
                    <Badge color={doc.is_active ? "green" : "gray"}>
                      {doc.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{doc.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(doc); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(doc.id, doc.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {doc.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteDoctor(doc.id)}
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

function DoctorForm({ doctor, onSave, onCancel }: {
  doctor: Doctor | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: doctor?.name || "",
    title: doctor?.title || "",
    specialty: doctor?.specialty || "",
    branch: doctor?.branch || "adana",
    branch_label: doctor?.branch_label || "",
    photo: doctor?.photo || "",
    bio: doctor?.bio || "",
    education: doctor?.education?.join("\n") || "",
    expertise: doctor?.expertise?.join(", ") || "",
    booking_url: doctor?.booking_url || "https://randevu.positivedental.com",
    is_active: doctor?.is_active ?? true,
    sort_order: doctor?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      education: form.education.split("\n").filter(Boolean),
      expertise: form.expertise.split(",").map(s => s.trim()).filter(Boolean),
    };
    if (doctor?.id) {
      await supabase.from("doctors").update(payload).eq("id", doctor.id);
    } else {
      await supabase.from("doctors").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{doctor ? "Doktor Düzenle" : "Yeni Doktor"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Ad Soyad" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Unvan" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
        <FormField label="Uzmanlık" value={form.specialty} onChange={v => setForm(f => ({ ...f, specialty: v }))} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şube</label>
          <select value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value as any }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="adana">Adana Türkmenbaşı</option>
            <option value="istanbul">İstanbul Nişantaşı</option>
          </select>
        </div>
        <FormField label="Şube Etiketi" value={form.branch_label} onChange={v => setForm(f => ({ ...f, branch_label: v }))} />
        <ImageUpload
          currentUrl={form.photo}
          bucket="doctors"
          fileName={form.name ? slugify(form.name) : ""}
          onUploaded={url => setForm(f => ({ ...f, photo: url }))}
          label="Fotoğraf"
          hint="400x500px portre, 3:4 oran"
        />
        <div className="md:col-span-2">
          <FormField label="Biyografi" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
        </div>
        <div>
          <FormField label="Eğitim (Her satıra bir)" value={form.education} onChange={v => setForm(f => ({ ...f, education: v }))} multiline />
        </div>
        <div>
          <FormField label="Uzmanlık Alanları (virgülle ayır)" value={form.expertise} onChange={v => setForm(f => ({ ...f, expertise: v }))} multiline />
        </div>
        <FormField label="Randevu URL" value={form.booking_url} onChange={v => setForm(f => ({ ...f, booking_url: v }))} />
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
