# Zeru Printing Service — Frontend Web App 👕✨

Next.js 15 web application for **Zeru Printing Service** (DTF Apparel Customizer & Print-on-Demand in Myanmar).

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

* **Interactive 2D Customizer Studio:**
  * Front & Back switchable realistic vector t-shirt canvas.
  * Real-time garment color preview (Pure White, Pitch Black, Charcoal, Beige, etc.).
  * **Default Visible Placements:** **Full Front** & **Full Back** (12" × 14").
  * **Collapsible Print Drawer:** Left Chest, Center Chest, Left/Right Sleeves, Back Collar, Upper Back, Inside Neck Label.
  * **Direct Artwork Uploader:** Transparent PNG / SVG / High-res JPG with live DPI resolution quality indicator (300 DPI check).
  * Graphic scaling, repositioning, and auto-center controls.
* **Smart Garment Picker & Size Chart:**
  * Heavyweight 240 GSM, 290 GSM, and 350 GSM Air Layer Boxy Oversized tees.
  * Interactive **Size Chart modal** with instant **Inches ⇋ CM** unit toggle.
* **Order & Deposit Payment Flow:**
  * Multi-size quantity breakdown (e.g., 2x M, 3x L) with proportional graphic scale notice.
  * Strictly **No Cash on Delivery (COD)** for custom apparel.
  * Automatic **1/3 Down Payment calculation** in Myanmar Kyats (**MMK**).
  * KBZPay and WavePay account info + transfer screenshot upload.
  * Direct order submission linked to NestJS backend, Google Drive storage, and Telegram bot alerts.
* **Customer Order Tracker (`/track`):**
  * Real-time tracking by Order Number (`ZP-20261120-XXXX`) and Phone.
  * 5-stage lifecycle: Deposit Review ➔ Deposit Verified ➔ DTF Printing & Press ➔ Ready for Shipping ➔ Completed.
* **Admin Dashboard (`/admin`):**
  * PIN-protected portal (Default PIN: `281120`).
  * Live customer orders table, deposit slip inspection, status updater, and high-res DTF print file downloads.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the customizer studio.

### 4. Build for Production
```bash
npm run build
npm start
```
