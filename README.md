## 👟 DropRoom Frontend (Next.js)

This is the client-side application for the **DropRoom** ecosystem. It is a high-performance, real-time interface designed to handle limited-edition sneaker releases with zero latency and high security.

### 🌟 Key Features

* **Real-Time Stock Sync:** Uses **Socket.io** to update sneaker inventory and "Live Cop" activity feeds without requiring a page refresh.
* **Atomic Reservations:** A high-pressure checkout flow featuring a **60-second reservation timer** to ensure inventory fairness.
* **Optimized Performance:** Leverages **Next.js Server Components** for lightning-fast initial page loads and SEO.

### 🛠 Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Shadcn/UI
* **State:** React Context API + WebSockets
* **Real-time:** Socket.io-client

### 🚦 Quick Start

1. **Install dependencies:**
```bash
npm install

```


2. **Configure Environment:**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"

```


3. **Run Development Server:**
```bash
npm run dev

```
---