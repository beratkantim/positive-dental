import { useState } from "react";
import { TreatmentsList } from "./services/TreatmentsList";
import { CategoriesList } from "./services/CategoriesList";

export function ServicesSection() {
  const [tab, setTab] = useState<"treatments" | "categories">("treatments");

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("treatments")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tab === "treatments" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          🦷 Tedaviler
        </button>
        <button onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tab === "categories" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          📁 Tedavi Kategorileri
        </button>
      </div>
      {tab === "treatments" ? <TreatmentsList /> : <CategoriesList />}
    </div>
  );
}
