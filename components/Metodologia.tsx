export default function Metodologia() {
  return (
    <div className="metodo">
      <h1>Metodologia ICE Score</h1>
      <p className="lead">Como o Squad Falcon decide qual hipótese testar primeiro, executa com dono e prazo, e transforma o resultado em aprendizado.</p>

      <h2>1. O que é o ICE</h2>
      <p>Cada hipótese recebe três notas de 1 a 10. O score é a multiplicação das três, de 1 a 1000. Quanto maior, mais cedo a hipótese deve ser testada.</p>
      <div className="box"><b>ICE = Impacto × Confiança × Facilidade</b></div>
      <table style={{ marginTop: 12 }}>
        <thead><tr><th>Critério</th><th>Pergunta</th><th>Exemplos em mídia paga</th></tr></thead>
        <tbody>
          <tr><td><b>I · Impacto</b></td><td>Se der certo, quanto melhora o resultado da conta?</td><td>Reduzir CPL, subir taxa de conversão, mais leads qualificados, melhor ROAS.</td></tr>
          <tr><td><b>C · Confiança</b></td><td>Quão provável é funcionar, com base em evidências?</td><td>Histórico de campanhas, dados de conversão, criativos anteriores, CRM.</td></tr>
          <tr><td><b>E · Facilidade</b></td><td>Quão simples e rápido é executar? (10 = muito fácil)</td><td>Criativos prontos, aprovação do cliente, dependência de dev, tempo de produção.</td></tr>
        </tbody>
      </table>

      <h2>2. Exemplo</h2>
      <table>
        <thead><tr><th>Hipótese</th><th>I</th><th>C</th><th>E</th><th>ICE</th></tr></thead>
        <tbody>
          <tr><td>Testar novos criativos</td><td>9</td><td>8</td><td>9</td><td><b>648</b></td></tr>
          <tr><td>Testar novo público</td><td>7</td><td>6</td><td>8</td><td><b>336</b></td></tr>
          <tr><td>Otimizar landing page</td><td>9</td><td>7</td><td>5</td><td><b>315</b></td></tr>
          <tr><td>Revisar oferta comercial</td><td>10</td><td>5</td><td>3</td><td><b>150</b></td></tr>
        </tbody>
      </table>
      <p className="lead" style={{ marginTop: 8 }}>Valores ilustrativos. No app: vermelho ≥ 400, amarelo ≥ 200.</p>

      <h2>3. Fluxo de trabalho</h2>
      <ol>
        <li><b>Entrada:</b> identifique problemas e oportunidades nos dados da conta.</li>
        <li><b>Hipótese:</b> escreva no formato “Se fizermos X, então Y, porque Z”.</li>
        <li><b>Pontuação:</b> dê notas de I, C e E. O ICE é calculado sozinho.</li>
        <li><b>Priorização:</b> a tabela já ordena do maior para o menor ICE.</li>
        <li><b>Execução:</b> defina responsável, área, canal, métrica, meta, início e fim.</li>
        <li><b>Aprendizado:</b> registre o resultado obtido, marque Validada, Invalidada ou Inconclusiva e escreva o que aprendeu.</li>
      </ol>

      <h2>4. Status</h2>
      <table>
        <tbody>
          <tr><td><b>Backlog</b></td><td>Hipótese mapeada e pontuada, aguardando vez.</td></tr>
          <tr><td><b>Em desenvolvimento</b></td><td>Sendo preparada: criativo, página, configuração, aprovação.</td></tr>
          <tr><td><b>Em andamento</b></td><td>Teste no ar, coletando dados.</td></tr>
          <tr><td><b>Concluído</b></td><td>Teste encerrado, com resultado e aprendizado registrados.</td></tr>
        </tbody>
      </table>

      <h2>5. Regras de ouro</h2>
      <ul>
        <li><b>Padronize a fórmula.</b> Neste app é sempre a multiplicação. Não misture com soma ou média.</li>
        <li><b>O ICE define a ordem, não a validade do teste.</b> Respeite volume mínimo de dados, período de teste e risco.</li>
        <li><b>Todo teste tem dono e data.</b> Responsável e área mostram onde a ação está: Tráfego, Account, Criativo, Cliente…</li>
        <li><b>Atualize a Confiança.</b> Aprendizados de testes anteriores devem mudar as notas das próximas hipóteses.</li>
        <li><b>Um teste, uma variável.</b> Sem isso, o resultado não prova a hipótese.</li>
      </ul>

      <h2>6. Como usar o app</h2>
      <ul>
        <li>Escolha o cliente no menu lateral. Use “Ocultar menu” para ganhar espaço.</li>
        <li>Clique em <b>+ Nova hipótese</b> e preencha a linha como numa planilha. Tudo salva automaticamente.</li>
        <li>Alterne entre <b>Tabela</b> e <b>Kanban</b>; no Kanban, arraste o card para mudar o status.</li>
        <li>Em <b>Configurações</b>, adicione, edite, exclua ou troque clientes e pessoas do time.</li>
      </ul>
    </div>
  );
}
