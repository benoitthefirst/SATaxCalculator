# ProcessX Feature Testing Checklist

Use this checklist to test all features on the ProcessX platform.

---

## 1. Authentication & User Management

### 1.1 Registration
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| New user registration | Go to /register, fill form, submit | Account created, redirected to onboarding | ⬜ | |
| Welcome email sent | Register new account | Welcome email received | ⬜ | Requires SMTP config |
| Duplicate email | Register with existing email | Error: "Email already registered" | ⬜ | |
| Weak password | Use password < 8 chars | Error: "Password must be at least 8 characters" | ⬜ | |

### 1.2 Login
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Valid login | Enter correct credentials | Redirected to dashboard | ⬜ | |
| Invalid password | Enter wrong password | Error message shown | ⬜ | |
| Non-existent email | Enter unregistered email | Error message shown | ⬜ | |

### 1.3 Password Reset
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Request reset | Go to /forgot-password, enter email | Success message shown | ⬜ | |
| Reset email sent | Request password reset | Reset email received with link | ⬜ | Requires SMTP config |
| Valid reset link | Click link in email | Reset form shown with user's name | ⬜ | |
| Expired reset link | Use link after 1 hour | Error: "Reset link has expired" | ⬜ | |
| Reset password | Enter new password, submit | Success, redirected to login | ⬜ | |

### 1.4 Change Password (Authenticated)
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Change password | Settings > Change Password, fill form | Password updated successfully | ⬜ | |
| Wrong current password | Enter incorrect current password | Error shown | ⬜ | |

---

## 2. Company Management

### 2.1 Company Onboarding
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Create first company | Complete onboarding form | Company created, redirected to dashboard | ⬜ | |
| Required fields | Submit with empty company name | Validation error | ⬜ | |

### 2.2 Multi-Company (Business Plan)
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Create additional company | Click "Create New Company" in switcher | New company form shown | ⬜ | Business plan only |
| Switch companies | Click company in switcher dropdown | Dashboard reloads with new company data | ⬜ | |
| Data isolation | Switch companies, check data | Each company shows its own data | ⬜ | |
| Company limit (Starter) | Try to create 2nd company on Starter | Upgrade prompt shown | ⬜ | |

### 2.3 Company Settings
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Update company info | Settings > Company, edit fields | Changes saved | ⬜ | |
| VAT registration | Add VAT number | VAT fields appear in income/expenses | ⬜ | |

---

## 3. Team Management

### 3.1 Team Invitations
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Send invite | Settings > Team > Invite Member | Invite created, email sent | ⬜ | |
| Invite email received | Send invite | Invitee receives branded email | ⬜ | Requires SMTP config |
| Duplicate invite | Invite same email twice | Error: "Invitation already sent" | ⬜ | |
| Cancel invite | Click Cancel on pending invite | Invite removed from list | ⬜ | |
| Team member limit | Exceed plan limit | Error with upgrade prompt | ⬜ | |

### 3.2 Accepting Invitations
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Accept invite (new user) | Click link, register account | Account created, joined company | ⬜ | |
| Accept invite (existing user) | Click link, login if needed | Joined company | ⬜ | |
| Invite accepted email | Accept invitation | Inviter receives notification email | ⬜ | Requires SMTP config |
| Wrong email | Login with different email than invite | Error: "Wrong account" with sign out option | ⬜ | |
| Expired invite | Use link after 7 days | Error: "Invitation has expired" | ⬜ | |

### 3.3 Team Member Management
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View team members | Settings > Team | All active members listed | ⬜ | |
| Change member role | Click Edit on member, change role | Role updated | ⬜ | Owner/Admin only |
| Remove member | Click Remove on member | Member deactivated | ⬜ | Owner/Admin only |
| Cannot remove owner | Try to remove owner | No remove option shown | ⬜ | |

### 3.4 Role Permissions
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Owner access | Login as owner | Full access to all features | ⬜ | |
| Admin access | Login as admin | Can manage team (not other admins) | ⬜ | |
| Accountant access | Login as accountant | Can view/edit financial data | ⬜ | |
| Viewer access | Login as viewer | Read-only access | ⬜ | |

---

## 4. Subscription & Billing

### 4.1 View Subscription
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View current plan | Settings > Subscription | Current plan and usage shown | ⬜ | |
| Usage meters | Check usage section | Transactions and team members shown | ⬜ | |

### 4.2 Upgrade Subscription
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View upgrade options | Settings > Subscription | Professional/Business plans shown | ⬜ | |
| Monthly/Yearly toggle | Click toggle | Prices update (17% yearly discount) | ⬜ | |
| Start checkout | Click upgrade button | Redirected to PayFast | ⬜ | |
| Subscription created email | Complete payment | Confirmation email received | ⬜ | Requires SMTP config |

