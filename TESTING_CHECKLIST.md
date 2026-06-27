# ProcessX Feature Testing Checklist

Use this checklist to test all features on the ProcessX platform.

**Version:** 2.0
**Last Updated:** June 2025
**Platform URL:** https://processx.co.za

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

## 5. Dashboard

### 5.1 Overview
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View dashboard | Go to /dashboard | All widgets displayed | ⬜ | |
| Sidebar navigation | Click sidebar items | Navigate to correct pages | ⬜ | |
| Mobile sidebar | On mobile, click hamburger | Sidebar opens/closes | ⬜ | |
| Income summary | Check income card | Correct total shown | ⬜ | |
| Expense summary | Check expense card | Correct total shown | ⬜ | |
| Tax estimate | Check tax card | Estimated tax shown | ⬜ | |

### 5.2 Tax Year Selection
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Change tax year | Select different year | Dashboard updates | ⬜ | |
| Fiscal year dates | Check date range | Mar 1 - Feb 28/29 | ⬜ | |

### 5.3 Quick Actions
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add Income button | Click + Add Income | Income form opens | ⬜ | |
| Add Expense button | Click + Add Expense | Expense form opens | ⬜ | |
| Log Trip button | Click + Log Trip | Logbook form opens | ⬜ | |

### 5.4 Company Switcher
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Company name displayed | Check sidebar | Current company shown | ⬜ | |
| Switch company | Click switcher, select other | Dashboard refreshes with new data | ⬜ | Multi-company only |

---

## 6. Income Management

### 6.1 Add Income
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add income entry | Income > Add Income, fill form | Entry created, appears in list | ⬜ | |
| Required fields | Submit with empty fields | Validation errors shown | ⬜ | |
| VAT calculation | Enter amount, select VAT rate | VAT calculated automatically | ⬜ | VAT registered only |
| Attach receipt | Upload file | File attached to entry | ⬜ | |

### 6.2 View/Edit Income
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View income list | Go to Income page | All income entries listed | ⬜ | |
| Filter by category | Select category filter | List filtered | ⬜ | |
| Filter by date | Select year/month | List filtered | ⬜ | |
| Search income | Enter search term | Results filtered | ⬜ | |
| Edit income | Click entry, edit, save | Changes saved | ⬜ | |
| Delete income | Click delete, confirm | Entry removed | ⬜ | |
| Pagination | Navigate pages | Correct data shown | ⬜ | |

### 6.3 Income Analytics
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View analytics | Income > Analytics | Charts and stats shown | ⬜ | |
| Category breakdown | Check pie chart | Income by category shown | ⬜ | |
| Trend chart | Check line chart | Income over time shown | ⬜ | |

### 6.4 Income Export
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Export to CSV | Click Export | CSV file downloaded | ⬜ | |
| Export filtered | Apply filter, then export | Only filtered data exported | ⬜ | |

---

## 7. Expense Management

### 7.1 Add Expense
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add expense entry | Expenses > Add Expense, fill form | Entry created | ⬜ | |
| Tax deductible toggle | Mark as deductible | Deduction percentage field appears | ⬜ | |
| VAT input | Enter VAT amount | VAT recorded | ⬜ | VAT registered only |
| Attach receipt | Upload file | File attached | ⬜ | |
| Multiple attachments | Upload multiple files | All files attached | ⬜ | |

### 7.2 View/Edit Expenses
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View expense list | Go to Expenses page | All expenses listed | ⬜ | |
| Filter by category | Select category | List filtered | ⬜ | |
| Filter by deductibility | Toggle filter | List filtered | ⬜ | |
| Edit expense | Click entry, edit, save | Changes saved | ⬜ | |
| Delete expense | Click delete, confirm | Entry removed | ⬜ | |
| Pagination | Navigate pages | Correct data shown | ⬜ | |

