# ProcessX - User Flows

## 1. User Registration & Onboarding

### Flow: New User Sign Up
```
1. User visits processx.com
2. Clicks "Get Started" or "Sign Up"
3. Registration form appears:
   - Email address
   - Password (min 8 chars)
   - First name
   - Last name
4. User submits form
5. System validates:
   - Email not already registered
   - Password meets requirements
   - All fields filled
6. Account created (email_verified = false)
7. Verification email sent
8. User redirected to "Check your email" page
9. User clicks verification link in email
10. Email verified (email_verified = true)
11. User redirected to company setup
```

### Flow: Company Setup (First-time)
```
1. User lands on "Create Your Company" page
2. Form fields:
   - Company name (required)
   - Registration number (optional)
   - Tax number (optional)
   - Industry (dropdown, optional)
   - Fiscal year end (date picker)
3. User submits
4. Company created
5. User automatically added as "owner"
6. User redirected to dashboard
7. Welcome modal appears:
   - Quick tour option
   - "Add your first expense" CTA
   - "Invite team members" CTA
```

---

## 2. User Login

### Flow: Returning User Login
```
1. User visits processx.com/login
2. Login form:
   - Email
   - Password
   - "Remember me" checkbox
   - "Forgot password?" link
3. User submits
4. System validates credentials
5. If valid:
   - Session created
   - Load user's companies
   - If 1 company: redirect to dashboard
   - If multiple companies: show company selector
6. If invalid:
   - Show error message
   - Allow retry
```

### Flow: Password Reset
```
1. User clicks "Forgot password?"
2. Enter email address
3. Submit
4. System sends reset email (if account exists)
5. User clicks reset link
6. Reset password page:
   - New password
   - Confirm password
7. Submit
8. Password updated
9. Redirect to login
10. Show success message
```

---

## 3. Dashboard Navigation

### Flow: First Login (Empty State)
```
1. User lands on dashboard
2. Dashboard shows:
   - Welcome message with user's name
   - Empty state graphics
   - "Quick Actions" panel:
     - Add your first expense
     - Upload a receipt
     - Set up expense categories
     - Invite team members
   - Getting started checklist:
     ☐ Complete company profile
     ☐ Add your first expense
     ☐ Invite a team member
     ☐ Upload a receipt
```

### Flow: Dashboard with Data
```
1. User lands on dashboard
2. Dashboard displays:
   - Summary cards (top row):
     - Total Expenses (this month)
     - Total Income (this month)
     - Net Profit (this month)
     - Tax Deductible Expenses
   - Expense by category chart (pie/donut)
   - Recent expenses table (last 10)
   - Quick actions:
     - Add expense
     - Add income
     - Generate report
   - Alerts/notifications:
     - Pending approvals
     - Overdue invoices
     - Budget alerts
```

---

## 4. Expense Management

### Flow: Add New Expense
```
1. User clicks "Add Expense" button
2. Modal/form appears:
   - Date (date picker, defaults to today)
   - Amount (ZAR input)
   - Category (dropdown)
   - Vendor name (text input)
   - Payment method (dropdown)
   - Description (textarea, optional)
   - Tax deductible (checkbox, default checked)
   - Recurring (checkbox)
   - Upload receipt (file upload)
3. If recurring checked:
   - Show recurrence options:
     - Frequency (weekly/monthly/quarterly/annually)
     - End date (optional)
4. User fills form
5. User clicks "Save Expense"
6. Validation:
   - Amount > 0
   - Date not in future
   - Category selected
7. If valid:
   - Expense created
   - Receipt uploaded (if provided)
   - Success message
   - Form closes
   - Expense appears in list
8. If invalid:
   - Show error messages
   - Keep form open
```

### Flow: Upload Receipt
```
1. User clicks "Upload Receipt" in expense form
2. File picker opens
3. User selects file (JPEG, PNG, PDF)
4. System validates:
   - File type allowed
   - File size < 10MB
5. If valid:
   - Show preview
   - Display file name and size
   - Allow removal
6. On save:
   - Upload to cloud storage
   - Link to expense record
```

### Flow: Edit Expense
```
1. User clicks on expense in list
2. Expense detail modal opens
3. User clicks "Edit"
4. Form becomes editable
5. User makes changes
6. User clicks "Save"
7. Changes validated
8. Expense updated
9. Audit log created
10. Success message
11. Updated expense shown
```

### Flow: Delete Expense
```
1. User clicks delete icon on expense
2. Confirmation dialog appears:
   "Are you sure you want to delete this expense?"
   - Cancel
   - Delete (red button)
3. If Delete clicked:
   - Expense soft-deleted (or hard-deleted)
   - Success message
   - Expense removed from list
4. If Cancel:
   - Dialog closes
   - No action taken
```

### Flow: Filter/Search Expenses
```
1. User on expenses page
2. Filter panel available:
   - Date range (from/to date pickers)
   - Category (multi-select dropdown)
   - Payment method (multi-select)
   - Amount range (min/max)
   - Tax deductible only (checkbox)
   - Search box (vendor, description)
3. User applies filters
4. List updates in real-time
5. Show result count: "23 expenses found"
6. User can clear all filters
7. User can export filtered results
```

