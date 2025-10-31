# ❓ FAQ - God Level Coder Challenge

## Sobre o Desafio

### Quanto tempo devo investir?

O prazo é 1 semana, mas você decide o esforço. Candidatos top geralmente investem 40-80 horas. Qualidade > quantidade.

## Tecnologias

### Posso usar frameworks/libraries?

Sim! Use o que faz sentido. Não reinvente a roda. Mas entenda o que está usando.

### Preciso fazer do zero?

Idealmente sim, construir um dashboard em PowerBI ou no Metabase não resolveria a dor do usuário completamente.

### Frontend e backend são obrigatórios?

Sim. A solução precisa de interface visual para o usuário explorar dados. Precisamos também ser capazes de agregar os dados além do SQL.

## Dados

### Como obtenho os dados?

Clone o repositório e rode o script / docker compose para geração dos dados.

### Posso gerar mais dados?

Sim, use o script `generate_data.py` com parâmetros diferentes.

### Os dados são realistas?

Mias ou menos. Baseados em tentativa de reproduzir padrões reais de 50+ restaurantes. Incluem sazonalidade, anomalias, distribuições reais.

## Implementação

### Preciso fazer drag-and-drop?

Não é obrigatório. Se você tem uma forma melhor de criar dashboards customizados, mostre.

### Preciso fazer query builder visual?

Novamente, não é obrigatório. Se há uma forma melhor de permitir exploração de dados, implemente.

### Quanto de features avançadas?

Foque em resolver o problema core MUITO bem. Features extras são bonus, não requisito.

### Preciso fazer autenticação?

Não é obrigatório, mas valorizado. Esta solução implementa autenticação completa com JWT e validação robusta de senhas.

### Como funciona a validação de senha?

A plataforma exige senhas seguras com:

- Mínimo 8 caracteres
- 1 letra maiúscula
- 1 caractere especial
- Validação em tempo real (client-side) + server-side

### A plataforma está em português?

Sim! Interface 100% traduzida para português brasileiro, incluindo mensagens de erro, labels, gráficos e insights.

### Queries precisam ser rápidas mesmo?

Sim. 500ms para queries complexas é esperado. 2+ segundos é inaceitável. Performance importa.

## Entrega

### O vídeo é obrigatório?

Sim. Queremos ver você explicando sua solução. 5-10 minutos é suficiente.

### Preciso fazer deploy?

Não obrigatório, mas valorizado. Se não fizer, garanta que `docker compose up` funciona perfeitamente.

### E se não funcionar primeiro try?

Tenha instruções MUITO claras no README. "Clone, docker compose up, acesse localhost:3000" deve funcionar.

## Avaliação

### Vocês preferem tecnologia X?

Não. Preferimos **boa engenharia** independente da stack.

### Se eu usar tech desconhecida para vocês?

Documente bem. Se a escolha faz sentido e o código é bom, pontos ganhos.

### Posso copiar código de libs open source?

Sim, mas dê créditos. Não copie soluções de outros participantes.

## Suporte

### Posso fazer perguntas durante?

Sim! Discord e email estão abertos.

### Vocês dão dicas de implementação?

Esclarecemos o problema e dados. Não damos dicas de solução (seria injusto).

### E se encontrar bug nos dados?

Reporte no Discord. Debateremos o problema e possíveis correções, não tenha apreço aos detalhes nos dados -> boas visualizações e bons backends serão efetivamente considerados embora os dados não estejam perfeitos.

## Premiação

### Posso recusar a vaga e ficar só com o prêmio?

Não.

### Quando recebo o prêmio?

3 meses após entrada no time.

## Ética

### Posso trabalhar em equipe?

Não. Desafio é individual. Mas pode discutir conceitos gerais no Discord com a equipe do Nola.

### Posso usar AI para me ajudar no código?

Sim, como ferramenta. Mas você deve entender e defender cada linha de código.

### E se eu colar de outro participante?

Desqualificação imediata. Temos detecção de similaridade.
