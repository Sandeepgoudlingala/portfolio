export interface SkillCategory {
  title: string;
  description: string;
  icon?: string;
  skills: string[];
}

export const skillBentoTiles = [
  {
    icon: "</>",
    title: "Full-stack web apps",
    copy: "Production web applications using React.js, Node.js, Express.js, and MongoDB/MySQL with clean MVC architecture and instant load times.",
    wide: true,
  },
  {
    icon: "AI",
    title: "AI integration",
    copy: "Implementing Gemini API and generative AI capabilities into practical user applications, such as dynamic ATS resume optimization.",
    wide: false,
  },
  {
    icon: "☁",
    title: "Cloud & DevOps",
    copy: "Architecting high-availability infrastructure, secure access control, containerization, and scalable production deployments.",
    wide: false,
  },
  {
    icon: null,
    title: "Core Stack & Technologies",
    copy: null,
    wide: true,
    chips: [
      "Java",
      "JavaScript (ES6+)",
      "Python",
      "SQL",
      "React.js",
      "Node.js",
      "Express.js",
      "MySQL",
      "MongoDB",
      "Cloud Architecture",
      "Git & GitHub",
      "Tailwind CSS",
      "REST APIs",
      "Docker",
    ],
  },
];

export const marqueeItemsRow1 = [
  "Lingala Sandeep Goud",
  "Full-Stack",
  "Cloud Architecture",
  "React.js",
  "Node.js",
  "Express.js",
  "Python",
  "Java",
  "MySQL",
  "MongoDB",
  "Gemini AI",
  "REST APIs",
];

export const marqueeItemsRow2 = [
  "Integrated M.Tech",
  "VIT-AP",
  "Data Structures & Algorithms",
  "MVC Architecture",
  "System Design",
  "Agile SDLC",
  "Query Optimization",
  "High Availability",
  "Vercel Deployments",
  "Git & GitHub",
];

export const categorizedSkills: SkillCategory[] = [
  {
    title: "Frontend Engineering",
    description: "Component-driven, responsive user interfaces with smooth animations and accessibility.",
    skills: ["React.js", "Vite", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "State Management"],
  },
  {
    title: "Backend & Systems",
    description: "Secure REST APIs, layered MVC architectures, JWT authentication, and resilient server backends.",
    skills: ["Node.js", "Express.js", "Java", "Python", "REST API Design", "MVC Pattern", "JWT Auth", "API Security"],
  },
  {
    title: "Databases & Storage",
    description: "Normalized relational schemas, ACID-compliant operations, and high-performance NoSQL stores.",
    skills: ["MySQL", "MongoDB", "SQL", "Schema Design", "Query Optimization", "ACID Transactions", "Indexing"],
  },
  {
    title: "Cloud & Developer Tools",
    description: "Cloud architecture, version control workflows, containerization, and modern deployments.",
    skills: ["Cloud Architecture", "Git", "GitHub", "Vercel", "Docker", "VS Code", "Postman", "CI/CD"],
  },
  {
    title: "AI Integration & GenAI",
    description: "Integrating Google Gemini API and LLM capabilities into production ATS tools and web applications.",
    skills: ["Gemini API", "Prompt Engineering", "Structured Outputs", "AI Resume Optimization", "RAG Patterns", "JWT Sessions"],
  },
  {
    title: "Core Computer Science",
    description: "Strong theoretical computer science foundation and structured software engineering methodologies.",
    skills: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks", "Agile SDLC"],
  },
];
