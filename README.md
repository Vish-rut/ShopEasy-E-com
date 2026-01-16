🛒 ShopEasy — Modern E‑Commerce Web App

A full‑stack E‑Commerce platform built with modern web technologies, designed for performance, scalability, and a smooth user experience. ShopEasy allows users to browse products, manage carts, and experience a clean, responsive shopping interface.

🚀 Live Demo: https://shopeasy-ecom.vercel.app/

📦 GitHub Repository: https://github.com/Vish-rut/ShopEasy-E-com

---

## ✨ Features

- **Product Catalog** - Browse products by category with real-time filtering and search
- **Shopping Cart** - Add, remove, and manage items with persistent cart state
- **Wishlist** - Save favorite products for later
- **User Authentication** - Secure login and registration with Supabase Auth
- **Checkout** - Seamless checkout experience with Stripe payments
- **Order Tracking** - View order status and history
- **Responsive Design** - Optimized for all devices
- **Real-time Updates** - Live product and inventory updates

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: [Stripe](https://stripe.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)


---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopeasy.git
   cd shopeasy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📁 Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── account/           # User account page
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── login/             # Authentication pages
│   ├── products/          # Product listing & details
│   ├── register/          # User registration
│   └── wishlist/          # Wishlist page
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions & configurations
```

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

* Open‑source community
* Modern React ecosystem
* Vercel for seamless deployment

---

## 👨‍💻 Author

**Vishrut**

* GitHub: (https://github.com/Vish-rut)
* Portfolio: https://portfolio-vishrut-15.vercel.app/
---

⭐ If you like this project, don’t forget to **star** the repository!