### 7.3 Recurring Expenses
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Create recurring expense | Expenses > Recurring > Add | Recurring expense created | ⬜ | |
| View recurring | Go to Recurring tab | All recurring expenses shown | ⬜ | |
| Set frequency | Select monthly/quarterly/annually | Frequency saved | ⬜ | |
| Pause recurring | Click pause | Status changed to paused | ⬜ | |
| Resume recurring | Click resume | Status changed to active | ⬜ | |
| Delete recurring | Click delete | Recurring expense removed | ⬜ | |

### 7.4 Expense Analytics
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View analytics | Expenses > Analytics | Charts and stats shown | ⬜ | |
| Category breakdown | Check pie chart | Expenses by category shown | ⬜ | |
| Trend chart | Check line chart | Expenses over time shown | ⬜ | |

### 7.5 Expense Export
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Export to CSV | Click Export | CSV file downloaded | ⬜ | |
| Export filtered | Apply filter, then export | Only filtered data exported | ⬜ | |

---

## 8. Asset Management

### 8.1 Add Asset
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Add new asset | Assets > Add Asset | Asset created | ⬜ | |
| Select asset type | Choose type | Depreciation rate auto-filled | ⬜ | |
| Purchase details | Enter cost, date | Values saved | ⬜ | |
| Business use percentage | Enter percentage | Saved correctly | ⬜ | |

### 8.2 View/Edit Assets
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View asset list | Go to Assets page | All assets listed | ⬜ | |
| Current value | Check asset | Depreciated value shown | ⬜ | |
| Depreciation calculation | View asset details | SARS-compliant depreciation | ⬜ | |
| Edit asset | Click asset, edit, save | Changes saved | ⬜ | |
| Dispose asset | Mark as disposed | Asset marked disposed | ⬜ | |
| Delete asset | Click delete | Asset removed | ⬜ | |

### 8.3 Asset Export
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Export assets | Click Export | CSV file downloaded | ⬜ | |

---

## 9. Vehicle Logbook

### 9.1 Add Trip
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Log new trip | Logbook > Log Trip | Trip recorded | ⬜ | |
| Business vs Personal | Select trip type | Correct categorization | ⬜ | |
| Opening/closing odometer | Enter readings | Distance calculated | ⬜ | |
| Distance validation | Closing < Opening | Error shown | ⬜ | |
| Trip purpose | Enter purpose | Saved correctly | ⬜ | |

### 9.2 View/Edit Logbook
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View trips | Go to Logbook page | All trips listed | ⬜ | |
| Filter by type | Select Business/Personal | List filtered | ⬜ | |
| Filter by date | Select date range | List filtered | ⬜ | |
| Business percentage | Check summary | Correct % calculated | ⬜ | |
| Edit trip | Click trip, edit, save | Changes saved | ⬜ | |
| Delete trip | Click delete, confirm | Trip removed | ⬜ | |

### 9.3 Logbook Export
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Export logbook | Click Export | CSV file downloaded | ⬜ | |
| Deduction summary | View summary | SARS calculation shown | ⬜ | |

### 9.4 Feature Gate
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Starter plan access | Try to access on Starter | Upgrade prompt shown | ⬜ | |
| Professional plan access | Access on Professional | Full access | ⬜ | |

---

## 10. Document Analysis (AI)

### 10.1 Upload Documents
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Access analyzer | Documents > Analyze | Upload page shown | ⬜ | Professional+ only |
| Upload image | Select image file | File uploaded | ⬜ | |
| Upload PDF | Select PDF file | File uploaded | ⬜ | |
| Multiple files | Upload multiple | All files uploaded | ⬜ | |
| File size limit | Upload large file | Error if > limit | ⬜ | |

### 10.2 AI Analysis
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Analyze document | Click Analyze | Processing starts | ⬜ | |
| View extracted data | After analysis | Data shown with confidence | ⬜ | |
| Invoice detection | Upload invoice | Invoice data extracted | ⬜ | |
| Receipt detection | Upload receipt | Receipt data extracted | ⬜ | |
| Confidence scores | Check results | Scores displayed | ⬜ | |

