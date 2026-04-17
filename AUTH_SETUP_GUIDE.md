# UltimartGameStop - Authentication Setup Guide

## Overview
Your website now has a complete authentication system with:
- **Sign In**: Create a new account with Google OAuth + basic profile info
- **Login**: Login with Google OAuth OR email/password
- Separate buttons in the header for each action
- User profiles with phone and address info
- Secure password-based authentication for existing users

---

## STEP 1: Enable Google OAuth in Supabase

### 1.1 Configure Google OAuth Provider
1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your project: **crcvqtkzpzjudxsagzdx**
3. Go to **Authentication** → **Providers**
4. Find **Google** and click it
5. You should see the Google OAuth settings
6. Make sure the provider is **Enabled**

### 1.2 Set Up Google Cloud Project (if not already done)
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → Create **OAuth 2.0 Client ID** (Web Application)
5. Add these authorized URIs:
- `https://crcvqtkzpzjudxsagzdx.supabase.co/auth/v1/callback`
   - Your local development URL (e.g., `http://localhost:3000`)
6. Copy the **Client ID** and **Client Secret**
7. Paste them in Supabase Authentication settings

### 1.3 Set Redirect URLs in Supabase
1. In Supabase, go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://yoursite.com` (or your production domain)
3. Add **Redirect URLs**:
   - `https://yoursite.com/`
   - `http://localhost:3000/` (for development)

---

## STEP 2: Enable Email/Password Authentication

### 2.1 Configure Email Provider
1. In Supabase, go to **Authentication** → **Providers**
2. Find **Email** and make sure it's **Enabled**
3. Enable **Email Confirmations** (optional but recommended):
   - Go to **Email Templates** → Configure confirmation email
   - This ensures users verify their email before login

### 2.2 Configure Email Settings (SMTP)
1. Go to **Authentication** → **Email Templates**
2. Configure SMTP or use Supabase's default email service
3. Test by creating a user - they should receive a confirmation email

---

## STEP 3: Update Database Schema (if first time)

### 3.1 Run SQL Setup
1. Go to Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy the entire content from `supabase-setup.sql`
3. Paste into the SQL editor
4. Click **Run**

This creates:
- `user_profiles` table with fields: `username`, `first_name`, `last_name`
- RLS policies for secure access
- `orders`, `order_items`, `cart` tables
- All necessary indexes and relationships

### 3.1B Populate Products (Important!)
To add all your games to the database:
1. Go to Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy the entire content from `populate-products.sql`
3. Paste into the SQL editor
4. Click **Run**

This will insert all 40+ games into the products table with correct pricing and categories.

### 3.2 Verify Tables
1. Go to **Table Editor**
2. You should see these tables:
   - `user_profiles` ✅
   - `orders` ✅
   - `order_items` ✅
   - `cart` ✅
   - `products` ✅
3. **Note**: `auth.users` is a built-in Supabase system table (not shown in Table Editor)
   - To see auth users, go to **Authentication** → **Users** instead
   - This is normal and expected - it's a system table

---

## STEP 4: Create Storage Buckets

### 4.1 Create Buckets
1. Go to **Storage** in Supabase
2. Create three buckets:
   - **product-images** (Public)
   - **payment-uploads** (Private)
   - **user-avatars** (Public)

### 4.2 Set Bucket Policies

**What are policies?** They control who can read, upload, and manage files in each bucket.

**Policy Definition Syntax:**
- `true` = Anyone can access (public)
- `auth.uid() = owner` = Only the authenticated user who uploaded it can access

---

#### For **product-images** bucket (Public - anyone can view):
1. Click on **product-images** bucket
2. Click **Policies** tab
3. Click **New Policy** → **For SELECT** (allow public read)
   - Policy name: `"Allow public read"`
   - Target roles: `public`
   - Policy definition: **`true`**
   - Click **Review** → **Save**

4. Click **New Policy** → **For INSERT** (authenticated users upload)
   - Policy name: `"Allow authenticated upload"`
   - Target roles: `authenticated`
   - Policy definition: **`auth.uid() = owner`**
   - Click **Review** → **Save**

#### For **payment-uploads** bucket (Private - only user can access):
1. Click on **payment-uploads** bucket
2. Click **Policies** tab
3. Click **New Policy** → **For SELECT** (user can read own files)
   - Policy name: `"Allow user access"`
   - Target roles: `authenticated`
   - Policy definition: **`auth.uid() = owner`**
   - Click **Review** → **Save**

4. Click **New Policy** → **For INSERT** (user can upload)
   - Policy name: `"Allow user upload"`
   - Target roles: `authenticated`
   - Policy definition: **`auth.uid() = owner`**
   - Click **Review** → **Save**

#### For **user-avatars** bucket (Public read, authenticated upload):
1. Click on **user-avatars** bucket
2. Click **Policies** tab
3. Click **New Policy** → **For SELECT** (public read)
   - Policy name: `"Allow public read"`
   - Target roles: `public`
   - Policy definition: **`true`**
   - Click **Review** → **Save**

