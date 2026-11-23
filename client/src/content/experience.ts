// EXPERIENCE.TXT. Text carried over word for word from the previous site; only the layout changed.

export interface Role {
  title: string;
  dates: string;
  location: string;
  paragraphs: readonly string[];
  skills?: string;
}

export interface Job {
  company: string;
  details: readonly string[];
  roles: readonly Role[];
}

export interface School {
  name: string;
  degree: string;
  paragraphs: readonly string[];
  skills?: string;
}

export const EXPERIENCE: {
  intro: readonly string[];
  jobs: readonly Job[];
  educationHeading: string;
  education: readonly School[];
} = {
  intro: [
    'I am a DevOps engineer with experience supporting, monitoring and maintaining cloud infrastructure in Microsoft Azure environments. My work has mainly focused on Azure infrastructure configuration, monitoring, and operational support. I’ve worked with Azure services, YAML pipelines, Git, PowerShell, and ServiceNow, among others. I’ve also been involved in creating and maintaining operational workflows and user-facing request forms used by internal teams.',
    'I enjoy improving processes, reducing repetitive manual work, and helping teams maintain reliable deployment environments. Currently continuing to expand my knowledge in cloud infrastructure, automation technologies and AI.',
  ],
  jobs: [
    {
      company: 'DIGITALL',
      details: ['Full-time · 7 yrs 2 mos', 'Hybrid'],
      roles: [
        {
          title: 'DevOps Engineer',
          dates: 'May 2022 - Dec 2024 · 2 yrs 8 mos',
          location: 'Sofia, Sofia City, Bulgaria',
          paragraphs: [
            'Investigated over 100 bugs using KQL in Azure Log Analytics to monitor various resources in an Enterprise-level environment.',
            'Used IaC and Azure Pipelines to provision and manage resources for end users, including Storage services, SQL solutions, Databricks Workspaces and ADF Instances.',
            'Delivered PositConnect as a service to customers, taking it from early stages of implementation to live on Production within 1 year. Relevant tasks include configuring, hardening and updating RHEL servers, Apache Tomcat, R runtime environment and PositConnect. Other responsibilities included setting up IAM and Access Customer Requests via ServiceNow.',
          ],
          skills: 'Skills: Microsoft Azure, Azure DevOps Services, +6 skills',
        },
        {
          title: 'Senior Technical Support Specialist',
          dates: 'Nov 2017 - May 2022 · 4 yrs 7 mos',
          location: 'Sofia, Bulgaria',
          paragraphs: [
            'Delivered technical support to "Datorama, a Salesforce Company" clients across global markets. Worked on data ingestion errors, visualization issues, and configuration problems, while ensuring timely resolution according to SLAs. Occasionally assisted with onboarding team members through teaching sessions and personal mentoring.',
          ],
        },
      ],
    },
    {
      company: 'Sixty K Ltd (60K)',
      details: ['Full-time'],
      roles: [
        {
          title: 'Support Specialist',
          dates: 'Oct 2014 - May 2017 · 2 yrs 8 mos',
          location: 'Sofia, Bulgaria · On-site',
          paragraphs: [
            'As Customer Support Operator (until May 2016), used data mining and validation to complete or correct up to 50 000 eBay catalog products used as templates to which listings are linked.',
            'In my last year at 60k, as Senior Customer Support Operator (“Shift Leader”), shared responsibility for a team of approximately 20 people with the Team Leader. I assisted with task division between agents, as well as with their daily work. I interviewed and trained 5 new employees and 2 Senior Customer Support Operators. I was also able to assist hundreds of clients – handling complaints and requests, with authority to directly update information on live eBay pages.',
          ],
        },
      ],
    },
  ],
  educationHeading: 'EDUCATION',
  education: [
    {
      name: 'Dimitar A. Tsenov Academy of Economics',
      degree: "Bachelor's degree, Business Informatics",
      paragraphs: [
        'The Business Informatics curriculum is divided into two core phases: foundational business theory and specialized technical training.',
        'The first half of the degree focuses on building a strong commercial mindset. This involved deep-diving into the mechanics of micro and macroeconomics, corporate finance, management, and accounting - providing the essential context for how modern organizations operate.',
        'The latter half is dedicated to technical mastery and IT. This phase covers the full lifecycle of business technology, from designing robust system architectures and managing network infrastructure to hands-on software engineering and web development. The curriculum emphasizes not just how to build applications, but how to strategically manage IT infrastructure and deploy modern information systems to drive business growth.',
      ],
    },
    {
      name: 'Foreign Language High School Pleven',
      degree: 'High School Diploma, German Language and Literature',
      paragraphs: [],
      skills: 'Skills: German Language, English',
    },
  ],
};
