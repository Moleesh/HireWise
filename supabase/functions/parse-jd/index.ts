import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Marketing", "Sales", "Operations",
  "Finance", "HR", "Legal", "Customer Success", "Data", "Security",
  "DevOps", "QA", "Research", "Analytics", "Growth", "Compliance",
];

const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "Ruby", "PHP",
  "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "SvelteKit",
  "Node.js", "Express", "Django", "Flask", "Spring", "Rails", "Laravel", "FastAPI",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "SQLite",
  "GraphQL", "REST", "gRPC", "WebSocket", "API Design",
  "Git", "Linux", "Agile", "Scrum", "Jira", "Confluence",
  "Figma", "Sketch", "Photoshop", "Illustrator", "InDesign",
  "Machine Learning", "AI", "Data Science", "NLP", "Computer Vision", "Deep Learning",
  "Swift", "Kotlin", "Flutter", "React Native", "iOS", "Android",
  "HTML", "CSS", "Tailwind", "SASS", "SCSS", "LESS",
  "Testing", "Jest", "Cypress", "Playwright", "Selenium", "Mocha",
  "Microservices", "Serverless", "Event-Driven", "Message Queues",
  "Tableau", "Power BI", "Looker", "Snowflake", "dbt",
  "SAP", "Salesforce", "HubSpot", "Marketo",
  "Project Management", "Stakeholder Management", "Budgeting",
];

function extractTitle(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 3)) {
    if (line.length < 100 && !line.includes(":") && !line.startsWith("-") && !line.startsWith("•")) {
      return line.replace(/^(job title|position|role|title)\s*:\s*/i, "").trim();
    }
  }
  const titleMatch = text.match(/(?:job title|position|role|title)\s*:\s*([^\n]+)/i);
  return titleMatch ? titleMatch[1].trim() : "";
}

function extractDepartment(text: string): string {
  for (const dept of DEPARTMENTS) {
    const regex = new RegExp(`\\b${dept}\\b`, "i");
    if (regex.test(text)) return dept;
  }
  const deptMatch = text.match(/(?:department|team|division|group)\s*:\s*([^\n,]+)/i);
  return deptMatch ? deptMatch[1].trim() : "";
}

function extractLocation(text: string): string {
  const patterns = [
    /(?:location|city|office|based in|situated in|headquarters|work location)\s*:\s*([^\n,]+)/i,
    /\b(remote|hybrid|on-?site|onsite)\b/i,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2})/,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+)/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return (match[1] || match[0]).trim();
  }
  return "";
}

function extractEmploymentType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("part-time") || lower.includes("part time")) return "part-time";
  if (lower.includes("contract") || lower.includes("freelance") || lower.includes("consultant")) return "contract";
  if (lower.includes("intern") || lower.includes("co-op") || lower.includes("co op")) return "internship";
  return "full-time";
}

function extractExperienceLevel(text: string): string {
  const lower = text.toLowerCase();
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/i);
  if (expMatch) {
    const years = parseInt(expMatch[1]);
    if (years <= 2) return "entry";
    if (years <= 5) return "mid";
    if (years <= 8) return "senior";
    return "lead";
  }
  if (/\b(senior|sr\.?|lead|principal|staff|expert)\b/i.test(text)) return "senior";
  if (/\b(junior|jr\.?|entry.level|graduate|associate)\b/i.test(text)) return "entry";
  if (/\b(manager|director|vp|vice president|head|chief)\b/i.test(text)) return "executive";
  return "mid";
}

function extractSalaryRange(text: string): string {
  const patterns = [
    /(?:salary|compensation|pay|wage|ctc)\s*:\s*\$?([\d,]+)\s*[-–to]+\s*\$?([\d,]+)/i,
    /\$([\d,]+[kK]?)\s*[-–to]+\s*\$([\d,]+[kK]?)/,
    /([\d,]+)\s*[-–]\s*([\d,]+)\s+(?:per\s+)?(?:annum|year|month)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return `$${match[1]} - $${match[2]}`;
  }
  return "";
}

function extractSkills(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const skill of COMMON_SKILLS) {
    if (lower.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  // Also extract skills from bullet points
  const skillSection = text.match(/(?:required skills|technical skills|tech stack|technologies|key skills|skills)\s*[:\n]([\s\S]*?)(?:\n\n|\n[A-Z])/i);
  if (skillSection) {
    const items = skillSection[1].split(/[-•*,\n]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 50);
    for (const item of items) {
      const cleaned = item.replace(/^\d+[.)]\s*/, "").trim();
      if (cleaned && !found.includes(cleaned)) found.push(cleaned);
    }
  }
  return [...new Set(found)];
}

