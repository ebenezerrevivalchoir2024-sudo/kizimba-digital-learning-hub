export type ThemeMode = 'auto' | 'light' | 'dark';

export interface AppThemeConfig {
  mode: ThemeMode;
  isDark: boolean;
}

type ThemeListener = (config: AppThemeConfig) => void;

class AppThemeService {
  private mode: ThemeMode = 'auto';
  private isDark: boolean = true;
  private listeners: Set<ThemeListener> = new Set();
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Check saved mode or default to 'auto'
    try {
      const savedMode = localStorage.getItem('kdlh_app_theme_mode') as ThemeMode | null;
      if (savedMode && (savedMode === 'auto' || savedMode === 'light' || savedMode === 'dark')) {
        this.mode = savedMode;
      } else {
        this.mode = 'auto';
      }
    } catch {
      this.mode = 'auto';
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    this.computeAndApplyTheme();
  }

  private handleSystemThemeChange = () => {
    if (this.mode === 'auto') {
      this.computeAndApplyTheme();
    }
  };

  private computeAndApplyTheme() {
    if (this.mode === 'auto') {
      if (this.mediaQuery) {
        this.isDark = this.mediaQuery.matches;
      } else {
        // Fallback default
        this.isDark = true;
      }
    } else {
      this.isDark = this.mode === 'dark';
    }

    // Apply to document element
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (this.isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
      }
    }

    this.notify();
  }

  public setMode(mode: ThemeMode) {
    this.mode = mode;
    try {
      localStorage.setItem('kdlh_app_theme_mode', mode);
    } catch {}
    this.computeAndApplyTheme();
  }

  public toggleMode() {
    if (this.mode === 'auto') {
      this.setMode(this.isDark ? 'light' : 'dark');
    } else if (this.mode === 'light') {
      this.setMode('dark');
    } else {
      this.setMode('auto');
    }
  }

  public getThemeConfig(): AppThemeConfig {
    return {
      mode: this.mode,
      isDark: this.isDark
    };
  }

  public subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener);
    listener(this.getThemeConfig());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const config = this.getThemeConfig();
    this.listeners.forEach(fn => fn(config));
  }
}

export const appThemeService = new AppThemeService();
