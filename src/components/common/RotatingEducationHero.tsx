import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, FlaskConical, GraduationCap, School, Users, Award } from 'lucide-react';

export interface EducationalSlide {
  id: string;
  title: string;
  subtitle: string;
  category: 'STUDENTS' | 'LABORATORY' | 'TEACHER' | 'LIBRARY' | 'CLASSROOM';
  imageUrl: string;
  caption: string;
  highlightText: string;
  icon: React.ReactNode;
}

export const EDUCATIONAL_SLIDES: EducationalSlide[] = [
  {
    id: 'slide-students-1',
    title: 'Excellence in Secondary Education',
    subtitle: 'Kizimba Secondary School • Form I to Form VI',
    category: 'STUDENTS',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    caption: 'Students collaborating on science & mathematics problem sets with digital notes and peer revision.',
    highlightText: 'Academic Victory & Discipline',
    icon: <Users className="w-5 h-5 text-amber-300" />
  },
  {
    id: 'slide-lab-1',
    title: 'Practical Science Experiments',
    subtitle: 'Hands-on Chemistry, Physics & Biology Labs',
    category: 'LABORATORY',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
    caption: 'Titration, qualitative analysis, mechanics, and specimen dissections mapped directly to NECTA guidelines.',
    highlightText: 'Laboratory Mastery 🧪',
    icon: <FlaskConical className="w-5 h-5 text-emerald-300" />
  },
  {
    id: 'slide-teacher-1',
    title: 'Dedicated Educator Mentorship',
    subtitle: 'Inspired by Mwl. Isaack Edward Lungwa',
    category: 'TEACHER',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    caption: 'Step-by-step topic mastery, chalkboard demonstrations, and continuous academic assessment.',
    highlightText: 'Teacher Empowerment ✏️',
    icon: <GraduationCap className="w-5 h-5 text-blue-300" />
  },
  {
    id: 'slide-library-1',
    title: 'Digital Reference Library',
    subtitle: 'Comprehensive NECTA Past Papers & Book Collection',
    category: 'LIBRARY',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
    caption: 'Instant access to syllabi, marking schemes, topical questions, and audio-video revision guides.',
    highlightText: 'Over 250+ Resources 📚',
    icon: <BookOpen className="w-5 h-5 text-amber-300" />
  },
  {
    id: 'slide-classroom-1',
    title: 'Interactive Smart Learning',
    subtitle: 'AI Exam Scanning, OCR Marking & 24/7 AI Tutor',
    category: 'CLASSROOM',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    caption: 'Instant exam corrections with teacher red-pen annotations and personalized revision feedback.',
    highlightText: 'Next-Gen EdTech ⚡',
    icon: <Sparkles className="w-5 h-5 text-purple-300" />
  }
];

interface RotatingEducationHeroProps {
  onNavigate?: (route: string) => void;
  className?: string;
}

export const RotatingEducationHero: React.FC<RotatingEducationHeroProps> = ({
  onNavigate,
  className = ''
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % EDUCATIONAL_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % EDUCATIONAL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + EDUCATIONAL_SLIDES.length) % EDUCATIONAL_SLIDES.length);
  };

  const slide = EDUCATIONAL_SLIDES[currentIdx];

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-3xl border border-blue-600/40 bg-slate-950 shadow-2xl ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Rotating Images with Cross-Fade */}
      <div className="relative h-72 sm:h-96 lg:h-[420px] w-full overflow-hidden">
        {EDUCATIONAL_SLIDES.map((s, index) => {
          const isActive = index === currentIdx;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={s.imageUrl}
                alt={s.title}
                className="w-full h-full object-cover object-center filter brightness-[0.75]"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Dark Gradient Overlay for legible typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-blue-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 text-white font-serif">
          {/* Top category badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 border border-blue-400/50 text-blue-200 text-xs font-bold backdrop-blur-md shadow-lg">
              {slide.icon}
              <span className="tracking-wider uppercase font-mono">{slide.highlightText}</span>
            </div>

            <div className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/60 border border-white/20 text-amber-300 font-bold backdrop-blur">
              {currentIdx + 1} / {EDUCATIONAL_SLIDES.length}
            </div>
          </div>

          {/* Center / Lower Info Block */}
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              {slide.subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-wide drop-shadow-md">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-xl italic drop-shadow">
              "{slide.caption}"
            </p>
          </div>

          {/* Bottom Bar: Indicators and Quick Nav Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {EDUCATIONAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIdx ? 'w-8 bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Quick Actions & Navigation Arrows */}
            <div className="flex items-center gap-2">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition uppercase tracking-wider font-mono mr-2"
                >
                  Explore Hub
                </button>
              )}

              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/20 transition-colors backdrop-blur"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/20 transition-colors backdrop-blur"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
