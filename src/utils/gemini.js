const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey() {
  return localStorage.getItem('gemini_api_key') || '';
}

export function setApiKey(key) {
  localStorage.setItem('gemini_api_key', key);
}

export function hasApiKey() {
  return !!getApiKey();
}

async function callGemini(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No Gemini API key configured');

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractJSON(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    try { return JSON.parse(match[1].trim()); } catch(e) {}
  }
  try { return JSON.parse(text); } catch(e) {}
  const braceMatch = text.match(/[\[{][\s\S]*[\]}]/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch(e) {}
  }
  return null;
}

export async function parseResume(text) {
  const prompt = `Analyze this resume text and extract structured data. Return ONLY a JSON object with this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, State",
  "summary": "Brief professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "years": 2,
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Year"
    }
  ],
  "totalExperience": 5,
  "topSkills": ["top1", "top2", "top3", "top4", "top5"]
}

Resume text:
${text}`;

  const response = await callGemini(prompt);
  return extractJSON(response);
}

export async function generateJD(formData) {
  const prompt = `Create a comprehensive, professional job description based on these inputs. Return ONLY a JSON object:
{
  "title": "Job Title",
  "company": "${formData.company}",
  "location": "${formData.location}",
  "type": "${formData.type}",
  "experience": "${formData.experience}",
  "salary": "${formData.salary}",
  "summary": "2-3 sentence overview",
  "responsibilities": ["resp1", "resp2", ...],
  "requirements": ["req1", "req2", ...],
  "niceToHave": ["nice1", "nice2", ...],
  "skills": ["skill1", "skill2", ...],
  "benefits": ["benefit1", "benefit2", ...],
  "fullDescription": "Full formatted job description text"
}

Role: ${formData.role}
Department: ${formData.department}
Key technologies: ${formData.technologies}
Team size: ${formData.teamSize}
Additional notes: ${formData.notes}`;

  const response = await callGemini(prompt);
  return extractJSON(response);
}

export async function scoreJD(jdText) {
  const prompt = `Evaluate this job description and rate it. Return ONLY a JSON object:
{
  "overallScore": 85,
  "clarity": { "score": 90, "feedback": "..." },
  "skillBalance": { "score": 80, "feedback": "..." },
  "inclusivity": { "score": 85, "feedback": "..." },
  "completeness": { "score": 82, "feedback": "..." },
  "improvements": ["suggestion1", "suggestion2", ...],
  "strengths": ["strength1", "strength2", ...]
}

Job Description:
${jdText}`;

  const response = await callGemini(prompt);
  return extractJSON(response);
}

export async function generateInterviewQuestions(role, skills) {
  const prompt = `Generate 5 interview questions for a ${role} position requiring these skills: ${skills.join(', ')}. 
Mix technical and behavioral questions. Return ONLY a JSON array:
[
  {
    "id": 1,
    "question": "Question text",
    "type": "technical|behavioral",
    "difficulty": "easy|medium|hard",
    "expectedTopics": ["topic1", "topic2"]
  }
]`;

  const response = await callGemini(prompt);
  return extractJSON(response);
}

export async function evaluateAnswer(question, answer, role) {
  const prompt = `Evaluate this interview answer for a ${role} position.

Question: ${question}
Answer: ${answer}

Return ONLY a JSON object:
{
  "score": 75,
  "maxScore": 100,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "Detailed feedback paragraph",
  "keyMissing": ["missed topic1", "missed topic2"]
}`;

  const response = await callGemini(prompt);
  return extractJSON(response);
}

export async function analyzeSkillGap(candidateSkills, targetRole) {
  const prompt = `Analyze skill gaps for a candidate targeting a ${targetRole} role.

Candidate skills: ${candidateSkills.join(', ')}

Return ONLY a JSON object:
{
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "partialSkills": [{"skill": "name", "level": "beginner|intermediate", "needed": "advanced"}],
  "recommendations": [
    {
      "skill": "Skill Name",
      "priority": "high|medium|low",
      "courses": [
        {"name": "Course Name", "platform": "Platform", "url": "#", "duration": "X hours"}
      ]
    }
  ],
  "overallReadiness": 72,
  "summary": "Brief analysis"
}`;

  const response = await callGemini(prompt);
  return extractJSON(response);
}
