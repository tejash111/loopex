/**
 * Generate Sample Profiles with Embeddings
 * Creates 40 diverse profiles for testing semantic search
 * 
 * Usage: node scripts/generateSampleProfiles.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../models/Profile.model');
const User = require('../models/User.model');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopex';
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB connected\n');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample data arrays
const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ishaan', 'Krishna', 'Advait', 'Dhruv',
    'Aaradhya', 'Ananya', 'Diya', 'Kavya', 'Ishita', 'Saanvi', 'Navya', 'Aadhya', 'Myra', 'Sara',
    'Rohan', 'Aayush', 'Arnav', 'Aarush', 'Kabir', 'Shivansh', 'Rishi', 'Vedant', 'Atharv', 'Shaurya',
    'Kiara', 'Anika', 'Tara', 'Riya', 'Ira', 'Zara', 'Pari', 'Shanaya', 'Mishka', 'Anvi'
];

const lastNames = [
    'Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Joshi', 'Kulkarni',
    'Mehta', 'Agarwal', 'Desai', 'Iyer', 'Menon', 'Kapoor', 'Malhotra', 'Chopra', 'Thakur', 'Rao',
    'Pillai', 'Shetty', 'Naik', 'Bhat', 'Jain', 'Shah', 'Bansal', 'Saxena', 'Arora', 'Khanna',
    'Bose', 'Das', 'Dutta', 'Ghosh', 'Roy', 'Sengupta', 'Chatterjee', 'Mukherjee', 'Bhattacharya', 'Saha'
];

const cities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad',
    'Gurgaon', 'Noida', 'Kochi', 'Chandigarh', 'Jaipur', 'Indore', 'Bhopal', 'Lucknow'
];

const jobTitles = [
    { title: 'Senior Full Stack Developer', level: 'senior', category: 'Full Stack' },
    { title: 'Frontend Developer', level: 'mid', category: 'Frontend' },
    { title: 'Backend Engineer', level: 'mid', category: 'Backend' },
    { title: 'UI/UX Designer', level: 'mid', category: 'Design' },
    { title: 'DevOps Engineer', level: 'senior', category: 'DevOps' },
    { title: 'Data Scientist', level: 'senior', category: 'Data Science' },
    { title: 'Mobile App Developer', level: 'mid', category: 'Mobile' },
    { title: 'Product Manager', level: 'senior', category: 'Product' },
    { title: 'QA Engineer', level: 'mid', category: 'QA' },
    { title: 'Machine Learning Engineer', level: 'senior', category: 'ML/AI' },
    { title: 'React Developer', level: 'mid', category: 'Frontend' },
    { title: 'Node.js Developer', level: 'mid', category: 'Backend' },
    { title: 'Python Developer', level: 'mid', category: 'Backend' },
    { title: 'Java Developer', level: 'senior', category: 'Backend' },
    { title: 'Cloud Architect', level: 'senior', category: 'Cloud' },
    { title: 'Security Engineer', level: 'senior', category: 'Security' },
    { title: 'Blockchain Developer', level: 'mid', category: 'Blockchain' },
    { title: 'iOS Developer', level: 'mid', category: 'Mobile' },
    { title: 'Android Developer', level: 'mid', category: 'Mobile' },
    { title: 'Technical Lead', level: 'senior', category: 'Leadership' }
];

const companies = [
    'TechCorp', 'Innovate Solutions', 'CloudWorks', 'DataSphere', 'CodeNest',
    'FutureTech', 'Zenith Systems', 'Nexus Digital', 'Quantum Labs', 'Stellar Solutions',
    'ByteForce', 'Apex Technologies', 'Vertex Systems', 'Prime Digital', 'CoreStack',
    'Phoenix Tech', 'Titan Solutions', 'Orbit Systems', 'Nova Technologies', 'Matrix Labs'
];

const skillCategories = {
    'Frontend': [
        ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
        ['Vue.js', 'Angular', 'JavaScript', 'SASS', 'Webpack'],
        ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Redux']
    ],
    'Backend': [
        ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API'],
        ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
        ['Java', 'Spring Boot', 'MySQL', 'Microservices', 'Kafka']
    ],
    'Full Stack': [
        ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
        ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Docker'],
        ['Angular', 'Java', 'Spring', 'MySQL', 'Kubernetes']
    ],
    'Mobile': [
        ['React Native', 'JavaScript', 'Redux', 'Firebase', 'iOS'],
        ['Flutter', 'Dart', 'Firebase', 'REST API', 'Android'],
        ['Swift', 'iOS', 'SwiftUI', 'Core Data', 'XCode']
    ],
    'DevOps': [
        ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
        ['CI/CD', 'Azure', 'Ansible', 'Prometheus', 'Grafana'],
        ['GCP', 'GitLab CI', 'Helm', 'ArgoCD', 'Monitoring']
    ],
    'Data Science': [
        ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'],
        ['R', 'Machine Learning', 'Statistics', 'SQL', 'Tableau'],
        ['PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Keras']
    ],
    'Design': [
        ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
        ['Wireframing', 'UI Design', 'UX Design', 'InVision', 'Zeplin'],
        ['Design Systems', 'Interaction Design', 'Usability Testing', 'Adobe Creative Suite']
    ],
    'Cloud': [
        ['AWS', 'Lambda', 'S3', 'EC2', 'CloudFormation'],
        ['Azure', 'Azure Functions', 'Blob Storage', 'ARM Templates'],
        ['GCP', 'Cloud Functions', 'BigQuery', 'Cloud Storage']
    ],
    'ML/AI': [
        ['TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision'],
        ['Machine Learning', 'Neural Networks', 'Python', 'Keras', 'MLOps'],
        ['AI', 'LLMs', 'Transformers', 'Hugging Face', 'BERT']
    ]
};

const additionalSkillsPool = [
    ['Team Leadership', 'Agile', 'Scrum', 'Project Management'],
    ['Communication', 'Problem Solving', 'Code Review', 'Mentoring'],
    ['API Design', 'System Architecture', 'Database Design', 'Performance Optimization'],
    ['Testing', 'Debugging', 'CI/CD', 'Git', 'Documentation'],
    ['Cloud Architecture', 'Microservices', 'Security', 'Scalability']
];

const institutes = [
    'IIT Delhi', 'IIT Bombay', 'IIT Bangalore', 'IIT Madras', 'IIT Kharagpur',
    'BITS Pilani', 'NIT Trichy', 'NIT Surathkal', 'IIIT Hyderabad', 'VIT Vellore',
    'Delhi University', 'Mumbai University', 'Pune University', 'Anna University',
    'Manipal Institute', 'SRM University', 'Amity University', 'Christ University'
];

const degrees = [
    'B.Tech', 'B.E.', 'M.Tech', 'M.Sc', 'BCA', 'MCA', 'B.Sc'
];

const fields = [
    'Computer Science', 'Information Technology', 'Software Engineering',
    'Electronics and Communication', 'Computer Applications', 'Data Science'
];

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExperienceString(years, months = null) {
    if (months === null) {
        months = randomInt(0, 11);
    }
    let str = '';
    if (years > 0) str += `${years} yr${years > 1 ? 's' : ''}`;
    if (months > 0) {
        if (str) str += ' ';
        str += `${months} mo${months > 1 ? 's' : ''}`;
    }
    return str || '0 yrs';
}

function generateProfile(index) {
    const name = `${randomElement(firstNames)} ${randomElement(lastNames)}`;
    const location = `${randomElement(cities)}, India`;
    
    // Current job
    const currentJob = randomElement(jobTitles);
    const currentCompany = randomElement(companies);
    const yearsInCurrent = randomInt(1, 5);
    
    // Previous job
    const previousJob = randomElement(jobTitles.filter(j => j.category === currentJob.category || Math.random() > 0.5));
    const previousCompany = randomElement(companies.filter(c => c !== currentCompany));
    const yearsInPrevious = randomInt(1, 4);
    
    const totalYears = yearsInCurrent + yearsInPrevious;
    const totalMonths = randomInt(0, 11);
    
    // Skills
    const skillSet = skillCategories[currentJob.category] || skillCategories['Full Stack'];
    const skills = randomElement(skillSet);
    
    // Work Experience
    const workExperience = [
        {
            title: currentJob.title,
            company: currentCompany,
            isPromoted: Math.random() > 0.7,
            startDate: new Date(2024 - yearsInCurrent, randomInt(0, 11), 1),
            endDate: null,
            description: `Leading ${currentJob.category.toLowerCase()} development and delivering high-quality solutions.`,
            location: location.split(',')[0]
        },
        {
            title: previousJob.title,
            company: previousCompany,
            isPromoted: false,
            startDate: new Date(2024 - yearsInCurrent - yearsInPrevious, randomInt(0, 11), 1),
            endDate: new Date(2024 - yearsInCurrent, randomInt(0, 11), 1),
            description: `Worked on ${previousJob.category.toLowerCase()} projects and contributed to team success.`,
            location: randomElement(cities)
        }
    ];
    
    // Education
    const institute = randomElement(institutes);
    const degree = randomElement(degrees);
    const field = randomElement(fields);
    const graduationYear = 2024 - totalYears - randomInt(0, 2);
    
    const education = [{
        institute,
        degree,
        fieldOfStudy: field,
        startDate: new Date(graduationYear - 4, 6, 1),
        endDate: new Date(graduationYear, 4, 1)
    }];
    
    // Additional skills
    const additionalSkills = {
        skills: randomElement(additionalSkillsPool)
    };
    
    // Stats
    const stats = {
        averageTenure: generateExperienceString(Math.floor(totalYears / 2)),
        currentTenure: generateExperienceString(yearsInCurrent),
        totalExperience: generateExperienceString(totalYears, totalMonths)
    };
    
    // Contact
    const firstName = name.split(' ')[0].toLowerCase();
    const socials = {
        whatsapp: `+91 ${randomInt(70, 99)}${randomInt(10, 99)}${randomInt(100, 999)}${randomInt(100, 999)}`,
        linkedin: `https://linkedin.com/in/${firstName}${randomInt(100, 999)}`,
        github: Math.random() > 0.3 ? `https://github.com/${firstName}dev` : undefined,
        mail: `${firstName}.${randomInt(10, 99)}@example.com`,
        portfolio: Math.random() > 0.5 ? `https://${firstName}portfolio.dev` : undefined
    };
    
    const languages = ['English', 'Hindi'];
    if (Math.random() > 0.5) {
        languages.push(randomElement(['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi']));
    }
    
    return {
        name,
        location,
        socials,
        workExperience,
        education,
        skills: [{ category: currentJob.category, skills }],
        additionalSkills,
        languages,
        stats
    };
}

async function generateProfiles() {
    try {
        await connectDB();
        
        console.log('🔨 Generating 40 diverse profiles...\n');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 1; i <= 40; i++) {
            try {
                // Generate profile data
                const profileData = generateProfile(i);
                
                // Create a dummy user first
                const user = new User({
                    email: profileData.socials.mail,
                    password: 'dummy_password_123',
                    verified: true,
                    onboardingCompleted: true
                });
                await user.save();
                
                // Create profile with user reference
                const profile = new Profile({
                    userId: user._id,
                    ...profileData
                });
                
                // Save profile (embedding will be auto-generated via pre-save hook)
                await profile.save();
                
                console.log(`[${i}/40] ✅ Created: ${profileData.name} - ${profileData.workExperience[0].title}`);
                successCount++;
                
                // Small delay to avoid rate limiting
                if (i % 5 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (error) {
                console.log(`[${i}/40] ❌ Error: ${error.message}`);
                errorCount++;
            }
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 GENERATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📈 Total: 40`);
        console.log('='.repeat(60));
        
        // Show final counts
        const totalProfiles = await Profile.countDocuments();
        const withEmbeddings = await Profile.countDocuments({
            profileEmbedding: { $exists: true, $not: { $size: 0 } }
        });
        
        console.log(`\n📊 Database Status:`);
        console.log(`   Total profiles: ${totalProfiles}`);
        console.log(`   With embeddings: ${withEmbeddings}`);
        console.log(`   Without embeddings: ${totalProfiles - withEmbeddings}`);
        
        if (totalProfiles - withEmbeddings > 0) {
            console.log(`\n💡 Run to generate embeddings for remaining profiles:`);
            console.log(`   node scripts/generateEmbeddings.js`);
        } else {
            console.log(`\n🎉 All profiles have embeddings!`);
        }
        
    } catch (error) {
        console.error('❌ Generation failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 MongoDB disconnected');
        process.exit(0);
    }
}

// Run the script
generateProfiles();
