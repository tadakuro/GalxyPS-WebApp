# 🚀 Server Hub Platform

A modern web platform for displaying and managing a game server (Growtopia Private Server or similar) with a secret-key protected admin panel.

## ✨ Features

- **Landing Page** - Display server details, stats, preview images, and instructions
- **Admin Panel** - Secret key authentication, full server management
- **File Management** - Upload hosts file, download or share via `/api/raw/powertunnel`
- **Image Hosting** - Cloudinary integration for logos, backgrounds, and previews
- **Editable Content** - Platform-specific "How To Play" instructions (Android, Windows, iOS)
- **MongoDB Storage** - All data persists to MongoDB
- **Vercel Ready** - Easy deployment to Vercel
- **Responsive Design** - Works on desktop and mobile

## 📁 Project Structure

```
server-platform/
├── app/
│   ├── api/
│   │   ├── server/              # GET server details
│   │   ├── download/host/       # Download hosts file
│   │   ├── raw/powertunnel/     # Raw hosts file content
│   │   └── admin/update/        # Update server (POST)
│   ├── admin/
│   │   └── page.tsx             # Admin panel
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── lib/
│   └── mongodb.ts               # MongoDB connection
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── .env.example
└── README.md
```

## 🛠 Prerequisites

- **Node.js** 18+
- **MongoDB Atlas** (free tier) - https://www.mongodb.com/cloud/atlas
- **Cloudinary** (free tier) - https://cloudinary.com/

## 📋 Setup Instructions

### 1. Clone/Extract the Project

```bash
cd server-platform
npm install
```

### 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# MongoDB (get from Atlas connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/server-platform?retryWrites=true&w=majority

# Cloudinary (get from Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin secret key (change this!)
ADMIN_SECRET_KEY=your_super_secret_key_123
```

### 3. Get MongoDB URI

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Click "Connect" → "Drivers"
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Paste into `MONGODB_URI` in `.env.local`

### 4. Get Cloudinary Credentials

1. Go to https://cloudinary.com/
2. Create a free account
3. Go to Dashboard
4. Copy:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

5. Go to Settings → Upload
6. Create an upload preset (name: `unsigned_preset`, set to "Unsigned")
7. Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset` to `.env.local`

### 5. Run Locally

```bash
npm run dev
```

- **Landing Page**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Enter your `ADMIN_SECRET_KEY` to access

## 🌐 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/server-platform.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Environment Variables" and add:
   - `MONGODB_URI`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_SECRET_KEY`
5. Click "Deploy"

## 📖 How to Use

### Landing Page (`/`)

- Displays server details fetched from MongoDB
- Shows logo, description, stats, preview images
- "Download Host" button downloads the hosts file
- "Copy PowerTunnel Link" copies the `/api/raw/powertunnel` URL
- "How To Play" tabs show platform-specific instructions
- "Server Preview" carousel shows images

### Admin Panel (`/admin`)

1. Enter your `ADMIN_SECRET_KEY`
2. Edit server details:
   - Name, description, country, ping, players online
   - Upload logo and background via Cloudinary
   - Upload/edit hosts file content
   - Edit "How To Play" for Android, Windows, iOS
   - Add/remove preview images
3. Click "Save Changes" to update MongoDB

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/server` | Get server details |
| GET | `/api/download/host` | Download hosts file |
| GET | `/api/raw/powertunnel` | Get raw hosts file content |
| POST | `/api/admin/update` | Update server (requires `secretKey`) |

## 🎨 Customization

### Colors & Theme

Edit `app/globals.css` to change colors:

```css
body {
  background: linear-gradient(to bottom, #0f172a, #0f172a, #1e293b);
}
```

### Add More Platforms

In `app/admin/page.tsx` and `app/page.tsx`, add new platforms to the `howToPlay` object:

```typescript
howToPlay?: {
  android?: string;
  windows?: string;
  ios?: string;
  // Add more here
}
```

### Extend Server Fields

Add new fields to the `Server` interface and update the admin form accordingly.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Server not found" on landing page | Check MongoDB connection string in `.env.local` |
| Cloudinary upload fails | Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct; create unsigned upload preset |
| Admin key not working | Make sure `ADMIN_SECRET_KEY` matches what you entered; restart dev server |
| Images not loading | Check Cloudinary credentials; make sure remote pattern is configured in `next.config.js` |

## 📞 Support

For issues, check:
1. MongoDB Atlas connection status
2. Cloudinary dashboard for upload limits
3. `.env.local` file has all required variables
4. Environment variables are set in Vercel if deployed

## 📜 License

MIT - Feel free to use and modify!
