# 🚀 Installation & Setup Guide

## What's Inside

A complete Next.js server platform with:
- Landing page for displaying server details
- Admin panel for managing everything (secret key protected)
- MongoDB for data storage
- Cloudinary for image hosting
- Ready to deploy on Vercel

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

## Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Edit `.env.local` and fill in your credentials:

```env
# MongoDB - Get from mongodb.com/atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/...

# Cloudinary - Get from cloudinary.com dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset

# Admin Secret Key - Create your own
ADMIN_SECRET_KEY=your_password_here_123
```

### 3. Get MongoDB URI

1. Go to https://mongodb.com/atlas
2. Create cluster
3. Click "Connect" → "Drivers"
4. Copy connection string
5. Paste into MONGODB_URI (replace password)

### 4. Get Cloudinary Credentials

1. Go to https://cloudinary.com
2. Dashboard → Copy Cloud Name
3. Settings → API Keys → Copy API Key & Secret
4. Settings → Upload → Create preset named "unsigned_preset"

### 5. Run Locally

```bash
npm run dev
```

Visit:
- **Landing Page:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

Enter your `ADMIN_SECRET_KEY` to access admin panel.

### 6. Deploy to Vercel (Optional)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/server-platform.git
git push -u origin main
```

Then:
1. Go to vercel.com
2. Import repository
3. Add environment variables
4. Deploy!

## File Structure

```
server-platform/
├── app/
│   ├── page.tsx              # Landing page
│   ├── admin/page.tsx        # Admin panel
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Styles
│   └── api/
│       ├── server/route.ts
│       ├── download/host/route.ts
│       ├── raw/powertunnel/route.ts
│       └── admin/update/route.ts
├── lib/
│   └── mongodb.ts
├── .env.local               # YOUR CREDENTIALS (already created)
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

## Features

✅ Landing page with server details
✅ Admin panel (secret key protected)
✅ Download/share hosts file
✅ Upload images to Cloudinary
✅ Editable How To Play sections
✅ Preview image carousel
✅ MongoDB persistence
✅ Responsive design
✅ Ready for production

## Troubleshooting

**"Server not found" on landing page**
- Check MongoDB URI is correct in .env.local
- Make sure MongoDB cluster is active

**Cloudinary upload fails**
- Verify Cloud Name in .env.local
- Create "unsigned_preset" in Cloudinary settings

**Admin key doesn't work**
- Restart dev server: `npm run dev`
- Check ADMIN_SECRET_KEY in .env.local

**Images not loading**
- Check Cloudinary credentials
- Verify account has upload quota

## API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/server` | GET | Fetch server data |
| `/api/download/host` | GET | Download hosts file |
| `/api/raw/powertunnel` | GET | Raw file content |
| `/api/admin/update` | POST | Update server |

## Support

All documentation is in README.md and this file.

Questions? Check the included documentation.

Good luck! 🚀
