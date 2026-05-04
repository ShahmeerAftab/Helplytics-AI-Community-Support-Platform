// Static data used across the app
// Note: actual questions/users come from the API, not from here

// Question categories for dropdowns and filters
export const categories = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "AI/ML",
  "Design",
];

// Stats shown on the landing page
export const communityStats = [
  { label: "Active Users",        value: "12,400+" },
  { label: "Questions Answered",  value: "89,200+" },
  { label: "Expert Helpers",      value: "3,800+"  },
  { label: "Topics Covered",      value: "250+"    },
];

// Features shown on the landing page
export const features = [
  {
    icon: "🧠",
    title: "AI-Powered Matching",
    description: "Our AI automatically matches your question with the most qualified helpers based on their skills and past contributions.",
  },
  {
    icon: "⚡",
    title: "Fast Responses",
    description: "Get help within minutes, not days. Our active community ensures urgent issues are prioritized and resolved quickly.",
  },
  {
    icon: "🏷️",
    title: "Smart Tagging",
    description: "Organize questions with intelligent tags and categories so the right experts find your requests instantly.",
  },
  {
    icon: "🔒",
    title: "Verified Experts",
    description: "All helpers are community-vetted with a transparent reputation system based on quality of help provided.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description: "Track your learning journey, contributions, and growth over time with a beautiful personal dashboard.",
  },
  {
    icon: "🌍",
    title: "Global Community",
    description: "Connect with developers, designers, and learners from around the world across dozens of skill categories.",
  },
];
