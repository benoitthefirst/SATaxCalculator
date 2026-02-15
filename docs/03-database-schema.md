# ProcessX - Database Schema

## Overview
This document defines the database schema for ProcessX. The schema is designed to be PostgreSQL-compatible but can be adapted for other relational databases.

---

## Tables

### 1. users
Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

### 2. companies
Stores company/organization information.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  vat_number VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'South Africa',
  fiscal_year_end DATE,
  logo_url VARCHAR(500),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_created_by ON companies(created_by);
```

---

### 3. company_members
Junction table for users and companies with role information.

```sql
CREATE TABLE company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'accountant', 'viewer')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, user_id)
);

CREATE INDEX idx_company_members_company ON company_members(company_id);
CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_company_members_status ON company_members(status);
```

---

### 4. invitations
Stores pending team invitations.

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'accountant', 'viewer')),
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invitations_company ON invitations(company_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
```

---

### 5. expense_categories
Predefined and custom expense categories.

```sql
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color code
  icon VARCHAR(50),
  is_system BOOLEAN DEFAULT FALSE, -- System categories cannot be deleted
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, name)
);

CREATE INDEX idx_expense_categories_company ON expense_categories(company_id);
CREATE INDEX idx_expense_categories_active ON expense_categories(is_active);
```

---

### 6. expenses
Stores expense records.

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  expense_date DATE NOT NULL,
  vendor_name VARCHAR(255),
  description TEXT,
  payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'bank_transfer', 'credit_card', 'debit_card', 'eft', 'other')),
  is_tax_deductible BOOLEAN DEFAULT TRUE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50) CHECK (recurrence_pattern IN ('weekly', 'monthly', 'quarterly', 'annually')),
  recurrence_end_date DATE,
  parent_expense_id UUID REFERENCES expenses(id), -- For recurring expenses
  approval_status VARCHAR(50) DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_company ON expenses(company_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_expenses_approval_status ON expenses(approval_status);
```

---

### 7. expense_attachments
Stores receipt and document attachments for expenses.

```sql
CREATE TABLE expense_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER, -- Size in bytes
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expense_attachments_expense ON expense_attachments(expense_id);
```

---

### 8. clients
Stores client/customer information.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  tax_number VARCHAR(100),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'South Africa',
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_active ON clients(is_active);
```

---

### 9. income_types
Categories for income sources.

```sql
CREATE TABLE income_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, name)
);

CREATE INDEX idx_income_types_company ON income_types(company_id);
```

---

### 10. income
Stores income/revenue records.

```sql
CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  income_type_id UUID REFERENCES income_types(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  income_date DATE NOT NULL,
  payment_method VARCHAR(50),
  invoice_id UUID, -- Will reference invoices table
  description TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  recurrence_end_date DATE,
  parent_income_id UUID REFERENCES income(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_income_company ON income(company_id);
CREATE INDEX idx_income_client ON income(client_id);
CREATE INDEX idx_income_date ON income(income_date);
CREATE INDEX idx_income_created_by ON income(created_by);
```

---

### 11. invoices
Stores invoice records.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partial')),
  subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 15.00, -- VAT rate
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'ZAR',
  notes TEXT,
  terms TEXT,
  sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

---

### 12. invoice_line_items
Stores line items for invoices.

```sql
CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(15, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_line_items_invoice ON invoice_line_items(invoice_id);
```

---

### 13. payments
Stores payment records linked to invoices.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id),
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_company ON payments(company_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
```

---

### 14. audit_logs
Tracks all changes for compliance and audit purposes.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
  entity_type VARCHAR(50) NOT NULL, -- 'expense', 'income', 'invoice', etc.
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

### 15. budgets
Stores budget allocations by category.

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id),
  period_type VARCHAR(50) CHECK (period_type IN ('monthly', 'quarterly', 'annually')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  alert_threshold DECIMAL(5, 2) DEFAULT 80.00, -- Alert when 80% spent
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_company ON budgets(company_id);
CREATE INDEX idx_budgets_category ON budgets(category_id);
CREATE INDEX idx_budgets_dates ON budgets(start_date, end_date);
```

---

## Relationships Summary

```
users (1) ----< (M) company_members (M) >---- (1) companies
users (1) ----< (M) invitations
companies (1) ----< (M) invitations
companies (1) ----< (M) expense_categories
companies (1) ----< (M) expenses
expense_categories (1) ----< (M) expenses
expenses (1) ----< (M) expense_attachments
companies (1) ----< (M) clients
companies (1) ----< (M) income_types
companies (1) ----< (M) income
clients (1) ----< (M) income
income_types (1) ----< (M) income
companies (1) ----< (M) invoices
clients (1) ----< (M) invoices
invoices (1) ----< (M) invoice_line_items
invoices (1) ----< (M) payments
companies (1) ----< (M) payments
clients (1) ----< (M) payments
companies (1) ----< (M) audit_logs
companies (1) ----< (M) budgets
expense_categories (1) ----< (M) budgets
```

---

## Seed Data

### Default Expense Categories

```sql
INSERT INTO expense_categories (name, description, is_system, is_active) VALUES
('Travel & Transportation', 'Business travel, fuel, vehicle expenses', TRUE, TRUE),
('Office Supplies', 'Stationery, printer supplies, office equipment', TRUE, TRUE),
('Utilities', 'Electricity, water, internet, phone', TRUE, TRUE),
('Rent & Lease', 'Office rent, equipment leasing', TRUE, TRUE),
('Salaries & Wages', 'Employee salaries, wages, bonuses', TRUE, TRUE),
('Professional Fees', 'Legal, accounting, consulting fees', TRUE, TRUE),
('Equipment', 'Computers, machinery, tools', TRUE, TRUE),
('Marketing & Advertising', 'Ads, promotional materials, marketing campaigns', TRUE, TRUE),
('Insurance', 'Business insurance, liability coverage', TRUE, TRUE),
('Licenses & Permits', 'Business licenses, permits, certifications', TRUE, TRUE),
('Maintenance & Repairs', 'Equipment repairs, building maintenance', TRUE, TRUE),
('Subscriptions', 'Software subscriptions, memberships', TRUE, TRUE),
('Other', 'Miscellaneous business expenses', TRUE, TRUE);
```

### Default Income Types

```sql
INSERT INTO income_types (name, description, is_system, is_active) VALUES
('Sales', 'Product sales revenue', TRUE, TRUE),
('Services', 'Service-based revenue', TRUE, TRUE),
('Interest', 'Interest income', TRUE, TRUE),
('Dividends', 'Dividend income', TRUE, TRUE),
('Rental Income', 'Property rental income', TRUE, TRUE),
('Royalties', 'Royalty payments', TRUE, TRUE),
('Other', 'Other income sources', TRUE, TRUE);
```

---

## Data Migration Notes

- All existing tax calculator data is standalone (no database currently)
- No data migration needed from current version
- Fresh start with new schema
- Tax calculators will remain as tools, not data-driven features initially
