"use client";
import { useState } from "react";
import { supabase, FUNCOES, type Cliente, type Pessoa } from "@/lib/supabase";

type Props = {
  clientes: Cliente[];
  pessoas: Pessoa[];
  onClose: () => void;
  reload: () => Promise<void>;
};

const ROLE_FIELDS: { key: "account" | "trafego" | "social" | "designer"; label: string; role: string[] }[] = [
  { key: "account", label: "Account", role: ["Account", "Coordenador"] },
  { key: "trafego", label: "Tráfego", role: ["Gestor de Tráfego"] },
  { key: "social", label: "Social", role: ["Social Media"] },
  { key: "designer", label: "Designer", role: ["Designer"] },
];

export default function Settings({ clientes, pessoas, onClose, reload }: Props) {
  const [tab, setTab] = useState<"clientes" | "pessoas">("clientes");
  const [novoCliente, setNovoCliente] = useState("");
  const [novaPessoa, setNovaPessoa] = useState("");
  const [novaFuncao, setNovaFuncao] = useState(FUNCOES[1]);

  const optionsFor = (roles: string[], current: string | null) => {
    const names = pessoas.filter((p) => roles.includes(p.funcao)).map((p) => p.nome);
    if (current && !names.includes(current)) names.push(current);
    return names;
  };

  async function updCliente(id: string, patch: Partial<Cliente>) {
    await supabase.from("ice_clientes").update(patch).eq("id", id);
    await reload();
  }
  async function addCliente() {
    const nome = novoCliente.trim();
    if (!nome) return;
    const ordem = Math.max(0, ...clientes.map((c) => c.ordem)) + 1;
    await supabase.from("ice_clientes").insert({ nome, ordem });
    setNovoCliente("");
    await reload();
  }
  async function delCliente(c: Cliente) {
    if (!confirm(`Excluir "${c.nome}" e TODAS as hipóteses dele? Isso não pode ser desfeito.`)) return;
    await supabase.from("ice_clientes").delete().eq("id", c.id);
    await reload();
  }

  async function addPessoa() {
    const nome = novaPessoa.trim();
    if (!nome) return;
    await supabase.from("ice_pessoas").insert({ nome, funcao: novaFuncao });
    setNovaPessoa("");
    await reload();
  }
  async function renamePessoa(p: Pessoa, nome: string) {
    nome = nome.trim();
    if (!nome || nome === p.nome) return;
    await supabase.from("ice_pessoas").update({ nome }).eq("id", p.id);
    // mantém os vínculos (guardados como texto) apontando para o novo nome
    for (const col of ["account", "trafego", "social", "designer"]) {
      await supabase.from("ice_clientes").update({ [col]: nome }).eq(col, p.nome);
    }
    await supabase.from("ice_hipoteses").update({ responsavel: nome }).eq("responsavel", p.nome);
    await reload();
  }
  async function funcaoPessoa(p: Pessoa, funcao: string) {
    await supabase.from("ice_pessoas").update({ funcao }).eq("id", p.id);
    await reload();
  }
  async function delPessoa(p: Pessoa) {
    const uso = clientes.filter((c) => [c.account, c.trafego, c.social, c.designer].includes(p.nome)).length;
    const msg = uso
      ? `"${p.nome}" está em ${uso} cliente(s). Remover limpa esse vínculo (use "trocar" no cliente se quiser outra pessoa). Continuar?`
      : `Excluir "${p.nome}"?`;
    if (!confirm(msg)) return;
    for (const col of ["account", "trafego", "social", "designer"]) {
      await supabase.from("ice_clientes").update({ [col]: null }).eq(col, p.nome);
    }
    await supabase.from("ice_pessoas").delete().eq("id", p.id);
    await reload();
  }

  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <h2>Configurações</h2>
            <div className="meta">Clientes e time. Alterações salvam na hora.</div>
          </div>
          <div className="spacer" />
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
        <div className="mtabs">
          <div className="seg">
            <button className={tab === "clientes" ? "on" : ""} onClick={() => setTab("clientes")}>Clientes ({clientes.length})</button>
            <button className={tab === "pessoas" ? "on" : ""} onClick={() => setTab("pessoas")}>Pessoas ({pessoas.length})</button>
          </div>
        </div>

        {tab === "clientes" && (
          <>
            <div className="form-row clients-grid hdr">
              <span>Cliente</span>{ROLE_FIELDS.map((f) => <span key={f.key}>{f.label}</span>)}<span />
            </div>
            {clientes.map((c) => (
              <div className="form-row clients-grid" key={c.id}>
                <input defaultValue={c.nome} onBlur={(e) => e.target.value.trim() && e.target.value !== c.nome && updCliente(c.id, { nome: e.target.value.trim() })} />
                {ROLE_FIELDS.map((f) => (
                  <select key={f.key} value={c[f.key] ?? ""} onChange={(e) => updCliente(c.id, { [f.key]: e.target.value || null })}>
                    <option value="">—</option>
                    {optionsFor(f.role, c[f.key]).map((n) => <option key={n}>{n}</option>)}
                  </select>
                ))}
                <button className="btn sm danger" onClick={() => delCliente(c)}>Excluir</button>
              </div>
            ))}
            <h3>Novo cliente</h3>
            <div className="form-row" style={{ gridTemplateColumns: "1fr auto" }}>
              <input placeholder="Nome do cliente" value={novoCliente} onChange={(e) => setNovoCliente(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCliente()} />
              <button className="btn red" onClick={addCliente}>Adicionar</button>
            </div>
          </>
        )}

        {tab === "pessoas" && (
          <>
            <div className="form-row people-grid hdr"><span>Nome</span><span>Função</span><span /></div>
            {pessoas.map((p) => (
              <div className="form-row people-grid" key={p.id}>
                <input defaultValue={p.nome} onBlur={(e) => renamePessoa(p, e.target.value)} />
                <select value={p.funcao} onChange={(e) => funcaoPessoa(p, e.target.value)}>
                  {[...new Set([...FUNCOES, p.funcao])].map((f) => <option key={f}>{f}</option>)}
                </select>
                <button className="btn sm danger" onClick={() => delPessoa(p)}>Excluir</button>
              </div>
            ))}
            <h3>Nova pessoa</h3>
            <div className="form-row" style={{ gridTemplateColumns: "1.4fr 1fr auto" }}>
              <input placeholder="Nome" value={novaPessoa} onChange={(e) => setNovaPessoa(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPessoa()} />
              <select value={novaFuncao} onChange={(e) => setNovaFuncao(e.target.value)}>{FUNCOES.map((f) => <option key={f}>{f}</option>)}</select>
              <button className="btn red" onClick={addPessoa}>Adicionar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
