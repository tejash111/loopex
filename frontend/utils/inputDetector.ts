// Indian cities and locations
const LOCATIONS = [
  // Metros and Tier-1
  'mumbai','bombay','delhi','new delhi','delhi ncr','ncr',
  'bangalore','bengaluru','blr','hyderabad','hyd','chennai','chn',
  'kolkata','calcutta','pune','gurgaon','gurugram','noida','ghaziabad',

  // Tier-2
  'ahmedabad','surat','jaipur','lucknow','kanpur','nagpur','indore',
  'bhopal','visakhapatnam','vizag','patna','vadodara','ludhiana','agra',
  'nashik','faridabad','meerut','rajkot','varanasi','srinagar','allahabad',
  'prayagraj','ranchi','coimbatore','jabalpur','gwalior','vijayawada',
  'jodhpur','madurai','raipur','kota','mysore','mysuru','kochi','cochin',
  'trivandrum','thiruvananthapuram','mangalore','mangaluru',

  // States
  'maharashtra','karnataka','tamil nadu','telangana','andhra pradesh',
  'kerala','gujarat','rajasthan','uttar pradesh','bihar','punjab','haryana',
  'madhya pradesh','odisha','jharkhand','west bengal','assam','uttarakhand'
];


// Job titles and roles
const JOB_TITLES = [
  'engineer','developer','designer','manager','analyst','consultant',
  'architect','executive','officer','associate','specialist','coordinator',

  // IT / India-specific
  'software engineer','software developer','full stack developer',
  'frontend developer','backend developer','mern developer','mean developer',
  'java developer','python developer','react developer','nodejs developer',
  'sde','sde1','sde2','sde3','data engineer','data analyst','ml engineer',
  'devops engineer','cloud engineer','ui designer','ux designer',
  'product manager','project manager','business analyst','qa','tester',
  'test engineer','support engineer','technical support','helpdesk'
];


// Years/experience keywords
const EXPERIENCE_KEYWORDS = [
  'year','years','yr','yrs','yoe','experience','exp',
  'fresher','freshers','experienced','entry level','junior','senior',
  '0-1','1-2','2-3','3-5','5-7','7-10','10+',
  'months','month','internship','trainee'
];


// Salary keywords
const SALARY_KEYWORDS = [
  'lakh','lakhs','lac','lacs','lpa','ctc','salary','package',
  'fixed','variable','compensation','in hand','take home',
  'inr','rupees','rs','₹','crore','crores','k','thousand'
];


// Skills and technologies
const SKILLS = [
  'react','reactjs','angular','vue','nextjs','next.js',
  'nodejs','node.js','express','django','flask','spring','spring boot',
  'javascript','typescript','python','java','c++','c#','php','golang','go',
  'swift','kotlin','dart','html','css','sass','scss',

  // Databases
  'mongodb','mysql','postgresql','redis','sql','nosql',

  // DevOps
  'aws','azure','gcp','docker','kubernetes','jenkins','terraform',

  // Tools
  'git','github','gitlab','figma','jira','postman',

  // Testing
  'selenium','jest','cypress',

  // Extra India specific
  'dsa','data structures','algorithms','microservices','rest api'
];


// Industry keywords
const INDUSTRIES = [
  'it','software','technology','fintech','finance','banking','insurance',
  'healthcare','pharma','ecommerce','retail','consulting','edtech',
  'startup','manufacturing','automotive','travel','hospitality','logistics',
  'telecom','media','entertainment','real estate','fmcg','agriculture',
  'bpo','kpo','government','psu','mining','steel','renewable','solar','ev'
];


/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if text contains any keyword from a list
 */
function containsKeyword(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => {
    const escapedKeyword = escapeRegex(keyword.toLowerCase());
    // Match whole words or as part of compound words
    const pattern = new RegExp(`\\b${escapedKeyword}\\b|${escapedKeyword}`, 'i');
    return pattern.test(lowerText);
  });
}

/**
 * Detect which categories are present in the input text
 */
export function detectCategories(text: string): {
  location: boolean;
  jobTitle: boolean;
  experience: boolean;
  salary: boolean;
  skills: boolean;
  industry: boolean;
} {
  if (!text || text.trim().length === 0) {
    return {
      location: false,
      jobTitle: false,
      experience: false,
      salary: false,
      skills: false,
      industry: false,
    };
  }

  return {
    location: containsKeyword(text, LOCATIONS),
    jobTitle: containsKeyword(text, JOB_TITLES),
    experience: containsKeyword(text, EXPERIENCE_KEYWORDS),
    salary: containsKeyword(text, SALARY_KEYWORDS),
    skills: containsKeyword(text, SKILLS),
    industry: containsKeyword(text, INDUSTRIES),
  };
}

/**
 * Get border color based on whether any keywords are detected
 */
export function getBorderColor(text: string): string {
  const categories = detectCategories(text);
  const hasAnyCategory = Object.values(categories).some(val => val);
  return hasAnyCategory ? '#22C55E' : '#26272B';
}
