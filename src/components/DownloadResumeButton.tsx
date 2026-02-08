import { Resume, type ResumeProps } from "@johnrdoty92/resume-generator";
import { pdf } from "@react-pdf/renderer";
import { githubUrl, linkedInUrl } from "../constants/socialMedia";
import { SKILLS } from "../constants/skills";
import { useState, type ComponentProps } from "react";
import { personalInfo } from "../constants/personalInfo";
import { workExperience } from "../constants/workExperience";
import { workProjects } from "../constants/workProjects";

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
  workExperience: Object.values(workExperience),
  workProjects: Object.values(workProjects),
};

const DownloadIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
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
      <p>{isDownloading ? "Downloading..." : "Download Resume"}</p>
      <DownloadIcon />
    </button>
  );
};

export default DownloadResumeButton;
