import { UserProfile, FriendRequest, ChatThread, ChatMessage, AppNotification, AlumniEvent, Announcement, Opportunity, Chapter, CareerMilestone, GalleryItem } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user_default_admin',
    name: 'Administrator',
    email: 'admin@stcecilia.edu',
    password: 'Password123!',
    role: 'admin',
    batch: '2015',
    course: 'Public Administration & Institutional Governance',
    location: 'St. Cecilia’s Campus, Administration Hall',
    profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    headline: 'System & Alumni Relations Administrator • St. Cecilia’s College',
    about: 'Official system administrator for St. Cecilia’s Alumni Portal. Overseeing member verification, records verification, campus event coordination, and community engagement.',
    phone: '+63 918 987 6543',
    employeeId: 'ADM-2015-001',
    department: 'Alumni Affairs & Institutional Advancement',
    isVerified: true,
    followersCount: 1,
    followingCount: 0,
    connectionsCount: 0,
    experience: [
      {
        id: 'exp_adm_1',
        title: 'Director of Alumni Relations',
        company: 'St. Cecilia’s College',
        location: 'Campus Administration',
        startDate: '2018-01',
        current: true,
        description: 'Coordinating institutional engagement, alumni affairs, and scholarship foundations.'
      }
    ],
    education: [
      {
        id: 'edu_adm_1',
        degree: 'Bachelor of Science in Public Administration',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Public Administration',
        startYear: '2011',
        endYear: '2015',
        honors: 'Magna Cum Laude'
      }
    ],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    uid: 'user_default_registrar',
    name: 'Maria Santos',
    email: 'registrar@stcecilia.edu',
    password: 'Password123!',
    role: 'registrar',
    batch: '2018',
    course: 'Educational Management & Academic Registry',
    location: 'St. Cecilia’s Campus, Office of the Registrar',
    profilePictureUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    headline: 'Head University Registrar • St. Cecilia’s College',
    about: 'Lead Registrar overseeing academic credentials, commencement records, institutional archiving, and alumni heritage verification.',
    phone: '+63 917 888 2345',
    employeeId: 'REG-2018-042',
    department: 'Office of the Registrar & Academic Records',
    isVerified: true,
    followersCount: 0,
    followingCount: 0,
    connectionsCount: 0,
    experience: [
      {
        id: 'exp_reg_1',
        title: 'Head Registrar',
        company: 'St. Cecilia’s College',
        location: 'Registrar Hall',
        startDate: '2019-06',
        current: true,
        description: 'Managing student archives, alumni diplomas, graduation certifications, and campus heritage registry.'
      }
    ],
    education: [
      {
        id: 'edu_reg_1',
        degree: 'Bachelor of Science in Education & Records Administration',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Education',
        startYear: '2014',
        endYear: '2018',
        honors: 'Cum Laude'
      }
    ],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    uid: 'user_default_alumni',
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2024',
    course: 'B.S. Information Technology',
    location: 'Cebu, Philippines',
    profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
    headline: 'Junior Software Associate • St. Cecilia’s Alum',
    about: 'Proud alumnus of St. Cecilia’s College, Class of 2024. Interested in software engineering, cloud computing, and staying connected with batchmates and mentors.',
    phone: '+63 917 123 4567',
    studentId: 'SC-2020-0192',
    isVerified: true,
    followersCount: 0,
    followingCount: 1,
    connectionsCount: 0,
    experience: [
      {
        id: 'exp_jdc_1',
        title: 'Junior Software Engineer',
        company: 'NextGen Solutions Inc.',
        location: 'Cebu IT Park',
        startDate: '2024-07',
        current: true,
        description: 'Building modern responsive web interfaces and cloud-native backend services.'
      }
    ],
    education: [
      {
        id: 'edu_jdc_1',
        degree: 'Bachelor of Science in Information Technology',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Information Technology',
        startYear: '2020',
        endYear: '2024',
        honors: 'Dean’s Lister, Best Capstone Project'
      }
    ],
    createdAt: '2024-06-15T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_bea',
    name: 'Bea Alonzo',
    email: 'bea.alonzo@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2020',
    course: 'B.S. Nursing',
    location: 'Cebu City, Philippines',
    profilePictureUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    headline: 'Senior Critical Care Nurse • Cebu Doctors’ University Hospital',
    about: 'Dedicated healthcare professional and proud St. Cecilia’s Nursing alumna. Passionate about community medicine, patient advocacy, and mentoring nursing graduates.',
    phone: '+63 917 222 3344',
    studentId: 'SC-2016-0812',
    isVerified: true,
    followersCount: 14,
    followingCount: 9,
    connectionsCount: 8,
    experience: [
      {
        id: 'exp_bea_1',
        title: 'Senior ICU Staff Nurse',
        company: 'Cebu Doctors’ University Hospital',
        location: 'Cebu City',
        startDate: '2020-08',
        current: true,
        description: 'Providing critical care nursing and clinical oversight in the intensive care unit.'
      }
    ],
    education: [
      {
        id: 'edu_bea_1',
        degree: 'Bachelor of Science in Nursing',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Nursing',
        startYear: '2016',
        endYear: '2020',
        honors: 'Cum Laude'
      }
    ],
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_rafael',
    name: 'Rafael Tan',
    email: 'rafael.tan@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2021',
    course: 'B.S. Computer Science',
    location: 'Tokyo, Japan',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    headline: 'Cloud Infrastructure & DevOps Engineer • Rakuten Group',
    about: 'St. Cecilia’s CS graduate based in Tokyo. Working on high-availability cloud platforms, Kubernetes clusters, and open-source infrastructure tools.',
    phone: '+81 80 1234 5678',
    studentId: 'SC-2017-0433',
    isVerified: true,
    followersCount: 22,
    followingCount: 15,
    connectionsCount: 12,
    experience: [
      {
        id: 'exp_raf_1',
        title: 'DevOps & Site Reliability Engineer',
        company: 'Rakuten',
        location: 'Tokyo, Japan',
        startDate: '2021-09',
        current: true,
        description: 'Automating multi-cloud deployments, monitoring distributed microservices, and optimizing CI/CD pipelines.'
      }
    ],
    education: [
      {
        id: 'edu_raf_1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Computer Science',
        startYear: '2017',
        endYear: '2021',
        honors: 'Magna Cum Laude'
      }
    ],
    createdAt: '2024-01-12T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_camille',
    name: 'Camille Fernandez',
    email: 'camille.f@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2019',
    course: 'B.S. Accountancy',
    location: 'Makati, Metro Manila',
    profilePictureUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    headline: 'Senior Financial Assurance Auditor • SGV & Co. (EY Philippines)',
    about: 'Certified Public Accountant (CPA) helping enterprise clients navigate financial audits, corporate compliance, and risk assessments.',
    phone: '+63 918 345 6789',
    studentId: 'SC-2015-0211',
    isVerified: true,
    followersCount: 31,
    followingCount: 19,
    connectionsCount: 17,
    experience: [
      {
        id: 'exp_cam_1',
        title: 'Senior Audit Associate',
        company: 'SGV & Co.',
        location: 'Makati City',
        startDate: '2019-10',
        current: true,
        description: 'Conducting statutory audits, risk evaluations, and financial statement verifications.'
      }
    ],
    education: [
      {
        id: 'edu_cam_1',
        degree: 'Bachelor of Science in Accountancy',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Accountancy',
        startYear: '2015',
        endYear: '2019',
        honors: 'Summa Cum Laude, CPA Board Top 10'
      }
    ],
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_mark',
    name: 'Mark Anthony Reyes',
    email: 'mark.reyes@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2022',
    course: 'B.S. Civil Engineering',
    location: 'Pasig City, Metro Manila',
    profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&auto=format&fit=crop&q=80',
    headline: 'Structural Design & Project Engineer • Megawide Construction',
    about: 'Licensed Civil Engineer focused on commercial infrastructure, earthquake-resilient structures, and sustainable green construction methodologies.',
    phone: '+63 920 456 7890',
    studentId: 'SC-2017-0921',
    isVerified: true,
    followersCount: 18,
    followingCount: 12,
    connectionsCount: 9,
    experience: [
      {
        id: 'exp_mrk_1',
        title: 'Structural Project Engineer',
        company: 'Megawide Construction Corp',
        location: 'Pasig City',
        startDate: '2022-06',
        current: true,
        description: 'Supervising high-rise building structural integrity and concrete engineering works.'
      }
    ],
    education: [
      {
        id: 'edu_mrk_1',
        degree: 'Bachelor of Science in Civil Engineering',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Civil Engineering',
        startYear: '2017',
        endYear: '2022'
      }
    ],
    createdAt: '2024-01-18T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_alyssa',
    name: 'Alyssa Dizon',
    email: 'alyssa.d@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2023',
    course: 'B.A. Communication & Media',
    location: 'Taguig, Metro Manila',
    profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    headline: 'Digital Media Strategist & Brand Lead • Ogilvy Philippines',
    about: 'Storyteller, brand strategist, and media enthusiast. Passionate about creative campaigns that spotlight Filipino creativity on the global stage.',
    phone: '+63 917 555 1234',
    studentId: 'SC-2019-0344',
    isVerified: true,
    followersCount: 42,
    followingCount: 27,
    connectionsCount: 21,
    experience: [
      {
        id: 'exp_aly_1',
        title: 'Digital Campaign Manager',
        company: 'Ogilvy',
        location: 'BGC, Taguig',
        startDate: '2023-05',
        current: true,
        description: 'Managing cross-channel brand communications, influencer partnerships, and digital PR.'
      }
    ],
    education: [
      {
        id: 'edu_aly_1',
        degree: 'Bachelor of Arts in Communication',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Communication',
        startYear: '2019',
        endYear: '2023',
        honors: 'Dean’s Lister'
      }
    ],
    createdAt: '2024-01-20T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_kenneth',
    name: 'Kenneth Lim',
    email: 'kenneth.lim@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2018',
    course: 'B.S. Information Technology',
    location: 'Singapore',
    profilePictureUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop&q=80',
    headline: 'Principal Solutions Architect • Grab Financial Group',
    about: 'St. Cecilia’s IT alumnus of 2018. Architecting fintech payment rails, secure ledger systems, and microservices for Grab across Southeast Asia.',
    phone: '+65 9123 4567',
    studentId: 'SC-2014-0155',
    isVerified: true,
    followersCount: 56,
    followingCount: 30,
    connectionsCount: 34,
    experience: [
      {
        id: 'exp_ken_1',
        title: 'Lead Enterprise Architect',
        company: 'Grab',
        location: 'Singapore',
        startDate: '2018-08',
        current: true,
        description: 'Leading architecture for real-time payments, risk detection, and regional cloud scale.'
      }
    ],
    education: [
      {
        id: 'edu_ken_1',
        degree: 'Bachelor of Science in Information Technology',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Information Technology',
        startYear: '2014',
        endYear: '2018',
        honors: 'Valedictorian'
      }
    ],
    createdAt: '2024-01-22T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_patricia',
    name: 'Patricia Gomez',
    email: 'patricia.g@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2024',
    course: 'B.S. Hospitality Management',
    location: 'Cebu, Philippines',
    profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    headline: 'Guest Experience Executive • Shangri-La Mactan Resort & Spa',
    about: 'Recent graduate of St. Cecilia’s College Hospitality program. Passionate about world-class tourism, luxury guest relations, and sustainable hospitality management.',
    phone: '+63 917 666 7890',
    studentId: 'SC-2020-0589',
    isVerified: true,
    followersCount: 15,
    followingCount: 18,
    connectionsCount: 11,
    experience: [
      {
        id: 'exp_pat_1',
        title: 'Guest Relations Executive',
        company: 'Shangri-La Mactan',
        location: 'Lapu-Lapu City, Cebu',
        startDate: '2024-05',
        current: true,
        description: 'Overseeing VIP arrivals, luxury hospitality operations, and cultural event showcases.'
      }
    ],
    education: [
      {
        id: 'edu_pat_1',
        degree: 'Bachelor of Science in Hospitality Management',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Hospitality Management',
        startYear: '2020',
        endYear: '2024',
        honors: 'Cum Laude'
      }
    ],
    createdAt: '2024-01-25T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_david',
    name: 'David Christopher Lee',
    email: 'david.lee@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2016',
    course: 'B.S. Information Technology',
    location: 'San Francisco, CA, USA',
    profilePictureUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop&q=80',
    headline: 'Staff Software Engineer • Stripe Payments Platform',
    about: 'Silicon Valley-based alumnus from Batch 2016. Passionate about developer tooling, distributed databases, and helping St. Cecilia’s tech alumni break into global careers.',
    phone: '+1 415 555 0199',
    studentId: 'SC-2012-0088',
    isVerified: true,
    followersCount: 89,
    followingCount: 45,
    connectionsCount: 52,
    experience: [
      {
        id: 'exp_dvd_1',
        title: 'Staff Software Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        startDate: '2019-02',
        current: true,
        description: 'Building global developer APIs, transaction throughput engines, and financial reconciliation microservices.'
      }
    ],
    education: [
      {
        id: 'edu_dvd_1',
        degree: 'Bachelor of Science in Information Technology',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Information Technology',
        startYear: '2012',
        endYear: '2016',
        honors: 'Magna Cum Laude'
      }
    ],
    createdAt: '2024-01-28T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_sarah',
    name: 'Sarah Mae Villacarlos',
    email: 'sarah.v@email.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2020',
    course: 'B.S. Business Administration',
    location: 'Sydney, Australia',
    profilePictureUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&auto=format&fit=crop&q=80',
    headline: 'Global Growth Product Marketing Lead • Canva',
    about: 'International marketer and proud Cecilian. Focusing on international product growth, brand positioning, and empowering visual creators worldwide.',
    phone: '+61 412 345 678',
    studentId: 'SC-2016-0419',
    isVerified: true,
    followersCount: 48,
    followingCount: 32,
    connectionsCount: 29,
    experience: [
      {
        id: 'exp_srh_1',
        title: 'Senior Product Marketing Manager',
        company: 'Canva',
        location: 'Sydney, Australia',
        startDate: '2021-04',
        current: true,
        description: 'Spearheading product adoption campaigns and international localized marketing strategies.'
      }
    ],
    education: [
      {
        id: 'edu_srh_1',
        degree: 'Bachelor of Science in Business Administration',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Marketing Management',
        startYear: '2016',
        endYear: '2020',
        honors: 'Magna Cum Laude'
      }
    ],
    createdAt: '2024-01-30T00:00:00.000Z'
  },
  {
    uid: 'user_alumni_maria_santos',
    name: 'Maria Elena Santos',
    email: 'maria.santos@techsolutions.com',
    password: 'Password123!',
    role: 'alumni',
    batch: '2020',
    course: 'B.S. Information Technology',
    currentPosition: 'Senior Software Engineer',
    company: 'Apex Cloud Systems',
    location: 'Cebu City, Philippines',
    profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    headline: 'Senior Software Engineer • Apex Cloud Systems',
    about: 'Passionate full-stack developer and alumni mentor proud of my Cecilian roots. Mentor for graduating IT/CS students.',
    bio: 'Passionate full-stack developer and alumni mentor proud of my Cecilian roots.',
    skills: ['Flutter', 'React', 'Cloud Architecture', 'TypeScript'],
    phone: '+63 918 234 5678',
    isVerified: true,
    followersCount: 65,
    followingCount: 40,
    connectionsCount: 38,
    experience: [
      {
        id: 'exp_maria_1',
        title: 'Senior Software Engineer',
        company: 'Apex Cloud Systems',
        location: 'Cebu City',
        startDate: '2022-03',
        current: true,
        description: 'Architecting scalable cloud microservices and cross-platform mobile solutions.'
      }
    ],
    education: [
      {
        id: 'edu_maria_1',
        degree: 'Bachelor of Science in Information Technology',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Information Technology',
        startYear: '2016',
        endYear: '2020',
        honors: 'Cum Laude'
      }
    ],
    createdAt: '2024-02-01T00:00:00.000Z'
  },
  {
    uid: 'user_student_joshua_ramos',
    name: 'Joshua David Ramos',
    email: 'joshua.ramos@stcecilia.edu',
    password: 'Password123!',
    role: 'student',
    batch: '2025',
    course: 'B.S. Computer Science',
    location: 'Minglanilla, Cebu',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    headline: 'Undergraduate Computer Science Student • Aspiring AI Engineer',
    about: 'Senior student aspiring to become an AI & mobile application engineer. Actively seeking mentorship and internship opportunities.',
    bio: 'Senior student aspiring to become an AI & Mobile application engineer.',
    skills: ['Dart', 'Python', 'Machine Learning', 'React'],
    studentId: 'SC-2021-0311',
    phone: '+63 919 345 6789',
    isVerified: true,
    followersCount: 22,
    followingCount: 35,
    connectionsCount: 15,
    experience: [],
    education: [
      {
        id: 'edu_josh_1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'St. Cecilia’s College',
        fieldOfStudy: 'Computer Science',
        startYear: '2021',
        endYear: '2025',
        honors: "Dean's Lister"
      }
    ],
    createdAt: '2024-02-05T00:00:00.000Z'
  },
  {
    uid: 'user_faculty_fernando_gomez',
    name: 'Dr. Fernando Gomez, PhD',
    email: 'fernando.gomez@stcecilia.edu',
    password: 'Password123!',
    role: 'faculty',
    department: 'College of Information and Communications Technology',
    currentPosition: 'Associate Professor & Research Chair',
    location: 'Minglanilla, Cebu',
    profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
    headline: 'Associate Professor & Research Chair • College of ICT',
    about: 'Guiding generations of Cecilian computer scientists and tech innovators through cutting-edge research, curriculum advancement, and industry partnerships.',
    bio: 'Guiding generations of Cecilian computer scientists and tech innovators.',
    skills: ['Software Engineering', 'Research', 'Curriculum Design', 'Data Science'],
    phone: '+63 920 456 7890',
    isVerified: true,
    followersCount: 140,
    followingCount: 25,
    connectionsCount: 88,
    experience: [
      {
        id: 'exp_fg_1',
        title: 'Associate Professor & Research Chair',
        company: 'St. Cecilia’s College',
        location: 'Minglanilla, Cebu',
        startDate: '2015-06',
        current: true,
        description: 'Leading computer science academic programs and student thesis research mentorship.'
      }
    ],
    education: [
      {
        id: 'edu_fg_1',
        degree: 'Doctor of Philosophy in Computer Science',
        institution: 'University of the Philippines',
        fieldOfStudy: 'Computer Science',
        startYear: '2010',
        endYear: '2014'
      }
    ],
    createdAt: '2024-02-10T00:00:00.000Z'
  },
  {
    uid: 'user_admin_cecilia_velasco',
    name: 'Hon. Cecilia Carreon-Velasco',
    email: 'alumni.director@stcecilia.edu',
    password: 'Password123!',
    role: 'admin',
    department: 'Alumni Affairs & Institutional Advancement',
    currentPosition: 'Director of Alumni Relations',
    location: 'Minglanilla, Cebu',
    profilePictureUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    headline: 'Director of Alumni Relations • St. Cecilia’s College',
    about: 'Connecting over 25,000 alumni worldwide and fostering institutional legacy, scholarships, and endowment funds.',
    bio: 'Connecting over 25,000 alumni worldwide and fostering institutional legacy.',
    skills: ['Institutional Leadership', 'Fundraising', 'Community Organizing'],
    phone: '+63 921 567 8901',
    isVerified: true,
    followersCount: 210,
    followingCount: 15,
    connectionsCount: 120,
    experience: [
      {
        id: 'exp_ccv_1',
        title: 'Director of Alumni Relations',
        company: 'St. Cecilia’s College',
        location: 'Campus Administration',
        startDate: '2016-01',
        current: true,
        description: 'Overseeing global alumni chapters, annual reunions, institutional archives, and Cecilian development campaigns.'
      }
    ],
    education: [
      {
        id: 'edu_ccv_1',
        degree: 'Master in Educational Leadership and Institutional Governance',
        institution: 'Ateneo de Manila University',
        fieldOfStudy: 'Educational Leadership',
        startYear: '2008',
        endYear: '2012'
      }
    ],
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    uid: 'user_superadmin_main',
    name: 'System Super Administrator',
    email: 'superadmin@stcecilia.edu',
    password: 'Password123!',
    role: 'superadmin',
    currentPosition: 'Chief Information Officer',
    location: 'Minglanilla, Cebu',
    profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    headline: 'Chief Information Officer • Institutional IT Governance',
    about: 'Institutional IT governance and security oversight for all digital systems across St. Cecilia’s College.',
    bio: 'Institutional IT governance and security oversight.',
    skills: ['Enterprise Systems', 'Cybersecurity', 'Database Administration', 'Cloud Infrastructure'],
    phone: '+63 922 678 9012',
    isVerified: true,
    followersCount: 50,
    followingCount: 10,
    connectionsCount: 45,
    experience: [],
    education: [],
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'req_bea_to_juan',
    fromUid: 'user_alumni_bea',
    toUid: 'user_default_alumni',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'req_rafael_to_juan',
    fromUid: 'user_alumni_rafael',
    toUid: 'user_default_alumni',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat_admin_alumni',
    memberIds: ['user_default_admin', 'user_default_alumni'],
    lastMessage: 'Welcome to St. Cecilia’s Alumni Network! Let us know if you need any assistance.',
    lastMessageAt: new Date().toISOString(),
    unreadCount: {
      user_default_alumni: 1,
      user_default_admin: 0
    }
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  chat_admin_alumni: [
    {
      id: 'msg_welcome_1',
      chatId: 'chat_admin_alumni',
      senderId: 'user_default_admin',
      text: 'Mabuhay Juan! Welcome to St. Cecilia’s Alumni Network portal. Here you can explore upcoming alumni homecomings, find career opportunities, and reconnect with classmates.',
      createdAt: new Date().toISOString()
    }
  ]
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_welcome',
    toUid: 'user_default_alumni',
    fromUid: 'user_default_admin',
    type: 'general',
    title: 'Welcome to St. Cecilia’s Alumni Portal',
    body: 'Your account is active. Connect with fellow Cecilians and explore upcoming events!',
    read: false,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_EVENTS: AlumniEvent[] = [
  {
    id: 'evt_homecoming_2026',
    title: 'St. Cecilia’s Grand Alumni Homecoming 2026',
    description: 'Join thousands of fellow Cecilians as we gather for an unforgettable celebration of brotherhood, reminiscing, and institutional progress with live musical performances and batch parades.',
    startDate: '2026-10-24T16:00:00.000Z',
    endDate: '2026-10-24T22:00:00.000Z',
    location: 'St. Cecilia’s Main Gymnasium & Quadrangle',
    type: 'reunion',
    isVirtual: false,
    isImportant: true,
    maxAttendees: 500,
    attendeesCount: 248,
    heroImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    likes: ['user_default_admin'],
    comments: [
      {
        id: 'comm_1',
        eventId: 'evt_homecoming_2026',
        authorId: 'user_default_admin',
        authorName: 'Administrator',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        text: 'All batches from 1980 through 2025 are warmly invited! Registration kits and batch souvenirs will be provided at the entrance.',
        createdAt: '2026-09-01T08:00:00.000Z'
      },
      {
        id: 'comm_2',
        eventId: 'evt_homecoming_2026',
        authorId: 'user_default_alumni',
        authorName: 'Juan Dela Cruz',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        text: 'Will there be dedicated cluster tables for Batch 2024? Excited to reunite with all our IT batchmates and professors!',
        createdAt: '2026-09-05T10:15:00.000Z'
      },
      {
        id: 'comm_3',
        eventId: 'evt_homecoming_2026',
        authorId: 'user_default_registrar',
        authorName: 'Maria Santos',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        text: 'Yes Juan! The quadrangle will have designated sections by department and graduating batch year. See you all there!',
        createdAt: '2026-09-05T11:30:00.000Z'
      }
    ],
    createdBy: 'user_default_admin',
    createdByName: 'Administrator'
  },
  {
    id: 'evt_tech_mentorship',
    title: 'Cecilian Alumni Tech & Career Mentorship Summit',
    description: 'An interactive virtual workshop where industry-leading Cecilian graduates guide recent graduates on breaking into tech, freelancing, and career advancement.',
    startDate: '2026-11-14T14:00:00.000Z',
    endDate: '2026-11-14T17:00:00.000Z',
    location: 'Online via Zoom / Google Meet',
    type: 'workshop',
    isVirtual: true,
    isImportant: false,
    maxAttendees: 200,
    attendeesCount: 95,
    heroImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    likes: ['user_default_alumni'],
    comments: [
      {
        id: 'comm_tech_1',
        eventId: 'evt_tech_mentorship',
        authorId: 'user_default_alumni',
        authorName: 'Juan Dela Cruz',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        text: 'Looking forward to the software engineering track! Will the session recordings be available for alumni working overseas?',
        createdAt: '2026-09-08T09:00:00.000Z'
      }
    ],
    createdBy: 'user_default_admin',
    createdByName: 'Administrator'
  },
  {
    id: 'evt_global_tech_summit',
    title: 'Global Cecilian Tech & Innovation Summit',
    description: 'Virtual keynote panels featuring Cecilian alumni founders across North America, Singapore, and Europe discussing AI, Cloud, and Engineering careers.',
    startDate: '2026-10-15T13:00:00.000Z',
    endDate: '2026-10-15T17:00:00.000Z',
    location: 'Virtual Broadcast (Zoom & Live Stream)',
    type: 'webinar',
    isVirtual: true,
    isImportant: true,
    maxAttendees: 500,
    attendeesCount: 195,
    heroImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    likes: ['user_alumni_maria_santos'],
    comments: [],
    createdBy: 'user_admin_cecilia_velasco',
    createdByName: 'Hon. Cecilia Carreon-Velasco'
  },
  {
    id: 'evt_charity_run_2026',
    title: 'Alumni Charity Run & Campus Tree Planting',
    description: 'Annual scholarship fundraiser run through Minglanilla followed by campus arbor preservation and tree planting.',
    startDate: '2026-11-08T06:00:00.000Z',
    endDate: '2026-11-08T11:00:00.000Z',
    location: 'Minglanilla Sports Complex & SCC Grounds',
    type: 'social',
    isVirtual: false,
    isImportant: false,
    maxAttendees: 600,
    attendeesCount: 310,
    heroImageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&auto=format&fit=crop&q=80',
    likes: [],
    comments: [],
    createdBy: 'user_admin_cecilia_velasco',
    createdByName: 'Hon. Cecilia Carreon-Velasco'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_welcome_portal',
    title: 'Welcome to the Official St. Cecilia’s Alumni Portal',
    content: 'We are thrilled to launch the new online portal for St. Cecilia’s alumni worldwide! You can now browse verified batchmates, explore official events, update your employment milestones, and communicate with campus departments directly.',
    important: true,
    publishedAt: new Date().toISOString(),
    createdBy: 'user_default_admin',
    authorName: 'Office of Alumni Relations',
    authorRole: 'admin'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_frontend_dev',
    title: 'Junior / Associate Frontend Developer',
    company: 'Cecilian Tech Ventures',
    location: 'Cebu / Hybrid or Remote',
    type: 'Full-time',
    description: 'Seeking motivated junior software engineers to build scalable React applications. Fresh graduates from St. Cecilia’s College are prioritized!',
    salaryOrStipend: '₱35,000 - ₱45,000 / month',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Git'],
    contactEmail: 'careers@ceciliantech.com',
    postedBy: 'user_default_admin',
    posterName: 'Administrator',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'opp_flutter_dev_apex',
    title: 'Junior Mobile Application Developer (Flutter / iOS)',
    company: 'Apex Cloud Systems',
    location: 'Cebu City / Hybrid',
    type: 'Full-time',
    description: 'Building next-generation mobile applications for global fintech clients. Open to Cecilian graduates with strong Dart/Flutter or React Native skills.',
    salaryOrStipend: '₱35,000 - ₱55,000 / month',
    skills: ['Flutter', 'Dart', 'REST APIs', 'Git', 'Firebase'],
    contactEmail: 'maria.santos@techsolutions.com',
    postedBy: 'user_alumni_maria_santos',
    posterName: 'Maria Elena Santos',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'active'
  },
  {
    id: 'opp_tech_mentorship_program',
    title: 'Alumni Tech Industry Mentorship Program',
    company: 'Cecilian Tech Founders Circle',
    location: 'Virtual / Remote',
    type: 'Mentorship',
    description: 'Get paired 1-on-1 with industry veterans for resume reviews, mock interviews, and career guidance.',
    salaryOrStipend: 'Pro-Bono Mentorship',
    skills: ['Career Guidance', 'Mock Interviews', 'Portfolio Review'],
    contactEmail: 'alumni.director@stcecilia.edu',
    postedBy: 'user_admin_cecilia_velasco',
    posterName: 'Hon. Cecilia Carreon-Velasco',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'active'
  },
  {
    id: 'opp_qa_intern_visayas',
    title: 'Software Quality Assurance Intern',
    company: 'Visayas Digital Labs',
    location: 'Minglanilla / On-site',
    type: 'Internship',
    description: 'Exciting paid internship opportunity for graduating students to learn automated and manual testing methodologies.',
    salaryOrStipend: '₱12,000 allowance / month',
    skills: ['Testing', 'Documentation', 'Attention to Detail'],
    contactEmail: 'careers@visayasdigitallabs.com',
    postedBy: 'user_alumni_maria_santos',
    posterName: 'Maria Elena Santos',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: 'active'
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'chap_cebu_main',
    name: 'Metro Cebu Central Chapter',
    region: 'Central Visayas, Philippines',
    leadName: 'Engr. Roberto Mendoza',
    leadEmail: 'cebu.chapter@stcecilia.edu',
    memberCount: 1840,
    meetingFrequency: 'Quarterly',
    description: 'Official chapter serving alumni residing in Cebu and neighboring provinces in Central Visayas.'
  },
  {
    id: 'chap_north_america',
    name: 'North America Cecilians Alliance',
    region: 'California, United States',
    leadName: 'Dr. Clarissa Uy-Tan',
    leadEmail: 'northamerica@stcecilia.edu',
    memberCount: 650,
    meetingFrequency: 'Bi-annual',
    description: 'Connecting alumni living and working across the United States and Canada.'
  },
  {
    id: 'chap_middle_east',
    name: 'Middle East & Gulf Chapter',
    region: 'Dubai, UAE',
    leadName: 'Architect Noel Santos',
    leadEmail: 'middleeast@stcecilia.edu',
    memberCount: 420,
    meetingFrequency: 'Annual',
    description: 'Active chapter organizing professional and charitable gatherings across the UAE and Gulf region.'
  }
];

export const INITIAL_MILESTONES: CareerMilestone[] = [
  {
    id: 'mile_1',
    uid: 'user_default_alumni',
    alumniName: 'Juan Dela Cruz',
    batch: '2024',
    title: 'Graduated B.S. Information Technology with Academic Honors',
    category: 'Award',
    description: 'Successfully completed the degree program and joined NextGen Solutions as an Associate Software Engineer.',
    company: 'NextGen Solutions Inc.',
    date: '2024-06-20'
  },
  {
    id: 'mile_2',
    uid: 'user_alumni_rafael',
    alumniName: 'Justice Rafael Alvarez',
    batch: 'Class of 1998',
    title: 'Distinguished Cecilian Jurist Award',
    category: 'Award',
    description: 'For exemplary service in judicial integrity and constitutional governance.',
    company: 'Court of Appeals',
    date: '2025-03-15'
  },
  {
    id: 'mile_3',
    uid: 'user_alumni_patricia',
    alumniName: 'Engr. Katrina Yap',
    batch: 'Class of 2012',
    title: 'Global Engineering Pioneer',
    category: 'Leadership',
    description: 'Leading high-capacity renewable solar infrastructure across Southeast Asia.',
    company: 'Apex Clean Power Systems',
    date: '2024-11-10'
  }
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal_1',
    category: 'campus',
    title: "St. Cecilia's Main Quadrangle & Administration Hall",
    year: '2026',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    description: 'The historic heart of the campus featuring the administrative wing and heritage quadrangle.',
    uploadedBy: 'user_default_admin',
    uploadedByName: 'Administrator',
    uploaderRole: 'admin',
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'gal_2',
    category: 'commencement',
    title: 'Annual Commencement Exercises & Baccalaureate Mass',
    year: 'Batch 2024',
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&auto=format&fit=crop&q=80',
    description: 'Ceremonial commencement and degree conferment verified by the Office of the Registrar.',
    uploadedBy: 'user_default_registrar',
    uploadedByName: 'Maria Santos',
    uploaderRole: 'registrar',
    createdAt: '2026-02-15T09:30:00.000Z'
  },
  {
    id: 'gal_3',
    category: 'homecoming',
    title: 'Grand Alumni Gala & Jubilarian Honors',
    year: '2025 Reunion',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
    description: 'Silver and Golden Jubilarians gathered at the Grand Ballroom for the annual fellowship.',
    uploadedBy: 'user_default_admin',
    uploadedByName: 'Administrator',
    uploaderRole: 'admin',
    createdAt: '2026-02-20T14:15:00.000Z'
  },
  {
    id: 'gal_4',
    category: 'campus',
    title: 'Cecilian Center for Research & Innovation',
    year: 'Campus Hub',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    description: 'Modern collaborative technology labs and digital engineering research facilities.',
    uploadedBy: 'user_default_admin',
    uploadedByName: 'Administrator',
    uploaderRole: 'admin',
    createdAt: '2026-03-01T11:00:00.000Z'
  },
  {
    id: 'gal_5',
    category: 'heritage',
    title: 'Foundational Chapel & Archival Heritage Cornerstone',
    year: '1998 Founding',
    url: 'https://images.unsplash.com/photo-1548625361-1959737962eb?w=1200&auto=format&fit=crop&q=80',
    description: 'Historical archives and charter dedication preserved by the Office of the Registrar.',
    uploadedBy: 'user_default_registrar',
    uploadedByName: 'Maria Santos',
    uploaderRole: 'registrar',
    createdAt: '2026-03-05T16:45:00.000Z'
  },
  {
    id: 'gal_6',
    category: 'commencement',
    title: 'Class of Distinction Medallion Ceremony',
    year: 'Institutional',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
    description: 'Conferring Latin honors and institutional service leadership medallions to outstanding graduates.',
    uploadedBy: 'user_default_registrar',
    uploadedByName: 'Maria Santos',
    uploaderRole: 'registrar',
    createdAt: '2026-03-12T10:20:00.000Z'
  }
];

