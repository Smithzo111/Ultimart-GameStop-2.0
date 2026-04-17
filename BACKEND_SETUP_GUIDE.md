# UltimartGameStop - Complete Backend Setup Guide

## Overview
Your website now has a complete Supabase backend with:
- User authentication (Google OAuth)
- Shopping cart system
- Order management with status tracking
- User profiles with purchase history
- Payment upload storage
- Product catalog management

---

## STEP 1: Supabase Database Setup

### 1.1 Access Supabase
1. Go to [supabase.com](https://supabase.com)
2. Sign in with your account (same one you used for your project)
3. Select your project: **crcvqtkzpzjudxsagzdx**

### 1.2 Create Database Tables
1. Go to **SQL Editor** tab
2. Click **New Query**
3. Copy the entire SQL from `supabase-setup.sql` file in your project folder
4. Paste it into the SQL editor
5. Click **Run**

This will create:
- `products` - Game catalog
- `cart` - User shopping carts
- `orders` - Order records
- `order_items` - Items in each order
- `user_profiles` - User information
- Automatic Row Level Security (RLS) policies

### 1.3 Verify Tables Created
1. Go to **Table Editor**
2. You should see these tables listed on the left:
   - products
   - cart
   - orders
   - order_items
   - user_profiles

---

## STEP 2: Set Up Storage Buckets

Storage is used for uploading images and payment proofs.

### 2.1 Create Buckets
1. Go to **Storage** → **Buckets**
2. Click **Create Bucket**
3. Create these 3 buckets:

**Bucket 1: product-images**
- Name: `product-images`
- Private/Public: **Public**
- Click Create

**Bucket 2: payment-uploads**
- Name: `payment-uploads`
- Private/Public: **Private** (only authenticated users)
- Click Create

**Bucket 3: user-avatars** (Optional)
- Name: `user-avatars`
- Private/Public: **Public**
- Click Create

### 2.2 Configure CORS (If needed)
If you get CORS errors:
1. Go to **Settings** → **API**
2. Under "CORS Configuration", add your website URL

---

## STEP 3: Configure Authentication

### 3.1 Google OAuth Setup
1. Go to **Authentication** → **Providers**
2. Click **Google**
3. You should see a **Client ID** and **Client Secret** (already pre-filled by Supabase)
4. Click **Enable** to turn it on
5. The redirect URL should be: `https://crcvqtkzpzjudxsagzdx.supabase.co/auth/v1/callback`

### 3.2 Verify Email Provider
1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (for fallback)

---

## STEP 4: Update Frontend Configuration

Your credentials are already embedded in `script.js`:
```javascript
const supabaseUrl = 'https://crcvqtkzpzjudxsagzdx.supabase.co'
const supabaseAnonKey = 'sb_publishable_poYElyzvYvx_pxAnUqk8PA_Pc9MLVOf'
```

**IMPORTANT**: These are your public keys and are safe to use in frontend code.

---

## STEP 5: Populate Products (Optional)

To add products to your database:

### Option A: Via Supabase Dashboard
1. Go to **Table Editor**
2. Click on `products` table
3. Click **Insert Row**
4. Add product details:
   - `name`: Game title
   - `category`: Category name
   - `price`: Price in ₹ (e.g., 299)
   - `description`: Optional description
   - `image_url`: URL to product image

### Option B: Sync from Local Data
The app automatically uses the local `gamesData` array. To sync to database later, run this in browser console:
```javascript
// Products are fetched from local array for now
// Database integration can be added later
```

---

## STEP 6: Test the Features

### 6.1 Test Authentication
1. Open your website in browser
2. Click **Login** button
3. Sign in with Google
4. You should see your name appear
5. Click on your name/profile icon to see profile page

### 6.2 Test Cart
1. Log in first
2. Click on any game, then **Add to Cart**
3. See cart count increase
4. Click the shopping bag icon to open cart sidebar

### 6.3 Test Checkout
1. Add items to cart
2. Click **Proceed to Checkout**
3. Fill in billing information
4. Upload payment proof screenshot
5. Click **Place Order**
6. Order should appear in your profile

### 6.4 Test Profile
1. Click on profile icon (user circle)
2. View your orders and purchase history

---

## STEP 7: Security & Row Level Security (RLS)

Row Level Security is **automatically configured** in the SQL setup. This ensures:
- Users can only see their own cart
- Users can only see their own orders
- Users can only edit their own profile
- Anyone can view products

No additional configuration needed!

---

## STEP 8: Deployment & Live Testing

### For Local Testing:
1. Open `index.html` in browser
2. All features work locally with Supabase backend

### For Live Deployment:
1. Upload all files to your hosting (Netlify, Vercel, GitHub Pages, etc.)
2. Supabase will work automatically (it's cloud-based)

### Required Files:
- `index.html` - Main page
- `styles.css` - Styling
- `script.js` - Backend logic
- `Source/` folder - Product images

---

## STEP 9: Monitoring & Management

### Check Orders in Supabase
1. Go to **Table Editor** → **orders**
2. See all orders created by users
3. You can manually update `status` column:
   - `pending` → User hasn't paid yet
   - `confirmed` → Payment received
   - `processing` → Preparing order
   - `delivered` → Order complete
   - `cancelled` → Cancelled order

### View Payment Uploads
1. Go to **Storage** → **payment-uploads**
2. See all uploaded payment proofs

### Check User Cart
1. Go to **Table Editor** → **cart**
2. See what items users have added

---

## STEP 10: Customization

### Add Email Notifications (Optional)
1. Go to **Supabase** → **Functions** (Pro plan)
2. Create a function to send emails on order placement
3. Use SendGrid or Mailgun API

### Change Payment Methods
Edit in `script.js` - Payment Methods section:
```javascript
const paymentMethods = ['upi', 'card', 'bank'];
```

### Customize Order Status Flow
Modify in Supabase dashboard or via API calls

---

## TROUBLESHOOTING

### Issue: "Cart not saving"
**Solution**: Check browser console (F12) for errors. Ensure user is logged in.

### Issue: "Payment upload fails"
**Solution**: 
- Check file size (max 25MB)
- Ensure bucket is created
- Check browser storage permissions

### Issue: "Order not appearing in profile"
**Solution**:
- Refresh page
- Check user is logged in with same account
- Check Supabase table `orders` for data

### Issue: "Google login not working"
**Solution**:
- Clear browser cache
- Check Google OAuth is enabled in Supabase
- Check console for errors

### Issue: "Cart sidebar empty after login"
**Solution**: This is normal. Cart data is stored per user. Add items to see them.

---

## FEATURE SUMMARY

| Feature | Status | Details |
|---------|--------|---------|
| User Login | ✅ Active | Google OAuth |
| Shopping Cart | ✅ Active | Local storage + Supabase sync |
| Checkout | ✅ Active | Collects billing info |
| Orders | ✅ Active | Stored in Supabase |
| User Profile | ✅ Active | Shows orders & purchase history |
| Payment Upload | ✅ Active | Stores in Supabase Storage |
| Product Catalog | ✅ Active | 41 games available |
| Search & Filter | ✅ Active | Working on catalog |
| Stock Management | ⏳ Coming | Can be added later |
| Email Notifications | ⏳ Coming | Can be added later |

---

## API ENDPOINTS (For Future Integration)

The app uses these Supabase functions internally:

```javascript
// Add to cart
supabaseClient.from('cart').upsert({...})

// Create order
supabaseClient.from('orders').insert({...})

// Get orders
supabaseClient.from('orders').select('*')

// Upload file
supabaseClient.storage.from('payment-uploads').upload(...)
```

---

## NEXT STEPS

1. ✅ Set up database tables (SQL)
2. ✅ Create storage buckets
3. ✅ Configure authentication
4. ✅ Test all features
5. Deploy to live server
6. Set up email notifications
7. Add payment gateway integration (Stripe/Razorpay)
8. Add SMS notifications

---

## SUPPORT

For Supabase issues:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.io)

For website issues:
- Check browser console (F12) for errors
- Check Supabase dashboard for data
- Ensure all files are in correct location

---

**Your backend is now ready! 🚀**
