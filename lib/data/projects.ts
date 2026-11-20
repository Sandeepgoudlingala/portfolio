export interface Project {
  number: string;
  meta: string;
  title: string;
  description: string;
  stack: string[];
  command: string;
  repoUrl: string;
  demoUrl: string;
  highlights?: string[];
}

export const projects: Project[] = [
  {
    number: "01",
    meta: "Case 01 · AI & Full-Stack · 2025-2026",
    title: "AI-Powered Resume Builder",
    description:
      "Full-stack ATS resume platform that dynamically generates keyword-optimized resumes using Gemini AI, featuring Google OAuth, version history, and multiple exportable PDF templates.",
    stack: [
      "React.js",
      "Vite",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Gemini API",
      "JWT",
      "Vercel",
    ],
    command: "$ npx vercel deploy --prod\n✓ ATS resume engine online · Gemini AI connected",
    repoUrl: "https://github.com/Sandeepgoudlingala",
    demoUrl: "https://github.com/Sandeepgoudlingala",
    highlights: [
      "Generates ATS-optimized resumes with Google Gemini AI",
      "Google OAuth & email/password authentication with JWT sessions",
      "Layered MVC architecture (routes, controllers, services, middleware)",
      "Resume versioning in MongoDB with instant PDF generation and export",
    ],
  },
  {
    number: "02",
    meta: "Case 02 · E-Commerce Platform · 2025",
    title: "FARM to Home",
    description:
      "Direct farmer-to-consumer marketplace platform enabling agricultural producers to sell fresh produce directly with real-time product listings, dynamic pricing, and order tracking.",
    stack: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "SQL",
      "MySQL",
      "DBMS",
      "Agile SDLC",
    ],
    command: "$ npm run test:transactions\n✓ SQL schema validated · 0 concurrent transaction leaks",
    repoUrl: "https://github.com/Sandeepgoudlingala",
    demoUrl: "https://github.com/Sandeepgoudlingala",
    highlights: [
      "Direct farmer-to-consumer transactions bypassing middlemen",
      "Optimized SQL backend schemas for ACID-compliant concurrent order transactions",
      "Real-time dynamic pricing management and live delivery tracking",
      "Delivered within Agile sprint cycles following complete SDLC phases",
    ],
  },
  {
    number: "03",
    meta: "Case 03 · Cloud & Systems · 2025",
    title: "Cloud Infrastructure & API Platform",
    description:
      "High-availability backend service architecture built on cloud infrastructure, applying modern microservices best practices, secure REST design, and database query optimization.",
    stack: [
      "Cloud Architecture",
      "Node.js",
      "Express.js",
      "Python",
      "MongoDB",
      "MySQL",
      "Docker",
      "Git",
    ],
    command: "$ cloud-deploy --stack-name prod\n✓ Cloud infrastructure online · 99.99% uptime",
    repoUrl: "https://github.com/Sandeepgoudlingala",
    demoUrl: "https://linkedin.com/in/lingala-sandeep-goud",
    highlights: [
      "Resilient cloud backend architecture with automated load scaling and strict IAM security",
      "Layered REST API design with automated validation and error logging",
      "MySQL & MongoDB query optimization reducing latency by over 35%",
      "Systematic unit testing, debugging, and continuous Git-based workflows",
    ],
  },
];