### 10.3 Approval Queue
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View queue | Documents > Approval Queue | Pending documents listed | ⬜ | |
| Approve document | Click Approve | Document approved | ⬜ | |
| Create expense | Approve and create expense | Expense created with data | ⬜ | |
| Create income | Approve and create income | Income created with data | ⬜ | |
| Reject document | Click Reject, enter reason | Document rejected | ⬜ | |

### 10.4 Quota & Limits
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View quota | Check usage | Current usage shown | ⬜ | |
| Quota exceeded | Use all monthly quota | Upgrade prompt shown | ⬜ | |
| Quota reset | New month | Quota reset to 0 | ⬜ | |

### 10.5 Feature Gate
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Starter plan access | Try to access on Starter | Upgrade prompt shown | ⬜ | |
| Professional plan access | Access on Professional | Full access | ⬜ | |

---

## 11. Reports

### 11.1 Reports Overview
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Access reports | Go to Reports | Report types listed | ⬜ | |

### 11.2 Profit & Loss Report
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Generate P&L | Reports > Profit & Loss | Report displayed | ⬜ | |
| Select period | Choose date range | Report updates | ⬜ | |
| Income totals | Check income section | Correct totals | ⬜ | |
| Expense totals | Check expense section | Correct totals | ⬜ | |
| Net profit/loss | Check bottom line | Correctly calculated | ⬜ | |

### 11.3 Tax Computation
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View tax computation | Reports > Tax Computation | Tax calculation shown | ⬜ | Professional+ |
| Select tax year | Choose year | Computation updates | ⬜ | |
| Taxable income | Check calculation | Correct amount | ⬜ | |
| Tax brackets | Check brackets | SARS brackets applied | ⬜ | |
| Deductions applied | Check deductions | All deductions listed | ⬜ | |
| Estimated tax | Check final amount | Correctly calculated | ⬜ | |

### 11.4 Deduction Summary
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View deductions | Reports > Deduction Summary | All deductions listed | ⬜ | |
| Category breakdown | Check categories | Grouped by category | ⬜ | |
| SARS categories | Check groupings | SARS-compliant groups | ⬜ | |

---

## 12. Categories Management

### 12.1 Expense Categories
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View categories | Check category dropdown | All categories shown | ⬜ | |
| System categories | Check defaults | Default categories present | ⬜ | |
| Add custom category | Create new category | Category added | ⬜ | |
| Edit category | Edit existing | Changes saved | ⬜ | |
| Delete category | Delete custom | Category removed | ⬜ | |

### 12.2 Income Categories
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View categories | Check category dropdown | All categories shown | ⬜ | |
| System categories | Check defaults | Default categories present | ⬜ | |
| Add custom category | Create new category | Category added | ⬜ | |

---

## 13. Settings

### 13.1 Profile Settings
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View profile | Settings > Profile | Current info shown | ⬜ | |
| Edit first name | Change name | Saved correctly | ⬜ | |
| Edit last name | Change name | Saved correctly | ⬜ | |
| Edit phone | Change phone | Saved correctly | ⬜ | |

### 13.2 Company Settings
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View company | Settings > Company | Current info shown | ⬜ | |
| Edit company name | Change name | Saved correctly | ⬜ | |
| Edit registration | Change number | Saved correctly | ⬜ | |
| Edit tax number | Change number | Saved correctly | ⬜ | |
| Edit VAT number | Change number | Saved correctly | ⬜ | |
| Edit business type | Change type | Saved correctly | ⬜ | |

---

## 14. Public Website

### 14.1 Main Pages
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Home page | Go to / | Page loads correctly | ⬜ | |
| Features page | Go to /features | All features displayed | ⬜ | |
| Pricing page | Go to /pricing | All plans shown | ⬜ | |
| About page | Go to /about | Content displays | ⬜ | |
| Contact page | Go to /contact | Form displays | ⬜ | |
| Terms page | Go to /terms | Content displays | ⬜ | |
| Privacy page | Go to /privacy | Content displays | ⬜ | |

### 14.2 Contact Form
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Submit contact | Fill form, submit | Success message | ⬜ | |
| Required fields | Submit empty | Validation errors | ⬜ | |
| Email validation | Enter invalid email | Error shown | ⬜ | |

