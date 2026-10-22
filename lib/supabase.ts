import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const STATUSES = ["Backlog", "Em desenvolvimento", "Em andamento", "Concluído"] as const;
export type Status = (typeof STATUSES)[number];
export const RESULTADOS = ["Validada", "Invalidada", "Inconclusiva"] as const;
export const CANAIS = ["Meta Ads", "Google Ads", "Landing Page", "Site", "CRM", "Orgânico / SEO", "Social Media", "Outro"];
export const AREAS = ["Tráfego", "Account", "Criativo / Design", "Social Media", "CRM", "Desenvolvimento", "Cliente", "Outro"];
export const FUNCOES = ["Coordenador", "Account", "Gestor de Tráfego", "Social Media", "Designer", "CRM", "Outro"];

export type Pessoa = { id: string; nome: string; funcao: string };
export type Cliente = {
  id: string; nome: string; account: string | null; trafego: string | null;
  social: string | null; designer: string | null; ordem: number;
};
export type Hipotese = {
  id: string; cliente_id: string; hipotese: string; canal: string | null; area: string | null;
  responsavel: string | null; metrica: string | null; meta: string | null; resultado_obtido: string | null;
  impacto: number; confianca: number; facilidade: number; ice: number; status: Status;
  data_inicio: string | null; data_fim: string | null; resultado: string | null; aprendizado: string | null;
};