### 4.3 Cancel Subscription
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Cancel subscription | Click Cancel, confirm | Status shows "Cancelling" | ⬜ | |
| Cancellation email | Cancel subscription | Confirmation email received | ⬜ | Requires SMTP config |
| Access until period end | After cancellation | Features still work until period end | ⬜ | |

### 4.4 Payment Notifications
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Payment success email | Recurring payment processed | Payment confirmation email | ⬜ | Via PayFast webhook |
| Payment failed email | Payment fails | Alert email with retry info | ⬜ | Via PayFast webhook |

---

## 5. Income Management

### 5.1 Add Income
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add income entry | Income > Add Income, fill form | Entry created, appears in list | ⬜ | |
| Required fields | Submit with empty fields | Validation errors shown | ⬜ | |
| VAT calculation | Enter amount, select VAT rate | VAT calculated automatically | ⬜ | VAT registered only |
| Attach receipt | Upload file | File attached to entry | ⬜ | |

### 5.2 View/Edit Income
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View income list | Go to Income page | All income entries listed | ⬜ | |
| Filter by category | Select category filter | List filtered | ⬜ | |
| Filter by date | Select year/month | List filtered | ⬜ | |
| Search income | Enter search term | Results filtered | ⬜ | |
| Edit income | Click entry, edit, save | Changes saved | ⬜ | |
| Delete income | Click delete, confirm | Entry removed | ⬜ | |

### 5.3 Income Analytics
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View analytics | Income > Analytics | Charts and stats shown | ⬜ | |
| Category breakdown | Check pie chart | Income by category shown | ⬜ | |

---

## 6. Expense Management

### 6.1 Add Expense
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add expense entry | Expenses > Add Expense, fill form | Entry created | ⬜ | |
| Tax deductible toggle | Mark as deductible | Deduction percentage field appears | ⬜ | |
| VAT input | Enter VAT amount | VAT recorded | ⬜ | VAT registered only |
| Attach receipt | Upload file | File attached | ⬜ | |

### 6.2 View/Edit Expenses
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View expense list | Go to Expenses page | All expenses listed | ⬜ | |
| Filter by category | Select category | List filtered | ⬜ | |
| Filter by deductibility | Toggle filter | List filtered | ⬜ | |
| Edit expense | Click entry, edit, save | Changes saved | ⬜ | |
| Delete expense | Click delete, confirm | Entry removed | ⬜ | |

### 6.3 Recurring Expenses
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Create recurring expense | Expenses > Recurring > Add | Recurring expense created | ⬜ | |
| View recurring | Go to Recurring tab | All recurring expenses shown | ⬜ | |
| Pause recurring | Click pause | Status changed to paused | ⬜ | |

---

## 7. Vehicle Logbook

### 7.1 Add Trip
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Log new trip | Logbook > Log Trip | Trip recorded | ⬜ | |
| Business vs Personal | Select trip type | Correct categorization | ⬜ | |
| Opening/closing odometer | Enter readings | Distance calculated | ⬜ | |
| Distance validation | Closing < Opening | Error shown | ⬜ | |

### 7.2 View Logbook
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View trips | Go to Logbook page | All trips listed | ⬜ | |
| Filter by type | Select Business/Personal | List filtered | ⬜ | |
| Business percentage | Check summary | Correct % calculated | ⬜ | |
| Edit trip | Click trip, edit, save | Changes saved | ⬜ | |
| Delete trip | Click delete, confirm | Trip removed | ⬜ | |

---

## 8. Asset Management

### 8.1 Add Asset
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add new asset | Assets > Add Asset | Asset created | ⬜ | |
| Select asset type | Choose type | Depreciation rate auto-filled | ⬜ | |
| Depreciation method | Select method | Method applied | ⬜ | |
| Purchase details | Enter cost, date | Values saved | ⬜ | |

### 8.2 View Assets
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View asset list | Go to Assets page | All assets listed | ⬜ | |
| Current value | Check asset | Depreciated value shown | ⬜ | |
| Depreciation schedule | View asset details | Schedule displayed | ⬜ | |
| Edit asset | Click asset, edit, save | Changes saved | ⬜ | |
| Dispose asset | Mark as disposed | Asset marked disposed | ⬜ | |

---

## 9. Reports

### 9.1 Profit & Loss Report
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Generate P&L | Reports > Profit & Loss | Report displayed | ⬜ | |
| Select period | Choose date range | Report updates | ⬜ | |
| Export PDF | Click Export | PDF downloaded | ⬜ | |

### 9.2 Tax Computation
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View tax computation | Reports > Tax Computation | Tax calculation shown | ⬜ | |
| Select tax year | Choose year | Computation updates | ⬜ | |
| Deductions applied | Check deductions | All deductions listed | ⬜ | |

