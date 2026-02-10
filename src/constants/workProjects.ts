import type { ResumeProps } from "@johnrdoty92/resume-generator";

export const workProjects = {
  digital_toolbox: {
    projectName: "Digital Toolbox",
    url: "https://learn.bigassfans.com",
    description:
      "A collection of internal and external sales tools served as a progressive web app.",
    achievements: [
      "Implemented user authentication with Auth0 to protect application routes from unauthorized access.",
      "Developed realtime backend error notifications with Golang and AWS Lambda to improve MTTR.",
      "Improved first contentful paint by 71% (2.1s to 0.6s) through code splitting, resulting in faster page loads.",
    ],
  },
  hashport_metrics: {
    projectName: "Hashport Metrics",
    url: "https://metrics.hashport.network",
    description:
      "A metrics dashboard for tracking cryptocurrency trade data on the Hashport platform.",
    achievements: [
      "Added security to the backend service with NGINX rate limiting and CORS domain whitelisting.",
      "Reduced the amount of data transferred over expensive HTTP requests from 1MB to under 20kB.",
    ],
  },
  hashport_sdk_and_react_client_library: {
    projectName: "Hashport SDK and React Client Library",
    url: "https://github.com/BCWResearch/hashport-framework",
    description: "An open source SDK and React component library for the Hashport platform.",
    achievements: [
      "Authored an open source SDK and React component library to encourage community engagement.",
      "Automated UI testing and publishing to NPM with Github Actions for quick version updates.",
    ],
  },
  hashport: {
    projectName: "Hashport",
    url: "https://app.hashport.network",
    description:
      "A React application for facilitating cross-chain cryptocurrency transfers on the Hashport platform.",
    achievements: [
      "Optimized the application’s transferred resources by 50% (10.7MB to 5.4MB) by code splitting with Rollup and moving image assets to a CDN with AWS CloudFront and S3.",
      "Improved render durations over 50% (37.9ms average to 11.4ms) by analyzing website performance with React Developer Tools and implementing React best practices for better state management.",
    ],
  },
} as const satisfies Record<string, ResumeProps["workProjects"][number] & { description: string }>;

export type ProjectName = keyof typeof workProjects;
