import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { BookingDropdown } from "./BookingDropdown";
import type { Branch } from "@/lib/supabase";

export function Step1Clinic({ clinicId, clinicLabel, activeBranches, onChange }: {
  clinicId: string;
  clinicLabel: string;
  activeBranches: Branch[];
  onChange: (clinicId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <StepHeader step={1} title="Klinik Seçin" sub="Size en yakın kliniği seçin" />
      <BookingDropdown placeholder="Klinik Seç" value={clinicId}
        options={activeBranches.map(b => ({ label: b.name, value: b.id }))}
        onChange={onChange} />
      {clinicLabel && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-indigo-500 text-sm flex items-center gap-1.5 font-medium">
          <MapPin className="w-3.5 h-3.5" /> {clinicLabel} seçildi
        </motion.p>
      )}
    </div>
  );
}
