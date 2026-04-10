# FinDash Dark Premium V2 - Design System Oficial

**STATUS**: CONGELADO - CHECKPOINT V2
**DATA**: 2025-01-XX
**VERSÃO**: 2.0

---

## ⚠️ AVISO CRÍTICO

Este Design System está **CONGELADO** e é o **PADRÃO OFICIAL** do FinDash Pro.
Nenhuma modificação visual é permitida sem autorização explícita.

---

## 🎨 Identidade Visual Premium

### Paleta de Cores Oficial

#### Background System
- **Background Principal**: `bg-background` (dark premium)
  - Escala: Preto/cinza profundo com sutis tons de cinza
  - Uso: Fundo principal da aplicação
- **Background Secundário**: `bg-card` (cards escuros)
  - Escala: Cinza escuro levemente mais claro que o background
  - Uso: Cards, modais, painéis

#### Texto System
- **Texto Primário**: `text-foreground` (branco premium)
  - Uso: Títulos, números principais, texto de destaque
- **Texto Secundário**: `text-muted-foreground` (cinza claro)
  - Uso: Labels, descrições, texto de apoio

#### Cores Semânticas
- **Receitas/Positivo**: `text-emerald-600 dark:text-emerald-400`
  - Uso: Entradas, saldo positivo, limite disponível
- **Despesas/Negativo**: `text-rose-600 dark:text-rose-400`
  - Uso: Saídas, faturas, valores negativos
- **Ativação/Highlight**: `text-primary` (cor primária do tema)
  - Uso: Elementos ativos, melhor dia de compra

#### Border System
- **Bordas Padrão**: `border` (suaves, sutis)
  - Cor: Cinza escuro com baixa opacidade
  - Espessura: 1px padrão, 2px para elementos destacados
- **Bordas de Cards**: `border-2` (cards destacados)

#### Navegação
- **Item Ativo**: `bg-primary text-primary-foreground`
  - Card claro com contraste premium
  - Sombra discreta: `shadow-sm`
- **Item Inativo**: `text-muted-foreground hover:bg-accent hover:text-accent-foreground`
  - Transparente com hover sutil

---

## 📐 Layout & Grid

### Estrutura Global
- **Sidebar**: Largura fixa de 256px (w-64)
  - Posição: Fixed à esquerda
  - Altura: 100vh (h-screen)
  - Transição: `duration-300` para mobile

- **Main Content**: Margem esquerda dinâmica
  - Com sidebar: `ml-64`
  - Sem sidebar: `ml-0`
  - Transição: `duration-300`

- **Header**: Altura fixa de 64px (h-16)
  - Posição: Sticky no topo
  - Backdrop blur suave

- **Footer**: Altura fixa de 48px (h-12)
  - Posição: Fixed na parte inferior
  - Sticky com push natural no overflow
  - Z-index: 40

### Grid System
- **Stats Cards**: `grid gap-4 md:grid-cols-2 lg:grid-cols-4`
- **Charts Section**: `grid gap-4 md:grid-cols-2`
- **Credit Cards**: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`

---

## 🎯 Componentes

### Sidebar
```tsx
// Estrutura
<aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-card">
  {/* Logo area */}
  {/* Navigation items */}
  {/* Settings */}
</aside>
```

**Navegação Ativa**:
- Background: `bg-primary`
- Texto: `text-primary-foreground`
- Sombra: `shadow-sm`
- Border radius: `rounded-lg`

**Navegação Inativa**:
- Background: Transparente
- Texto: `text-muted-foreground`
- Hover: `hover:bg-accent hover:text-accent-foreground`
- Border radius: `rounded-lg`

### Stats Cards (KPIs)
```tsx
// Card Structure
<Card className="overflow-hidden border-2">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">{title}</CardTitle>
    <div className={cn('rounded-lg p-2', bgColor)}>
      <Icon className={cn('h-4 w-4', color)} />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
      {/* Trend indicator */}
    </div>
  </CardContent>
