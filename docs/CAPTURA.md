# Captura de leads → planilha do Excel (Power Automate)

O site é estático. O formulário monta **um objeto plano** (uma chave por
coluna) e envia para a URL de um fluxo, que grava a linha na planilha.
Enquanto o fluxo não existir, o formulário cai no WhatsApp — nenhum contato
se perde.

## ⚠️ Licença: leia antes

O gatilho **"Quando uma solicitação HTTP é recebida"** é **premium**. O
**Microsoft 365 Business Basic** inclui o *Power Automate para Microsoft 365*,
que **não** cobre gatilhos/conectores premium. Caminhos possíveis:

| Caminho | Custo | Observação |
|---|---|---|
| **Power Automate Premium** | ~US$ 15/usuário/mês (tem teste de 90 dias) | Mais direto; segue o passo a passo abaixo sem mudanças |
| **Azure Logic Apps (consumo)** | centavos por mês nesse volume | Mesmo gatilho HTTP e o mesmo conector do Excel; precisa de uma assinatura Azure |
| **Microsoft Forms** | incluído no Business Basic | Sem custo, mas troca o formulário do site por um Forms da Microsoft (perde o funil próprio) |

Os dois primeiros funcionam com o site como está. O terceiro exige decidir se
vale trocar a experiência do formulário — me avise que eu adapto.

## 1. A planilha

1. No **OneDrive** (ou num site do SharePoint), crie `leads.xlsx`.
2. Na primeira linha, escreva os cabeçalhos **exatamente** nesta ordem:

```
quando | origem | pagina | escopo | necessidade | ramo | descoberta | trava | urgencia | faixa | nome | email | whatsapp | mensagem
```

3. Selecione o intervalo dos cabeçalhos e use **Inserir → Tabela**
   (`Ctrl+T`, com "Minha tabela tem cabeçalhos" marcado).
4. Em **Design da Tabela**, renomeie a tabela para **`Leads`**.

> A ordem das colunas vive em `COLUNAS`, em `src/scripts/captura.ts`. Mudou
> lá, muda aqui.

## 2. O fluxo

Em [make.powerautomate.com](https://make.powerautomate.com) → **Criar** →
**Fluxo de nuvem instantâneo** → gatilho **Quando uma solicitação HTTP é
recebida**.

**Gatilho:** deixe o esquema do corpo vazio e, em *Quem pode acionar*,
mantenha "Qualquer pessoa".

**Ação:** *Excel Online (Business)* → **Adicionar uma linha em uma tabela**.
- **Local**: OneDrive for Business (ou o site do SharePoint)
- **Biblioteca de documentos**: OneDrive
- **Arquivo**: `leads.xlsx`
- **Tabela**: `Leads`

Em cada coluna, use uma **expressão** (aba *Expressão*, não *Conteúdo
dinâmico*) — o corpo chega como texto, então precisa ser convertido:

```
json(triggerBody())?['quando']
json(triggerBody())?['origem']
json(triggerBody())?['pagina']
json(triggerBody())?['escopo']
json(triggerBody())?['necessidade']
json(triggerBody())?['ramo']
json(triggerBody())?['descoberta']
json(triggerBody())?['trava']
json(triggerBody())?['urgencia']
json(triggerBody())?['faixa']
json(triggerBody())?['nome']
json(triggerBody())?['email']
json(triggerBody())?['whatsapp']
json(triggerBody())?['mensagem']
```

Salve. O gatilho passa a exibir a **URL HTTP POST** — copie.

> **Por que `text/plain`?** O navegador faria uma verificação de CORS
> (preflight) num POST `application/json`, e o gatilho do Power Automate não
> responde a essa verificação. Enviando como texto puro a requisição vai
> direto, e o `json()` acima faz a conversão do outro lado.

## 3. Ligar o site ao fluxo

Na Vercel → projeto → **Settings → Environment Variables**:

- **Name**: `PUBLIC_CAPTURA_URL`
- **Value**: a URL copiada
- **Environments**: Production (e Preview, se quiser testar antes)

Depois **refaça o deploy** (Deployments → ⋯ → Redeploy). O valor é embutido no
build, então sem novo deploy o site continua sem endpoint.

## 4. Conferir

1. Abra o site, preencha o formulário e envie.
2. Em **Power Automate → Meus fluxos → seu fluxo → Histórico de execuções**,
   a execução aparece em segundos.
3. A linha nova está na planilha.

Se a execução não aparecer: confira se a variável está no ambiente certo, se o
deploy foi refeito e se a URL foi copiada inteira (ela termina com `&sig=...`).

## Sobre segurança

A URL fica no JavaScript do site, ou seja, é pública — qualquer pessoa pode
enviar POSTs e criar linhas. Isso é inerente a site estático sem servidor.
Formas de reduzir o risco:

- No fluxo, uma **condição** que descarta envios sem `nome` e `email` válidos.
- Se aparecer abuso, **regerar a URL** do gatilho (recriar o gatilho) e
  atualizar a variável na Vercel.
- Solução definitiva: mover o envio para uma **função serverless na Vercel**,
  guardando a URL do fluxo como variável **privada** (sem `PUBLIC_`). Isso
  exige o adaptador Vercel no Astro — posso implementar quando quiser.
