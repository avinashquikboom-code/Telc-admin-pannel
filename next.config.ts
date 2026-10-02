import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/admin/review-sessions",
        destination: "/admin/reviews",
        permanent: false,
      },
      {
        source: "/admin/learners",
        destination: "/admin/users",
        permanent: false,
      },
      {
        source: "/admin/user-progress",
        destination: "/admin/progress",
        permanent: false,
      },
      {
        source: "/admin/learning-analytics",
        destination: "/admin/analytics/learning",
        permanent: false,
      },
      {
        source: "/admin/vocabulary-analytics",
        destination: "/admin/analytics/vocabulary",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
