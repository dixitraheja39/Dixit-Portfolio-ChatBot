export const portfolio = {
  name: 'Dixit',
  age: 18,
  location: 'Samana, Punjab, India',
  role: 'Aspiring Software Engineer',
  headline: 'B.E. CSE Student | DSA Enthusiast | Aspiring Full-Stack Developer',
  about: 'I am an 18-year-old Computer Science Engineering student at Chitkara University. I am interested in programming, problem-solving, Data Structures and Algorithms, and software development. I practice C++ and Java, explore modern web development, and enjoy building practical projects.',
  education: [
    { degree: 'Bachelor of Engineering', field: 'Computer Science and Engineering', school: 'Chitkara University', year: '2nd Year', result: '9.5 CGPA' },
    { degree: 'Class 12', school: 'Agarsain Public School', result: '64%' },
    { degree: 'Class 10', school: 'Agarsain Public School', result: '74%' },
  ],
  skills: {
    programming: ['C++', 'Java', 'JavaScript', 'TypeScript (learning)'],
    frontend: ['HTML', 'CSS', 'React.js', 'Next.js'],
    tools: ['Visual Studio Code', 'Git', 'GitHub', 'Antigravity AI'],
    learning: ['Backend Development', 'Database Management', 'API Integration', 'Authentication Systems'],
  },
  dsa: [
    'Arrays and Strings', 'Sorting and Searching', 'Binary Search', 'Linked Lists',
    'Stacks and Queues', 'Hash Maps and Hash Sets', 'Sliding Window', 'Two Pointers',
    'Recursion and Backtracking', 'Trees and Binary Search Trees',
    'Graphs (BFS and DFS)', 'Dynamic Programming', 'Greedy Algorithms',
  ],
  projects: [
    {
      name: 'Passport',
      type: 'Email OTP Authentication System',
      description: 'An email-based authentication application with six-digit OTP verification, protected dashboard, and session management.',
      technologies: ['Next.js', 'TypeScript', 'Supabase', 'Resend'],
      status: 'In development',
    },
  ],
  interests: ['Competitive Programming', 'Artificial Intelligence', 'Software Engineering', 'Full-Stack Development', 'Problem Solving', 'Learning New Technologies'],
  objective: 'My goal is to become a skilled Software Engineer, improve my problem-solving abilities, and build useful real-world applications using modern technologies.',
  contact: { email: 'dixitraheja7788@gmail.com' },
}

export const profileContext = [
  `Name: ${portfolio.name}; age: ${portfolio.age}; location: ${portfolio.location}; role: ${portfolio.role}.`,
  `Headline: ${portfolio.headline}`,
  `About: ${portfolio.about}`,
  `Education: ${portfolio.education.map((item) => `${item.degree}${item.field ? ` in ${item.field}` : ''}, ${item.school}, ${item.year ? `${item.year}, ` : ''}${item.result}`).join('; ')}`,
  `Programming: ${portfolio.skills.programming.join(', ')}. Frontend: ${portfolio.skills.frontend.join(', ')}. Tools: ${portfolio.skills.tools.join(', ')}. Learning: ${portfolio.skills.learning.join(', ')}.`,
  `DSA topics: ${portfolio.dsa.join(', ')}.`,
  `Project: ${portfolio.projects.map((project) => `${project.name}, ${project.type}. ${project.description} Technologies: ${project.technologies.join(', ')}. Status: ${project.status}.`).join(' ')}`,
  `Interests: ${portfolio.interests.join(', ')}. Career objective: ${portfolio.objective}`,
  `Contact email: ${portfolio.contact.email}`,
].join('\n')
