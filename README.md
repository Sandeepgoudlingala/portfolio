# Lingala Sandeep Goud — Portfolio Website

A production-ready personal portfolio website for **Lingala Sandeep Goud**, Software Engineer (Integrated M.Tech at VIT-AP). Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis, and React Three Fiber (R3F).

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Motion & Reveals**: [Framer Motion](https://www.framer.com/motion/)
- **Scroll Triggers**: [GSAP](https://greensock.com/) + ScrollTrigger
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **3D & Shaders**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Typography**: `next/font/google` (Archivo, JetBrains Mono, Instrument Serif, VT323)
- **Contact Form**: [Resend](https://resend.com/) API Route Handler
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd sandeep-portfolio-native
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Resend API credentials:

```env
# Get your API key from https://resend.com
RESEND_API_KEY=re_your_api_key_here

# The email where you want to receive messages from the contact form
CONTACT_TO_EMAIL=your-email@example.com
```

> **Note:** If `RESEND_API_KEY` is not provided, the form runs in safe local mock mode and logs submissions to the console.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live site.

---

## ✏️ How to Edit Content

All portfolio content is decoupled from JSX components and lives inside `lib/data/`:

| File | What to edit |
| --- | --- |
| `lib/data/projects.ts` | Case study titles, descriptions, metrics, tech stacks, GitHub and demo URLs. Marked with `// TODO:` |
| `lib/data/skills.ts` | Bento grid features, infinite marquee terms, and categorized skills lists. |
| `components/sections/ContactSection.tsx` | Your contact email, GitHub profile URL, and LinkedIn URL. Marked with `// TODO:` |
| `app/layout.tsx` | Site metadata, SEO keywords, Twitter handles, and Open Graph settings. |

---

## 🌐 Deploying to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete production portfolio"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
   - Click **Add New Project** and select your repository.
   - Framework preset will automatically detect **Next.js**.

3. **Set Environment Variables**:
   Under **Environment Variables**, add:
   - `RESEND_API_KEY`: Your production Resend API Key.
   - `CONTACT_TO_EMAIL`: Your destination email address.

4. **Deploy**:
   Click **Deploy**. Your site will build in ~45 seconds and be live with edge caching, global CDN, and Vercel Analytics enabled.

---

## ♿ Accessibility & Performance

- **Reduced Motion**: Automatically pauses 3D canvas and starfield loop when `prefers-reduced-motion` is active.
- **Dynamic 3D Imports**: `HeroGeometric` is dynamically imported with `ssr: false` to ensure fast initial page paint and zero hydration mismatches.
- **Lighthouse Score**: Optimized bundle size, responsive image formats, semantic HTML landmarks (`header`, `main`, `footer`, `section`), and accessible ARIA attributes.

---

## 📄 License

MIT License © 2026 Sandeep Goud. Made with gravity.
