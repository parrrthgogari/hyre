export function cosineSimilarity(skillsA, skillsB) {
  const allSkills = [...new Set([...skillsA, ...skillsB])].map(s => s.toLowerCase());
  const vecA = allSkills.map(s => skillsA.map(x => x.toLowerCase()).includes(s) ? 1 : 0);
  const vecB = allSkills.map(s => skillsB.map(x => x.toLowerCase()).includes(s) ? 1 : 0);
  
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magA === 0 || magB === 0) return 0;
  return Math.round((dotProduct / (magA * magB)) * 100);
}

export function rankCandidates(candidates, jobSkills) {
  return candidates
    .map(c => ({
      ...c,
      matchScore: cosineSimilarity(c.skills || [], jobSkills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function matchJobsToCandidate(jobs, candidateSkills) {
  return jobs
    .map(j => ({
      ...j,
      matchScore: cosineSimilarity(candidateSkills, j.skills || []),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function calculatePercentile(candidateScore, allScores) {
  const sorted = [...allScores].sort((a, b) => a - b);
  const rank = sorted.filter(s => s < candidateScore).length;
  return Math.round((rank / sorted.length) * 100);
}

export function getSkillMatchDetails(candidateSkills, jobSkills) {
  const cLower = candidateSkills.map(s => s.toLowerCase());
  const jLower = jobSkills.map(s => s.toLowerCase());
  
  const matched = jobSkills.filter(s => cLower.includes(s.toLowerCase()));
  const missing = jobSkills.filter(s => !cLower.includes(s.toLowerCase()));
  const extra = candidateSkills.filter(s => !jLower.includes(s.toLowerCase()));
  
  return { matched, missing, extra };
}
