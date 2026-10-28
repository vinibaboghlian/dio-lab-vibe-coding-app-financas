# 💰 FinFlow AI — Assistente de Finanças Pessoais com Vibe Coding

> Projeto desenvolvido como parte do desafio da certificação **DIO - Criando Apps com IA e Vibe Coding**.

## 📌 Visão Geral do Projeto

O **FinFlow AI** é uma aplicação web mobile-first voltada para a organização de finanças pessoais de forma natural e sem atrito. O projeto substitui o modelo tradicional de formulários burocráticos e planilhas complexas por uma interface conversacional orientada por Inteligência Artificial, combinada a um dashboard financeiro visual em tempo real.

O desenvolvimento seguiu integralmente o paradigma de **Vibe Coding**, atuando na concepção estratégica, design de requisitos (PRD) e direcionamento da IA no **Lovable**, sem a necessidade de digitação de código manual.

## 🚀 Funcionalidades Principais

1. **Registro Conversacional**: Lançamento de despesas e receitas usando linguagem natural simples (ex.: *"Gastei 42 reais na padaria hoje"* ou *"Recebi 1200 de freela"*).
2. **Classificação Automática de Gastos**: Identificação imediata da categoria (Alimentação, Transporte, Lazer, etc.) e renderização de cards com tags coloridas no chat.
3. **Dashboard Financeiro Reativo**: Painel consolidado com cards de Saldo Atual, Receitas, Despesas e gráfico de distribuição mensal.
4. **Gestão Visual de Metas**: Acompanhamento de objetivos de economia (ex.: Reserva de Emergência) com barras de progresso percentual e valores acumulados.
5. **Agente Consultor com Insights Práticos**: Dicas rápidas e microanálises de gastos acionadas por botões de atalho no chat.

## 🤖 Persona do Agente Financeiro

* **Nome**: Finny
* **Papel**: Consultor financeiro amigável focado em iniciantes.
* **Tom de Voz**: Empático, educativo, encorajador e livre de jargões bancários intimidador.
* **Comportamento**: Confirma os lançamentos extraídos, parabeniza avanços nas metas e sugere pequenas economias diárias sem julgamentos sobre o padrão de consumo do usuário.

## 🛠️ Tecnologias e Ferramentas

* **Geração e Vibe Coding**: [Lovable.dev](https://lovable.dev)
* **Frontend**: React + TypeScript + Vite
* **Estilização**: Tailwind CSS + Shadcn/ui
* **Ícones**: Lucide Icons
* **Gráficos**: Recharts
* **Gerenciamento de Estado**: React State / LocalStorage (com mock inicial completo para autonomia no plano gratuito)

## 📸 Demonstração da Aplicação

> *Dica: Tire capturas de tela da versão gerada no Lovable e substitua os links abaixo pelas imagens salvas na pasta `/assets` ou use um gravador de tela simples (ex.: Loom, Clipchamp ou gravação nativa).*

### 1. Conversa com o Agente e Lançamento de Despesa
*Demonstração do usuário digitando uma despesa em linguagem natural e o agente confirmando com card interativo.*

### 2. Dashboard e Visão Consolidada
*Exibição do saldo, resumo mensal de entradas/saídas e gráfico de despesas por categoria.*

### 3. Acompanhamento de Metas de Economia
*Barra de progresso interativa da Reserva de Emergência e Viagem.*

## 📋 PRD (Product Requirements Document) Utilizado

```text
# PROJETO: App de Organização de Finanças Pessoais com Vibe Coding
Atue como um Arquiteto de Software e Designer de Produto especialista no Lovable. Quero construir o MVP funcional de uma aplicação web mobile-first de finanças pessoais focada em linguagem natural e Vibe Coding, eliminando formulários manuais e planilhas complexas.

1. CONTEXTO E PROBLEMA
- Problema: Pessoas iniciantes abandonam o controle financeiro por causa do atrito de preencher formulários manuais exaustivos.
- Solução: Uma experiência conversacional e visual, onde o usuário registra entradas/saídas como se estivesse conversando com um consultor amigável.
- Público-Alvo: Iniciantes em educação financeira que buscam simplicidade prática.

2. PERSONA DO AGENTE
- Nome: Finny | Tom de voz: Empático, educativo, descontraído e em PT-BR.

3. FUNCIONALIDADES
- Input conversacional em linguagem natural.
- Classificação automática com badges visuais.
- Gestão de metas financeiras com barra de progresso.
- Dicas rápidas do agente financeiro via chips interativos.
- Dashboard simplificado com cards de saldo e gráfico donut.

4. DADOS MOCK
- Iniciar com 8 transações realistas pré-carregadas e 2 metas ativas para navegação imediata.
```

## 💡 Reflexão: O Paradoxo e o Poder do Vibe Coding

### 1. Como a clareza do PRD impactou o resultado gerado pela IA?
A experiência comprovou que a qualidade da saída de uma ferramenta geradora de código como o Lovable é diretamente proporcional à precisão das restrições e do contexto fornecidos. Ao estruturar antecipadamente a persona, os contratos de dados e a arquitetura visual, evitou-se o retrabalho e o consumo desnecessário da cota diária de interações do plano gratuito, obtendo um MVP funcional logo na primeira execução.

### 2. Quais foram as maiores vantagens em relação ao desenvolvimento tradicional?
A velocidade de prototipação foi incomparável. A transição entre o rascunho de requisitos e uma interface reativa, componentizada e esteticamente moderna com Tailwind CSS levou apenas alguns minutos. O foco do desenvolvedor migrou da sintaxe de código para a experiência do usuário e a lógica do produto.

### 3. Quais os cuidados necessários ao utilizar Vibe Coding em aplicações reais?
Embora o protótipo visual seja gerado com agilidade, aplicações críticas (como sistemas financeiros) exigem validação rigorosa de regras de negócio, tratamento determinístico de erros no parser de linguagem natural e garantia de segurança (como regras de RLS no banco de dados e sanitização de dados) antes de irem para produção.

## 👨‍💻 Autor

Desenvolvido por **Vinicius Baboghlian**

* [LinkedIn](https://www.linkedin.com/in/vinicius-cardoso-baboghlian-94252533/)
* [GitHub](https://github.com/vinibaboghlian)