### 14.3 Tax Calculator
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Access calculator | Go to /tax-calculator | Calculator shown | ⬜ | |
| Salaried calculator | Enter salary | Tax calculated | ⬜ | |
| Business calculator | Enter income/expenses | Tax calculated | ⬜ | |

---

## 15. Help Centre

### 15.1 Main Help Page
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Access help | Go to /help | Help centre shown | ⬜ | |
| Browse categories | View category cards | All 6 categories shown | ⬜ | |
| Popular articles | Check popular section | Articles with links | ⬜ | |
| FAQ section | Expand FAQ items | Answers shown | ⬜ | |
| Contact support | Click Contact Support | Goes to /contact | ⬜ | |

### 15.2 Category Pages
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Getting Started | Go to /help/getting-started | Articles listed | ⬜ | |
| Expenses | Go to /help/expenses | Articles listed | ⬜ | |
| Income | Go to /help/income | Articles listed | ⬜ | |
| Reports & Tax | Go to /help/reports-and-tax | Articles listed | ⬜ | |
| Vehicle Logbook | Go to /help/vehicle-logbook | Articles listed | ⬜ | |
| Account & Billing | Go to /help/account-and-billing | Articles listed | ⬜ | |

### 15.3 Article Pages
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View article | Click any article | Article content shown | ⬜ | |
| Breadcrumb | Check navigation | Shows Help > Category > Article | ⬜ | |
| Related articles | Check bottom | Related articles shown | ⬜ | |
| External links | Click SARS links | Opens in new tab | ⬜ | |
| Internal links | Click help links | Navigates correctly | ⬜ | |
| Back navigation | Click back link | Returns to category | ⬜ | |

### 15.4 SEO & Metadata
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Page titles | Check browser tab | Proper titles | ⬜ | |
| Meta descriptions | View page source | Descriptions present | ⬜ | |
| JSON-LD | View page source | Structured data present | ⬜ | |

---

## 16. Admin Panel

### 16.1 Admin Access
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Admin login | Login as admin | Access /admin | ⬜ | Admin role required |
| Non-admin blocked | Login as user | Cannot access /admin | ⬜ | |

### 16.2 Admin Dashboard
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View dashboard | Go to /admin | Stats displayed | ⬜ | |
| User count | Check users stat | Correct count | ⬜ | |
| Company count | Check companies stat | Correct count | ⬜ | |
| Recent activity | Check activity | Recent actions shown | ⬜ | |

### 16.3 User Management
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View users | Admin > Users | User list shown | ⬜ | |
| Search users | Enter search term | Results filtered | ⬜ | |
| View user details | Click user | Details shown | ⬜ | |
| Edit user | Edit user info | Changes saved | ⬜ | |
| Create user | Add new user | User created | ⬜ | |
| Deactivate user | Click deactivate | User deactivated | ⬜ | |
| Change role | Change user role | Role updated | ⬜ | |

### 16.4 Company Management
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View companies | Admin > Companies | Company list shown | ⬜ | |
| Search companies | Enter search term | Results filtered | ⬜ | |
| View company details | Click company | Details shown | ⬜ | |

### 16.5 Subscription Management
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View subscriptions | Admin > Subscriptions | List shown | ⬜ | |
| Filter by status | Select status | List filtered | ⬜ | |
| Assign subscription | Assign to company | Subscription assigned | ⬜ | |
| Cancel subscription | Click cancel | Subscription cancelled | ⬜ | |

### 16.6 Subscription Plans
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View plans | Admin > Plans | All plans listed | ⬜ | |
| Edit plan | Edit plan details | Changes saved | ⬜ | |
| Toggle active | Enable/disable plan | Status changed | ⬜ | |

### 16.7 Support Tickets
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View tickets | Admin > Support | Ticket list shown | ⬜ | |
| Filter by status | Select status | List filtered | ⬜ | |
| View ticket | Click ticket | Details shown | ⬜ | |
| Reply to ticket | Add reply | Reply saved | ⬜ | |
| Change status | Update status | Status changed | ⬜ | |

