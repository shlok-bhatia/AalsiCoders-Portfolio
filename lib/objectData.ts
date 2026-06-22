import type { ObjectId } from '@/store/useAppStore';

export interface ObjectData {
  id: ObjectId;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
  // Position in the 3D room
  position: [number, number, number];
  rotation: [number, number, number];
  // Camera zoom target when clicked
  camPosition: [number, number, number];
  camTarget: [number, number, number];
  // Content panel data
  content: {
    title: string;
    subtitle: string;
    body: string;
    tags?: string[];
    items?: { label: string; value: string }[];
    links?: { label: string; href: string }[];
  };
}

export const OBJECTS: Record<ObjectId, ObjectData> = {
  monitor: {
    id: 'monitor',
    label: 'Team',
    icon: '⬛',
    color: '#00aaff',
    glowColor: '#00aaff',
    position: [0, 0.9, -2.2],
    rotation: [0, 0, 0],
    camPosition: [0, 1.4, -0.2],
    camTarget: [0, 0.9, -2.2],
    content: {
      title: 'Our Team',
      subtitle: 'Three engineers. One mission.',
      body: 'AalsiCoders is built by three specialized engineers who turn ambitious ideas into production-grade digital products.',
      items: [
        { label: '🟢 Shlok Bhatia', value: 'Cybersecurity Engineer — Black tactical suit. Penetration testing, zero-trust architecture, secure DevOps.' },
        { label: '🔵 Nihal Chaudhary', value: 'Full Stack Developer — MERN stack specialist. React, Node.js, WebSockets, REST APIs, production deployments.' },
        { label: '🟣 Tanmay Chamar', value: 'ML Engineer — Neural networks, NLP pipelines, model deployment, LLM fine-tuning.' },
      ],
    },
  },
  coffee: {
    id: 'coffee',
    label: 'About',
    icon: '☕',
    color: '#ffd700',
    glowColor: '#ffd700',
    position: [-2.4, 0.72, 0.6],
    rotation: [0, 0.4, 0],
    camPosition: [-1.2, 1.1, 1.2],
    camTarget: [-2.4, 0.72, 0.6],
    content: {
      title: 'AalsiCoders',
      subtitle: 'We build the future — one commit at a time.',
      body: 'Founded in Noida, AalsiCoders is a boutique tech studio that ships production-grade MERN applications, cybersecurity audits, and ML-powered products for clients across India, the US, and the UK.',
      tags: ['Est. 2023', 'Noida, India', 'MERN Stack', 'Remote-first'],
      items: [
        { label: 'Stack', value: 'MongoDB · Express · React · Node.js · Socket.io' },
        { label: 'Clients', value: 'Early-stage SaaS, fintech startups, ecommerce brands' },
        { label: 'Payment', value: 'Wise · Payoneer · Razorpay' },
      ],
    },
  },
  keyboard: {
    id: 'keyboard',
    label: 'Skills',
    icon: '⌨️',
    color: '#00ff41',
    glowColor: '#00ff41',
    position: [0.8, 0.72, 0.4],
    rotation: [0, -0.2, 0],
    camPosition: [1.6, 1.3, 1.4],
    camTarget: [0.8, 0.72, 0.4],
    content: {
      title: 'Tech Stack',
      subtitle: 'Battle-tested in production.',
      body: 'Every skill listed here has shipped to a live domain. No tutorial projects.',
      items: [
        { label: 'Frontend', value: 'React · Next.js · Vite · Three.js · Tailwind · GSAP' },
        { label: 'Backend', value: 'Node.js · Express · Socket.io · JWT · REST · GraphQL' },
        { label: 'Database', value: 'MongoDB · Mongoose · Redis · PostgreSQL' },
        { label: 'DevOps', value: 'Vercel · Render · Docker · Nginx · GitHub Actions' },
        { label: 'Security', value: 'Penetration testing · OWASP · Zero-trust · OAuth2' },
        { label: 'ML/AI', value: 'Python · PyTorch · HuggingFace · LangChain · RAG' },
      ],
    },
  },
  phone: {
    id: 'phone',
    label: 'Contact',
    icon: '📱',
    color: '#00e5ff',
    glowColor: '#00e5ff',
    position: [-0.6, 0.82, 0.8],
    rotation: [0, 0.3, 0],
    camPosition: [0.2, 1.2, 1.6],
    camTarget: [-0.6, 0.82, 0.8],
    content: {
      title: 'Get In Touch',
      subtitle: 'Response within 24 hours.',
      body: 'Have a project? We take on freelance work, product contracts, and long-term retainers for international clients.',
      items: [
        { label: 'Email', value: 'hello@aalsicoders.in' },
        { label: 'GitHub', value: 'github.com/aalsicoders' },
        { label: 'LinkedIn', value: 'linkedin.com/company/aalsicoders' },
        { label: 'Location', value: 'Noida, Delhi NCR · Remote Worldwide' },
      ],
      links: [
        { label: 'Send a message', href: 'mailto:hello@aalsicoders.in' },
        { label: 'Book a call', href: 'https://cal.com/aalsicoders' },
      ],
    },
  },
  notebook: {
    id: 'notebook',
    label: 'Projects',
    icon: '📓',
    color: '#b040ff',
    glowColor: '#b040ff',
    position: [-1.6, 0.72, -0.4],
    rotation: [0, 0.15, 0],
    camPosition: [-0.6, 1.2, 0.8],
    camTarget: [-1.6, 0.72, -0.4],
    content: {
      title: 'Projects',
      subtitle: 'All live. All production.',
      body: 'Every project below is deployed to a real domain, serving real users.',
      items: [
        { label: 'DashX', value: 'MERN dashboard unifying GitHub + LeetCode with tri-color heatmap & streaks → dashx.aalsicoders.in' },
        { label: 'DRIP', value: 'Full B2C clothing resale platform — Razorpay, JWT auth, admin panel, multi-image → drip-beryl.vercel.app' },
        { label: 'Parliament', value: 'Real-time multiplayer political board game — Socket.io, Web Audio API, Three.js background' },
        { label: 'ReputX', value: 'Web3 on-chain identity system — SIWE, Wagmi, ENS, Snapshot GraphQL, Alchemy SDK' },
        { label: 'SAN Beverages', value: 'Beverage depot ERP — crate/bottle inventory math, MT pricing model, React frontend' },
      ],
    },
  },
  mouse: {
    id: 'mouse',
    label: 'Services',
    icon: '🖱️',
    color: '#ff6b6b',
    glowColor: '#ff6b6b',
    position: [1.8, 0.72, 0.2],
    rotation: [0, -0.3, 0],
    camPosition: [2.6, 1.2, 1.2],
    camTarget: [1.8, 0.72, 0.2],
    content: {
      title: 'Services',
      subtitle: 'We build. You launch.',
      body: 'Fixed-scope MVPs, hourly retainers, or project-based engagements — structured to move fast.',
      items: [
        { label: '🔵 MERN MVP', value: 'Full-stack web app from 0 to production in 2–4 weeks. Auth, DB, API, deployment.' },
        { label: '🟢 Security Audit', value: 'Penetration testing, OWASP assessment, vulnerability report with remediation guide.' },
        { label: '🟣 ML Integration', value: 'Add AI to your existing product — chatbots, recommendation engines, data pipelines.' },
        { label: '⚡ Performance', value: 'Lighthouse audit, bundle optimization, Core Web Vitals — ship fast pages.' },
        { label: '🔧 Maintenance', value: 'Monthly retainer — bug fixes, feature additions, uptime monitoring.' },
      ],
    },
  },
  wallDisplay: {
    id: 'wallDisplay',
    label: 'Achievements',
    icon: '🏆',
    color:'#00e5ff' ,
    glowColor: '#7b2cff',
    position: [0, 1.8, -3.6],
    rotation: [0, 0, 0],
    camPosition: [0, 1.8, -0.8],
    camTarget: [0, 1.8, -3.6],
    content: {
      title: 'Achievements',
      subtitle: 'Numbers that matter.',
      body: '',
      items: [
        { label: '🚀 Projects shipped', value: '12+ production deployments across MERN, Web3, and ML stacks' },
        { label: '🌍 International clients', value: 'US, UK, and EU clients via Upwork and cold outreach' },
        { label: '⭐ GitHub contributions', value: 'Open-source contributions to FreeCodeCamp, Cal.com, Appwrite' },
        { label: '🎓 Education', value: 'B.Tech CSE · AKTU 2028 · JSS Academy, Noida' },
        { label: '📦 Domains live', value: 'aalsicoders.in · dashx.aalsicoders.in · drip-beryl.vercel.app' },
      ],
    },
  },
};

export const OBJECT_IDS = Object.keys(OBJECTS) as ObjectId[];
