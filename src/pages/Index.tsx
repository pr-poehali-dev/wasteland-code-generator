import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "adminbegemotik2004";

interface PromoCode {
  id: string;
  code: string;
  role: string;
  used: boolean;
  createdAt: string;
}

const initialCodes: PromoCode[] = [
  { id: "1", code: "WASTE-ALPHA-7X2K", role: "VIP", used: false, createdAt: "2026-03-11" },
  { id: "2", code: "LAND-BETA-9Q1M", role: "Moderator", used: false, createdAt: "2026-03-11" },
  { id: "3", code: "NEON-GAMMA-3Z8P", role: "Member", used: true, createdAt: "2026-03-10" },
];

export default function Index() {
  const [tab, setTab] = useState<"promo" | "admin">("promo");
  const [codes, setCodes] = useState<PromoCode[]>(initialCodes);

  const [promoInput, setPromoInput] = useState("");
  const [promoResult, setPromoResult] = useState<null | { success: boolean; message: string; role?: string }>(null);
  const [checking, setChecking] = useState(false);

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [newRole, setNewRole] = useState("");
  const [createMsg, setCreateMsg] = useState<null | string>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateCode = () => {
    const segments = ["WASTE", "LAND", "NEON", "VOID", "DARK", "FLUX"];
    const seg2 = ["ALPHA", "BETA", "GAMMA", "DELTA", "SIGMA", "OMEGA"];
    const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const s1 = segments[Math.floor(Math.random() * segments.length)];
    const s2 = seg2[Math.floor(Math.random() * seg2.length)];
    return `${s1}-${s2}-${rand()}`;
  };

  const handleCheckPromo = () => {
    setChecking(true);
    setPromoResult(null);
    setTimeout(() => {
      const found = codes.find(c => c.code.toUpperCase() === promoInput.toUpperCase().trim());
      if (!found) {
        setPromoResult({ success: false, message: "КОД НЕ НАЙДЕН. ДОСТУП ЗАПРЕЩЁН." });
      } else if (found.used) {
        setPromoResult({ success: false, message: "КОД УЖЕ ИСПОЛЬЗОВАН." });
      } else {
        setCodes(prev => prev.map(c => c.id === found.id ? { ...c, used: true } : c));
        setPromoResult({ success: true, message: "КОД ПРИНЯТ. РОЛЬ АКТИВИРОВАНА.", role: found.role });
      }
      setChecking(false);
    }, 800);
  };

  const handleAdminLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handleCreateCode = () => {
    if (!newRole.trim()) {
      setCreateMsg("УКАЖИТЕ РОЛЬ");
      return;
    }
    const code = newCode.trim() || generateCode();
    const exists = codes.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (exists) {
      setCreateMsg("КОД УЖЕ СУЩЕСТВУЕТ");
      return;
    }
    const now = new Date().toISOString().split("T")[0];
    setCodes(prev => [...prev, { id: Date.now().toString(), code, role: newRole.trim(), used: false, createdAt: now }]);
    setNewCode("");
    setNewRole("");
    setCreateMsg("КОД СОЗДАН");
    setTimeout(() => setCreateMsg(null), 2000);
  };

  const handleDeleteCode = (id: string) => {
    setCodes(prev => prev.filter(c => c.id !== id));
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--darker-bg)" }}>
      {/* Header */}
      <header className="relative border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(255,0,51,0.05) 0%, transparent 100%)"
        }} />
        <div className="relative max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="inline-block mb-2">
            <span className="text-xs tracking-[0.5em] text-gray-500 font-mono uppercase">// система доступа //</span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-black tracking-widest glitch-text neon-red flicker"
            data-text="WASTELAND"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            WASTELAND
          </h1>
          <p className="mt-3 text-sm tracking-[0.3em] text-gray-500 font-mono">
            DISCORD ROLE ACCESS SYSTEM
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-16" style={{ background: "var(--neon-red)", boxShadow: "0 0 5px var(--neon-red)" }} />
            <Icon name="Zap" size={12} className="neon-red" />
            <div className="h-px w-16" style={{ background: "var(--neon-red)", boxShadow: "0 0 5px var(--neon-red)" }} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="flex border-b" style={{ borderColor: "var(--border-color)" }}>
          <button
            onClick={() => setTab("promo")}
            className={`px-6 py-3 text-sm tracking-widest font-mono uppercase transition-all ${tab === "promo" ? "tab-active-red" : "text-gray-500 hover:text-gray-300"}`}
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}
          >
            <span className="flex items-center gap-2">
              <Icon name="Key" size={14} />
              Промокод
            </span>
          </button>
          <button
            onClick={() => setTab("admin")}
            className={`px-6 py-3 text-sm tracking-widest font-mono uppercase transition-all ${tab === "admin" ? "tab-active-green" : "text-gray-500 hover:text-gray-300"}`}
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}
          >
            <span className="flex items-center gap-2">
              <Icon name="ShieldAlert" size={14} />
              Админ
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* PROMO TAB */}
        {tab === "promo" && (
          <div className="fade-in-up">
            <div className="card-wasteland rounded p-8 max-w-xl mx-auto">
              <div className="mb-6">
                <h2 className="text-sm tracking-[0.4em] font-mono text-gray-400 mb-1">ВВОД ПРОМОКОДА</h2>
                <p className="text-xs text-gray-600 font-mono">Введи код для получения роли на Discord сервере</p>
              </div>

              <div className="space-y-4">
                <input
                  className="wasteland-input w-full px-4 py-3 rounded text-sm uppercase"
                  placeholder="XXXX-XXXX-XXXX"
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value); setPromoResult(null); }}
                  onKeyDown={e => e.key === "Enter" && handleCheckPromo()}
                  maxLength={30}
                />
                <button
                  onClick={handleCheckPromo}
                  disabled={!promoInput.trim() || checking}
                  className="neon-btn-red w-full py-3 rounded text-sm tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {checking ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="Loader" size={14} className="animate-spin" />
                      ПРОВЕРКА...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="Unlock" size={14} />
                      АКТИВИРОВАТЬ
                    </span>
                  )}
                </button>
              </div>

              {promoResult && (
                <div className={`mt-6 p-4 rounded border fade-in-up ${promoResult.success
                  ? "border-green-500 bg-green-500/5"
                  : "border-red-600 bg-red-600/5"
                }`}>
                  <div className="flex items-start gap-3">
                    <Icon
                      name={promoResult.success ? "CheckCircle" : "XCircle"}
                      size={18}
                      className={promoResult.success ? "neon-green mt-0.5" : "text-red-500 mt-0.5"}
                    />
                    <div>
                      <p className={`text-sm font-mono tracking-widest ${promoResult.success ? "neon-green" : "text-red-500"}`}>
                        {promoResult.message}
                      </p>
                      {promoResult.success && promoResult.role && (
                        <p className="mt-1 text-xs font-mono text-gray-400">
                          РОЛЬ: <span className="neon-green">{promoResult.role}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 max-w-xl mx-auto">
              <div className="flex items-center gap-3 p-4 rounded border" style={{ borderColor: "var(--border-color)", background: "rgba(255,255,255,0.01)" }}>
                <Icon name="Info" size={16} className="text-gray-500 shrink-0" />
                <p className="text-xs font-mono text-gray-500 leading-relaxed">
                  Каждый промокод одноразовый. После активации роль автоматически назначается на сервере.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {tab === "admin" && (
          <div className="fade-in-up">
            {!adminUnlocked ? (
              <div className="card-wasteland card-admin rounded p-8 max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded border mb-4 pulse-neon-green"
                    style={{ borderColor: "var(--neon-green)", background: "rgba(0,255,65,0.05)" }}>
                    <Icon name="Lock" size={28} className="neon-green" />
                  </div>
                  <h2 className="text-sm tracking-[0.5em] font-mono" style={{ color: "var(--neon-green)", fontFamily: "'Orbitron', sans-serif" }}>
                    RESTRICTED ACCESS
                  </h2>
                  <p className="text-xs text-gray-600 font-mono mt-1">Введи пароль для входа</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="password"
                    className={`wasteland-input w-full px-4 py-3 rounded text-sm ${passwordError ? "border-red-600" : ""}`}
                    placeholder="••••••••••••••••"
                    value={passwordInput}
                    onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                    onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                  />
                  {passwordError && (
                    <p className="text-xs text-red-500 font-mono tracking-widest fade-in-up flex items-center gap-1">
                      <Icon name="AlertTriangle" size={12} /> НЕВЕРНЫЙ ПАРОЛЬ
                    </p>
                  )}
                  <button
                    onClick={handleAdminLogin}
                    disabled={!passwordInput}
                    className="neon-btn-green w-full py-3 rounded text-sm tracking-widest disabled:opacity-30"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="LogIn" size={14} />
                      ВОЙТИ
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm tracking-[0.4em] font-mono" style={{ color: "var(--neon-green)", fontFamily: "'Orbitron', sans-serif" }}>
                      ПАНЕЛЬ УПРАВЛЕНИЯ
                    </h2>
                    <p className="text-xs text-gray-600 font-mono mt-1">
                      Всего: <span className="neon-green">{codes.length}</span> · Активных: <span className="neon-green">{codes.filter(c => !c.used).length}</span> · Использованных: <span className="text-gray-500">{codes.filter(c => c.used).length}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminUnlocked(false)}
                    className="text-xs text-gray-600 font-mono hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Icon name="LogOut" size={12} />
                    ВЫХОД
                  </button>
                </div>

                {/* Create form */}
                <div className="card-wasteland card-admin rounded p-6">
                  <h3 className="text-xs tracking-[0.4em] font-mono text-gray-400 mb-4 flex items-center gap-2">
                    <Icon name="Plus" size={12} className="neon-green" />
                    СОЗДАТЬ ПРОМОКОД
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      className="wasteland-input px-3 py-2 rounded text-sm uppercase"
                      placeholder="КОД (авто)"
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                    />
                    <input
                      className="wasteland-input px-3 py-2 rounded text-sm"
                      placeholder="РОЛЬ (VIP, Mod...)"
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleCreateCode()}
                    />
                    <button
                      onClick={handleCreateCode}
                      className="neon-btn-green px-4 py-2 rounded text-xs tracking-widest"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="Plus" size={12} />
                        СОЗДАТЬ
                      </span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => setNewCode(generateCode())}
                      className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                    >
                      <Icon name="RefreshCw" size={10} />
                      сгенерировать код
                    </button>
                    {createMsg && (
                      <span className={`text-xs font-mono copy-success ${createMsg === "КОД СОЗДАН" ? "neon-green" : "text-red-500"}`}>
                        {createMsg}
                      </span>
                    )}
                  </div>
                </div>

                {/* Codes list */}
                <div className="card-wasteland card-admin rounded overflow-hidden">
                  <div className="px-6 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border-color)" }}>
                    <Icon name="List" size={12} className="neon-green" />
                    <span className="text-xs tracking-[0.4em] font-mono text-gray-400">СПИСОК КОДОВ</span>
                  </div>
                  <div>
                    {codes.length === 0 && (
                      <div className="px-6 py-8 text-center text-xs text-gray-600 font-mono">
                        НЕТ ПРОМОКОДОВ
                      </div>
                    )}
                    {codes.map((c, i) => (
                      <div
                        key={c.id}
                        className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                        style={{ borderTop: i > 0 ? "1px solid var(--border-color)" : "none" }}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${c.used ? "bg-gray-600" : "bg-green-500"}`}
                            style={!c.used ? { boxShadow: "0 0 6px var(--neon-green)" } : {}}
                          />
                          <div className="min-w-0">
                            <p className={`font-mono text-sm tracking-wider ${c.used ? "text-gray-600 line-through" : "neon-green"}`}>
                              {c.code}
                            </p>
                            <p className="text-xs font-mono text-gray-600 mt-0.5">
                              РОЛЬ: <span className="text-gray-400">{c.role}</span> · {c.createdAt} · {c.used ? "использован" : "активен"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleCopy(c.code, c.id)}
                            className="p-2 rounded border text-xs font-mono transition-all"
                            style={{ borderColor: "var(--border-color)", color: copiedId === c.id ? "var(--neon-green)" : "#555" }}
                            title="Копировать"
                          >
                            <Icon name={copiedId === c.id ? "Check" : "Copy"} size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCode(c.id)}
                            className="p-2 rounded border text-xs font-mono text-gray-600 hover:text-red-500 hover:border-red-600 transition-all"
                            style={{ borderColor: "var(--border-color)" }}
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6" style={{ borderColor: "var(--border-color)" }}>
        <p className="text-center text-xs font-mono text-gray-700 tracking-widest">
          WASTELAND © 2026 · DISCORD ACCESS SYSTEM
        </p>
      </footer>
    </div>
  );
}
