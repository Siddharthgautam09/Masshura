# Firebase Email/Password Authentication Setup Guide

## 🔥 Enable Email/Password Authentication in Firebase Console

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com
2. Sign in with: siddharth.mtc09@gmail.com
3. Select project: **Maashura-Admin** (maashura-admin)

### Step 2: Navigate to Authentication
1. In the left sidebar, click: **Authentication**
2. Click on the **Sign-in method** tab

### Step 3: Enable Email/Password
1. Find **Email/Password** in the list of providers
2. Click on it to expand
3. Click the **Enable** toggle switch
4. Make sure both options are enabled:
   - ✅ **Email/Password** 
   - ✅ **Email link (passwordless sign-in)** (optional)
5. Click **Save**

### Step 4: Verify Setup
1. You should see "Email/Password" marked as **Enabled**
2. The status should show a green checkmark

### Step 5: Test the Application
1. Go back to: http://localhost:8082/set-password?email=test@gmail.com
2. Fill in a password that meets requirements:
   - At least 8 characters
   - 1 uppercase letter
   - 1 lowercase letter
   - 1 number
   - 1 special character
3. Click "Save & Login"

## 🚀 Alternative: Quick Enable via Firebase Console URL

Direct link to your authentication settings:
https://console.firebase.google.com/project/maashura-admin/authentication/providers

## 📧 Password Requirements
For testing, use a password like: `TestPass123!`
- ✅ 8+ characters
- ✅ Uppercase: T, P
- ✅ Lowercase: est, ass
- ✅ Number: 123
- ✅ Special: !

## 🔧 Troubleshooting
If you still get errors after enabling:
1. Wait 1-2 minutes for changes to propagate
2. Refresh your browser
3. Clear browser cache
4. Try again

## ⚠️ Important Notes
- This change affects your entire Firebase project
- All apps using this Firebase project will have Email/Password enabled
- Make sure to configure appropriate security rules