4. Click **New Policy** → **For INSERT** (user can upload avatar)
   - Policy name: `"Allow owner upload"`
   - Target roles: `authenticated`
   - Policy definition: **`auth.uid() = owner`**
   - Click **Review** → **Save**

**Quick Reference:**
| Bucket | Policy | Operation | Who | Policy Definition |
|--------|--------|-----------|-----|----|
| product-images | Public read | SELECT | Public | `true` |
| product-images | User upload | INSERT | Authenticated | `auth.uid() = owner` |
| payment-uploads | User access | SELECT | Authenticated | `auth.uid() = owner` |
| payment-uploads | User upload | INSERT | Authenticated | `auth.uid() = owner` |
| user-avatars | Public read | SELECT | Public | `true` |
| user-avatars | User upload | INSERT | Authenticated | `auth.uid() = owner` |

---

**Explanation:**
- **`true`**: Means the policy allows access (no restrictions)
- **`auth.uid() = owner`**: Means only the logged-in user who is listed as the "owner" of that file can access it
- **Never use `bucket_id`** - the bucket is already selected, so you don't need to specify it in the policy

---

## STEP 5: Understand the Authentication Flows

### Sign In (New Users)
1. User clicks **Sign In** button
2. Selects **Sign In with Google**
3. Redirected to Google login
4. After Google auth, form appears asking for:
   - Username
   - First Name
   - Last Name
5. Form is saved to `user_profiles` table
6. User is logged in and redirected

### Login (Existing Users)
1. User clicks **Login** button
2. Two options available:
   - **Google**: Quick login if already authenticated with Google
   - **Email & Password**: Login with email + password
3. After login, user is redirected to home page

---

## STEP 6: Frontend Configuration

### 6.1 Check Supabase Keys
In `script.js`, verify these are set (lines 1-7):
```javascript
const supabaseUrl = 'https://crcvqtkzpzjudxsagzdx.supabase.co'
const supabaseAnonKey = 'sb_publishable_poYElyzvYvx_pxAnUqk8PA_Pc9MLVOf'
```

### 6.2 Update if Keys Changed
If you regenerated keys in Supabase:
1. Go to Supabase → **Settings** → **API**
2. Copy the **Project URL** and **Anon Key**
3. Update the values in `script.js`

---

## STEP 7: Test the Authentication

### Test Sign In
1. Click **Sign In** button in header
2. Click **Sign In with Google**
3. Complete Google login
4. Fill in profile info (Name, Phone, Address)
5. Click **Complete Sign Up**
6. Should see user profile in header

### Test Login with Google
1. Logout first (click profile → Logout)
2. Click **Login** button
3. Click **Login with Google**
4. Should automatically login if Google session exists

### Test Email/Password Login
1. Logout first
2. Click **Login** button
3. Enter email and password (use a test account)
4. Click **Login**
5. Should be logged in

---

## STEP 8: Create Test Users (Optional)

### 8.1 Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Mark as **Confirmed** if needed

### 8.2 Via Application
1. Use the Sign In flow to create Google-authenticated user
2. Use the Login form to test email/password with created users

---

## Important Notes

### For Production
1. Always use HTTPS URLs
2. Set proper environment variables
3. Enable email confirmation
4. Configure SMTP for reliable emails
5. Implement rate limiting on auth endpoints
6. Use strong password requirements

### Database Structure
- **User Profiles**: Automatically created when user signs up
- **Orders**: Created when user places an order
- **Cart**: Persisted in localStorage and synced with database

### Security
- All user data is protected by RLS policies
- Users can only access their own data
- Passwords are handled securely by Supabase
- Google OAuth is more secure than email/password

---

## Troubleshooting

### "Google login not working"
- Check Google OAuth credentials are correctly entered
- Verify redirect URL is in Google Cloud Console
- Clear browser cache and try again

### "Email login not working"
- Verify email provider is enabled in Supabase
- Check user exists in `auth.users`
- Verify password is correct

### "User profile not saving"
- Check RLS policies are correctly set
- Verify `user_profiles` table exists
- Check browser console for errors

### "Redirect loop after login"
- Check Site URL in Supabase Email Configuration
- Verify redirect URL matches your domain
- Clear browser cookies

### "I don't see auth.users in Table Editor"
- This is normal! `auth.users` is a system table in Supabase
- Go to **Authentication** → **Users** to see registered users
- Only custom tables appear in the Table Editor
- You should see: `user_profiles`, `orders`, `order_items`, `cart`, `products`

---

## Next Steps

1. ✅ Configure Google OAuth
2. ✅ Enable Email/Password authentication
3. ✅ Run SQL setup script
4. ✅ Create age buckets
5. ✅ Test all authentstorication flows
6. ✅ Customize email templates (optional)
7. ✅ Deploy to production

---

For more help, visit [Supabase Documentation](https://supabase.com/docs)
