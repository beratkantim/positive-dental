import { useState } from "react";
import {
  Calendar, Clock, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft,
} from "lucide-react";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

// Bazi slotlari dolu goster (demo)
const BUSY_SLOTS: Record<string, string[]> = {
  "0": ["09:00", "10:30", "14:00"],
  "1": ["09:30", "11:00", "15:00", "16:00"],
  "2": ["10:00", "13:00", "14:30"],
  "3": ["09:00", "11:30", "13:30"],
  "4": ["10:30", "15:30"],
  "5": [],
  "6": [],
};

const DAYS_TR = ["Pzt", "Sal", "\u00c7ar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS_TR = [
  "Ocak", "\u015eubat", "Mart", "Nisan", "May\u0131s", "Haziran",
  "Temmuz", "A\u011fustos", "Eyl\u00fcl", "Ekim", "Kas\u0131m", "Aral\u0131k"
];

function buildCalendar(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // Pazartesi = 0
  const days: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function displayDate(y: number, m: number, d: number) {
  return `${d} ${MONTHS_TR[m]} ${y}`;
}

export function Step2({
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  onNext, onBack,
}: {
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = buildCalendar(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function isPast(d: number) {
    const date = new Date(viewYear, viewMonth, d);
    date.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  }
  function isSunday(d: number) {
    return new Date(viewYear, viewMonth, d).getDay() === 0;
  }

  const selectedDow = selectedDate
    ? String(new Date(selectedDate + "T12:00:00").getDay())
    : null;
  const busyToday = selectedDow ? (BUSY_SLOTS[selectedDow] ?? []) : [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Takvim */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-bold">
              {MONTHS_TR[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Gun basliklari */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_TR.map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 py-1">{d}</div>
            ))}
          </div>

          {/* Gunler */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = formatDate(viewYear, viewMonth, day);
              const past = isPast(day);
              const sun = isSunday(day);
              const selected = selectedDate === dateStr;
              const disabled = past || sun;

              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                  className={`aspect-square rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
                    selected
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-400/40"
                      : disabled
                        ? "text-slate-700 cursor-not-allowed"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-600 mt-3 text-center">
            Pazar g\u00fcnleri hizmet verilmemektedir.
          </p>
        </div>

        {/* Saat secimi */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-white font-bold">
              {selectedDate
                ? displayDate(viewYear, viewMonth, parseInt(selectedDate.split("-")[2]))
                : "\u00d6nce tarih se\u00e7in"}
            </h3>
          </div>

          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600">
              <Calendar className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Saat se\u00e7mek i\u00e7in tarih se\u00e7in</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">M\u00fcsait saatler g\u00f6sterilmektedir.</p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => {
                  const busy = busyToday.includes(slot);
                  const sel = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      disabled={busy}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        sel
                          ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-400/30"
                          : busy
                            ? "bg-white/3 text-slate-700 cursor-not-allowed line-through"
                            : "bg-white/8 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 border border-white/10"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-xs text-slate-500">M\u00fcsait</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="text-xs text-slate-500">Dolu</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 font-semibold text-sm transition-all">
          <ArrowLeft className="w-4 h-4" /> Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-400/30 hover:from-indigo-400 hover:to-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Devam Et <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
