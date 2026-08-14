export interface EntryTheme {
  id: string;
  name: string;
  bgGradient: string;
  borderColor: string;
  headerGradient: string;
  accentBadgeBg: string;
  accentTextColor: string;
  patternStyle: string; // CSS class for pattern (chalkboard, paper, grid, etc.)
  iconEmoji: string;
  motto: string;
  quote: string;
  quoteAuthor: string;
  bgImageUrl?: string;
  decorations?: string[];
}

export const ENTRY_THEMES: EntryTheme[] = [
  {
    id: 'kdlh-royal-blue',
    name: 'Royal Academic Blue',
    bgGradient: 'from-blue-950 via-slate-950 to-indigo-950',
    borderColor: 'border-blue-500/50',
    headerGradient: 'from-blue-900 via-slate-950 to-indigo-900',
    accentBadgeBg: 'bg-blue-600',
    accentTextColor: 'text-blue-300',
    patternStyle: 'academic-paper-bg',
    iconEmoji: '🎓',
    motto: 'Kizimba Secondary School • Excellence & Character',
    quote: '"Education is the most powerful weapon which you can use to change the world."',
    quoteAuthor: 'Nelson Mandela',
    bgImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    decorations: ['Physics & Chemistry', 'Biology & Agriculture', 'Mathematics & ICT']
  },
  {
    id: 'kdlh-emerald-lab',
    name: 'Emerald Practical Lab',
    bgGradient: 'from-emerald-950 via-slate-950 to-cyan-950',
    borderColor: 'border-emerald-500/50',
    headerGradient: 'from-emerald-900 via-slate-950 to-teal-900',
    accentBadgeBg: 'bg-emerald-600',
    accentTextColor: 'text-emerald-300',
    patternStyle: 'chalkboard-bg',
    iconEmoji: '🧪',
    motto: 'KDLH Practical & Experimental Excellence',
    quote: '"The important thing is not to stop questioning. Curiosity has its own reason for existing."',
    quoteAuthor: 'Albert Einstein',
    bgImageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    decorations: ['Apparatus Setups', 'Titration & Optics', 'Lab Safety Protocols']
  },
  {
    id: 'kdlh-crimson-honors',
    name: 'Crimson Scholars & NECTA Honors',
    bgGradient: 'from-red-950 via-slate-950 to-blue-950',
    borderColor: 'border-red-500/50',
    headerGradient: 'from-red-900 via-slate-950 to-blue-950',
    accentBadgeBg: 'bg-red-600',
    accentTextColor: 'text-red-300',
    patternStyle: 'academic-paper-bg',
    iconEmoji: '📚',
    motto: 'Founded by Isaack Edward Lungwa • Kizimba Hub',
    quote: '"An investment in knowledge pays the best interest."',
    quoteAuthor: 'Benjamin Franklin',
    bgImageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80',
    decorations: ['Form I to IV Notes', 'Form V & VI Advanced', 'NECTA Past Papers']
  },
  {
    id: 'kdlh-golden-sunburst',
    name: 'Golden Knowledge Zenith',
    bgGradient: 'from-amber-950 via-slate-950 to-blue-950',
    borderColor: 'border-amber-500/50',
    headerGradient: 'from-amber-900 via-slate-950 to-indigo-950',
    accentBadgeBg: 'bg-amber-600',
    accentTextColor: 'text-amber-300',
    patternStyle: 'chalkboard-bg',
    iconEmoji: '✏️',
    motto: 'Form I to Form VI • Academic Empowerment',
    quote: '"Develop a passion for learning. If you do, you will never cease to grow."',
    quoteAuthor: 'Anthony J. D\'Angelo',
    bgImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    decorations: ['Video Lessons', 'Audio Classroom Guides', 'AI Study Assistant']
  }
];

type ThemeListener = (theme: EntryTheme) => void;

class ThemeSwitcherService {
  private currentThemeIndex = 0;
  private listeners: Set<ThemeListener> = new Set();

  constructor() {
    this.initSessionTheme();
  }

  private initSessionTheme() {
    try {
      const storedIdx = sessionStorage.getItem('kdlh_entry_theme_idx');
      if (storedIdx !== null) {
        // Rotate to next theme each session
        const nextIdx = (parseInt(storedIdx, 10) + 1) % ENTRY_THEMES.length;
        this.currentThemeIndex = nextIdx;
        sessionStorage.setItem('kdlh_entry_theme_idx', nextIdx.toString());
      } else {
        const randomIdx = Math.floor(Math.random() * ENTRY_THEMES.length);
        this.currentThemeIndex = randomIdx;
        sessionStorage.setItem('kdlh_entry_theme_idx', randomIdx.toString());
      }
    } catch {
      this.currentThemeIndex = 0;
    }
  }

  public getCurrentTheme(): EntryTheme {
    return ENTRY_THEMES[this.currentThemeIndex] || ENTRY_THEMES[0];
  }

  public getAllThemes(): EntryTheme[] {
    return ENTRY_THEMES;
  }

  public rotateNextTheme(): EntryTheme {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % ENTRY_THEMES.length;
    try {
      sessionStorage.setItem('kdlh_entry_theme_idx', this.currentThemeIndex.toString());
    } catch {}
    const theme = this.getCurrentTheme();
    this.notify();
    return theme;
  }

  public setThemeById(id: string): EntryTheme {
    const idx = ENTRY_THEMES.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.currentThemeIndex = idx;
      try {
        sessionStorage.setItem('kdlh_entry_theme_idx', idx.toString());
      } catch {}
      this.notify();
    }
    return this.getCurrentTheme();
  }

  public subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentTheme());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const theme = this.getCurrentTheme();
    this.listeners.forEach(fn => fn(theme));
  }
}

export const themeSwitcherService = new ThemeSwitcherService();
