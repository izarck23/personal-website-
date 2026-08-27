// ============================================================================
// CODERTECH (Isaac) — Portfolio, Blog & Monetization Platform Data
// Pure JavaScript data store - 100% compatible with Acode, VS Code & all browsers
// ============================================================================

window.PORTFOLIO_DATA = {
  profile: {
    brandName: 'codertech',
    creatorName: 'Isaac',
    heroBadge: 'KOTLIN APP DEVELOPER & WEB DEVELOPER (HTML • CSS • JS) 🚀',
    heroHeadline: 'I build Kotlin Android apps & fast web experiences',
    heroHeadlineAccent: 'that scale.',
    heroBio: "Hi! I'm Isaac (codertech), an App Developer specialized in Kotlin & Android, and a Web Developer skilled in HTML, CSS, and JavaScript. I craft clean, fast native mobile applications and modern responsive web solutions.",
    email: 'isaacapptech23developer@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    heroIllustration: 'assets/images/hero_tech_creator_1787669566326.jpg',
    mascotMug: 'assets/images/mascot_coffee_mug_1787669580415.jpg',
    envelopeAsset: 'assets/images/cute_envelope_heart_1787669669793.jpg',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    discord: 'https://discord.com',
  },

  skills: {
    appDevelopment: [
      'Kotlin (Modern Native Android)',
      'Jetpack Compose (Declarative UI)',
      'Room Database (SQLite Persistence)',
      'Kotlin Coroutines & StateFlow / SharedFlow',
      'MVVM & MVI Clean Architecture',
      'Android SDK & Jetpack Libraries',
      'Material 3 & Motion Animations',
      'Google Play Store Publishing & CI/CD'
    ],
    webDevelopment: [
      'Semantic HTML5 & Accessible DOM',
      'Modern CSS3 (Flexbox, Grid, Custom Props, Animations)',
      'Vanilla & Modern JavaScript (ES6+, Async/Await, DOM APIs)',
      'Single Page Application (SPA) Architecture',
      'Responsive Cross-Device & Mobile-First UX',
      'Performance Optimization & Core Web Vitals (95+)',
      'Fetch API & RESTful JSON Data Integration',
      'LocalStorage & Client-Side State Persistence'
    ],
    toolsAndWorkflow: [
      'Visual Studio Code (Desktop)',
      'Acode Editor (Android & Mobile)',
      'Android Studio (Emulators & Profilers)',
      'Git & GitHub Version Control',
      'Stripe & Monetization Webhooks',
      'REST APIs & Microservices'
    ]
  },

  projects: [
    {
      id: 'pulsefit-kotlin-app',
      title: 'PulseFit — Kotlin Android Fitness & Health Tracker',
      tag: 'KOTLIN ANDROID',
      category: 'mobile',
      shortDescription: 'Native Android fitness tracker built with Kotlin, Jetpack Compose, Room database, and real-time step telemetry.',
      fullDescription: 'PulseFit delivers a fluid, 60fps native Android health experience. Features custom workout builders, local biometric telemetry, offline-first Room database synchronization, and modern Material 3 dark/light dynamic theming.',
      accentColor: '#FF7675',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-600',
      techStack: ['Kotlin', 'Jetpack Compose', 'Room Database', 'Coroutines / Flow', 'Material 3', 'Android SDK'],
      metrics: [
        { label: 'Active Users', value: '50K+' },
        { label: 'Play Store Rating', value: '4.9 ★' },
        { label: 'Frame Rate', value: '60 FPS' }
      ],
      liveUrl: 'https://example.com/pulsefit',
      githubUrl: 'https://github.com/codertech/pulsefit-kotlin-android',
      deviceType: 'mobile',
      highlights: [
        'Pure Kotlin implementation with Jetpack Compose declarative UI',
        'Offline-first architecture powered by Room SQLite & Kotlin Flow',
        'Asynchronous background sensor sync with WorkManager & Coroutines',
        'Targeting Android 15 with Material You dynamic color theming'
      ]
    },
    {
      id: 'fiora-plant-care',
      title: 'Fiora — Kotlin IoT Smart Plant Companion',
      tag: 'KOTLIN & BLE',
      category: 'mobile',
      shortDescription: 'A calming Kotlin Android plant companion featuring Bluetooth Low Energy (BLE) sensor telemetry and care routines.',
      fullDescription: 'Fiora connects directly to Bluetooth IoT soil moisture probes using Android BLE APIs and Kotlin Coroutines. Features visual diagnostic timelines, customized hydration schedules, and micro-animations with Jetpack Compose.',
      accentColor: '#00B894',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600',
      techStack: ['Kotlin', 'Android BLE', 'Jetpack Compose', 'SQLite / Room', 'CameraX Diagnostics', 'Material 3'],
      metrics: [
        { label: 'Plants Monitored', value: '120K+' },
        { label: 'BLE Sync Latency', value: '<50ms' },
        { label: 'Crash Rate', value: '<0.01%' }
      ],
      liveUrl: 'https://example.com/fiora',
      githubUrl: 'https://github.com/codertech/fiora-kotlin-plant-care',
      deviceType: 'mobile',
      highlights: [
        'Robust Android Bluetooth LE GATT connection manager with auto-reconnect',
        'CameraX vision integration for leaf health diagnostic capture',
        'Reactive UI updates powered by StateFlow and Compose ViewModels',
        'Zero battery drain background sync via scheduled Android WorkManager'
      ]
    },
    {
      id: 'finova-dashboard',
      title: 'Finova — Web Finance & Cloud Dashboard (HTML • CSS • JS)',
      tag: 'HTML • CSS • JS',
      category: 'web',
      shortDescription: 'High-performance web dashboard built with clean HTML5, modern CSS3 Grid/Flexbox, and vanilla JavaScript.',
      fullDescription: 'Finova delivers instant financial clarity for startups and fintech teams. Aggregates multi-currency payment streams, MRR analytics, automated invoicing, and interactive charting with sub-second page loads and zero runtime framework bloat.',
      accentColor: '#6C5CE7',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-600',
      techStack: ['HTML5', 'CSS3 (Grid/Flexbox)', 'JavaScript (ES6+)', 'Web APIs', 'Chart.js', 'REST API'],
      metrics: [
        { label: 'Lighthouse Score', value: '99/100' },
        { label: 'Page Load Time', value: '0.4s' },
        { label: 'Active Teams', value: '240+' }
      ],
      liveUrl: 'https://example.com/finova',
      githubUrl: 'https://github.com/codertech/finova-web-dashboard',
      deviceType: 'dashboard',
      highlights: [
        'Zero-build architecture runnable instantly in VS Code, Acode, and standard web servers',
        'Responsive CSS3 custom property theming supporting system dark and light modes',
        'Optimized DOM rendering with minimal memory footprint and fast repaint cycles',
        'Interactive financial forecasting charts with client-side CSV export'
      ]
    },
    {
      id: 'wanderly-travel',
      title: 'Wanderly — AI Travel & Exploration Web Platform',
      tag: 'WEBSITE & API',
      category: 'saas',
      shortDescription: 'Inspiring travel web application with bold visual styling, smart itinerary generators, and responsive UX.',
      fullDescription: 'Wanderly redefines trip planning by generating personalized travel itineraries. Features responsive HTML/CSS layout grids, interactive map plotting via JavaScript, budget calculation engines, and offline itinerary caching.',
      accentColor: '#E17055',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-600',
      techStack: ['HTML5', 'CSS3 Animations', 'JavaScript (ES6+)', 'Maps Web API', 'LocalStorage', 'REST API'],
      metrics: [
        { label: 'Trips Generated', value: '95,000+' },
        { label: 'Mobile Conversion', value: '+38%' },
        { label: 'Avg Session', value: '7.8m' }
      ],
      liveUrl: 'https://example.com/wanderly',
      githubUrl: 'https://github.com/codertech/wanderly-travel-web',
      deviceType: 'laptop',
      highlights: [
        'Seamless responsive design adapting across mobile phones, tablets, and ultra-wide desktops',
        'Interactive interactive itinerary cards with drag-and-drop sequencing in pure JavaScript',
        'Client-side LocalStorage persistence allowing travelers to view offline itineraries',
        'Fast REST API integration with real-time currency conversion widgets'
      ]
    },
    {
      id: 'devpulse-analytics',
      title: 'DevPulse — Developer Income & Growth Suite',
      tag: 'MONETIZATION TOOL',
      category: 'monetization',
      shortDescription: 'All-in-one revenue analytics, digital downloads, and sponsorship tracker for modern tech creators.',
      fullDescription: 'DevPulse is a specialized web toolkit built with HTML, CSS, and JavaScript for software engineers and creators to track multiple income streams: digital products, mobile app ad earnings, freelance invoices, and sponsorship packages.',
      accentColor: '#0984E3',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600',
      techStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Stripe Connect', 'Local Cache', 'Chart Engine'],
      metrics: [
        { label: 'Revenue Tracked', value: '$4.2M+' },
        { label: 'Monetized Devs', value: '1,800+' },
        { label: 'Monthly Growth', value: '+28%' }
      ],
      liveUrl: 'https://example.com/devpulse',
      githubUrl: 'https://github.com/codertech/devpulse-monetization',
      deviceType: 'dashboard',
      highlights: [
        'Unified Stripe, Google Play, and digital product revenue calculation pipelines',
        'Instant client proposal and freelance invoice generator with printable HTML/CSS styles',
        'Audience funnel metrics and digital product conversion analytics',
        'Secure client-side license key generation algorithm'
      ]
    },
    {
      id: 'syntaxforge-boilerplate',
      title: 'SyntaxForge — Kotlin Mobile & HTML/CSS/JS Starter Kits',
      tag: 'DEV BOILERPLATE',
      category: 'devtool',
      shortDescription: 'Production starter kits featuring Kotlin Android architecture templates and clean HTML/CSS/JS web boilerplates.',
      fullDescription: 'SyntaxForge eliminates 50+ hours of repetitive boilerplate setup. Includes clean Kotlin Jetpack Compose MVVM project skeletons and modern, zero-build HTML5/CSS3/JavaScript responsive web templates ready for immediate editing in Acode or VS Code.',
      accentColor: '#00B894',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600',
      techStack: ['Kotlin (Android)', 'HTML5', 'CSS3', 'JavaScript', 'Jetpack Compose', 'Room DB'],
      metrics: [
        { label: 'GitHub Stars', value: '3.8K' },
        { label: 'Devs Using Kits', value: '950+' },
        { label: 'Apps Shipped', value: '140+' }
      ],
      liveUrl: 'https://example.com/syntaxforge',
      githubUrl: 'https://github.com/codertech/syntaxforge-starter-kits',
      deviceType: 'laptop',
      highlights: [
        'Includes full Kotlin Android MVVM starter with Room DB, Coroutines, and navigation',
        'Includes clean zero-build HTML/CSS/JS responsive web templates ready for Acode & VS Code',
        'Pre-configured dark/light theme switching and accessible typography',
        'Comprehensive documentation and step-by-step setup guides'
      ]
    }
  ],

  processSteps: [
    {
      stepNumber: 1,
      title: 'Discover & Scope',
      subtitle: 'Understanding goals, users, and technical architecture.',
      description: 'We define the core problem, user journeys, Android/Web screen flows, and monetization strategy to ensure every line of Kotlin or HTML/CSS/JS code delivers maximum value.',
      iconName: 'search',
      color: '#8b7eff',
      deliverables: ['Tech Spec & Architecture Plan', 'Kotlin / Web MVP Scope', 'UI/UX Wireframes & User Flows']
    },
    {
      stepNumber: 2,
      title: 'Design & Code',
      subtitle: 'Native Kotlin Android & clean HTML/CSS/JS implementation.',
      description: 'Crafting responsive user interfaces with semantic HTML5 & modern CSS3 paired with pure JavaScript, or building native Android UIs with Kotlin & Jetpack Compose.',
      iconName: 'code',
      color: '#f0932b',
      deliverables: ['Modular Kotlin or Web Codebase', 'Responsive UI & Component Library', 'Clean State & Database Layer']
    },
    {
      stepNumber: 3,
      title: 'Profile, Test & Polish',
      subtitle: 'Ensuring 60fps performance, responsiveness, and stability.',
      description: 'Rigorous testing across real Android hardware and web browsers. Auditing memory usage, frame rates, offline SQLite caching, and Core Web Vitals (95+ score).',
      iconName: 'check-circle-2',
      color: '#ff7675',
      deliverables: ['Android Profiler / Lighthouse Audit', 'Cross-Device & Browser Testing', 'Offline Caching & State QA']
    },
    {
      stepNumber: 4,
      title: 'Deploy & Scale',
      subtitle: 'Play Store release, web hosting, and ongoing growth.',
      description: 'Deploying your Android application to Google Play Store or hosting your website on high-speed static/cloud infrastructure with monetization tools and analytics configured.',
      iconName: 'rocket',
      color: '#6c5ce7',
      deliverables: ['Google Play / Web Live Deployment', 'Analytics & Monetization Setup', 'Documentation & Source Handover']
    }
  ],

  services: [
    {
      id: 'kotlin-android',
      title: 'Native Kotlin Android App Development',
      description: 'High-performance, modern Android applications built with Kotlin, Jetpack Compose, Room database, Coroutines, and smooth 60fps native animations.',
      iconName: 'smartphone',
      accentColor: '#FF7675',
      badgeColor: 'bg-rose-100 text-rose-700',
      startingPrice: '$1,400',
      estimatedTimeline: '2-4 weeks',
      idealFor: 'Startups, businesses, and creators needing a fast, native Android mobile application.',
      features: [
        'Kotlin & Jetpack Compose declarative UI',
        'MVVM / MVI clean architecture & Room DB',
        'Kotlin Coroutines, StateFlow & offline sync',
        'Google Play Store release & Material 3 styling'
      ]
    },
    {
      id: 'web-development',
      title: 'Modern Web Development (HTML • CSS • JS)',
      description: 'Clean, lightning-fast, and responsive websites and single-page applications engineered with semantic HTML5, modern CSS3, and modern JavaScript.',
      iconName: 'globe',
      accentColor: '#6C5CE7',
      badgeColor: 'bg-purple-100 text-purple-700',
      startingPrice: '$950',
      estimatedTimeline: '1-3 weeks',
      idealFor: 'Businesses and creators wanting ultra-fast, accessible web platforms without heavy bloat.',
      features: [
        'Semantic HTML5 & accessible structure',
        'Modern CSS3 (Flexbox, Grid, CSS animations)',
        'Vanilla & Modern JavaScript (ES6+) SPAs',
        'Lighthouse 95+ score & sub-second page loads'
      ]
    },
    {
      id: 'api-monetization',
      title: 'API Integration & Monetization',
      description: 'Connecting Android apps and web platforms with RESTful APIs, Google Play In-App Billing, Stripe checkout, and real-time backend synchronization.',
      iconName: 'zap',
      accentColor: '#0984E3',
      badgeColor: 'bg-blue-100 text-blue-700',
      startingPrice: '$750',
      estimatedTimeline: '1-2 weeks',
      idealFor: 'Apps and sites requiring secure monetization, payment gateways, or custom REST APIs.',
      features: [
        'Google Play Billing & In-App Purchases',
        'Stripe payment gateway & subscription webhooks',
        'RESTful JSON API integrations & error handling',
        'Offline-first cache & local state persistence'
      ]
    },
    {
      id: 'mentorship-code-review',
      title: 'Code Review, Optimization & Mentorship',
      description: '1-on-1 technical mentorship and deep-dive code reviews to optimize your Kotlin Android apps, polish web performance, and monetize your software skills.',
      iconName: 'award',
      accentColor: '#F39C12',
      badgeColor: 'bg-amber-100 text-amber-800',
      startingPrice: '$120 / session',
      estimatedTimeline: 'Flexible / Ongoing',
      idealFor: 'Developers seeking to level up their Kotlin or Web skills and build profitable digital products.',
      features: [
        'Kotlin Android architecture & memory leak audit',
        'HTML/CSS/JS performance & DOM optimization',
        'Freelance client proposals & pricing strategy',
        'Personal tech brand & digital product roadmap'
      ]
    }
  ],

  testimonials: [
    {
      id: 'test-1',
      quote: 'Isaac is a phenomenal Kotlin and Android developer. He built our fitness companion with Jetpack Compose, and the UI runs at a butter-smooth 60 FPS. Our users love the offline-first experience!',
      author: 'Marcus Vance',
      role: 'Head of Mobile Product',
      company: 'FitPulse Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      accentColor: '#FF7675'
    },
    {
      id: 'test-2',
      quote: 'Isaac delivered our web platform using clean HTML5, CSS3, and JavaScript. It loads in under 400ms with a 99 Lighthouse score! Pure craftsmanship with zero bloat.',
      author: 'Elena Rostova',
      role: 'Founder & CEO',
      company: 'Finova Cloud',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      accentColor: '#6C5CE7'
    },
    {
      id: 'test-3',
      quote: 'Working with codertech on Acode and VS Code workflows made updating our documentation and blog seamless. The code is modular, well-commented, and incredibly easy to maintain.',
      author: 'David Chen',
      role: 'Lead Frontend Engineer',
      company: 'Indie Builder Studio',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      accentColor: '#00B894'
    },
    {
      id: 'test-4',
      quote: 'The 1-on-1 mentorship on Kotlin Android architecture and freelance client acquisition helped me land my first $3,500 contract in 3 weeks. Truly transformative guidance.',
      author: 'Sarah Jenkins',
      role: 'Android Engineer & Creator',
      company: 'AppForge',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      accentColor: '#E17055'
    }
  ],

  faq: [
    {
      id: 'faq-1',
      category: 'Projects & Skills',
      question: 'What technologies and stacks do you specialize in?',
      answer: 'My primary focus is App Development using native Kotlin (Android SDK, Jetpack Compose, Room DB, Coroutines, MVVM/MVI) and Web Development using semantic HTML5, modern CSS3 (Grid/Flexbox/Animations), and vanilla/modern JavaScript (ES6+).'
    },
    {
      id: 'faq-2',
      category: 'Editing in IDEs (Acode & VS Code)',
      question: 'Can I edit this website and add blog posts using Acode or VS Code?',
      answer: 'Yes! This entire website runs on standard HTML, CSS, and JavaScript with zero build steps required. You can open and edit it in Acode on Android or VS Code on your computer. To add blog posts, simply copy-paste a post template in `js/data.js` or use the in-app "Dev Studio" to write visually and copy formatted code with 1 click!'
    },
    {
      id: 'faq-3',
      category: 'Mobile App Scope',
      question: 'Do you build native Android apps with Kotlin and Jetpack Compose?',
      answer: 'Yes, absolutely. I specialize in native Kotlin development utilizing Jetpack Compose, Material 3, Room database for offline persistence, background workers, and Google Play Store submission.'
    },
    {
      id: 'faq-4',
      category: 'Timeline & Delivery',
      question: 'How long does a typical Kotlin app or web project take?',
      answer: 'A focused web application or Kotlin mobile MVP typically takes 2 to 4 weeks. I provide weekly milestone builds, clean modular code, and clear documentation.'
    },
    {
      id: 'faq-5',
      category: 'Monetization & Consulting',
      question: 'How do you help developers monetize their Kotlin and Web skills?',
      answer: 'Through in-depth technical blogs, digital starter boilerplates, 1-on-1 mentorship sessions, freelance pricing formulas, and guidance on building scalable digital products.'
    }
  ],

  // =========================================================================
  // ✍️ DEVELOPER INSTRUCTION: HOW TO ADD A NEW BLOG POST IN VS CODE OR ACODE
  // =========================================================================
  // 1. Copy the BLOG POST TEMPLATE below.
  // 2. Paste it at the top of the `blogPosts` array.
  // 3. Update the `id`, `slug`, `title`, `excerpt`, `contentMarkdown`, etc.
  // 4. Save `js/data.js`. That's it! Your article will instantly appear on the website.
  //
  // TIP: You can also use the in-app "✍️ Dev Studio / Write Blog" button on the
  // website to write visually and click "Copy as data.js Code" to copy it in 1 tap!
  // =========================================================================
  /*
  --- COPY FROM HERE ---
  {
    id: 'my-new-post-id',
    slug: 'my-new-post-slug',
    title: 'My Awesome New Article Title',
    excerpt: 'A short, engaging 1-2 sentence summary of what this article covers.',
    contentMarkdown: `## Introduction
Write your article in standard markdown here.

### Key Highlights
- Feature 1
- Feature 2

\`\`\`kotlin
// You can include Kotlin code blocks:
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { Text("Hello Kotlin Android!") }
    }
}
\`\`\`

\`\`\`javascript
// Or JavaScript / HTML code blocks:
console.log("Hello Web Development!");
\`\`\`
`,
    category: 'Kotlin', // Options: 'Kotlin', 'Web Dev', 'Monetization', 'Architecture', 'Tutorials'
    readTime: '5 min read',
    publishedAt: 'Aug 26, 2026',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Isaac (codertech)',
      role: 'Kotlin & Web Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['Kotlin', 'Android', 'WebDev', 'Tutorial'],
    likesCount: 50,
    bookmarksCount: 20,
    viewsCount: 650,
    comments: []
  },
  --- END OF TEMPLATE ---
  */

  blogPosts: [
    {
      id: 'mastering-kotlin-jetpack-compose-2026',
      slug: 'mastering-kotlin-jetpack-compose-2026',
      title: 'Building Modern Android Apps with Kotlin & Jetpack Compose: The 2026 Blueprint',
      excerpt: 'A comprehensive guide to building responsive, offline-first native Android applications using Kotlin, Jetpack Compose, Room SQLite, and Kotlin Coroutines.',
      contentMarkdown: `## Why Modern Kotlin & Jetpack Compose Redefined Android Development

For Android developers, **Kotlin + Jetpack Compose** represents the ultimate declarative UI toolkit. By combining Kotlin's concise syntax, type safety, and first-class Coroutines with Compose's reactive rendering engine, you can build production-ready mobile apps with 50% less code than legacy XML layouts.

Here is the exact architectural blueprint I use for high-performance Android applications:

### 1. The Clean MVVM & StateFlow Architecture
Keep your UI completely stateless by hoisting state into ViewModel observables:

\`\`\`kotlin
// WorkoutViewModel.kt
class WorkoutViewModel(
    private val repository: WorkoutRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<WorkoutUiState>(WorkoutUiState.Loading)
    val uiState: StateFlow<WorkoutUiState> = _uiState.asStateFlow()

    init {
        loadDailyWorkouts()
    }

    private fun loadDailyWorkouts() {
        viewModelScope.launch {
            repository.getDailyWorkoutsFlow()
                .catch { e -> _uiState.value = WorkoutUiState.Error(e.message ?: "Unknown error") }
                .collect { workouts ->
                    _uiState.value = WorkoutUiState.Success(workouts)
                }
        }
    }
}
\`\`\`

### 2. Declarative Composable UI with Smooth Animations
Compose allows you to describe how your UI should look for a given state without mutating views manually:

\`\`\`kotlin
// WorkoutScreen.kt
@Composable
fun WorkoutCard(
    workout: WorkoutItem,
    onStartClick: (String) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .animateContentSize(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = workout.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "\${workout.durationMinutes} mins • \${workout.calorieBurn} kcal",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = { onStartClick(workout.id) },
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Start Workout")
            }
        }
    }
}
\`\`\`

### 3. Offline-First Persistence with Room Database
Users expect their apps to work offline instantly. Always cache your data locally in SQLite using Room:

\`\`\`kotlin
// WorkoutDao.kt
@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workouts ORDER BY timestamp DESC")
    fun getAllWorkouts(): Flow<List<WorkoutEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkout(workout: WorkoutEntity)
}
\`\`\`

### Key Takeaway
Build apps that feel instant: prioritize clean StateFlow emissions, smooth Material 3 micro-interactions, and offline Room database synchronization!`,
      category: 'Kotlin',
      readTime: '7 min read',
      publishedAt: 'Aug 26, 2026',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Isaac (codertech)',
        role: 'Kotlin & Web Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      tags: ['Kotlin', 'Android', 'Jetpack Compose', 'Room DB', 'Mobile'],
      likesCount: 184,
      bookmarksCount: 76,
      viewsCount: 1840,
      comments: [
        {
          id: 'c1',
          author: 'Alex River',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          content: 'The ViewModel + StateFlow pattern shown here is so clean. Jetpack Compose makes UI development enjoyable again!',
          createdAt: '2 hours ago',
          likes: 14
        },
        {
          id: 'c2',
          author: 'Maya Lin',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          content: 'Great breakdown of Room DB Flow streaming directly into Compose. Excited for more Kotlin Android tutorials!',
          createdAt: '5 hours ago',
          likes: 8
        }
      ]
    },
    {
      id: 'mastering-html-css-javascript-2026',
      slug: 'mastering-html-css-javascript-zero-framework-bloat',
      title: 'Mastering HTML5, CSS3 & Modern JavaScript: Building Fast Web Apps Without Bloat',
      excerpt: 'How to build high-performance, single-page web applications with pure HTML, modern CSS3 Grid/Flexbox, and vanilla JavaScript that load in under 500ms.',
      contentMarkdown: `## The Power of the Vanilla Web Stack (HTML5, CSS3 & JS)

In an era of heavy JavaScript frameworks with gigabytes of node_modules, mastering the core foundations of the web (**HTML5, CSS3, and JavaScript**) gives you superpowers:
- **Zero build dependencies**: Runs immediately in Acode, VS Code, and any browser.
- **Sub-second load times**: Lighthouse scores of 98-100 out of the box.
- **True longevity**: Standard web platform APIs do not break across framework version upgrades.

### 1. Semantic HTML5 Architecture
Write semantic HTML that search engines and assistive technologies can parse effortlessly:

\`\`\`html
<!-- Semantic Single-Page Application (SPA) container -->
<header class="sticky-nav">
  <nav class="nav-container">
    <a href="#home" class="logo">codertech</a>
    <ul class="nav-links">
      <li><a href="#projects">Projects</a></li>
      <li><a href="#blog">Blog</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>

<main id="app-root">
  <!-- Dynamic views rendered via JavaScript router -->
</main>
\`\`\`

### 2. Modern CSS3 Custom Properties & Responsive Grid
Leverage modern CSS Grid and custom variables for flawless responsiveness:

\`\`\`css
:root {
  --color-primary: #6c5ce7;
  --color-accent: #ff7675;
  --color-surface: #fffdfb;
  --font-main: 'Plus Jakarta Sans', sans-serif;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: var(--color-surface);
  border-radius: 1.5rem;
  padding: 1.5rem;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover {
  transform: translateY(-4px);
}
\`\`\`

### 3. Lightweight Client-Side Routing in Pure JavaScript
You don't need a heavy routing library to build an interactive Single Page Application:

\`\`\`javascript
// router.js - Pure JavaScript SPA Router
function handleRoute() {
  const hash = window.location.hash || '#home';
  
  if (hash.startsWith('#/blog/')) {
    const slug = hash.replace('#/blog/', '');
    renderBlogArticle(slug);
  } else if (hash === '#/blog') {
    renderBlogDirectory();
  } else {
    renderHomeView();
  }
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
\`\`\`

### Key Takeaway
Mastering HTML, CSS, and JavaScript gives you total control over performance, accessibility, and code quality.`,
      category: 'Web Dev',
      readTime: '6 min read',
      publishedAt: 'Aug 24, 2026',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Isaac (codertech)',
        role: 'Kotlin & Web Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      tags: ['HTML5', 'CSS3', 'JavaScript', 'WebDev', 'Performance'],
      likesCount: 220,
      bookmarksCount: 98,
      viewsCount: 2450,
      comments: [
        {
          id: 'c3',
          author: 'David Kim',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          content: 'This zero-build approach makes editing in Acode on my tablet so fast. No bundler lag!',
          createdAt: '1 day ago',
          likes: 19
        }
      ]
    },
    {
      id: 'solo-dev-monetization-playbook',
      slug: 'solo-dev-monetization-playbook-2026',
      title: "The Solo Developer's 2026 Monetization Blueprint: From $0 to $10K/Month",
      excerpt: 'A practical, step-by-step breakdown of how software engineers can monetize Kotlin Android apps, HTML/CSS/JS starter kits, and high-value client architecture sprints.',
      contentMarkdown: `## Why Relying on a Single Tech Paycheck Is Risky

In modern software engineering, relying solely on one salary limits your financial autonomy. The most successful developers build **asymmetric upside** by packaging their coding skills into scalable assets.

Here is the exact 3-pillar framework I use:

### 1. The 3-Pillar Tech Income Model
- **Pillar A: High-Leverage Kotlin & Web Client Sprints** (High cash flow, active)
- **Pillar B: Developer Starter Kits & Digital Templates** (Passive, scalable)
- **Pillar C: Micro-SaaS & Kotlin Mobile In-App Purchases** (Compound recurring growth)

\`\`\`javascript
// Example: Instant digital product license key generation
function generateDeveloperLicense(userEmail, productId) {
  const salt = 'codertech_' + Date.now();
  const prefix = productId.substring(0, 3).toUpperCase();
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  return \`\${prefix}-\${hash}-\${Math.floor(1000 + Math.random() * 9000)}\`;
}
\`\`\`

### 2. Packaging Kotlin & Web Starter Kits
Identify common developer pain points:
- Kotlin Jetpack Compose Room database boilerplate
- Clean HTML5/CSS3/JavaScript responsive landing platforms
- Stripe webhook integration handlers
- Android BLE and sensor communication layers

### 3. Launching and Iterating
Start with a single helpful technical blog post, share code snippets on GitHub, and offer starter templates with lifetime updates.`,
      category: 'Monetization',
      readTime: '6 min read',
      publishedAt: 'Aug 20, 2026',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Isaac (codertech)',
        role: 'Kotlin & Web Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      tags: ['Monetization', 'Kotlin', 'WebDev', 'Freelancing', 'Career'],
      likesCount: 195,
      bookmarksCount: 84,
      viewsCount: 2120,
      comments: []
    },
    {
      id: 'offline-first-kotlin-room-architecture',
      slug: 'offline-first-kotlin-room-architecture-guide',
      title: 'Offline-First Architecture in Kotlin Android with Room DB & Coroutines',
      excerpt: 'Deep dive into building resilient Android apps that store data locally with SQLite Room, sync seamlessly in the background, and provide instant UI responses.',
      contentMarkdown: `## Building Truly Resilient Offline-First Mobile Apps

Mobile connectivity is inherently unreliable. By designing your Kotlin Android app as **offline-first**, users never face blank screens or loading spinners when opening the app.

### 1. The Single Source of Truth Principle
The UI observes the local Room database, while network calls update the local database:

\`\`\`kotlin
// OfflineRepository.kt
class ArticleRepository(
    private val localDao: ArticleDao,
    private val apiService: ArticleApiService
) {
    // UI continuously observes this local Flow
    val articlesFlow: Flow<List<Article>> = localDao.observeAllArticles()

    suspend fun refreshArticles() {
        withContext(Dispatchers.IO) {
            try {
                val remoteList = apiService.fetchLatestArticles()
                localDao.insertArticles(remoteList)
            } catch (e: Exception) {
                // Network failed, but local data remains available!
                Log.w("ArticleRepository", "Offline: using cached data", e)
            }
        }
    }
}
\`\`\`

### 2. Handling Background Sync with Android WorkManager
Ensure queued edits sync to the cloud once network connectivity is restored:

\`\`\`kotlin
// SyncWorker.kt
class DataSyncWorker(
    ctx: Context,
    params: WorkerParameters
) : CoroutineWorker(ctx, params) {

    override suspend fun doWork(): Result {
        return try {
            performPendingDataUpload()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
\`\`\`

### Summary
Offline-first mobile engineering guarantees superior user satisfaction and high Play Store ratings!`,
      category: 'Kotlin',
      readTime: '8 min read',
      publishedAt: 'Aug 15, 2026',
      coverImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Isaac (codertech)',
        role: 'Kotlin & Web Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      tags: ['Kotlin', 'Android', 'Room DB', 'Architecture', 'Coroutines'],
      likesCount: 168,
      bookmarksCount: 82,
      viewsCount: 1950,
      comments: []
    },
    {
      id: 'css3-responsive-layout-performance',
      slug: 'css3-responsive-layout-performance-mastery',
      title: 'Modern CSS3 Layout & Performance: Flexbox, Grid & Micro-Animations',
      excerpt: 'Essential techniques for structuring responsive web layouts with modern CSS3 that maintain 60 FPS transitions and adapt to any screen size.',
      contentMarkdown: `## Modern CSS3: Beyond Simple Styling

Modern CSS3 gives you layout engines and animation drivers natively without requiring heavy JavaScript computation.

### 1. Fluid Layouts with CSS Clamp & CSS Grid
Create layouts that automatically scale with viewport width:

\`\`\`css
/* Fluid Typography & Spacing */
h1 {
  font-size: clamp(2rem, 5vw + 1rem, 3.5rem);
  line-height: 1.15;
}

.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
\`\`\`

### 2. Hardware-Accelerated Animations
Always animate \`transform\` and \`opacity\` instead of \`top\`, \`left\`, or \`width\` to avoid browser layout recalculations:

\`\`\`css
.btn-action {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  will-change: transform;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
\`\`\`

### Key Takeaway
Keep styling declarative and hardware accelerated for silky smooth web responsiveness.`,
      category: 'Web Dev',
      readTime: '5 min read',
      publishedAt: 'Aug 10, 2026',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Isaac (codertech)',
        role: 'Kotlin & Web Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      tags: ['CSS3', 'WebDev', 'Animations', 'Responsive', 'Performance'],
      likesCount: 154,
      bookmarksCount: 68,
      viewsCount: 1720,
      comments: []
    }
  ],

  monetizationProducts: [
    {
      id: 'prod-kotlin-compose-starter',
      title: 'Kotlin Android + Jetpack Compose Production Boilerplate',
      type: 'Mobile Starter Kit',
      price: '$59',
      description: 'Production-ready Android project with Jetpack Compose UI, Room SQLite database, Coroutines Flow, Material 3 theming, and Play Store CI/CD.',
      badge: 'KOTLIN BESTSELLER ⚡',
      features: [
        'Complete Kotlin MVVM / MVI architecture',
        'Offline-first Room database & repository layer',
        'Pre-configured dark/light dynamic theme & animations',
        'Google Play Billing integration skeleton'
      ],
      popularityRating: 4.9,
      salesCount: 280,
      deliveryTime: 'Instant GitHub Repo & ZIP'
    },
    {
      id: 'prod-html-css-js-starter',
      title: 'Zero-Build HTML5, CSS3 & JavaScript SPA Starter Kit',
      type: 'Web Template Kit',
      price: '$39',
      description: 'Super-fast, zero-build single page application template. Designed for immediate editing in Acode, VS Code, or any IDE with 100 Lighthouse score.',
      badge: 'POPULAR ⭐',
      features: [
        'Pure HTML5, CSS3 & JavaScript architecture',
        'Hash-based SPA router & modular data store',
        'Responsive mobile-first layout with smooth modals',
        'Instant live preview in Acode & all browsers'
      ],
      popularityRating: 4.9,
      salesCount: 410,
      deliveryTime: 'Instant ZIP & Codebase'
    },
    {
      id: 'prod-1on1-mentorship',
      title: '1-on-1 Kotlin Android & Web Architecture Strategy Session',
      type: '1-on-1 Mentorship',
      price: '$120',
      description: 'A focused 60-minute video call to audit your Kotlin Android app, optimize your HTML/CSS/JS website, or design your next software product.',
      badge: 'LIMITED SLOTS 🔥',
      features: [
        '60-minute recorded 1-on-1 video call',
        'Line-by-line Kotlin or Web codebase audit',
        'Personalized 30-day technical growth plan',
        'Follow-up Q&A support on Discord/Email'
      ],
      popularityRating: 5.0,
      salesCount: 95,
      deliveryTime: 'Booked via Calendar'
    }
  ],

  socialLinks: [
    {
      id: 'github',
      name: 'GitHub',
      handle: '@codertech',
      url: 'https://github.com',
      description: 'Explore open-source Kotlin Android repositories, HTML/CSS/JS starter kits, micro-tools, and template codebases.',
      iconName: 'github',
      badge: 'OPEN SOURCE 🚀',
      color: '#24292e',
      stats: '3.8k Stars • 50+ Repos',
      category: 'Code & Repos'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Isaac (codertech)',
      url: 'https://linkedin.com',
      description: 'Connect for enterprise Kotlin Android contracting, web architecture partnerships, and technical consulting.',
      iconName: 'linkedin',
      badge: 'PROFESSIONAL 💼',
      color: '#0A66C2',
      stats: '6.2k Followers',
      category: 'Professional Network'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      handle: '@codertech_dev',
      url: 'https://twitter.com',
      description: 'Daily tips on Kotlin Android development, clean HTML/CSS/JS patterns, app monetization, and indie engineering.',
      iconName: 'twitter',
      badge: 'DAILY TECH TIPS ⚡',
      color: '#1DA1F2',
      stats: '14.5k Followers',
      category: 'Microblogging'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: 'codertech TV',
      url: 'https://youtube.com',
      description: 'In-depth video tutorials on Kotlin Jetpack Compose, HTML5/CSS3/JS app builds, and developer monetization breakdowns.',
      iconName: 'youtube',
      badge: 'VIDEO GUIDES 🎥',
      color: '#FF0000',
      stats: '21.0k Subscribers',
      category: 'Video Tutorials'
    },
    {
      id: 'discord',
      name: 'Discord Community',
      handle: 'codertech Lounge',
      url: 'https://discord.com',
      description: 'Join our friendly builder community for live pair programming, Kotlin/Web codebase feedback, and app monetization.',
      iconName: 'message-square',
      badge: 'COMMUNITY CHAT 💬',
      color: '#5865F2',
      stats: '2.5k Members',
      category: 'Live Community'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@codertech.dev',
      url: 'https://instagram.com',
      description: 'Behind-the-scenes developer workspace setups, coding reels, UI micro-interactions, and tech lifestyle content.',
      iconName: 'instagram',
      badge: 'DEV LIFESTYLE 📸',
      color: '#E4405F',
      stats: '8.4k Followers',
      category: 'Visual & Reels'
    },
    {
      id: 'telegram',
      name: 'Telegram Channel',
      handle: '@codertech_updates',
      url: 'https://telegram.org',
      description: 'Instant release announcements, Kotlin code snippets, curated tech news, and exclusive early product discounts.',
      iconName: 'send',
      badge: 'INSTANT ALERTS 📢',
      color: '#24A1DE',
      stats: '4.1k Subscribers',
      category: 'Broadcast Channel'
    },
    {
      id: 'email',
      name: 'Direct Email',
      handle: 'isaacapptech23developer@gmail.com',
      url: 'mailto:isaacapptech23developer@gmail.com',
      description: 'Have a custom Kotlin app or web project in mind? Send me an email and get a structured technical proposal within 24 hours.',
      iconName: 'mail',
      badge: 'DIRECT INQUIRIES 📬',
      color: '#FF7675',
      stats: '<24h Response Rate',
      category: 'Direct Inbox'
    }
  ]
};