### 9.3 Deduction Summary
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View deductions | Reports > Deduction Summary | All deductions listed | ⬜ | |
| Category breakdown | Check categories | Grouped by category | ⬜ | |

---

## 10. Dashboard

### 10.1 Overview
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View dashboard | Go to Dashboard | All widgets displayed | ⬜ | |
| Income summary | Check income card | Correct total shown | ⬜ | |
| Expense summary | Check expense card | Correct total shown | ⬜ | |
| Tax estimate | Check tax card | Estimated tax shown | ⬜ | |

### 10.2 Tax Year Selection
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Change tax year | Select different year | Dashboard updates | ⬜ | |
| Fiscal year dates | Check date range | Mar 1 - Feb 28/29 | ⬜ | |

### 10.3 Quick Actions
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add Income button | Click + Add Income | Income form opens | ⬜ | |
| Add Expense button | Click + Add Expense | Expense form opens | ⬜ | |
| Log Trip button | Click + Log Trip | Logbook form opens | ⬜ | |

---

## 11. Feature Gating (Subscription Limits)

### 11.1 Starter Plan Limits
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Transaction limit | Add >50 transactions/month | Upgrade prompt shown | ⬜ | |
| Team member limit | Try to invite 2nd member | Upgrade prompt shown | ⬜ | |
| Company limit | Try to create 2nd company | Upgrade prompt shown | ⬜ | |

### 11.2 Professional Plan Limits
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Unlimited transactions | Add many transactions | No limit | ⬜ | |
| 5 team members | Invite up to 5 | Allowed | ⬜ | |
| 6th team member | Try to invite 6th | Upgrade prompt shown | ⬜ | |

### 11.3 Business Plan
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Unlimited everything | Test all limits | No restrictions | ⬜ | |
| Multiple companies | Create multiple | All allowed | ⬜ | |

### 11.4 Subscriptions Disabled (Admin Setting)
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| All features unlocked | Disable subscriptions in admin | All features work without limits | ⬜ | |

---

## 12. Admin Panel

### 12.1 Dashboard
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View admin dashboard | Go to /admin | Stats displayed | ⬜ | Admin only |
| User count | Check users stat | Correct count | ⬜ | |
| Company count | Check companies stat | Correct count | ⬜ | |

### 12.2 User Management
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View users | Admin > Users | User list shown | ⬜ | |
| Search users | Enter search term | Results filtered | ⬜ | |
| Deactivate user | Click deactivate | User deactivated | ⬜ | |

### 12.3 Company Management
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View companies | Admin > Companies | Company list shown | ⬜ | |
| View company details | Click company | Details shown | ⬜ | |

### 12.4 Subscription Plans
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View plans | Admin > Subscriptions > Plans | All plans listed | ⬜ | |
| Edit plan | Click edit, change fields | Plan updated | ⬜ | |
| Toggle plan active | Click toggle | Plan enabled/disabled | ⬜ | |

### 12.5 Settings
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Toggle subscriptions | Admin > Settings | Enable/disable subscriptions | ⬜ | |
| Maintenance mode | Toggle maintenance | Site shows maintenance page | ⬜ | |

---

## 13. Email Notifications Summary

| Email Type | Trigger | Recipient | Status |
|------------|---------|-----------|--------|
| Welcome | User registration | New user | ⬜ |
| Password Reset | Forgot password request | User | ⬜ |
| Team Invite | Send team invitation | Invitee | ⬜ |
| Invite Accepted | Accept invitation | Inviter | ⬜ |
| Subscription Created | First payment | Company owner | ⬜ |
| Payment Success | Recurring payment | Company owner | ⬜ |
| Payment Failed | Payment fails | Company owner | ⬜ |
| Subscription Cancelled | Cancel subscription | User | ⬜ |

---

## Environment Setup for Testing

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Email (for email testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=ProcessX <your-email@gmail.com>

# PayFast (for subscription testing)
PAYFAST_MERCHANT_ID=...
PAYFAST_MERCHANT_KEY=...
PAYFAST_PASSPHRASE=...
PAYFAST_SANDBOX=true
```

### Test Accounts
| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Owner | | | Create during testing |
| Admin | | | Invite from owner account |
| Accountant | | | Invite from owner account |
| Viewer | | | Invite from owner account |
| Super Admin | | | Seeded in database |

---

## Status Legend
- ⬜ Not tested
- ✅ Passed
- ❌ Failed
- ⏸️ Blocked
- 🔄 In progress

---

## Notes Section
Use this area to document any bugs, issues, or observations during testing.

### Bugs Found
| ID | Feature | Description | Severity | Status |
|----|---------|-------------|----------|--------|
| | | | | |

### Observations
-
-
-
