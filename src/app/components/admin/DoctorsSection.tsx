import { useState, useEffect } from "react";
import { supabase, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload, type Doctor, type Service } from "./shared";

const BRANCH_OPTIONS = [
  { id: "adana", label: "Adana Türkmenbaşı" },
  { id: "istanbul", label: "İstanbul Nişantaşı" },
];

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

  const getBranches = (doc: Doctor): string[] => {
    if (doc.branches && doc.branches.length > 0) return doc.branches;
    if (doc.branch) return [doc.branch];
    return [];
  };

  const getBranchLabels = (doc: Doctor): string[] => {
    if (doc.branches_labels && doc.branches_labels.length > 0) return doc.branches_labels;
    if (doc.branch_label) return [doc.branch_label];
    return getBranches(doc).map(b => BRANCH_OPTIONS.find(o => o.id === b)?.label || b);
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
                    {getBranchLabels(doc).map(label => (
                      <Badge key={label} color="indigo">{label}</Badge>
                    ))}
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
  const initBranches = doctor?.branches?.length ? doctor.branches : (doctor?.branch ? [doctor.branch] : []);
  const initServices = doctor?.service_ids || [];

  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    name: doctor?.name || "",
    title: doctor?.title || "",
    specialty: doctor?.specialty || "",
    selectedBranches: initBranches as string[],
    selectedServices: initServices as string[],
    allServices: initServices.length === 0, // boş = tümü
    photo: doctor?.photo || "",
    bio: doctor?.bio || "",
    education: doctor?.education?.join("\n") || "",
    expertise: doctor?.expertise?.join(", ") || "",
    booking_url: doctor?.booking_url || "https://randevu.positivedental.com",
    is_active: doctor?.is_active ?? true,
    sort_order: doctor?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("is_active", true).order("sort_order").then(({ data }) => {
      setServices(data || []);
    });
  }, []);

  const toggleBranch = (branchId: string) => {
    setForm(f => ({
      ...f,
      selectedBranches: f.selectedBranches.includes(branchId)
        ? f.selectedBranches.filter(b => b !== branchId)
        : [...f.selectedBranches, branchId],
    }));
  };

  const toggleService = (id: string) => {
    setForm(f => ({
      ...f,
      selectedServices: f.selectedServices.includes(id)
        ? f.selectedServices.filter(s => s !== id)
        : [...f.selectedServices, id],
    }));
  };

  const save = async () => {
    setSaving(true);
    const branchLabels = form.selectedBranches.map(b => BRANCH_OPTIONS.find(o => o.id === b)?.label || b);
    const payload = {
      name: form.name,
      title: form.title,
      specialty: form.specialty,
      branch: form.selectedBranches[0] || "adana",
      branch_label: branchLabels[0] || "",
      branches: form.selectedBranches,
      branches_labels: branchLabels,
      service_ids: form.allServices ? [] : form.selectedServices, // boş = tümü
      photo: form.photo,
      bio: form.bio,
      education: form.education.split("\n").filter(Boolean),
      expertise: form.expertise.split(",").map(s => s.trim()).filter(Boolean),
      booking_url: form.booking_url,
      is_active: form.is_active,
      sort_order: form.sort_order,
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

        {/* Çoklu şube seçimi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şubeler</label>
          <div className="space-y-2">
            {BRANCH_OPTIONS.map(b => {
              const selected = form.selectedBranches.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBranch(b.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                    selected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {selected ? "✓" : ""}
                  </span>
                  {b.label}
                </button>
              );
            })}
          </div>
          {form.selectedBranches.length === 0 && (
            <p className="text-xs text-red-500 mt-1">En az bir şube seçin</p>
          )}
        </div>

        {/* Tedavi / Hizmet seçimi */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Yaptığı Tedaviler</label>

          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input type="checkbox" checked={form.allServices}
              onChange={e => setForm(f => ({ ...f, allServices: e.target.checked, selectedServices: [] }))}
              className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Tüm tedavileri yapar</span>
          </label>

          {!form.allServices && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {services.map(s => {
                const selected = form.selectedServices.includes(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggleService(s.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}>
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      selected ? "bg-indigo-500 text-white" : "bg-gray-100"
                    }`}>{selected ? "✓" : ""}</span>
                    <span className="text-lg">{s.icon}</span>
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {!form.allServices && form.selectedServices.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">En az bir tedavi seçin veya "Tüm tedavileri yapar" işaretleyin</p>
          )}
        </div>

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
        <button onClick={save} disabled={saving || form.selectedBranches.length === 0}
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
