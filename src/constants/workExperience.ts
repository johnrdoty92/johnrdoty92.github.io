import type { ResumeProps } from "@johnrdoty92/resume-generator";
import { getAssetUrl } from "../util/getAssetUrl";

export const workExperience = {
  Senior: {
    company: "Big Ass Fans",
    companyUrl: "https://www.bigassfans.com/",
    logoSrc: getAssetUrl("bigassfans", ".webp"),
    start: new Date("2024-02-01T00:00"),
    end: "Present",
    location: "Lexington, KY",
    title: "Software Engineer II",
    achievements: [
      "Performed SQL database (PostgreSQL) upgrades, avoiding $8,000 in annual RDS extended support costs.",
      "Developed REST APIs with NestJS and deployed in Docker containers for portability and scalability.",
      "Migrated application services from Elastic Beanstalk to AWS App Runner, saving $1,440 annually.",
      "Configured automated testing pipelines with Jest for UI unit and integration tests.",
    ],
  },
  Junior: {
    company: "BCW Group",
    companyUrl: "https://www.bcw.group/",
    logoSrc: getAssetUrl("bcw", ".webp"),
    start: new Date("2021-12-01T00:00"),
    end: new Date("2024-02-01T00:00"),
    location: "Remote",
    title: "Full Stack Developer",
    achievements: [
      "Managed CI/CD through Github Actions and OpenID Connect to deploy applications via AWS CloudFront and S3 ensuring reliable and scalable delivery of quality software into production.",
      "Developed, dockerized, and deployed Express apps to AWS EC2 for live data analytics dashboards.",
      "Led and mentored junior engineers through feature commits with code reviews and technical guidance.",
    ],
  },
  Intern: {
    companyUrl: "https://www.awesomeinc.com/",
    logoSrc: getAssetUrl("awesomeinc", ".webp"),
    company: "Awesome Inc",
    title: "Web Development Intern",
    location: "Lexington, KY",
    start: new Date("2021-07-01T00:00"),
    end: new Date("2021-11-01T00:00"),
    achievements: [
      "Created component wireframes in Figma to aid in migrating frontend components to Drupal CMS.",
      "Styled the website with CSS classes that follow BEM naming conventions.",
    ],
  },
} as const satisfies Record<
  string,
  ResumeProps["workExperience"][number] & {
    companyUrl: string;
    logoSrc: string;
  }
>;

export type JobTitle = keyof typeof workExperience;
