"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  supabase, STATUSES, RESULTADOS, CANAIS, AREAS,
  type Cliente, type Hipotese, type Pessoa, type Status,
} from "@/lib/supabase";
import Settings from "@/components/Settings";
import Metodologia from "@/components/Metodologia";

const iceClass = (n: number) => (n >= 400 ? "hi" : n >= 200 ? "md" : "lo");

function Auto({ value, onSave, placeholder }: { value: string; onSave: (v: string) => void; placeholder?: string }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const fit = (el: HTMLTextAreaElement | null) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } };
  return (
    <textarea
      ref={fit} rows={1} value={v} placeholder={placeholder}
      onChange={(e) => { setV(e.target.value); fit(e.target); }}
      onBlur={() => v !== value && onSave(v)}
    />
  );
}

function Opts({ list, current }: { list: string[]; current: string | null }) {
  const l = current && !list.includes(current) ? [...list, current] : list;
  return <>{<option value="">—</option>}{l.map((o) => <option key={o}>{o}</option>)}</>;
}

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [hip, setHip] = useState<Hipotese[]>([]);
  const [sel, setSel] = useState<string>("metodo");
  const [view, setView] = useState<"tabela" | "kanban">("tabela");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroResp, setFiltroResp] = useState("");
  const [config, setConfig] = useState(false);
  const [menuOculto, setMenuOculto] = useState(false);
  useEffect(() => { try { setMenuOculto(localStorage.getItem("ice_menu_oculto") === "1"); } catch {} }, []);
  const toggleMenu = () => setMenuOculto((v) => { try { localStorage.setItem("ice_menu_oculto", v ? "0" : "1"); } catch {} return !v; });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const reload = useCallback(async () => {
    const [c, p, h] = await Promise.all([
      supabase.from("ice_clientes").select("*").order("ordem").order("nome"),
      supabase.from("ice_pessoas").select("*").order("nome"),
      supabase.from("ice_hipoteses").select("*").order("created_at"),
    ]);
    if (c.error || p.error || h.error) flash("Erro ao carregar dados");
    setClientes((c.data as Cliente[]) ?? []);
    setPessoas((p.data as Pessoa[]) ?? []);
    setHip((h.data as Hipotese[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  useEffect(() => { if (sel !== "metodo" && !clientes.some((c) => c.id === sel) && !loading) setSel("metodo"); }, [clientes, sel, loading]);

    const cliente = clientes.find((c) => c.id === sel);

  async function patch(id: string, p: Partial<Hipotese>) {
    setHip((cur) => cur.map((h) => (h.id === id ? { ...h, ...p, ice: ((p.impacto ?? h.impacto) * (p.confianca ?? h.confianca) * (p.facilidade ?? h.facilidade)) } : h)));
    const { ice, ...clean } = p as any;
    const { error } = await supabase.from("ice_hipoteses").update({ ...clean, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { flash("Erro ao salvar"); reload(); }
  }
  async function add() {
    if (!cliente) return;
    const { data, error } = await supabase.from("ice_hipoteses").insert({ cliente_id: cliente.id, responsavel: cliente.trafego ?? cliente.account }).select().single();
    if (error) return flash("Erro ao criar");
    setHip((cur) => [...cur, data as Hipotese]);
  }
  async function del(h: Hipotese) {
    if (!confirm("Excluir esta hipótese?")) return;
    setHip((cur) => cur.filter((x) => x.id !== h.id));
    await supabase.from("ice_hipoteses").delete().eq("id", h.id);
  }

  const visible = useMemo(() => {
    return hip
      .filter((h) => (h.cliente_id === sel) && (!filtroStatus || h.status === filtroStatus) && (!filtroResp || h.responsavel === filtroResp))
      .sort((a, b) => {
        const done = (x: Hipotese) => (x.status === "Concluído" ? 1 : 0);
        return done(a) - done(b) || b.ice - a.ice;
      });
  }, [hip, sel, filtroStatus, filtroResp]);

  const base = hip.filter((h) => h.cliente_id === sel);
  const count = (s: Status) => base.filter((h) => h.status === s).length;
  const validadas = base.filter((h) => h.resultado === "Validada").length;
  const nomes = pessoas.map((p) => p.nome);

  const num = (h: Hipotese, k: "impacto" | "confianca" | "facilidade") => (
    <td><input className="num" type="number" min={1} max={10} value={h[k]}
      onChange={(e) => setHip((cur) => cur.map((x) => x.id === h.id ? { ...x, [k]: Number(e.target.value), ice: 0 } : x))}
      onBlur={(e) => { const v = Math.min(10, Math.max(1, Number(e.target.value) || 1)); patch(h.id, { [k]: v } as any); }} /></td>
  );
  const sel1 = (h: Hipotese, k: keyof Hipotese, list: string[]) => (
    <td><select value={(h[k] as string) ?? ""} onChange={(e) => patch(h.id, { [k]: e.target.value || null } as any)}><Opts list={list} current={h[k] as string} /></select></td>
  );
  const txt = (h: Hipotese, k: keyof Hipotese, w: number, ph?: string) => (
    <td style={{ minWidth: w }}><Auto value={(h[k] as string) ?? ""} placeholder={ph} onSave={(v) => patch(h.id, { [k]: v || null } as any)} /></td>
  );
  const date = (h: Hipotese, k: "data_inicio" | "data_fim") => (
    <td style={{ minWidth: 130 }}><input type="date" value={h[k] ?? ""} onChange={(e) => patch(h.id, { [k]: e.target.value || null } as any)} /></td>
  );

  return (
    <>
      <header className="top">
        <button className="btn" onClick={toggleMenu} title="Mostrar/ocultar menu">{menuOculto ? "☰ Mostrar menu" : "☰ Ocultar menu"}</button>
        <div className="brand">V4 <b>Falcon</b> · ICE Score<small>HIPÓTESES · PRIORIZAÇÃO · APRENDIZADO</small></div>
        <div className="spacer" />
        <button className="btn" onClick={() => setConfig(true)}>⚙ Configurações</button>
      </header>

      <div className={"shell" + (menuOculto ? " collapsed" : "")}>
      <aside className="side">
        <button className={"nav" + (sel === "metodo" ? " active" : "")} onClick={() => setSel("metodo")}>📘 Metodologia</button>
        <h4>Clientes ({clientes.length})</h4>
        {clientes.map((c) => (
          <button key={c.id} className={"nav" + (sel === c.id ? " active" : "")} onClick={() => setSel(c.id)}>
            <span>{c.nome}</span><span className="n">{hip.filter((h) => h.cliente_id === c.id).length || ""}</span>
          </button>
        ))}
      </aside>
      <main className="main">
      {sel === "metodo" ? <Metodologia /> : <>

      <div className="bar">
        <h2>{cliente?.nome}</h2>
        <span className="meta">Account: {cliente?.account ?? "—"} · Tráfego: {cliente?.trafego ?? "—"} · Social: {cliente?.social ?? "—"} · Designer: {cliente?.designer ?? "—"}</span>
        <div className="spacer" />
        <select className="btn" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="">Todos os status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="btn" value={filtroResp} onChange={(e) => setFiltroResp(e.target.value)}>
          <option value="">Todos os responsáveis</option>{nomes.map((n) => <option key={n}>{n}</option>)}
        </select>
        <div className="seg">
          <button className={view === "tabela" ? "on" : ""} onClick={() => setView("tabela")}>Tabela</button>
          <button className={view === "kanban" ? "on" : ""} onClick={() => setView("kanban")}>Kanban</button>
        </div>
        <button className="btn red" onClick={add}>+ Nova hipótese</button>
      </div>

      <div className="kpis">
        {STATUSES.map((s) => <div className="kpi" key={s}><b>{count(s)}</b><span>{s}</span></div>)}
        <div className="kpi"><b>{validadas}</b><span>Validadas</span></div>
      </div>
      <p className="guide">ICE = Impacto × Confiança × Facilidade (notas 1–10, máx. 1000). Ordenado do maior para o menor; concluídas vão para o fim. Vermelho ≥ 400 · amarelo ≥ 200.</p>

      {loading ? <div className="empty">Carregando…</div> : visible.length === 0 ? (
        <div className="empty">Nenhuma hipótese ainda. Clique em “+ Nova hipótese”.</div>
      ) : view === "tabela" ? (
        <div className="wrap">
          <table>
            <thead><tr>
              <th>#</th><th>Hipótese</th><th>Canal</th><th>Área</th><th>Responsável</th>
              <th title="Impacto">I</th><th title="Confiança">C</th><th title="Facilidade">E</th><th>ICE</th>
              <th>Status</th><th>Início</th><th>Fim</th><th>Métrica</th><th>Meta</th><th>Resultado obtido</th><th>Resultado</th><th>Aprendizado</th><th />
            </tr></thead>
            <tbody>
              {visible.map((h, i) => (
                <tr key={h.id}>
                  <td className="rank">{i + 1}</td>
                  
                  {txt(h, "hipotese", 300, "Se fizermos X, então Y, porque Z…")}
                  {sel1(h, "canal", CANAIS)}{sel1(h, "area", AREAS)}{sel1(h, "responsavel", nomes)}
                  {num(h, "impacto")}{num(h, "confianca")}{num(h, "facilidade")}
                  <td className={"ice " + iceClass(h.ice)}>{h.ice}</td>
                  <td><select className={"st-" + h.status} value={h.status} onChange={(e) => patch(h.id, { status: e.target.value as Status })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  {date(h, "data_inicio")}{date(h, "data_fim")}
                  {txt(h, "metrica", 130, "Ex.: CPL")}{txt(h, "meta", 110, "Ex.: R$ 32")}{txt(h, "resultado_obtido", 130, "Ex.: R$ 29")}
                  <td><select className={"res-" + (h.resultado ?? "")} value={h.resultado ?? ""} onChange={(e) => patch(h.id, { resultado: e.target.value || null })}><option value="">—</option>{RESULTADOS.map((r) => <option key={r}>{r}</option>)}</select></td>
                  {txt(h, "aprendizado", 240, "O que aprendemos?")}
                  <td style={{ padding: 6 }}><button className="btn sm danger" onClick={() => del(h)} title="Excluir">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="board">
          {STATUSES.map((s) => (
            <div className="col" key={s}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { const id = e.dataTransfer.getData("id"); if (id) patch(id, { status: s }); }}>
              <h3><span className={"st-" + s}>{s}</span><span>{visible.filter((h) => h.status === s).length}</span></h3>
              {visible.filter((h) => h.status === s).map((h) => (
                <div className="card" key={h.id} draggable onDragStart={(e) => e.dataTransfer.setData("id", h.id)}>
                  <p>{h.hipotese || <i style={{ color: "var(--muted)" }}>Sem descrição</i>}</p>
                  <div className="row">
                    <span>{h.responsavel ?? "sem responsável"}{h.canal ? " · " + h.canal : ""}</span>
                    <span className="score">{h.ice}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      </>}
      </main>
      </div>

      {config && <Settings clientes={clientes} pessoas={pessoas} onClose={() => setConfig(false)} reload={reload} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
