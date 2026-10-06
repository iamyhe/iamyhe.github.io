/**
 * Portfolio content — single source of truth.
 * Edit text here; components render it automatically.
 */

export const profile = {
  name: 'Yasmin Hossam Eldin',
  initials: 'YHE',
  title: 'Junior Data Scientist',
  usp: 'I bridge the gap between complex algorithms and human understanding. Turning raw data into intelligence.',
  // Drop your photo at public/assets/yasmin-photo.jpg (or src/assets/yasmin-photo.jpg).
  // HeroReveal resolves either location and falls back to a YHE monogram.
  photo: './assets/yasmin-photo.jpg',
}

export const about = {
  title: 'WHO IS YHE?',
  // Lines of: "Not a template. Not a generated profile. Just a human who likes turning data into decisions."
  manifesto: ['Not a template.', 'Not a generated profile.', 'Just a human who likes turning data into decisions.'],
  story: [
    {
      letter: 'Y',
      key: 'WHY',
      text: 'It didn’t start with code; it started with curiosity. Since day one, I’ve been fascinated by hidden patterns. Now, I use Data Science to uncover the patterns that matter.',
    },
    {
      letter: 'H',
      key: 'HOW',
      text: 'I bridge the gap between complex algorithms and human understanding. Using machine learning, relational databases, and front-end technologies, I build intelligent systems.',
    },
    {
      letter: 'E',
      key: 'EXPLORE',
      text: 'From interactive platforms to complex process simulations, I explore the intersection of AI and user experience to build tools that turn raw data into actionable decisions.',
    },
  ],
}

export const skills = {
  title: 'Neural Clusters',
  core: 'AI & Data Science',
  clusters: [
    {
      id: '01',
      name: 'THE CORE',
      area: 'c1',
      items: ['Python', 'R', 'SQL (MySQL/PostgreSQL)', 'Machine Learning', 'Modern Regression', 'EDA', 'Pandas & Matplotlib'],
    },
    {
      id: '02',
      name: 'THE INTERFACE',
      area: 'c2',
      items: ['Vue.js', 'Bootstrap 5', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Figma'],
    },
    {
      id: '03',
      name: 'THE WORKFLOW',
      area: 'c3',
      items: ['n8n Automation', 'GitHub', 'Replit', 'Data Structures', 'Operating Systems'],
    },
    {
      id: '04',
      name: 'THE EDGE',
      area: 'c4',
      items: ['Prompt Engineering', 'Midjourney V6', 'Veo & Seedance 2.0', 'Video Processing'],
    },
    {
      id: '05',
      name: 'THE HUMAN',
      area: 'c5',
      items: ['Data Storytelling', 'Technical Leadership', 'AI Ethics', 'Algorithmic Thinking'],
    },
  ],
}

export const projects = [
  {
    id: '01',
    title: 'Smart Housing Price Prediction',
    short: 'Housing',
    viz: 'regression',
    colors: ['#00c6ff', '#2f7bff'],
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    details: ['Exploratory Data Analysis (EDA)', 'Feature Engineering', 'Regression Algorithms'],
    dataset: 'Real estate dataset',
  },
  {
    id: '02',
    title: 'CPU Process Scheduling Simulator',
    short: 'Scheduler',
    viz: 'scheduler',
    colors: ['#2f7bff', '#7c3aed'],
    tech: ['Python', 'Streamlit'],
    details: ['Algorithmic logic implementation', 'UI bridging for abstract OS concepts'],
  },
  {
    id: '03',
    title: 'Interactive Space Exploration Platform',
    short: 'Space',
    viz: 'space',
    colors: ['#7c3aed', '#a855f7'],
    tech: ['Vue 3', 'Bootstrap 5', 'NASA APIs'],
    details: ['Led Front-End architecture', 'Integrating real-time API data'],
  },
  {
    id: '04',
    title: 'Musicana E-commerce Database Architecture',
    short: 'Musicana',
    viz: 'erd',
    colors: ['#a855f7', '#00c6ff'],
    tech: ['MySQL', 'Advanced SQL Queries'],
    details: ['Entity-Relationship Diagrams (ERD)', 'Schema Architecture', 'Data Normalization'],
  },
]

export const projectsMeta = {
  title: 'Interactive Data Universe',
}

export const education = [
  {
    period: '2026 — Present',
    current: true,
    org: 'University of Tokyo',
    program: 'GCI World AI Course',
    detail: 'Global Consumer Intelligence Cohort',
  },
  {
    period: '2026',
    current: false,
    org: 'Digital Egypt Pioneers Initiative — DEPI',
    program: 'Data Science Track',
    detail: '',
  },
  {
    period: '2024 — Present',
    current: true,
    org: 'Horus University',
    program: 'B.Sc. in Data Science',
    detail: 'Faculty of AI',
  },
]

export const certifications = [
  { title: 'Data Analytics Essentials', issuer: 'Cisco / TCSC AOU' },
  { title: 'Front-End & Automation', issuer: 'ITI & NTI Summer Training' },
  { title: 'Web Development', issuer: 'Tawar w Ghayar Initiative' },
]

export const achievements = [
  { value: 4, suffix: '+', label: 'Projects' },
  { value: 3, suffix: '+', label: 'Certifications' },
  { value: 2, suffix: '+', label: 'Trainings' },
  { value: 1, suffix: '', label: 'Focus' },
]

export const quote = {
  text: 'The best way to predict the future is to create it.',
  author: 'YHE',
}

export const journey = {
  title: 'Experience & Education',
}

export const contact = {
  title: "LET'S CONNECT",
  subtitle: "Have a project in mind? Let's build something amazing together.",
  email: 'yasminhossameldinabdelsalam@gmail.com',
  linkedin: 'https://linkedin.com/in/iamyhe',
  github: 'https://github.com/iamyhe',
}

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]