### Flow: Bulk Import Expenses
```
1. User clicks "Import Expenses"
2. Modal appears:
   - Download CSV template
   - Upload CSV file
   - Instructions for format
3. User uploads CSV
4. System validates format
5. Preview table shows:
   - Parsed expenses
   - Validation errors highlighted
6. User reviews and corrects errors
7. User clicks "Import X expenses"
8. Expenses created in bulk
9. Summary shown:
   - X imported successfully
   - Y errors
   - Error log downloadable
```

---

## 5. Team Management

### Flow: Invite Team Member
```
1. User (owner/admin) goes to Team page
2. Clicks "Invite Team Member"
3. Form appears:
   - Email address
   - Role (dropdown: Admin, Accountant, Viewer)
   - Personal message (optional)
4. User submits
5. System checks:
   - Email not already a member
   - Valid email format
6. Invitation created
7. Invitation email sent with:
   - Company name
   - Inviter name
   - Role being offered
   - "Accept Invitation" link
   - "Decline" link
8. Invitation appears in "Pending Invitations" list
9. Success message shown
```

### Flow: Accept Invitation
```
1. Invitee receives email
2. Clicks "Accept Invitation"
3. If invitee has account:
   - Login page
   - After login, auto-accept invitation
   - Added to company
   - Redirect to company dashboard
4. If invitee has no account:
   - Registration page
   - Pre-filled email (non-editable)
   - Complete registration
   - Auto-accept invitation
   - Added to company
   - Redirect to company dashboard
```

### Flow: Manage Team Member
```
1. User (owner/admin) on Team page
2. Team members list shown with:
   - Name
   - Email
   - Role
   - Status (active/pending)
   - Last active
   - Actions (Edit role, Remove)
3. User clicks "Edit Role"
4. Dropdown to change role
5. Confirmation: "Change [Name]'s role to [Role]?"
6. If confirmed:
   - Role updated
   - Member notified via email
   - Audit log created
7. User clicks "Remove"
8. Confirmation: "Remove [Name] from company?"
   - Warning: They will lose all access
9. If confirmed:
   - Member removed
   - Member notified via email
   - Member loses access immediately
```

---

## 6. Reporting

### Flow: Generate Expense Report
```
1. User goes to Reports page
2. Selects "Expense Report"
3. Filter options:
   - Date range (preset: This month, Last month, Quarter, Year, Custom)
   - Categories (multi-select)
   - Include/exclude tax deductible
4. User clicks "Generate Report"
5. Report displays:
   - Summary section:
     - Total expenses
     - Number of transactions
     - Average expense
     - Tax deductible total
   - Breakdown by category (table & chart)
   - Breakdown by payment method
   - List of all expenses in range
6. Export options:
   - PDF (formatted report)
   - Excel (detailed spreadsheet)
   - CSV (raw data)
7. User clicks export option
8. File generated and downloaded
```

### Flow: View Profit & Loss
```
1. User selects "Profit & Loss" report
2. Select period (month/quarter/year)
3. Report shows:
   - Income section:
     - Total income by type
     - Subtotal
   - Expense section:
     - Total expenses by category
     - Subtotal
   - Net profit/loss:
     - Income - Expenses
     - Profit margin %
   - Comparison to previous period
4. Visual chart shows income vs expenses trend
5. Export available (PDF/Excel)
```

---

## 7. Settings & Preferences

### Flow: Update Company Profile
```
1. User goes to Settings > Company
2. Form with current values:
   - Company details
   - Contact information
   - Address
   - Fiscal year
   - Logo upload
3. User edits fields
4. User clicks "Save Changes"
5. Validation performed
6. If valid:
   - Company updated
   - Success message
7. If invalid:
   - Error messages shown
   - Form stays open
```

### Flow: User Profile Settings
```
1. User clicks profile icon > Settings
2. Tabs available:
   - Profile (name, email, password)
   - Notifications (email preferences)
   - Security (2FA, sessions)
   - Preferences (timezone, date format, currency)
3. User updates settings
4. Changes saved per section
5. Success confirmation
```

---

## 8. Mobile Responsive Flows

### Key Differences on Mobile:
- Side navigation becomes hamburger menu
- Dashboard cards stack vertically
- Forms become full-screen modals
- Tables become card lists
- Filters collapse into drawer
- Quick actions in floating button
- Touch-optimized date pickers
- Camera integration for receipt capture

---

## 9. Error Handling Flows

### Flow: Session Expired
```
1. User inactive for > 7 days
2. User attempts action
3. Redirect to login with message:
   "Your session has expired. Please log in again."
4. After login, redirect to original destination
```

### Flow: Permission Denied
```
1. User attempts unauthorized action
2. Error message: "You don't have permission to perform this action"
3. Stay on current page
4. Log attempt in audit log
```

### Flow: Network Error
```
1. User attempts action
2. Network request fails
3. Show error toast:
   "Connection error. Please check your internet and try again."
4. Retry button available
5. Unsaved changes preserved
```

---

## 10. Onboarding Checklist

### First-Time User Completion:
- [ ] Email verified
- [ ] Company profile completed
- [ ] First expense added
- [ ] Receipt uploaded
- [ ] Team member invited
- [ ] First report generated
- [ ] Expense category customized

### Progress Indicator:
- Show completion % in dashboard
- Celebrate milestones
- Unlock features as completed
- Provide helpful tips
