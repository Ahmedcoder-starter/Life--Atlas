import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  LayoutDashboard, 
  Calendar, 
  Timer, 
  BookOpen, 
  Menu, 
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Edit2,
  Save,
  Target,
  TrendingUp,
  Clock,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

// Types
type View = 'landing' | 'dashboard' | 'planner' | 'focus' | 'subjects';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  subject?: string;
}

interface Subject {
  id: string;
  name: string;
  board: string;
  color: string;
  topics: string[];
}

interface TimeBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  task: string;
}

// Color palette for subjects
const SUBJECT_COLORS = [
  '#D93A3A', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

// Sample data
const SAMPLE_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', board: 'GCSE', color: '#D93A3A', topics: ['Algebra', 'Geometry', 'Calculus'] },
  { id: '2', name: 'Physics', board: 'GCSE', color: '#3B82F6', topics: ['Mechanics', 'Electricity', 'Waves'] },
  { id: '3', name: 'Chemistry', board: 'GCSE', color: '#10B981', topics: ['Organic', 'Inorganic', 'Physical'] },
  { id: '4', name: 'Biology', board: 'GCSE', color: '#F59E0B', topics: ['Cells', 'Genetics', 'Ecology'] },
  { id: '5', name: 'English Literature', board: 'GCSE', color: '#8B5CF6', topics: ['Poetry', 'Prose', 'Drama'] },
  { id: '6', name: 'Computer Science', board: 'GCSE', color: '#EC4899', topics: ['Programming', 'Data', 'Systems'] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dashboard state
  const [dailyPriorities, setDailyPriorities] = useState<Task[]>([
    { id: '1', text: 'Complete math homework', completed: false, subject: 'Mathematics' },
    { id: '2', text: 'Review physics notes', completed: true, subject: 'Physics' },
    { id: '3', text: 'Read English chapter', completed: false, subject: 'English' },
  ]);
  const [newPriority, setNewPriority] = useState('');
  const [focusHours, setFocusHours] = useState(12);
  const [weeklyGoal] = useState(20);
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [sessionCount, setSessionCount] = useState(4);
  
  // Planner state
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { id: '1', day: 'Mon', startTime: '09:00', endTime: '10:30', subject: 'Mathematics', task: 'Algebra practice' },
    { id: '2', day: 'Mon', startTime: '11:00', endTime: '12:30', subject: 'Physics', task: 'Mechanics review' },
    { id: '3', day: 'Tue', startTime: '09:00', endTime: '10:30', subject: 'Chemistry', task: 'Organic chemistry' },
  ]);
  
  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>(SAMPLE_SUBJECTS);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectBoard, setNewSubjectBoard] = useState('');
  
  // FAQ data
  const faqItems = [
    { question: 'Is Life Atlas free to use?', answer: 'Yes! Life Atlas is completely free for all students. We believe everyone deserves access to powerful productivity tools.' },
    { question: 'Can I use it on mobile?', answer: 'Absolutely! Life Atlas is fully responsive and works seamlessly on phones, tablets, and desktops.' },
    { question: 'How does the focus timer work?', answer: 'Our Pomodoro timer helps you work in focused 25-minute sessions followed by short breaks. You can customize session lengths to match your workflow.' },
    { question: 'Can I organize subjects by exam board?', answer: 'Yes! You can tag each subject with its exam board (GCSE, A-Level, IB, etc.) and organize topics within each subject.' },
    { question: 'Will there be more features soon?', answer: 'We\'re constantly improving Life Atlas. Upcoming features include collaboration tools, advanced analytics, and integration with popular calendar apps.' },
  ];

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Timer finished
          setIsTimerRunning(false);
          if (timerMode === 'work') {
            setSessionCount(prev => prev + 1);
            setFocusHours(prev => prev + 0.5);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  // Landing page scroll animations
  useEffect(() => {
    if (currentView !== 'landing') return;
    
    const ctx = gsap.context(() => {
      // Hero auto-play animation
      const heroTl = gsap.timeline({ delay: 0.3 });
      
      heroTl
        .fromTo('.hero-badge', 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo('.hero-headline-word', 
          { y: 24, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.03, ease: 'power2.out' }, 
          '-=0.3'
        )
        .fromTo('.hero-subheadline', 
          { y: 16, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
          '-=0.2'
        )
        .fromTo('.hero-cta', 
          { y: 16, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 
          '-=0.3'
        )
        .fromTo('.hero-card', 
          { y: 40, scale: 0.98, opacity: 0 }, 
          { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out' }, 
          '-=0.6'
        );

      // Pinned sections scroll animations
      const sections = ['.section-2', '.section-3', '.section-4', '.section-6', '.section-7'];
      
      sections.forEach((section) => {
        const sectionEl = document.querySelector(section);
        if (!sectionEl) return;
        
        gsap.fromTo(sectionEl.querySelectorAll('.section-headline'), 
          { y: -80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.5,
            }
          }
        );
        
        gsap.fromTo(sectionEl.querySelectorAll('.section-subheadline'), 
          { y: -50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 75%',
              end: 'top 35%',
              scrub: 0.5,
            }
          }
        );
        
        gsap.fromTo(sectionEl.querySelectorAll('.section-card'), 
          { y: 200, scale: 0.92, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.5,
            }
          }
        );
      });

      // Capabilities section
      gsap.fromTo('.capability-card', 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.section-5',
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.5,
          }
        }
      );

      // FAQ section
      gsap.fromTo('.faq-item', 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.section-8',
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.5,
          }
        }
      );
    });

    return () => ctx.revert();
  }, [currentView]);

  // Priority functions
  const addPriority = () => {
    if (newPriority.trim()) {
      setDailyPriorities([...dailyPriorities, { 
        id: Date.now().toString(), 
        text: newPriority, 
        completed: false 
      }]);
      setNewPriority('');
    }
  };

  const togglePriority = (id: string) => {
    setDailyPriorities(dailyPriorities.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    ));
  };

  const deletePriority = (id: string) => {
    setDailyPriorities(dailyPriorities.filter(p => p.id !== id));
  };

  // Timer functions
  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(timerMode === 'work' ? 25 : 5);
    setTimerSeconds(0);
  };

  // Subject functions
  const addSubject = () => {
    if (newSubjectName.trim() && newSubjectBoard.trim()) {
      const colorIndex = subjects.length % SUBJECT_COLORS.length;
      setSubjects([...subjects, {
        id: Date.now().toString(),
        name: newSubjectName,
        board: newSubjectBoard,
        color: SUBJECT_COLORS[colorIndex],
        topics: []
      }]);
      setNewSubjectName('');
      setNewSubjectBoard('');
    }
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Navigation
  const navigateTo = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className="relative">
      {/* Fixed background elements */}
      <div className="spotlight" />
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#0B0F17]/80 backdrop-blur-md">
        <div className="text-xl font-bold text-white font-['Sora']">Life Atlas</div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigateTo('dashboard')} className="text-[#A9B3C2] hover:text-white transition-colors link-underline">Dashboard</button>
          <button onClick={() => navigateTo('planner')} className="text-[#A9B3C2] hover:text-white transition-colors link-underline">Planner</button>
          <button onClick={() => navigateTo('focus')} className="text-[#A9B3C2] hover:text-white transition-colors link-underline">Focus</button>
          <button onClick={() => navigateTo('subjects')} className="text-[#A9B3C2] hover:text-white transition-colors link-underline">Subjects</button>
          <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-[#A9B3C2] hover:text-white transition-colors link-underline">FAQ</button>
        </div>
        <Button 
          onClick={() => navigateTo('dashboard')}
          className="hidden md:flex bg-[#D93A3A] hover:bg-[#B82E2E] text-white rounded-full px-6"
        >
          Start free
        </Button>
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0F17] pt-20 px-6">
          <div className="flex flex-col gap-6">
            <button onClick={() => navigateTo('dashboard')} className="text-white text-xl text-left">Dashboard</button>
            <button onClick={() => navigateTo('planner')} className="text-white text-xl text-left">Planner</button>
            <button onClick={() => navigateTo('focus')} className="text-white text-xl text-left">Focus</button>
            <button onClick={() => navigateTo('subjects')} className="text-white text-xl text-left">Subjects</button>
            <button onClick={() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-white text-xl text-left">FAQ</button>
            <Button onClick={() => navigateTo('dashboard')} className="bg-[#D93A3A] hover:bg-[#B82E2E] text-white rounded-full mt-4">
              Start free
            </Button>
          </div>
        </div>
      )}

      {/* Section 1: Hero */}
      <section className="section-pinned flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <div className="hero-badge mb-6 px-5 py-2 bg-[#D93A3A] rounded-full">
          <span className="text-white text-xs font-semibold tracking-[0.12em] uppercase">Plan · Track · Grow</span>
        </div>
        
        <h1 className="text-center mb-6">
          <span className="hero-headline-word inline-block text-white text-[clamp(44px,5.2vw,76px)] font-bold font-['Sora'] tracking-tight">Hello, </span>
          <span className="hero-headline-word inline-block text-white text-[clamp(44px,5.2vw,76px)] font-bold font-['Sora'] tracking-tight">this </span>
          <span className="hero-headline-word inline-block text-white text-[clamp(44px,5.2vw,76px)] font-bold font-['Sora'] tracking-tight">is</span>
          <br />
          <span className="hero-headline-word inline-block text-[#D93A3A] text-[clamp(44px,5.2vw,76px)] font-bold font-['Sora'] tracking-tight">Life </span>
          <span className="hero-headline-word inline-block text-[#D93A3A] text-[clamp(44px,5.2vw,76px)] font-bold font-['Sora'] tracking-tight">Atlas</span>
        </h1>
        
        <p className="hero-subheadline text-[#A9B3C2] text-center text-[clamp(15px,1.2vw,18px)] max-w-[52ch] mb-8 leading-relaxed">
          Track homework, plan your week, and prepare effectively — all inside one structured workspace.
        </p>
        
        <div className="flex gap-4 mb-12">
          <Button 
            onClick={() => navigateTo('dashboard')}
            className="hero-cta btn-primary bg-[#D93A3A] hover:bg-[#B82E2E] text-white rounded-full px-8 py-6 text-base font-semibold"
          >
            Start Planning
          </Button>
          <Button 
            variant="outline"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-cta border-[#A9B3C2]/30 text-white hover:bg-white/5 rounded-full px-8 py-6 text-base font-semibold"
          >
            See Animation
          </Button>
        </div>
        
        {/* Hero Card */}
        <div className="hero-card w-full max-w-[920px] bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Today's Priorities</h3>
              <span className="text-[#A9B3C2] text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="space-y-3">
              {dailyPriorities.slice(0, 3).map((priority) => (
                <div key={priority.id} className="flex items-center gap-3 p-3 bg-[#0B0F17] rounded-xl">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${priority.completed ? 'bg-[#10B981] border-[#10B981]' : 'border-[#A9B3C2]'}`}>
                    {priority.completed && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`flex-1 ${priority.completed ? 'text-[#A9B3C2] line-through' : 'text-white'}`}>{priority.text}</span>
                  {priority.subject && (
                    <span className="text-xs px-2 py-1 bg-[#D93A3A]/20 text-[#D93A3A] rounded-full">{priority.subject}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Focus Timer */}
      <section className="section-2 section-pinned flex flex-col items-center justify-center min-h-screen px-4" id="features">
        <h2 className="section-headline text-center mb-4">
          <span className="text-white text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">Stay focused.</span>
          <br />
          <span className="text-[#D93A3A] text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">Beat the clock.</span>
        </h2>
        <p className="section-subheadline text-[#A9B3C2] text-center text-[clamp(15px,1.2vw,18px)] max-w-[54ch] mb-10 leading-relaxed">
          Start a Pomodoro session, minimize distractions, and finish your study blocks with momentum.
        </p>
        
        <div className="section-card w-full max-w-[720px] bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] p-8">
          <div className="text-center">
            <h3 className="text-white font-semibold text-xl mb-6">Focus Session</h3>
            <div className="text-[clamp(64px,8vw,120px)] font-bold text-white font-['Sora'] mb-6 tabular-nums">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </div>
            <div className="flex justify-center gap-4 mb-6">
              <button 
                onClick={toggleTimer}
                className="w-14 h-14 rounded-full bg-[#D93A3A] hover:bg-[#B82E2E] flex items-center justify-center transition-transform hover:scale-105"
              >
                {isTimerRunning ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-14 h-14 rounded-full bg-[#1a2332] hover:bg-[#2a3342] flex items-center justify-center transition-transform hover:scale-105"
              >
                <RotateCcw size={24} className="text-white" />
              </button>
            </div>
            <p className="text-[#A9B3C2] text-sm">Small steps every day build big results.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Weekly Schedule */}
      <section className="section-3 section-pinned flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="section-headline text-center mb-4">
          <span className="text-white text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">Your week,</span>
          <br />
          <span className="text-[#D93A3A] text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">planned clearly.</span>
        </h2>
        <p className="section-subheadline text-[#A9B3C2] text-center text-[clamp(15px,1.2vw,18px)] max-w-[56ch] mb-10 leading-relaxed">
          Map subjects, tasks, and deadlines across the week—so you always know what's next.
        </p>
        
        <div className="section-card w-full max-w-[980px] bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-[#A9B3C2] text-sm font-medium py-2">{day}</div>
              ))}
            </div>
            <div className="space-y-2">
              {timeBlocks.slice(0, 3).map((block) => (
                <div key={block.id} className="flex items-center gap-4 p-3 bg-[#0B0F17] rounded-xl">
                  <span className="text-[#A9B3C2] text-sm w-20">{block.startTime}</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">{block.subject}</span>
                    <span className="text-[#A9B3C2] text-sm ml-2">{block.task}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-[#D93A3A]/20 text-[#D93A3A] rounded-full">{block.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Subject Manager */}
      <section className="section-4 section-pinned flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="section-headline text-center mb-4">
          <span className="text-white text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">All your subjects,</span>
          <br />
          <span className="text-[#D93A3A] text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">one system.</span>
        </h2>
        <p className="section-subheadline text-[#A9B3C2] text-center text-[clamp(15px,1.2vw,18px)] max-w-[56ch] mb-10 leading-relaxed">
          Add topics, tag exam boards, and keep resources tidy—so revision stays stress-free.
        </p>
        
        <div className="section-card w-full max-w-[920px] bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjects.slice(0, 6).map((subject) => (
                <div key={subject.id} className="flex items-center gap-3 p-4 bg-[#0B0F17] rounded-xl">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-white font-medium flex-1">{subject.name}</span>
                  <span className="text-[#A9B3C2] text-sm">({subject.board})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Capabilities Grid */}
      <section className="section-5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D93A3A] text-xs font-semibold tracking-[0.12em] uppercase mb-4 block">Capabilities</span>
            <h2 className="text-white text-[clamp(32px,3.5vw,56px)] font-bold font-['Sora'] mb-4">
              Everything you need to stay ahead
            </h2>
            <p className="text-[#A9B3C2] text-[clamp(15px,1.2vw,18px)] max-w-[60ch] mx-auto">
              Planner, focus timer, subjects, and insights—designed for students who mean business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="capability-card card-hover bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#D93A3A]/20 flex items-center justify-center mb-6">
                <Calendar className="text-[#D93A3A]" size={24} />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">Plan your week</h3>
              <p className="text-[#A9B3C2] text-sm leading-relaxed">
                Organize your schedule with time blocks, deadlines, and priorities in a clean, intuitive interface.
              </p>
            </div>
            
            <div className="capability-card card-hover bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#D93A3A]/20 flex items-center justify-center mb-6">
                <Timer className="text-[#D93A3A]" size={24} />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">Focus deeply</h3>
              <p className="text-[#A9B3C2] text-sm leading-relaxed">
                Use the Pomodoro timer to maintain concentration and build consistent study habits over time.
              </p>
            </div>
            
            <div className="capability-card card-hover bg-[#111827] rounded-[28px] border border-[#F4F6FB]/8 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#D93A3A]/20 flex items-center justify-center mb-6">
                <BookOpen className="text-[#D93A3A]" size={24} />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">Track subjects</h3>
              <p className="text-[#A9B3C2] text-sm leading-relaxed">
                Manage all your subjects, topics, and exam boards with color-coded organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Built for Students */}
      <section className="section-6 section-pinned flex flex-col items-center justify-center min-h-screen px-4">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(28, 40, 62, 0.65), rgba(11, 15, 23, 0) 55%)'
        }} />
        
        <h2 className="section-headline text-center mb-6 relative z-10">
          <span className="text-white text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">Built for students.</span>
          <br />
          <span className="text-[#D93A3A] text-[clamp(36px,4vw,64px)] font-bold font-['Sora']">Made for focus.</span>
        </h2>
        <p className="section-subheadline text-[#A9B3C2] text-center text-[clamp(15px,1.2vw,18px)] max-w-[58ch] mb-10 leading-relaxed relative z-10">
          Life Atlas replaces scattered notes and last-minute cramming with a calm, repeatable system.
        </p>
        <Button 
          onClick={() => navigateTo('dashboard')}
          className="section-card btn-primary bg-[#D93A3A] hover:bg-[#B82E2E] text-white rounded-full px-10 py-6 text-lg font-semibold relative z-10"
        >
          Get Started
        </Button>
      </section>

      {/* Section 7: Testimonial */}
      <section className="section-7 section-pinned flex flex-col items-center justify-center min-h-screen px-4">
        <div className="section-card w-32 h-32 md:w-40 md:h-40 rounded-full border-[3px] border-[#F4F6FB]/12 overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
            alt="Student" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <blockquote className="section-headline text-white text-[clamp(18px,1.6vw,22px)] text-center max-w-[52ch] mb-6 leading-relaxed">
          "It's like having a personal study coach that keeps me accountable without the stress."
        </blockquote>
        <p className="section-subheadline text-[#A9B3C2] text-sm">
          — A student who uses Life Atlas
        </p>
      </section>

      {/* Section 8: FAQ */}
      <section className="section-8 py-20 px-4" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white text-[clamp(28px,3vw,48px)] font-bold font-['Sora'] text-center mb-12">
            Frequently asked questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="faq-item border border-[#F4F6FB]/8 rounded-2xl overflow-hidden bg-[#111827]">
                <AccordionTrigger className="px-6 py-5 text-white hover:no-underline hover:bg-[#1a2332] transition-colors">
                  <span className="text-left font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-[#A9B3C2] leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 9: Footer + Signup */}
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="text-white text-[clamp(28px,3vw,48px)] font-bold font-['Sora'] mb-4">
            Start your week with clarity.
          </h2>
          <p className="text-[#A9B3C2] mb-8">
            Join students who plan smarter and finish stronger.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-[#111827] border-[#F4F6FB]/8 text-white placeholder:text-[#A9B3C2]/50 rounded-full px-6"
            />
            <Button className="bg-[#D93A3A] hover:bg-[#B82E2E] text-white rounded-full px-6">
              <Mail size={18} className="mr-2" />
              Get early access
            </Button>
          </div>
        </div>
        
        <footer className="border-t border-[#F4F6FB]/8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-[#A9B3C2]">
            <span className="font-semibold text-white">Life Atlas</span>
            <a href="#" className="hover:text-white transition-colors link-underline">Privacy</a>
            <a href="#" className="hover:text-white transition-colors link-underline">Terms</a>
            <a href="#" className="hover:text-white transition-colors link-underline">Contact</a>
          </div>
        </footer>
      </section>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-[#0B0F17] pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold font-['Sora'] mb-2">Life Dashboard</h1>
          <p className="text-[#A9B3C2]">Your central command for academic success</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Priorities */}
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px] lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Target size={20} className="text-[#D93A3A]" />
                Daily Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  placeholder="Add a new priority..."
                  className="flex-1 bg-[#0B0F17] border-[#F4F6FB]/8 text-white placeholder:text-[#A9B3C2]/50 rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && addPriority()}
                />
                <Button onClick={addPriority} className="bg-[#D93A3A] hover:bg-[#B82E2E] rounded-xl">
                  <Plus size={18} />
                </Button>
              </div>
              <div className="space-y-2">
                {dailyPriorities.map((priority) => (
                  <div key={priority.id} className="flex items-center gap-3 p-3 bg-[#0B0F17] rounded-xl group">
                    <button 
                      onClick={() => togglePriority(priority.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${priority.completed ? 'bg-[#10B981] border-[#10B981]' : 'border-[#A9B3C2] hover:border-[#D93A3A]'}`}
                    >
                      {priority.completed && <Check size={12} className="text-white" />}
                    </button>
                    <span className={`flex-1 ${priority.completed ? 'text-[#A9B3C2] line-through' : 'text-white'}`}>
                      {priority.text}
                    </span>
                    {priority.subject && (
                      <span className="text-xs px-2 py-1 bg-[#D93A3A]/20 text-[#D93A3A] rounded-full">{priority.subject}</span>
                    )}
                    <button 
                      onClick={() => deletePriority(priority.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#A9B3C2] hover:text-[#D93A3A] transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Focus Progress */}
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-[#D93A3A]" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white font-['Sora']">{focusHours}</div>
                <div className="text-[#A9B3C2] text-sm">hours focused</div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#A9B3C2]">Progress</span>
                  <span className="text-white">{Math.round((focusHours / weeklyGoal) * 100)}%</span>
                </div>
                <Progress value={(focusHours / weeklyGoal) * 100} className="h-2 bg-[#0B0F17]" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-[#0B0F17] rounded-xl">
                  <div className="text-2xl font-bold text-white">{sessionCount}</div>
                  <div className="text-[#A9B3C2] text-xs">Sessions</div>
                </div>
                <div className="text-center p-3 bg-[#0B0F17] rounded-xl">
                  <div className="text-2xl font-bold text-white">{weeklyGoal}</div>
                  <div className="text-[#A9B3C2] text-xs">Weekly Goal</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Timer */}
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Timer size={20} className="text-[#D93A3A]" />
                Quick Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold text-white font-['Sora'] mb-4 tabular-nums">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={toggleTimer}
                  className="w-12 h-12 rounded-full bg-[#D93A3A] hover:bg-[#B82E2E] flex items-center justify-center transition-transform hover:scale-105"
                >
                  {isTimerRunning ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full bg-[#0B0F17] hover:bg-[#1a2332] flex items-center justify-center transition-transform hover:scale-105"
                >
                  <RotateCcw size={20} className="text-white" />
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Deadlines */}
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px] lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock size={20} className="text-[#D93A3A]" />
                Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeBlocks.map((block) => (
                  <div key={block.id} className="flex items-center gap-4 p-3 bg-[#0B0F17] rounded-xl">
                    <div className="text-center min-w-[60px]">
                      <div className="text-[#A9B3C2] text-xs">{block.day}</div>
                      <div className="text-white font-semibold">{block.startTime}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{block.subject}</div>
                      <div className="text-[#A9B3C2] text-sm">{block.task}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Planner Component
  const Planner = () => {
    const [newBlock, setNewBlock] = useState({ day: 'Mon', startTime: '09:00', endTime: '10:00', subject: '', task: '' });
    const [editingBlock, setEditingBlock] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<TimeBlock | null>(null);

    const addTimeBlock = () => {
      if (newBlock.subject && newBlock.task) {
        setTimeBlocks([...timeBlocks, { ...newBlock, id: Date.now().toString() }]);
        setNewBlock({ day: 'Mon', startTime: '09:00', endTime: '10:00', subject: '', task: '' });
      }
    };

    const deleteTimeBlock = (id: string) => {
      setTimeBlocks(timeBlocks.filter(b => b.id !== id));
    };

    const startEdit = (block: TimeBlock) => {
      setEditingBlock(block.id);
      setEditValues({ ...block });
    };

    const saveEdit = () => {
      if (editValues) {
        setTimeBlocks(timeBlocks.map(b => b.id === editValues.id ? editValues : b));
        setEditingBlock(null);
        setEditValues(null);
      }
    };

    return (
      <div className="min-h-screen bg-[#0B0F17] pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold font-['Sora'] mb-2">Life Atlas Planner</h1>
            <p className="text-[#A9B3C2]">Organize your week with intention</p>
          </div>
          
          {/* Add New Block */}
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px] mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Plus size={20} className="text-[#D93A3A]" />
                Add Time Block
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-6 gap-3">
                <select 
                  value={newBlock.day}
                  onChange={(e) => setNewBlock({...newBlock, day: e.target.value})}
                  className="bg-[#0B0F17] border border-[#F4F6FB]/8 text-white rounded-xl px-4 py-2"
                >
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <Input 
                  type="time"
                  value={newBlock.startTime}
                  onChange={(e) => setNewBlock({...newBlock, startTime: e.target.value})}
                  className="bg-[#0B0F17] border-[#F4F6FB]/8 text-white rounded-xl"
                />
                <Input 
                  type="time"
                  value={newBlock.endTime}
                  onChange={(e) => setNewBlock({...newBlock, endTime: e.target.value})}
                  className="bg-[#0B0F17] border-[#F4F6FB]/8 text-white rounded-xl"
                />
                <Input 
                  placeholder="Subject"
                  value={newBlock.subject}
                  onChange={(e) => setNewBlock({...newBlock, subject: e.target.value})}
                  className="bg-[#0B0F17] border-[#F4F6FB]/8 text-white placeholder:text-[#A9B3C2]/50 rounded-xl md:col-span-2"
                />
                <Button onClick={addTimeBlock} className="bg-[#D93A3A] hover:bg-[#B82E2E] rounded-xl">
                  Add Block
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly Grid */}
          <div className="grid gap-6">
            {DAYS.map((day) => {
              const dayBlocks = timeBlocks.filter(b => b.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
              return (
                <Card key={day} className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px]">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white">{day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dayBlocks.length === 0 ? (
                      <p className="text-[#A9B3C2] text-sm italic">No scheduled blocks</p>
                    ) : (
                      <div className="space-y-2">
                        {dayBlocks.map((block) => (
                          <div key={block.id} className="flex items-center gap-4 p-3 bg-[#0B0F17] rounded-xl group">
                            {editingBlock === block.id && editValues ? (
                              <>
                                <Input 
                                  type="time"
                                  value={editValues.startTime}
                                  onChange={(e) => setEditValues({...editValues, startTime: e.target.value})}
                                  className="w-28 bg-[#111827] border-[#F4F6FB]/8 text-white rounded-xl"
                                />
                                <Input 
                                  type="time"
                                  value={editValues.endTime}
                                  onChange={(e) => setEditValues({...editValues, endTime: e.target.value})}
                                  className="w-28 bg-[#111827] border-[#F4F6FB]/8 text-white rounded-xl"
                                />
                                <Input 
                                  value={editValues.subject}
                                  onChange={(e) => setEditValues({...editValues, subject: e.target.value})}
                                  className="flex-1 bg-[#111827] border-[#F4F6FB]/8 text-white rounded-xl"
                                />
                                <Input 
                                  value={editValues.task}
                                  onChange={(e) => setEditValues({...editValues, task: e.target.value})}
                                  className="flex-1 bg-[#111827] border-[#F4F6FB]/8 text-white rounded-xl"
                                />
                                <button onClick={saveEdit} className="text-[#10B981] hover:text-[#059669]">
                                  <Save size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="text-[#A9B3C2] text-sm w-24">{block.startTime} - {block.endTime}</span>
                                <span className="text-white font-medium w-32">{block.subject}</span>
                                <span className="text-[#A9B3C2] text-sm flex-1">{block.task}</span>
                                <button 
                                  onClick={() => startEdit(block)}
                                  className="opacity-0 group-hover:opacity-100 text-[#A9B3C2] hover:text-white transition-all"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteTimeBlock(block.id)}
                                  className="opacity-0 group-hover:opacity-100 text-[#A9B3C2] hover:text-[#D93A3A] transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Focus Timer Component
  const FocusTimer = () => {
    const [customMinutes, setCustomMinutes] = useState(25);
    const [showCustom, setShowCustom] = useState(false);

    const setTimer = (minutes: number) => {
      setTimerMinutes(minutes);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setShowCustom(false);
    };

    return (
      <div className="min-h-screen bg-[#0B0F17] pt-20 px-4 pb-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-bold font-['Sora'] mb-2">Focus Timer</h1>
            <p className="text-[#A9B3C2]">Stay in the zone with structured work sessions</p>
          </div>
          
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px] p-8 md:p-12">
            <div className="text-center">
              {/* Mode Indicator */}
              <div className="flex justify-center gap-2 mb-8">
                <button 
                  onClick={() => { setTimerMode('work'); setTimer(25); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timerMode === 'work' ? 'bg-[#D93A3A] text-white' : 'bg-[#0B0F17] text-[#A9B3C2]'}`}
                >
                  Work
                </button>
                <button 
                  onClick={() => { setTimerMode('break'); setTimer(5); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timerMode === 'break' ? 'bg-[#10B981] text-white' : 'bg-[#0B0F17] text-[#A9B3C2]'}`}
                >
                  Break
                </button>
              </div>
              
              {/* Timer Display */}
              <div className={`text-[clamp(80px,15vw,160px)] font-bold text-white font-['Sora'] mb-8 tabular-nums ${isTimerRunning ? 'timer-pulse' : ''}`}>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              
              {/* Controls */}
              <div className="flex justify-center gap-4 mb-8">
                <button 
                  onClick={toggleTimer}
                  className="w-16 h-16 rounded-full bg-[#D93A3A] hover:bg-[#B82E2E] flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-[#D93A3A]/20"
                >
                  {isTimerRunning ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-full bg-[#0B0F17] hover:bg-[#1a2332] flex items-center justify-center transition-transform hover:scale-105"
                >
                  <RotateCcw size={28} className="text-white" />
                </button>
              </div>
              
              {/* Quick Presets */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {[15, 25, 45, 60].map((min) => (
                  <button 
                    key={min}
                    onClick={() => setTimer(min)}
                    className="px-4 py-2 bg-[#0B0F17] hover:bg-[#1a2332] text-[#A9B3C2] hover:text-white rounded-full text-sm transition-colors"
                  >
                    {min} min
                  </button>
                ))}
                <button 
                  onClick={() => setShowCustom(!showCustom)}
                  className="px-4 py-2 bg-[#0B0F17] hover:bg-[#1a2332] text-[#A9B3C2] hover:text-white rounded-full text-sm transition-colors"
                >
                  Custom
                </button>
              </div>
              
              {/* Custom Input */}
              {showCustom && (
                <div className="flex justify-center gap-2 mb-6">
                  <Input 
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                    placeholder="Minutes"
                    className="w-32 bg-[#0B0F17] border-[#F4F6FB]/8 text-white rounded-xl text-center"
                  />
                  <Button onClick={() => setTimer(customMinutes)} className="bg-[#D93A3A] hover:bg-[#B82E2E] rounded-xl">
                    Set
                  </Button>
                </div>
              )}
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#F4F6FB]/8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{sessionCount}</div>
                  <div className="text-[#A9B3C2] text-xs">Sessions Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{focusHours}</div>
                  <div className="text-[#A9B3C2] text-xs">Hours Focused</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{Math.round((focusHours / weeklyGoal) * 100)}%</div>
                  <div className="text-[#A9B3C2] text-xs">Weekly Goal</div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Tip */}
          <p className="text-center text-[#A9B3C2] text-sm mt-6">
            Tip: Take a 5-minute break after every 25-minute focus session
          </p>
        </div>
      </div>
    );
  };

  // Subjects Component
  const SubjectsView = () => {
    const [editingSubject, setEditingSubject] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const startEdit = (subject: Subject) => {
      setEditingSubject(subject.id);
      setEditName(subject.name);
    };

    const saveEdit = (id: string) => {
      setSubjects(subjects.map(s => s.id === id ? { ...s, name: editName } : s));
      setEditingSubject(null);
    };

    return (
      <div className="min-h-screen bg-[#0B0F17] pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold font-['Sora'] mb-2">Subject Manager</h1>
            <p className="text-[#A9B3C2]">Organize your academic subjects and topics</p>
          </div>
          
          {/* Add Subject */}
          <Card className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px] mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Plus size={20} className="text-[#D93A3A]" />
                Add New Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input 
                  placeholder="Subject name"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="flex-1 bg-[#0B0F17] border-[#F4F6FB]/8 text-white placeholder:text-[#A9B3C2]/50 rounded-xl"
                />
                <Input 
                  placeholder="Exam board (e.g., GCSE)"
                  value={newSubjectBoard}
                  onChange={(e) => setNewSubjectBoard(e.target.value)}
                  className="w-48 bg-[#0B0F17] border-[#F4F6FB]/8 text-white placeholder:text-[#A9B3C2]/50 rounded-xl"
                />
                <Button onClick={addSubject} className="bg-[#D93A3A] hover:bg-[#B82E2E] rounded-xl">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Subjects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="bg-[#111827] border-[#F4F6FB]/8 rounded-[28px] card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="flex-1 min-w-0">
                      {editingSubject === subject.id ? (
                        <div className="flex gap-2">
                          <Input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-[#0B0F17] border-[#F4F6FB]/8 text-white rounded-xl"
                            autoFocus
                          />
                          <button onClick={() => saveEdit(subject.id)} className="text-[#10B981]">
                            <Save size={18} />
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-white font-semibold text-lg truncate">{subject.name}</h3>
                      )}
                      <p className="text-[#A9B3C2] text-sm">({subject.board})</p>
                      
                      {subject.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {subject.topics.map((topic, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-[#0B0F17] text-[#A9B3C2] rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(subject)}
                        className="p-2 text-[#A9B3C2] hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteSubject(subject.id)}
                        className="p-2 text-[#A9B3C2] hover:text-[#D93A3A] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // App Navigation Layout
  const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#0B0F17]">
      {/* App Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#F4F6FB]/8">
        <button onClick={() => navigateTo('landing')} className="text-xl font-bold text-white font-['Sora']">Life Atlas</button>
        <div className="hidden md:flex items-center gap-1">
          <button 
            onClick={() => navigateTo('dashboard')} 
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${currentView === 'dashboard' ? 'bg-[#D93A3A] text-white' : 'text-[#A9B3C2] hover:text-white'}`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button 
            onClick={() => navigateTo('planner')} 
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${currentView === 'planner' ? 'bg-[#D93A3A] text-white' : 'text-[#A9B3C2] hover:text-white'}`}
          >
            <Calendar size={16} />
            Planner
          </button>
          <button 
            onClick={() => navigateTo('focus')} 
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${currentView === 'focus' ? 'bg-[#D93A3A] text-white' : 'text-[#A9B3C2] hover:text-white'}`}
          >
            <Timer size={16} />
            Focus
          </button>
          <button 
            onClick={() => navigateTo('subjects')} 
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${currentView === 'subjects' ? 'bg-[#D93A3A] text-white' : 'text-[#A9B3C2] hover:text-white'}`}
          >
            <BookOpen size={16} />
            Subjects
          </button>
        </div>
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0F17] pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-4">
            <button onClick={() => navigateTo('dashboard')} className={`text-left text-xl py-3 px-4 rounded-xl ${currentView === 'dashboard' ? 'bg-[#D93A3A] text-white' : 'text-white'}`}>
              <LayoutDashboard size={20} className="inline mr-3" />Dashboard
            </button>
            <button onClick={() => navigateTo('planner')} className={`text-left text-xl py-3 px-4 rounded-xl ${currentView === 'planner' ? 'bg-[#D93A3A] text-white' : 'text-white'}`}>
              <Calendar size={20} className="inline mr-3" />Planner
            </button>
            <button onClick={() => navigateTo('focus')} className={`text-left text-xl py-3 px-4 rounded-xl ${currentView === 'focus' ? 'bg-[#D93A3A] text-white' : 'text-white'}`}>
              <Timer size={20} className="inline mr-3" />Focus
            </button>
            <button onClick={() => navigateTo('subjects')} className={`text-left text-xl py-3 px-4 rounded-xl ${currentView === 'subjects' ? 'bg-[#D93A3A] text-white' : 'text-white'}`}>
              <BookOpen size={20} className="inline mr-3" />Subjects
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <AppLayout><Dashboard /></AppLayout>;
      case 'planner':
        return <AppLayout><Planner /></AppLayout>;
      case 'focus':
        return <AppLayout><FocusTimer /></AppLayout>;
      case 'subjects':
        return <AppLayout><SubjectsView /></AppLayout>;
      default:
        return <LandingPage />;
    }
  };

  return renderView();
}

export default App;