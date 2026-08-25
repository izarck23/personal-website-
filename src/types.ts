export interface Project {
  id: string;
  title: string;
  tag: string;
  category: 'mobile' | 'web' | 'saas' | 'devtool' | 'monetization';
  shortDescription: string;
  fullDescription: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  techStack: string[];
  metrics?: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  deviceType: 'mobile' | 'dashboard' | 'laptop' | 'browser';
  mockupImage?: string;
  highlights: string[];
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  deliverables: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  accentColor: string;
  badgeColor: string;
  startingPrice: string;
  estimatedTimeline: string;
  idealFor: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
  accentColor?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  category: 'Monetization' | 'Full-Stack' | 'Tech Journey' | 'AI & Tools' | 'Architecture';
  readTime: string;
  publishedAt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  likesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface MonetizationProduct {
  id: string;
  title: string;
  type: 'Digital Guide' | 'Starter Kit' | '1-on-1 Mentorship' | 'Code Review' | 'Sponsorship';
  price: string;
  description: string;
  badge: string;
  features: string[];
  popularityRating: number;
  salesCount: number;
  deliveryTime: string;
}

export interface SocialLink {
  id: string;
  name: string;
  handle: string;
  url: string;
  description: string;
  iconName: 'Github' | 'Linkedin' | 'Twitter' | 'Youtube' | 'Discord' | 'Mail' | 'Globe' | 'BookOpen' | 'Code';
  badge: string;
  color: string;
  stats?: string;
}

export interface ProfileConfig {
  brandName: string;
  creatorName: string;
  heroBadge: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroBio: string;
  customHeroPhoto?: string;
  email: string;
  github: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  discord: string;
  substack?: string;
  hashnode?: string;
}
