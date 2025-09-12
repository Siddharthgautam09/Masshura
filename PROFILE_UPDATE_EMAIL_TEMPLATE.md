# Profile Update Re-Approval System

## Overview

The system has been configured to handle profile updates with admin re-approval **without sending email notifications**. This keeps the workflow simple and reduces email noise.

## How It Works

### Supplier Side:
1. **Profile Edit**: Supplier clicks "Edit Profile" button in their dashboard
2. **Status Change**: When supplier saves changes, their status automatically changes to "pending_review"
3. **Visual Feedback**: 
   - Supplier sees "Profile Under Review" notification
   - Edit button becomes disabled and shows "Profile Under Review"
   - Orange status badge indicates "Profile Under Review"
4. **No Emails**: No automatic emails are sent to admin or supplier

### Admin Side:
1. **Visual Notification**: Admin sees special "Profile Update Pending Review" alert in supplier detail page
2. **Clear Indication**: Button text changes to "Approve Profile Changes" instead of "Approve"
3. **Simple Approval**: Admin clicks approve to re-activate the supplier
4. **Status Reset**: Supplier status returns to "approved" and profile flags are cleared
5. **No Emails**: No automatic emails are sent during this process

## Database Fields Added

### Supplier Document Fields:
- `status: 'pending_review'` - Set when profile is updated
- `profileUpdateRequested: true` - Flag indicating profile update
- `profileUpdateDate: string` - Timestamp of when profile was updated
- `profileReapprovedAt: string` - Timestamp of when profile was re-approved (set by admin)

## Code Changes Summary

### SupplierDashboard.tsx:
- ✅ Profile edit triggers status change to "pending_review"
- ✅ Visual notifications when profile is under review
- ✅ Edit button disabled during review
- ❌ No email notifications sent

### SupplierDetailPage.tsx (Admin):
- ✅ Visual notification for pending profile updates
- ✅ Button text changes for profile approvals
- ✅ Clears profile update flags on approval
- ❌ No email notifications sent

## Benefits

1. **Reduced Email Noise**: No unnecessary emails for routine profile updates
2. **Clear Visual Cues**: Both admin and supplier have clear visual indicators
3. **Simple Workflow**: Straightforward approve/reject without email complexity
4. **Audit Trail**: All changes tracked in database with timestamps
5. **User-Friendly**: Clear status messages and disabled states prevent confusion

## Admin Workflow

1. Admin logs into admin panel
2. Sees suppliers with "pending_review" status highlighted
3. Clicks on supplier to review changes
4. Sees "Profile Update Pending Review" notification
5. Reviews profile information
6. Clicks "Approve Profile Changes" 
7. Supplier status returns to "approved"
8. Supplier can continue using the system

No emails are involved in this process - everything is handled through the UI.
