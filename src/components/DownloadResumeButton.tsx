import { Resume, type ResumeProps } from "@johnrdoty92/resume-generator";
import { pdf } from "@react-pdf/renderer";
import { githubUrl, linkedInUrl } from "../constants/socialMedia";
import { SKILLS } from "../constants/skills";
import { useState } from "react";
import { personalInfo } from "../constants/personalInfo";

const resumeProps: ResumeProps = {
  author: personalInfo.name,
  keywords: "",
  title: `${personalInfo.name} - ${personalInfo.title} Resume`,
  // TODO: limit to 10? add flags to help filter?
  skills: SKILLS.map(({ name }) => name),
  contactInfo: {
    name: personalInfo.name,
    email: personalInfo.email,
    phone: personalInfo.phone,
    socials: {
      githubUrl,
      linkedInUrl,
    },
  },
  education: [
    {
      degreeOrProgram: "Introduction to Web Design",
      school: "Awesome Inc | 9 Week Course",
      description: "Lexington, KY",
      year: 2021,
    },
    {
      degreeOrProgram: "BFA in Film Production, Emphasis in Sound Design",
      school: "Chapman University",
      gpa: 3.7,
      description: "Orange, CA",
      year: 2014,
    },
  ],
  workExperience: [
    {
      company: "Big Ass Fans",
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
    {
      company: "BCW Group",
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
    {
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
  ],
  // TODO: store as consts and export to other components
  workProjects: [
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
  ],
};

const DownloadResumeButton = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await pdf(<Resume {...resumeProps} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "John_Doty_Full_Stack_Engineer.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button className="download" onClick={handleDownload}>
      {isDownloading ? "Downloading..." : "Download Resume"}
    </button>
  );
};

export default DownloadResumeButton;
