import type { ResumeProps } from "@johnrdoty92/resume-generator";

export const workProjects = [
  {
    projectName: "Digital Toolbox",
    url: "https://learn.bigassfans.com",
    achievements: [
      "Implemented user authentication with Auth0 to protect application routes from unauthorized access.",
      "Developed realtime backend error notifications with Golang and AWS Lambda to improve MTTR.",
      "Improved first contentful paint by 71% (2.1s to 0.6s) through code splitting, resulting in faster page loads.",
    ],
  },
  {
    projectName: "Hashport Metrics",
    url: "https://metrics.hashport.network",
    achievements: [
      "Added security to the backend service with NGINX rate limiting and CORS domain whitelisting.",
      "Reduced the amount of data transferred over expensive HTTP requests from 1MB to under 20kB.",
    ],
  },
  {
    projectName: "Hashport SDK and React Client Library",
    url: "https://github.com/BCWResearch/hashport-framework",
    achievements: [
      "Authored an open source SDK and React component library to encourage community engagement.",
      "Automated UI testing and publishing to NPM with Github Actions for quick version updates.",
    ],
  },
  {
    projectName: "Hashport",
    url: "https://app.hashport.network",
    achievements: [
      "Optimized the application’s transferred resources by 50% (10.7MB to 5.4MB) by code splitting with Rollup and moving image assets to a CDN with AWS CloudFront and S3.",
      "Improved render durations over 50% (37.9ms average to 11.4ms) by analyzing website performance with React Developer Tools and implementing React best practices for better state management.",
    ],
  },
] as const satisfies ResumeProps["workProjects"];
