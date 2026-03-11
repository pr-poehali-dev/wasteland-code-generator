import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "adminbegemotik2004";

interface PromoCode {
  id: string;
  code: string;
  role: string;
  maxUses: number;
  usedCount: number;
  createdAt: string;
}

const initialCodes: PromoCode[] = [
  { id: "1", code: "WASTE-ALPHA-7X2K", role: "VIP", maxUses: 1, usedCount: 0, createdAt: "2026-03-11" },
  { id: "2", code: "LAND-BETA-9Q1M", role: "Moderator", maxUses: 5, usedCount: 2, createdAt: "2026-03-11" },
  { id: "3", code: "NEON-GAMMA-3Z8P", role: "Member", maxUses: 10, usedCount: 10, createdAt: "2026-03-10" },
];

export default function Index() {
  const [tab, setTab] = useState<"promo" | "admin">("promo");
  const [codes, setCodes] = useState<PromoCode[]>(initialCodes);

  const [promoInput, setPromoInput] = useState("");
  const [promoResult, setPromoResult] = useState<null | { success: boolean; message: string; role?: string; left?: number }>(null);
  const [checking, setChecking] = useState(false);

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("1");
  const [createMsg, setCreateMsg] = useState<null | string>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMaxUses, setEditMaxUses] = useState("");

  const generateCode = () => {
    const segments = ["WASTE", "LAND", "NEON", "VOID", "DARK", "FLUX"];
    const seg2 = ["ALPHA", "BETA", "GAMMA", "DELTA", "SIGMA", "OMEGA"];
    const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${segments[Math.floor(Math.random() * segments.length)]}-${seg2[Math.floor(Math.random() * seg2.length)]}-${rand()}`;
  };

  const handleCheckPromo = () => {
    setChecking(true);
    setPromoResult(null);
    setTimeout(() => {
      const found = codes.find(c => c.code.toUpperCase() === promoInput.toUpperCase().trim());
      if (!found) {
        setPromoResult({ success: false, message: "КОД НЕ НАЙДЕН. ДОСТУП ЗАПРЕЩЁН." });
      } else if (found.usedCount >= found.maxUses) {
        setPromoResult({ success: false, message: "ЛИМИТ АКТИВАЦИЙ ИСЧЕРПАН." });
      } else {
        const newUsed = found.usedCount + 1;
        setCodes(prev => prev.map(c => c.id === found.id ? { ...c, usedCount: newUsed } : c));
        const left = found.maxUses - newUsed;
        setPromoResult({ success: true, message: "КОД ПРИНЯТ. РОЛЬ АКТИВИРОВАНА.", role: found.role, left });
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
    if (!newRole.trim()) { setCreateMsg("УКАЖИТЕ РОЛЬ"); return; }
    const maxU = parseInt(newMaxUses) || 1;
    if (maxU < 1) { setCreateMsg("МИНИМУМ 1 АКТИВАЦИЯ"); return; }
    const code = newCode.trim() || generateCode();
    if (codes.find(c => c.code.toUpperCase() === code.toUpperCase())) {
      setCreateMsg("КОД УЖЕ СУЩЕСТВУЕТ"); return;
    }
    const now = new Date().toISOString().split("T")[0];
    setCodes(prev => [...prev, { id: Date.now().toString(), code, role: newRole.trim(), maxUses: maxU, usedCount: 0, createdAt: now }]);
    setNewCode(""); setNewRole(""); setNewMaxUses("1");
    setCreateMsg("КОД СОЗДАН");
    setTimeout(() => setCreateMsg(null), 2000);
  };

  const handleDeleteCode = (id: string) => setCodes(prev => prev.filter(c => c.id !== id));

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleEditSave = (id: string) => {
    const val = parseInt(editMaxUses);
    if (!val || val < 1) return;
    setCodes(prev => prev.map(c => c.id === id ? { ...c, maxUses: val } : c));
    setEditingId(null);
  };

  const handleResetUses = (id: string) => {
    setCodes(prev => prev.map(c => c.id === id ? { ...c, usedCount: 0 } : c));
  };

  const isExhausted = (c: PromoCode) => c.usedCount >= c.maxUses;

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--darker-bg)" }}>
      {/* Header */}
      <header className="relative border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,0,51,0.05) 0%, transparent 100%)" }} />
        <div className="relative max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="inline-block mb-2">
            <span className="text-xs tracking-[0.5em] text-gray-500 font-mono uppercase">// система доступа //</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-widest glitch-text neon-red flicker" data-text="WASTELAND" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            WASTELAND
          </h1>
          <p className="mt-3 text-sm tracking-[0.3em] text-gray-500 font-mono">DISCORD ROLE ACCESS SYSTEM</p>
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
          <button onClick={() => setTab("promo")} className={`px-6 py-3 tracking-widest uppercase transition-all ${tab === "promo" ? "tab-active-red" : "text-gray-500 hover:text-gray-300"}`} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}>
            <span className="flex items-center gap-2"><Icon name="Key" size={14} />Промокод</span>
          </button>
          <button onClick={() => setTab("admin")} className={`px-6 py-3 tracking-widest uppercase transition-all ${tab === "admin" ? "tab-active-green" : "text-gray-500 hover:text-gray-300"}`} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px" }}>
            <span className="flex items-center gap-2"><Icon name="ShieldAlert" size={14} />Админ</span>
          </button>
        </div>
      </div>

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
                <button onClick={handleCheckPromo} disabled={!promoInput.trim() || checking} className="neon-btn-red w-full py-3 rounded text-sm tracking-widest disabled:opacity-30 disabled:cursor-not-allowed">
                  {checking ? (
                    <span className="flex items-center justify-center gap-2"><Icon name="Loader" size={14} className="animate-spin" />ПРОВЕРКА...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><Icon name="Unlock" size={14} />АКТИВИРОВАТЬ</span>
                  )}
                </button>
              </div>

              {promoResult && (
                <div className={`mt-6 p-4 rounded border fade-in-up ${promoResult.success ? "border-green-500 bg-green-500/5" : "border-red-600 bg-red-600/5"}`}>
                  <div className="flex items-start gap-3">
                    <Icon name={promoResult.success ? "CheckCircle" : "XCircle"} size={18} className={promoResult.success ? "neon-green mt-0.5" : "text-red-500 mt-0.5"} />
                    <div>
                      <p className={`text-sm font-mono tracking-widest ${promoResult.success ? "neon-green" : "text-red-500"}`}>{promoResult.message}</p>
                      {promoResult.success && promoResult.role && (
                        <p className="mt-1 text-xs font-mono text-gray-400">
                          РОЛЬ: <span className="neon-green">{promoResult.role}</span>
                          {promoResult.left !== undefined && (
                            <span className="ml-3 text-gray-600">· осталось активаций: <span className={promoResult.left === 0 ? "text-red-500" : "text-gray-400"}>{promoResult.left}</span></span>
                          )}
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
                  Каждый промокод имеет лимит активаций. После исчерпания лимита код становится недействительным.
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded border mb-4 pulse-neon-green" style={{ borderColor: "var(--neon-green)", background: "rgba(0,255,65,0.05)" }}>
                    <Icon name="Lock" size={28} className="neon-green" />
                  </div>
                  <h2 className="text-sm tracking-[0.5em] font-mono" style={{ color: "var(--neon-green)", fontFamily: "'Orbitron', sans-serif" }}>RESTRICTED ACCESS</h2>
                  <p className="text-xs text-gray-600 font-mono mt-1">Введи пароль для входа</p>
                </div>
                <div className="space-y-4">
                  <input type="password" className={`wasteland-input w-full px-4 py-3 rounded text-sm ${passwordError ? "border-red-600" : ""}`} placeholder="••••••••••••••••" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} />
                  {passwordError && (
                    <p className="text-xs text-red-500 font-mono tracking-widest fade-in-up flex items-center gap-1"><Icon name="AlertTriangle" size={12} /> НЕВЕРНЫЙ ПАРОЛЬ</p>
                  )}
                  <button onClick={handleAdminLogin} disabled={!passwordInput} className="neon-btn-green w-full py-3 rounded text-sm tracking-widest disabled:opacity-30">
                    <span className="flex items-center justify-center gap-2"><Icon name="LogIn" size={14} />ВОЙТИ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm tracking-[0.4em] font-mono" style={{ color: "var(--neon-green)", fontFamily: "'Orbitron', sans-serif" }}>ПАНЕЛЬ УПРАВЛЕНИЯ</h2>
                    <p className="text-xs text-gray-600 font-mono mt-1">
                      Всего: <span className="neon-green">{codes.length}</span> · Активных: <span className="neon-green">{codes.filter(c => !isExhausted(c)).length}</span> · Исчерпанных: <span className="text-gray-500">{codes.filter(isExhausted).length}</span>
                    </p>
                  </div>
                  <button onClick={() => setAdminUnlocked(false)} className="text-xs text-gray-600 font-mono hover:text-red-500 transition-colors flex items-center gap-1">
                    <Icon name="LogOut" size={12} />ВЫХОД
                  </button>
                </div>

                {/* Create form */}
                <div className="card-wasteland card-admin rounded p-6">
                  <h3 className="text-xs tracking-[0.4em] font-mono text-gray-400 mb-4 flex items-center gap-2">
                    <Icon name="Plus" size={12} className="neon-green" />СОЗДАТЬ ПРОМОКОД
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input className="wasteland-input px-3 py-2 rounded text-sm uppercase" placeholder="КОД (авто)" value={newCode} onChange={e => setNewCode(e.target.value)} />
                    <input className="wasteland-input px-3 py-2 rounded text-sm" placeholder="РОЛЬ (VIP...)" value={newRole} onChange={e => setNewRole(e.target.value)} />
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        className="wasteland-input w-full px-3 py-2 rounded text-sm pr-14"
                        placeholder="Акт."
                        value={newMaxUses}
                        onChange={e => setNewMaxUses(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleCreateCode()}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-mono pointer-events-none">uses</span>
                    </div>
                    <button onClick={handleCreateCode} className="neon-btn-green px-4 py-2 rounded text-xs tracking-widest">
                      <span className="flex items-center justify-center gap-2"><Icon name="Plus" size={12} />СОЗДАТЬ</span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => setNewCode(generateCode())} className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                      <Icon name="RefreshCw" size={10} />сгенерировать код
                    </button>
                    {createMsg && (
                      <span className={`text-xs font-mono copy-success ${createMsg === "КОД СОЗДАН" ? "neon-green" : "text-red-500"}`}>{createMsg}</span>
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
                      <div className="px-6 py-8 text-center text-xs text-gray-600 font-mono">НЕТ ПРОМОКОДОВ</div>
                    )}
                    {codes.map((c, i) => {
                      const exhausted = isExhausted(c);
                      const pct = Math.min(100, Math.round((c.usedCount / c.maxUses) * 100));
                      return (
                        <div key={c.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors" style={{ borderTop: i > 0 ? "1px solid var(--border-color)" : "none" }}>
                          <div className="flex items-start justify-between gap-4">
                            {/* Left */}
                            <div className="flex items-start gap-4 min-w-0 flex-1">
                              <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${exhausted ? "bg-gray-600" : "bg-green-500"}`} style={!exhausted ? { boxShadow: "0 0 6px var(--neon-green)" } : {}} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`font-mono text-sm tracking-wider ${exhausted ? "text-gray-600 line-through" : "neon-green"}`}>{c.code}</p>
                                  <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#888", border: "1px solid var(--border-color)" }}>{c.role}</span>
                                </div>

                                {/* Uses bar */}
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-color)", maxWidth: "120px" }}>
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{
                                        width: `${pct}%`,
                                        background: exhausted ? "#444" : pct > 75 ? "var(--neon-red)" : "var(--neon-green)",
                                        boxShadow: exhausted ? "none" : `0 0 4px ${pct > 75 ? "var(--neon-red)" : "var(--neon-green)"}`
                                      }}
                                    />
                                  </div>
                                  {editingId === c.id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={c.usedCount}
                                        className="wasteland-input w-16 px-2 py-0.5 rounded text-xs"
                                        value={editMaxUses}
                                        onChange={e => setEditMaxUses(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") handleEditSave(c.id); if (e.key === "Escape") setEditingId(null); }}
                                        autoFocus
                                      />
                                      <button onClick={() => handleEditSave(c.id)} className="text-xs neon-green hover:opacity-70 transition-opacity"><Icon name="Check" size={12} /></button>
                                      <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-red-400 transition-colors"><Icon name="X" size={12} /></button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => { setEditingId(c.id); setEditMaxUses(String(c.maxUses)); }}
                                      className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                                    >
                                      <span className={exhausted ? "text-red-500" : "text-gray-400"}>{c.usedCount}</span>
                                      <span className="text-gray-600">/</span>
                                      <span className="text-gray-500">{c.maxUses}</span>
                                      <Icon name="Pencil" size={10} className="ml-0.5 text-gray-600" />
                                    </button>
                                  )}
                                  <span className="text-xs text-gray-600 font-mono">{c.createdAt}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => handleCopy(c.code, c.id)} className="p-2 rounded border transition-all" style={{ borderColor: "var(--border-color)", color: copiedId === c.id ? "var(--neon-green)" : "#555" }} title="Копировать">
                                <Icon name={copiedId === c.id ? "Check" : "Copy"} size={12} />
                              </button>
                              <button onClick={() => handleResetUses(c.id)} className="p-2 rounded border text-gray-600 hover:text-yellow-400 hover:border-yellow-600 transition-all" style={{ borderColor: "var(--border-color)" }} title="Сбросить счётчик">
                                <Icon name="RotateCcw" size={12} />
                              </button>
                              <button onClick={() => handleDeleteCode(c.id)} className="p-2 rounded border text-gray-600 hover:text-red-500 hover:border-red-600 transition-all" style={{ borderColor: "var(--border-color)" }} title="Удалить">
                                <Icon name="Trash2" size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t mt-16 py-6" style={{ borderColor: "var(--border-color)" }}>
        <p className="text-center text-xs font-mono text-gray-700 tracking-widest">WASTELAND © 2026 · DISCORD ACCESS SYSTEM</p>
      </footer>
    </div>
  );
}