</Card>
```

**Características**:
- Border: `border-2` (destacado)
- Ícones em containers coloridos
- Valores em `text-2xl font-bold`
- Tendências em `text-xs text-muted-foreground`
- Cores semânticas para ícones (verde para positivo, vermelho para negativo)

### Credit Cards (Premium)
```tsx
// Card Structure
<Card className="group overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02] hover:shadow-xl">
  {/* Gradient card face */}
  <div className={cn('relative h-48 bg-gradient-to-br p-6 text-white', getGradient())}>
    {/* Content */}
  </div>
  {/* Details section */}
  <CardContent className="space-y-3 p-4">
    {/* Progress, limits, info */}
  </CardContent>
</Card>
```

**Gradientes por Bandeira**:
- **Visa**: `from-blue-600 to-blue-800`
- **Mastercard**: `from-orange-600 to-red-700`
- **Amex**: `from-gray-700 to-gray-900`
- **Elo**: `from-red-600 to-yellow-600`
- **Hipercard**: `from-yellow-600 to-yellow-800`

**Elementos do Card**:
- Altura do card visual: `h-48` (192px)
- Background pattern com blur
- Ícone da bandeira em container `bg-white/20 backdrop-blur-sm`
- Número mascarado com destaque nos últimos 4 dígitos
- Vencimento e fechamento no rodapé do card visual

**Detalhes Section**:
- Progress bar: `h-2`
- Grid de 3 colunas: Total, Disponível, Fatura
- Info row com badge de melhor dia
- Best day highlight com `bg-primary/10`

### Modals
```tsx
// Modal Structure
<DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>{title}</DialogTitle>
  </DialogHeader>
  <form>
    <div className="grid gap-4 py-4">
      {/* Form fields */}
    </div>
    <DialogFooter>
      {/* Actions */}
    </DialogFooter>
  </form>
