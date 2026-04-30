📁 server-platform/
│
├── 📄 package.json                    # Dependencies and scripts
├── 📄 next.config.js                  # Next.js configuration
├── 📄 tsconfig.json                   # TypeScript configuration
├── 📄 tailwind.config.ts              # Tailwind CSS configuration
├── 📄 .env.example                    # Environment variables template
├── 📄 .gitignore                      # Git ignore rules
├── 📄 README.md                       # Documentation
│
├── 📁 lib/
│   └── 📄 mongodb.ts                  # MongoDB connection utility
│
├── 📁 app/
│   ├── 📄 layout.tsx                  # Root layout (HTML wrapper)
│   ├── 📄 page.tsx                    # Landing page (/)
│   ├── 📄 globals.css                 # Global CSS styles
│   │
│   ├── 📁 admin/
│   │   └── 📄 page.tsx                # Admin panel (/admin)
│   │
│   └── 📁 api/
│       ├── 📁 server/
│       │   └── 📄 route.ts            # GET /api/server
│       │
│       ├── 📁 download/
│       │   └── 📁 host/
│       │       └── 📄 route.ts        # GET /api/download/host
│       │
│       ├── 📁 raw/
│       │   └── 📁 powertunnel/
│       │       └── 📄 route.ts        # GET /api/raw/powertunnel
│       │
│       └── 📁 admin/
│           └── 📁 update/
│               └── 📄 route.ts        # POST /api/admin/update

═══════════════════════════════════════════════════════════════════════

KEY FILES:

1. Landing Page (app/page.tsx)
   - Displays server details
   - Shows logo, background, description, stats
   - Download/copy buttons for host file
   - How To Play tabs
   - Preview image carousel
   - About server section

2. Admin Panel (app/admin/page.tsx)
   - Secret key authentication
   - Edit all server details
   - Upload images (Cloudinary)
   - Edit host file
   - Edit How To Play for each platform
   - Save changes to MongoDB

3. API Routes:
   - /api/server              → Get server data
   - /api/download/host       → Download hosts file
   - /api/raw/powertunnel     → Get raw file content
   - /api/admin/update        → Update server data

4. Database (lib/mongodb.ts)
   - Connection pooling
   - Single collection: "servers"
   - Document ID: "main-server"

═══════════════════════════════════════════════════════════════════════

SETUP:
1. npm install
2. Create .env.local from .env.example
3. Add MongoDB URI, Cloudinary credentials, admin secret key
4. npm run dev
5. Open http://localhost:3000
