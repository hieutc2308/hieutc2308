export type ProjectDocument = {
  label: string;
  type: string;
  href?: string;
  note?: string;
};

export type PortfolioProject = {
  slug: string;
  overview: string;
  repoUrl?: string;
  folderPath: string;
  documents: ProjectDocument[];
  sections: {
    title: string;
    body: string;
  }[];
};

export const portfolioProjects: Record<string, PortfolioProject> = {
  "healthtech-clinic-analytics": {
    slug: "healthtech-clinic-analytics",
    overview:
      "Embedded analytics case study for a multi-tenant health tech reporting platform. Use this page to collect architecture notes, dashboard screenshots, data model decisions, and delivery evidence.",
    folderPath: "content/projects/healthtech-clinic-analytics",
    documents: [
      {
        label: "Project workspace",
        type: "Folder",
        note: "Use this repo folder for briefs, exported visuals, diagrams, and implementation notes.",
      },
      {
        label: "Repository link",
        type: "Repo",
        note: "Add the source or sanitized reference repository URL when available.",
      },
      {
        label: "Case study draft",
        type: "Document",
        note: "Draft the narrative in the project workspace before promoting final content here.",
      },
    ],
    sections: [
      {
        title: "Context",
        body:
          "Summarize the business problem, user groups, source systems, reporting cadence, and constraints around embedded Power BI delivery.",
      },
      {
        title: "Approach",
        body:
          "Document the semantic model, DirectQuery or import decisions, dbt transformations, deployment workflow, and governance controls.",
      },
      {
        title: "Outcome",
        body:
          "Capture measurable improvements such as reduced latency, workspace automation, dashboard adoption, performance gains, and stakeholder impact.",
      },
    ],
  },
  "powerbi-admin-monitoring": {
    slug: "powerbi-admin-monitoring",
    overview:
      "Governance and usage monitoring case study for Power BI administration. Use this page to organize telemetry design, Fabric pipeline notes, and dashboard evidence.",
    folderPath: "content/projects/powerbi-admin-monitoring",
    documents: [
      {
        label: "Project workspace",
        type: "Folder",
        note: "Store Fabric notes, data model sketches, screenshots, and API references here.",
      },
      {
        label: "Repository link",
        type: "Repo",
        note: "Add the repo URL or sanitized notebook export when ready.",
      },
      {
        label: "Admin API notes",
        type: "Document",
        note: "Track endpoint usage, refresh cadence, and governance metrics.",
      },
    ],
    sections: [
      {
        title: "Context",
        body:
          "Explain the admin visibility gap, historical logging need, and target governance questions for workspace and user activity.",
      },
      {
        title: "Approach",
        body:
          "Describe the Fabric pipeline, lakehouse storage, notebook transformations, and Power BI model used to analyze audit activity.",
      },
      {
        title: "Outcome",
        body:
          "Add examples of improved monitoring, historical trend analysis, faster audits, and reduced manual admin checks.",
      },
    ],
  },
  "fashion-retail-analytics": {
    slug: "fashion-retail-analytics",
    overview:
      "Retail analytics platform case study for a legacy-to-cloud migration. Use this page for migration notes, dashboard screenshots, and modeling decisions.",
    folderPath: "content/projects/fashion-retail-analytics",
    documents: [
      {
        label: "Project workspace",
        type: "Folder",
        note: "Keep migration notes, metric definitions, and dashboard exports here.",
      },
      {
        label: "Repository link",
        type: "Repo",
        note: "Add a source, demo, or sanitized transformation repository URL when available.",
      },
      {
        label: "Metric catalog",
        type: "Document",
        note: "Track sales, inventory, refresh, and executive KPI definitions.",
      },
    ],
    sections: [
      {
        title: "Context",
        body:
          "Summarize the retailer's migration goals, legacy data quality issues, and reporting expectations across sales stakeholders.",
      },
      {
        title: "Approach",
        body:
          "Document dbt transformations, Snowflake modeling, Dagster validation, Power BI semantic models, and refresh automation.",
      },
      {
        title: "Outcome",
        body:
          "Capture performance improvements, reporting reliability, stakeholder adoption, and migration quality checks.",
      },
    ],
  },
  "bpo-workforce-analytics": {
    slug: "bpo-workforce-analytics",
    overview:
      "Workforce analytics case study for headcount, attendance, compliance, and performance monitoring in a BPO environment.",
    folderPath: "content/projects/bpo-workforce-analytics",
    documents: [
      {
        label: "Project workspace",
        type: "Folder",
        note: "Store capacity planning notes, dashboard screenshots, and KPI definitions here.",
      },
      {
        label: "Repository link",
        type: "Repo",
        note: "Add a private or sanitized repository reference when available.",
      },
      {
        label: "Planning artifacts",
        type: "Document",
        note: "Collect headcount logic, staffing rules, and SLA calculation notes.",
      },
    ],
    sections: [
      {
        title: "Context",
        body:
          "Explain the operational reporting problem, staffing decisions supported, and accuracy requirements for workforce planning.",
      },
      {
        title: "Approach",
        body:
          "Describe the data model, SQL Server sources, Excel inputs, Power BI measures, and validation routines.",
      },
      {
        title: "Outcome",
        body:
          "Add staffing efficiency improvements, headcount accuracy, compliance visibility, and reporting cycle reductions.",
      },
    ],
  },
  "employee-turnover-analysis": {
    slug: "employee-turnover-analysis",
    overview:
      "Predictive analytics case study for employee turnover drivers, exploratory analysis, model design, and visualization.",
    folderPath: "content/projects/employee-turnover-analysis",
    documents: [
      {
        label: "Project workspace",
        type: "Folder",
        note: "Store notebook exports, chart images, and model notes here.",
      },
      {
        label: "Repository link",
        type: "Repo",
        note: "Add a notebook, demo repository, or sanitized analysis link when ready.",
      },
      {
        label: "Model notes",
        type: "Document",
        note: "Capture features, assumptions, validation results, and limitations.",
      },
    ],
    sections: [
      {
        title: "Context",
        body:
          "Summarize the turnover problem, dataset shape, business questions, and expected decision support.",
      },
      {
        title: "Approach",
        body:
          "Document cleaning steps, EDA, sentiment analysis, model selection, validation, and Tableau reporting.",
      },
      {
        title: "Outcome",
        body:
          "Add driver insights, model performance, recommended actions, and dashboard examples.",
      },
    ],
  },
};
