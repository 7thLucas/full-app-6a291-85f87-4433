/*
 * Default Configurable Data — seeded into Mongo on first boot.
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TFeatureItem = {
  icon?: string;
  title: string;
  description?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline?: string;
  logoUrl: string;
  brandColor: TBrandColor;
  heroHeading?: string;
  heroSubheading?: string;
  ctaLabel?: string;
  features?: TFeatureItem[];
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Approvly",
  tagline: "Where great work gets approved.",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#ec4899",
    secondary: "#be185d",
    accent: "#f9a8d4",
  },
  heroHeading: "Where great work gets approved.",
  heroSubheading: "Approvly replaces scattered email threads and Slack messages with a single workspace for creative review and sign-off.",
  ctaLabel: "Get Started Free",
  features: [
    {
      icon: "FolderOpen",
      title: "Project Workspaces",
      description: "Every project gets a dedicated workspace with all deliverables, discussions, and revision history in one place.",
    },
    {
      icon: "MessageSquare",
      title: "Visual Feedback",
      description: "Pin comments directly on images and designs. Leave time-coded feedback on videos.",
    },
    {
      icon: "CheckCircle",
      title: "Approval Workflows",
      description: "Structured review rounds with clear status tracking — In Review, Revision Requested, Approved.",
    },
    {
      icon: "Users",
      title: "Client Invitations",
      description: "Invite clients via email to specific projects. No complex account setup required.",
    },
    {
      icon: "History",
      title: "Version History",
      description: "Full revision history across every review round. Never lose track of changes.",
    },
    {
      icon: "Bell",
      title: "Activity Timeline",
      description: "Real-time activity log and notifications for every project action.",
    },
  ],
  footerText: "© 2026 Approvly. Built for creative agencies.",
};
