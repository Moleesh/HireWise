import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COMMON_SKILLS = [
  'javascript', 'typescript', 'react', 'angular', 'vue', 'vue.js', 'node', 'node.js',
  'python', 'java', 'c++', 'c#', 'csharp', 'go', 'golang', 'rust', 'ruby', 'php',
  'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab', 'dart',
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud',
  'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd',
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'redis',
  'elasticsearch', 'dynamodb', 'cassandra', 'couchdb',
  'graphql', 'rest', 'rest api', 'api', 'microservices',
  'git', 'github', 'gitlab', 'bitbucket',
  'linux', 'unix', 'bash', 'shell scripting',
  'agile', 'scrum', 'kanban', 'jira',
  'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
  'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
  'machine learning', 'ml', 'deep learning', 'dl', 'ai', 'artificial intelligence',
  'tensorflow', 'pytorch', 'keras', 'nlp', 'natural language processing',
  'data science', 'data analysis', 'pandas', 'numpy', 'scipy',
  'project management', 'leadership', 'communication', 'problem solving',
  'selenium', 'cypress', 'jest', 'mocha', 'testing',
  'next.js', 'nextjs', 'nuxt', 'svelte', 'sveltekit',
  'express', 'express.js', 'fastapi', 'flask', 'django', 'spring', 'spring boot',
  'react native', 'flutter', 'xamarin', 'ios', 'android',
  'tableau', 'power bi', 'looker', 'snowflake', 'bigquery', 'spark', 'hadoop',
  'oauth', 'jwt', 'security', 'cybersecurity', 'penetration testing',
  'devops', 'sre', 'site reliability', 'monitoring', 'logging',
];

interface ParseRequest {
  text: string;
  file_name?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { text, file_name }: ParseRequest = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lowerText = text.toLowerCase();

    // Extract skills
    const foundSkills = COMMON_SKILLS.filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lowerText);
    });

    // Extract name (look for common patterns)
    let candidateName = '';
    const namePatterns = [
      /(?:name|nom)\s*[:\-]\s*([^\n]+)/i,
      /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
    ];
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        candidateName = match[1].trim();
        break;
      }
    }
    if (!candidateName && file_name) {
      candidateName = file_name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    }

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const candidateEmail = emailMatch ? emailMatch[0] : '';

    // Extract experience years
    let experienceYears = 0;
    const expPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/i,
      /(?:experience|exp)\s*[:\-]?\s*(\d+)\+?\s*years?/i,
    ];
    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) {
        experienceYears = parseInt(match[1]);
        break;
      }
    }

    // Extract education
    const educationKeywords = ['bachelor', 'master', 'phd', 'ph.d', 'b.s', 'm.s', 'b.a', 'm.a', 'mba', 'b.tech', 'm.tech', 'degree', 'diploma', 'certificate'];
    const education: { degree: string; institution: string; year: string }[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (educationKeywords.some(k => lower.includes(k))) {
        education.push({
          degree: line.trim().substring(0, 100),
          institution: '',
          year: (line.match(/20\d{2}|19\d{2}/) || [''])[0],
        });
      }
    }

    // Extract work history
    const workHistory: { title: string; company: string; duration: string; description: string }[] = [];
    const jobTitlePatterns = [
      /(?:senior|junior|lead|principal|staff|chief|head)\s+(?:software|frontend|backend|fullstack|full-stack|data|ml|devops|cloud|product|project|engineering|design|marketing|sales)\s+(?:engineer|developer|designer|manager|director|analyst|scientist|architect)/gi,
      /(?:software|frontend|backend|fullstack|full-stack|data|ml|devops|cloud|product|project)\s+(?:engineer|developer|designer|manager|director|analyst|scientist|architect)/gi,
    ];
    for (const pattern of jobTitlePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        workHistory.push({
          title: match[0].trim(),
          company: '',
          duration: '',
          description: '',
        });
      }
    }

    const parsedData = {
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      skills: [...new Set(foundSkills)],
      experience_years: experienceYears,
      education,
      work_history: workHistory.slice(0, 10),
    };

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
