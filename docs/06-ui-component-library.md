# ProcessX - UI Component Library

## Design System

### Color Palette (Tailwind Config)

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  success: {
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    500: '#ef4444',
    600: '#dc2626',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}
```

### Typography
```javascript
fontFamily: {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-geist-mono)', 'monospace'],
}

fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
}
```

### Spacing System
```javascript
spacing: {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
}
```

---

## Core UI Components

### 1. Button Component

**Variants**: Primary, Secondary, Outline, Ghost, Danger
**Sizes**: Small, Medium, Large

```typescript
// /src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}
```

**Usage**:
```tsx
<Button variant="primary" size="md">Add Expense</Button>
<Button variant="outline" icon={<Plus />}>New Invoice</Button>
<Button variant="danger" loading>Deleting...</Button>
```

---

### 2. Input Components

#### Text Input
```typescript
interface InputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}
```

#### Currency Input
```typescript
interface CurrencyInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  currency?: string // Default 'ZAR'
  error?: string
}
```

#### Date Picker
```typescript
interface DatePickerProps {
  label?: string
  value: Date
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  error?: string
}
```

#### Select/Dropdown
```typescript
interface SelectProps {
  label?: string
  options: Array<{ label: string; value: string }>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  searchable?: boolean
}
```

---

### 3. Card Component

```typescript
interface CardProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}
```

**Usage**:
```tsx
<Card title="Total Expenses" subtitle="This month">
  <div className="text-3xl font-bold">R 45,230</div>
</Card>
```

---

### 4. Modal/Dialog

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

**Usage**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add New Expense"
  size="lg"
>
  <ExpenseForm />
</Modal>
```

---

### 5. Table Component

```typescript
interface TableProps<T> {
  columns: Array<{
    key: string
    label: string
    render?: (value: any, row: T) => React.ReactNode
  }>
  data: T[]
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyState?: React.ReactNode
}
```

**Usage**:
```tsx
<Table
  columns={[
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
    { key: 'category', label: 'Category' },
  ]}
  data={expenses}
  onRowClick={(expense) => handleEdit(expense)}
/>
```

---

### 6. Badge/Tag

```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
}
```

**Usage**:
```tsx
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Overdue</Badge>
```

---

### 7. Toast/Notification

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number // ms, default 5000
  action?: {
    label: string
    onClick: () => void
  }
}
```

**Usage**:
```typescript
toast.success('Expense added successfully')
toast.error('Failed to delete expense')
toast.warning('Session expires in 5 minutes', {
  action: { label: 'Extend', onClick: () => extendSession() }
})
```

---

### 8. Dropdown Menu

```typescript
interface DropdownMenuProps {
  trigger: React.ReactNode
  items: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'danger'
    disabled?: boolean
  }>
}
```

**Usage**:
```tsx
<DropdownMenu
  trigger={<Button>Actions</Button>}
  items={[
    { label: 'Edit', icon: <Edit />, onClick: handleEdit },
    { label: 'Delete', icon: <Trash />, onClick: handleDelete, variant: 'danger' },
  ]}
/>
```

---

### 9. Tabs

```typescript
interface TabsProps {
  tabs: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    content: React.ReactNode
  }>
  defaultTab?: string
  onChange?: (tabId: string) => void
}
```

**Usage**:
```tsx
<Tabs
  tabs={[
    { id: 'expenses', label: 'Expenses', content: <ExpensesList /> },
    { id: 'income', label: 'Income', content: <IncomeList /> },
  ]}
/>
```

---

### 10. Empty State

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

**Usage**:
```tsx
<EmptyState
  icon={<Receipt size={48} />}
  title="No expenses yet"
  description="Add your first expense to get started"
  action={{ label: 'Add Expense', onClick: handleAddExpense }}
/>
```

---

### 11. Loading Spinner

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
```

---

### 12. Pagination

```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
}
```

---

### 13. File Upload

```typescript
interface FileUploadProps {
  onUpload: (files: File[]) => void
  accept?: string // e.g., 'image/*,.pdf'
  maxSize?: number // bytes
  maxFiles?: number
  multiple?: boolean
  showPreview?: boolean
}
```

---

### 14. Chart Components

Using Chart.js or Recharts

```typescript
// Pie Chart for Category Breakdown
interface PieChartProps {
  data: Array<{ label: string; value: number; color?: string }>
}

// Line Chart for Trends
interface LineChartProps {
  data: Array<{ date: string; value: number }>
  xLabel?: string
  yLabel?: string
}

// Bar Chart for Comparisons
interface BarChartProps {
  data: Array<{ label: string; value: number }>
}
```

---

### 15. Avatar

```typescript
interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string // Initials
  size?: 'sm' | 'md' | 'lg'
}
```

---

### 16. Breadcrumbs

```typescript
interface BreadcrumbsProps {
  items: Array<{
    label: string
    href?: string
  }>
}
```

**Usage**:
```tsx
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Expenses', href: '/expenses' },
    { label: 'Details' },
  ]}
/>
```

---

### 17. Search Input

```typescript
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSearch?: (value: string) => void
  debounce?: number // ms
}
```

---

### 18. Toggle/Switch

```typescript
interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}
```

---

### 19. Progress Bar

```typescript
interface ProgressBarProps {
  value: number // 0-100
  max?: number
  label?: string
  showPercentage?: boolean
  color?: string
}
```

---

### 20. Accordion

```typescript
interface AccordionProps {
  items: Array<{
    title: string
    content: React.ReactNode
    defaultOpen?: boolean
  }>
  allowMultiple?: boolean
}
```

---

## Layout Components

### 1. Dashboard Layout
```tsx
<DashboardLayout>
  <Sidebar />
  <Header />
  <MainContent>
    {children}
  </MainContent>
</DashboardLayout>
```

### 2. Page Container
```tsx
<PageContainer title="Expenses" breadcrumbs={...} actions={...}>
  {children}
</PageContainer>
```

### 3. Grid System
```tsx
<Grid cols={3} gap={4}>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>
```

---

## Form Components

### 1. Form Wrapper (React Hook Form)
```tsx
<Form onSubmit={handleSubmit}>
  <FormField name="amount" label="Amount" required>
    <CurrencyInput />
  </FormField>
  <FormField name="category" label="Category">
    <Select options={categories} />
  </FormField>
  <FormActions>
    <Button variant="outline" onClick={onCancel}>Cancel</Button>
    <Button type="submit">Save</Button>
  </FormActions>
</Form>
```

---

## Responsive Design Breakpoints

```javascript
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

---

## Icon Library

Using **lucide-react**:

Common icons:
- Navigation: Menu, X, ChevronDown, ChevronRight
- Actions: Plus, Edit, Trash, Download, Upload, Search
- Status: Check, X, AlertCircle, Info
- Finance: DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard
- People: User, Users, UserPlus
- Files: File, FileText, Image, Paperclip
- Other: Calendar, Clock, Settings, Mail, Phone

---

## Animation Guidelines

- Button hover: scale(1.02) + brightness increase
- Card hover: subtle shadow elevation
- Modal enter: fade + slide from top
- Toast enter: slide from right + fade
- List items: stagger animation on load
- Loading states: skeleton loaders preferred over spinners

---

## Accessibility (a11y)

- All interactive elements keyboard accessible
- ARIA labels for icon-only buttons
- Focus indicators visible
- Color contrast meets WCAG AA
- Form errors announced to screen readers
- Skip navigation link
- Semantic HTML