function extractListSection(text: string, keywords: string[]): string[] {
  const items: string[] = [];
  const lower = text.toLowerCase();

  for (const keyword of keywords) {
    const idx = lower.indexOf(keyword);
    if (idx === -1) continue;

    const afterKeyword = text.substring(idx + keyword.length);
    const lines = afterKeyword.split("\n");

    for (const line of lines.slice(1)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?:/.test(trimmed) && trimmed.length < 30) break;
      if (trimmed.length < 3) continue;

      const item = trimmed
        .replace(/^[-•*]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .trim();

      if (item.length > 3 && item.length < 300) {
        items.push(item);
      }
      if (items.length >= 12) break;
    }
    if (items.length > 0) break;
  }

  return items;
}

function generateProfessionalSummary(
  title: string,
  department: string,
  location: string,
  employmentType: string,
  experienceLevel: string,
  salaryRange: string,
  responsibilities: string[],
  requirements: string[],
  skills: string[],
  benefits: string[],
): string {
  const levelLabel: Record<string, string> = {
    entry: "entry-level",
    mid: "mid-level",
    senior: "senior",
    lead: "lead",
    executive: "executive",
  };
  const typeLabel: Record<string, string> = {
    "full-time": "full-time",
    "part-time": "part-time",
    contract: "contract",
    internship: "internship",
  };

  const level = levelLabel[experienceLevel] || "mid-level";
  const type = typeLabel[employmentType] || "full-time";

  let summary = `We are seeking a ${level} ${title}`;
  if (department) summary += ` to join our ${department} team`;
  summary += `. This is a ${type} position`;
  if (location) summary += ` based in ${location}`;
  summary += `.\n\n`;

  if (responsibilities.length > 0) {
    summary += `In this role, you will `;
    const respShort = responsibilities.slice(0, 3).map((r) => {
      const first = r.charAt(0).toLowerCase() + r.slice(1);
      return first.replace(/\.$/, "");
    });
    summary += respShort.join(", ") + ".";
    if (responsibilities.length > 3) {
      summary += ` You will also take on additional responsibilities including ${responsibilities.slice(3, 5).map((r) => r.charAt(0).toLowerCase() + r.slice(1).replace(/\.$/, "")).join(" and ")}.`;
    }
    summary += "\n\n";
  }

  if (requirements.length > 0) {
    summary += `The ideal candidate brings `;
    const reqShort = requirements.slice(0, 3).map((r) => r.charAt(0).toLowerCase() + r.slice(1).replace(/\.$/, ""));
    summary += reqShort.join(", ") + ".";
    summary += "\n\n";
  }

  if (skills.length > 0) {
    const topSkills = skills.slice(0, 6);
    summary += `Key technologies and skills include ${topSkills.join(", ")}.`;
    summary += "\n\n";
  }

  if (benefits.length > 0) {
    summary += `We offer ${benefits.slice(0, 3).map((b) => b.charAt(0).toLowerCase() + b.slice(1).replace(/\.$/, "")).join(", ")}`;
    if (benefits.length > 3) summary += ` and more`;
    summary += ".";
    summary += "\n\n";
  }

  if (salaryRange) {
    summary += `Compensation: ${salaryRange}.`;
  }

  return summary.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const title = extractTitle(text);
    const department = extractDepartment(text);
    const location = extractLocation(text);
    const employmentType = extractEmploymentType(text);
    const experienceLevel = extractExperienceLevel(text);
    const salaryRange = extractSalaryRange(text);
    const responsibilities = extractListSection(text, [
      "responsibilities", "what you will do", "you will", "key responsibilities",
      "duties", "your role", "about the role", "what you'll do",
    ]);
    const requirements = extractListSection(text, [
      "requirements", "qualifications", "what you need", "required",
      "must have", "ideal candidate", "you have", "what we're looking for",
      "who you are", "desired qualifications", "minimum qualifications",
    ]);
    const skills = extractSkills(text);
    const benefits = extractListSection(text, [
      "benefits", "perks", "what we offer", "we offer", "compensation & benefits",
      "why join", "what you'll get",
    ]);

    const summary = generateProfessionalSummary(
      title, department, location, employmentType, experienceLevel,
      salaryRange, responsibilities, requirements, skills, benefits,
    );

    const result = {
      title,
      department,
      location,
      employmentType,
      experienceLevel,
      salaryRange,
      summary,
      responsibilities,
      requirements,
      skills,
      benefits,
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to parse job description" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