### 16.8 Audit Logs
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View logs | Admin > Logs | Log list shown | ⬜ | |
| Filter by action | Select action | List filtered | ⬜ | |
| Filter by user | Select user | List filtered | ⬜ | |
| View details | Click log entry | Details shown | ⬜ | |

### 16.9 Admin Settings
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| View settings | Admin > Settings | Settings shown | ⬜ | |
| Toggle subscriptions | Enable/disable | Feature toggled | ⬜ | |
| Billing settings | Edit billing | Settings saved | ⬜ | |

---

## 17. Feature Gating (Subscription Limits)

### 17.1 Starter Plan Limits
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Transaction limit | Add >50 transactions/month | Upgrade prompt shown | ⬜ | |
| Team member limit | Try to invite 2nd member | Upgrade prompt shown | ⬜ | |
| Company limit | Try to create 2nd company | Upgrade prompt shown | ⬜ | |
| No vehicle logbook | Try to access | Upgrade prompt shown | ⬜ | |
| No document analysis | Try to access | Upgrade prompt shown | ⬜ | |
| No tax computation | Try to access | Upgrade prompt shown | ⬜ | |

### 17.2 Professional Plan
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Unlimited transactions | Add many transactions | No limit | ⬜ | |
| 5 team members | Invite up to 5 | Allowed | ⬜ | |
| Vehicle logbook | Access logbook | Full access | ⬜ | |
| Document analysis | Access analyzer | Full access (quota) | ⬜ | |
| Tax computation | Access reports | Full access | ⬜ | |

### 17.3 Business Plan
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Unlimited everything | Test all limits | No restrictions | ⬜ | |
| Multiple companies | Create multiple | All allowed | ⬜ | |
| Unlimited team | Invite many | All allowed | ⬜ | |

### 17.4 Subscriptions Disabled
| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| All features unlocked | Disable in admin | All features work | ⬜ | |

---

## 18. Mobile Responsiveness

| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| Dashboard mobile | View on mobile | Layout adapts | ⬜ | |
| Sidebar mobile | Check hamburger menu | Opens/closes properly | ⬜ | |
| Forms mobile | Fill forms on mobile | All fields accessible | ⬜ | |
| Tables mobile | View tables | Horizontal scroll | ⬜ | |
| Modals mobile | Open modals | Display correctly | ⬜ | |
| Help centre mobile | Browse help | Responsive layout | ⬜ | |

---

## 19. Cross-Browser Testing

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome (latest) | ⬜ | |
| Firefox (latest) | ⬜ | |
| Safari (latest) | ⬜ | |
| Edge (latest) | ⬜ | |
| Mobile Safari (iOS) | ⬜ | |
| Chrome (Android) | ⬜ | |

---

## 20. Error Handling

| Test Case | Steps | Expected Result | Status | Notes |
|-----------|-------|-----------------|--------|-------|
| 404 page | Go to invalid URL | 404 page displays | ⬜ | |
| Form validation | Submit invalid data | Error messages shown | ⬜ | |
| API errors | Trigger API error | User-friendly message | ⬜ | |
| Network error | Disconnect network | Graceful handling | ⬜ | |
| Session expiry | Let session expire | Redirected to login | ⬜ | |

---

## 21. Email Notifications Summary

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
| Contact Form | Submit contact | Admin | ⬜ |

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

# AI (for document analysis)
ANTHROPIC_API_KEY=...

# File Storage
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
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

## Bug Report Template

```
**Bug ID:** BUG-XXX
**Feature:**
**Severity:** Low / Medium / High / Critical

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**

**Actual Result:**

**Browser/Device:**

**Screenshot/Video:**

**Notes:**
```

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

---

## Testing Sign-Off

| Tester Name | Date | Sections Tested | Signature |
|-------------|------|-----------------|-----------|
| | | | |
| | | | |

---

**Document Version History:**
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | - | Initial checklist |
| 2.0 | June 2025 | Added Help Centre, Document Analysis, Dashboard sidebar, expanded all sections |