</DialogContent>
```

**Características**:
- Largura: `sm:max-w-[425px]` (edit cards), `sm:max-w-[500px]` (transactions)
- Background: `bg-card` (escuro premium)
- Spacing: `grid gap-4 py-4` para campos

---

## 📏 Espaçamento

### Padrões
- **Padding Cards**: `p-4` ou `p-6`
- **Gap Grid**: `gap-4`, `gap-6`
- **Padding Sections**: `p-4 md:p-6`
- **Padding Bottom Main**: `pb-20` (espaço para footer sticky)

### Component-Specific
- **Stats Cards Header**: `pb-2`
- **Stats Cards Content**: `mt-1` para tendências
- **Credit Card Content**: `space-y-3 p-4`
- **Modal Form**: `py-4`
- **Modal Footer**: Espaçamento automático

---

## ✨ Tipografia

### Fontes
- **Font Family**: Geist Sans (principal), Geist Mono (monospaced)
- **Weights**:
  - Regular: `font-normal`
  - Medium: `font-medium`
  - Bold: `font-bold`

### Tamanhos
- **H1 (Page Title)**: `text-2xl font-bold tracking-tight`
- **H2 (Section Title)**: `text-2xl font-bold tracking-tight`
- **Card Title**: `text-sm font-medium`
- **KPI Value**: `text-2xl font-bold`
- **Body Text**: Tamanho padrão (base)
- **Small Text**: `text-xs`
- **Caption**: `text-[10px]`

### Cores de Texto
- **Títulos**: `text-foreground` (branco)
- **Valores Numéricos**: `text-foreground` (branco)
- **Labels**: `text-muted-foreground` (cinza claro)
- **Descrições**: `text-muted-foreground` (cinza claro)
- **Receitas**: `text-emerald-600 dark:text-emerald-400`
- **Despesas**: `text-rose-600 dark:text-rose-400`

---

## 🎭 Efeitos & Animações

### Transições
- **Hover Cards**: `transition-all hover:scale-[1.02] hover:shadow-xl`
- **Sidebar Toggle**: `transition-transform duration-300`
- **Main Content**: `transition-all duration-300`
- **Modal Open**: Transições padrão do Radix UI

### Sombras
- **Cards Padrão**: Sombra sutil do componente Card
- **Cards Hover**: `hover:shadow-xl`
- **Navegação Ativa**: `shadow-sm`
- **Modal**: Sombra padrão do Dialog

### Blur Effects
- **Header**: `backdrop-blur supports-[backdrop-filter]:bg-background/60`
- **Footer**: `backdrop-blur supports-[backdrop-filter]:bg-background/60`
- **Card Icons**: `backdrop-blur-sm`
- **Patterns**: `blur-2xl`, `blur-3xl`

### Opacidade
- **Background Patterns**: `opacity-10`
- **Disabled Elements**: Variável do componente
- **Overlay Elements**: `bg-white/20`, `bg-white/10`

---

## 📱 Responsividade

### Breakpoints
- **Mobile**: Padrão (sem prefixo)
- **Tablet**: `md:`
- **Desktop**: `lg:`

### Grid Responsivo
- **Stats**: 1 coluna (mobile) → 2 colunas (md) → 4 colunas (lg)
- **Charts**: 1 coluna (mobile) → 2 colunas (md)
- **Credit Cards**: 1 coluna (mobile) → 2 colunas (md) → 3 colunas (lg)

### Mobile-Specific
- **Sidebar**: Toggle button em mobile, `-translate-x-full` quando fechada
- **Header**: Menu button visível apenas em mobile (`md:hidden`)
- **Padding**: `p-4` em mobile, `p-6` em desktop
- **Modals**: Full width em mobile pequeno

---

## 🎨 Cores Específicas

### Cards KPIs
- **Background**: Card escuro padrão
- **Border**: `border-2`
- **Icon Backgrounds**:
  - Verde: `bg-emerald-100 dark:bg-emerald-900/20`
  - Vermelho: `bg-rose-100 dark:bg-rose-900/20`
  - Laranja: `bg-orange-100 dark:bg-orange-900/20`

### Best Day Highlight
- **Background**: `bg-primary/10`
- **Text**: `text-primary`
- **Icon**: `text-primary`

### Progress Bar
- **Background**: Padrão do componente
- **Height**: `h-2`

---

## 🚫 PROIBIÇÕES

**NUNCA** alterar sem autorização:
- ❌ Background dark premium
- ❌ Sidebar escura
- ❌ Card ativo claro na navegação
- ❌ Cards KPIs escuros
- ❌ Números em branco
- ❌ Receitas em verde
- ❌ Despesas em vermelho
- ❌ Bordas suaves
- ❌ Sombras discretas
- ❌ Contraste premium
- ❌ Tipografia atual
- ❌ Espaçamento atual
- ❌ Layout structure
- ❌ Grid system
- ❌ Responsividade

---

## 📋 Aplicação Futura

Este Design System V2 aplica-se a TODAS as features futuras:

- ✅ Cartões (já implementado)
- ⏳ Metas financeiras
- ⏳ Investimentos
- ⏳ IA Insights
- ⏳ Exportação PDF
- ⏳ Qualquer nova feature

**REGRA**: Qualquer modificação visual requer aprovação explícita.

---

## 📝 Notas de Implementação

### Tailwind CSS 4
- Usando variáveis CSS do tema (`bg-primary`, `text-foreground`, etc.)
- Dark mode via `dark:` prefix
- Utilização de `cn()` para classes condicionais

### Componentes shadcn/ui
- Card, Dialog, Button, Input, Label, Select, Progress, Badge
- Customização mantida conforme Design System
- Sem modificação dos componentes base

### next-themes
- `defaultTheme="system"`
- `attribute="class"`
- `enableSystem`
- `disableTransitionOnChange`

---

**ASSINATURA**: Design System V2 Congelado
**VALIDADE**: Indeterminada até nova autorização
**RESPONSÁVEL**: Equipe FinDash Pro
