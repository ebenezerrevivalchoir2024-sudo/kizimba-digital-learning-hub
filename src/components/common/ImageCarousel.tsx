import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Maximize2, 
  X, 
  Sparkles, 
  BookOpen, 
  FlaskConical, 
  GraduationCap, 
  School, 
  Users, 
  Library, 
  Layers, 
  ExternalLink,
  Info
} from 'lucide-react';

export type EducationalPhotoCategory = 'all' | 'classrooms' | 'labs' | 'libraries' | 'students';

export interface EducationalPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'classrooms' | 'labs' | 'libraries' | 'students';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
  badge: string;
  route?: string;
  location?: string;
}

export const CURATED_EDUCATIONAL_PHOTOS: EducationalPhoto[] = [
  // 1. CLASSROOMS & TEACHING
  {
    id: 'photo-class-1',
    title: 'Secondary Classroom Instruction',
    subtitle: 'Form I to Form VI Curriculum Delivery',
    category: 'classrooms',
    categoryLabel: 'Classrooms & Lectures',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    caption: 'Educators providing structured blackboard demonstrations, syllabus topic breakdown, and active question reviews.',
    badge: 'Classroom Excellence 📚',
    route: '/notes',
    location: 'Kizimba Secondary School'
  },
  {
    id: 'photo-class-2',
    title: 'Collaborative Problem Solving',
    subtitle: 'Mathematics & Science Peer Revision',
    category: 'classrooms',
    categoryLabel: 'Classrooms & Lectures',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1600&q=80',
    caption: 'Students working collaboratively through step-by-step mathematical proofs and physics equation sets.',
    badge: 'Peer Revision ✏️',
    route: '/questions',
    location: 'Academic Study Hall'
  },
  {
    id: 'photo-class-3',
    title: 'Smart Digital Learning Hub',
    subtitle: 'Interactive Screen Notes & Video Lessons',
    category: 'classrooms',
    categoryLabel: 'Classrooms & Lectures',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    caption: 'Modern multimedia teaching combining verified digital notes, audio podcasts, and AI study tutor explanations.',
    badge: 'EdTech Innovation ⚡',
    route: '/videos',
    location: 'Digital Media Lab'
  },

  // 2. SCIENCE LABORATORIES & PRACTICALS
  {
    id: 'photo-lab-1',
    title: 'Volumetric Analysis & Titration',
    subtitle: 'Chemistry Form IV & Form VI Practicals',
    category: 'labs',
    categoryLabel: 'Science Laboratories',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
    caption: 'Standardizing hydrochloric acid and sodium hydroxide with phenolphthalein and methyl orange indicators.',
    badge: 'Titration Lab 🧪',
    route: '/practicals',
    location: 'Chemistry Practical Wing'
  },
  {
    id: 'photo-lab-2',
    title: 'Physics Optics & Mechanics Setup',
    subtitle: 'Triangular Glass Prisms, Lenses & Pulleys',
    category: 'labs',
    categoryLabel: 'Science Laboratories',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1600&q=80',
    caption: 'Measuring angles of minimum deviation, focal length calculations, and verifying Hooke’s law with spiral springs.',
    badge: 'Physics Lab 🔬',
    route: '/practicals',
    location: 'Physics Laboratory'
  },
  {
    id: 'photo-lab-3',
    title: 'Biological Dissection & Microscopy',
    subtitle: 'Specimen Classification & Cell Observation',
    category: 'labs',
    categoryLabel: 'Science Laboratories',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
    caption: 'Observing plant epidermal stomata under high-power light microscopy and identifying floral diagram parts.',
    badge: 'Biology Specimen Lab 🌿',
    route: '/practicals',
    location: 'Biology Laboratory'
  },

  // 3. DIGITAL LIBRARIES & REFERENCE
  {
    id: 'photo-lib-1',
    title: 'Digital Reference Library & Archives',
    subtitle: 'Over 250+ Verified Curriculum Books & Syllabi',
    category: 'libraries',
    categoryLabel: 'Library & Reference',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
    caption: 'Comprehensive collection of secondary textbooks, English and Kiswahili literature set-books, and reference encyclopedias.',
    badge: 'Textbook Collection 📖',
    route: '/books',
    location: 'School Library'
  },
  {
    id: 'photo-lib-2',
    title: 'NECTA Past Examination Archives',
    subtitle: 'Form II FTNA, Form IV CSEE & Form VI ACSEE',
    category: 'libraries',
    categoryLabel: 'Library & Reference',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80',
    caption: 'Accessing solved national papers, step-by-step marking schemes, and past examiners’ performance feedback reports.',
    badge: 'NECTA Archive 📝',
    route: '/past-papers',
    location: 'Examination Vault'
  },
  {
    id: 'photo-lib-3',
    title: 'Quiet Study & Individual Research Desks',
    subtitle: 'Distraction-Free Focus & Offline Revision',
    category: 'libraries',
    categoryLabel: 'Library & Reference',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
    caption: 'Students preparing study summaries, flashcards, and chapter reviews with offline cached notes and worksheets.',
    badge: 'Silent Study Desks 🕯️',
    route: '/notes',
    location: 'Reference Study Hall'
  },

  // 4. STUDENT SUCCESS & CAMPUS LIFE
  {
    id: 'photo-stud-1',
    title: 'Student Academic Community',
    subtitle: 'Kizimba Secondary School, Bumbuli, Tanga',
    category: 'students',
    categoryLabel: 'Student Community',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    caption: 'Fostering academic curiosity, moral discipline, mutual mentorship, and consistent examination excellence.',
    badge: 'Academic Community 🎓',
    route: '/dashboard',
    location: 'Kizimba Campus'
  },
  {
    id: 'photo-stud-2',
    title: 'STEM Innovation & Future Scientists',
    subtitle: 'Nurturing Tanzanian Engineers & Doctors',
    category: 'students',
    categoryLabel: 'Student Community',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80',
    caption: 'Empowering young minds with digital tools, practical science mastery, and automated AI exam grading.',
    badge: 'STEM Leadership 💡',
    route: '/practicals',
    location: 'Science Center'
  }
];

export interface ImageCarouselProps {
  category?: EducationalPhotoCategory;
  customPhotos?: EducationalPhoto[];
  variant?: 'hero' | 'card' | 'compact' | 'banner';
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  showCategoryTabs?: boolean;
  onNavigate?: (route: string) => void;
  className?: string;
  heightClassName?: string;
  title?: string;
  subtitle?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  category = 'all',
  customPhotos,
  variant = 'hero',
  autoPlayInterval = 5500,
  showControls = true,
  showIndicators = true,
  showCategoryTabs = false,
  onNavigate,
  className = '',
  heightClassName = '',
  title,
  subtitle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EducationalPhotoCategory>(category);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter photos based on category or custom prop
  const photos = React.useMemo(() => {
    if (customPhotos && customPhotos.length > 0) return customPhotos;
    if (selectedCategory === 'all') return CURATED_EDUCATIONAL_PHOTOS;
    return CURATED_EDUCATIONAL_PHOTOS.filter(p => p.category === selectedCategory);
  }, [customPhotos, selectedCategory]);

  // Reset index if out of bounds when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, photos.length]);

  // Auto-cycling logic
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!isPlaying || isHovered || isLightboxOpen || photos.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, isLightboxOpen, autoPlayInterval, photos.length, handleNext]);

  const currentPhoto = photos[currentIndex] || photos[0];

  // Helper icons for categories
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'labs':
        return <FlaskConical className="w-4 h-4 text-emerald-300" />;
      case 'libraries':
        return <Library className="w-4 h-4 text-amber-300" />;
      case 'classrooms':
        return <BookOpen className="w-4 h-4 text-blue-300" />;
      case 'students':
        return <GraduationCap className="w-4 h-4 text-purple-300" />;
      default:
        return <School className="w-4 h-4 text-amber-300" />;
    }
  };

  // Determine height classes based on variant
  const getDefaultHeight = () => {
    if (heightClassName) return heightClassName;
    switch (variant) {
      case 'card':
        return 'h-48 sm:h-56';
      case 'compact':
        return 'h-36 sm:h-44';
      case 'banner':
        return 'h-40 sm:h-52';
      case 'hero':
      default:
        return 'h-72 sm:h-96 lg:h-[420px]';
    }
  };

  // ----------------------------------------------------
  // CARD / COMPACT VARIANT (Optimized for Dashboard Cards)
  // ----------------------------------------------------
  if (variant === 'card' || variant === 'compact') {
    return (
      <div 
        className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-blue-900/60 shadow-xl group font-serif ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative w-full ${getDefaultHeight()} overflow-hidden`}>
          {/* Images */}
          {photos.map((p, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={p.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>
            );
          })}

          {/* Top Badge Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-300 font-mono shadow-md">
              {getCategoryIcon(currentPhoto.category)}
              <span>{currentPhoto.badge}</span>
            </span>

            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur border border-white/20 text-[10px] font-mono text-slate-300">
              {currentIndex + 1}/{photos.length}
            </span>
          </div>

          {/* Bottom Captions */}
          <div className="absolute bottom-2.5 left-3 right-3 z-20 space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
              {currentPhoto.title}
            </h4>
            <p className="text-[11px] text-slate-300 font-sans line-clamp-1 leading-snug">
              {currentPhoto.caption}
            </p>
          </div>

          {/* Hover Arrows for Compact Card */}
          {showControls && photos.length > 1 && (
            <div className="absolute inset-y-0 inset-x-1 flex items-center justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="p-1 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black text-white border border-white/20 transition backdrop-blur shadow"
                title="Previous photo"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="p-1 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black text-white border border-white/20 transition backdrop-blur shadow"
                title="Next photo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Indicator bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 z-20">
            <div 
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // HERO & FULL-FEATURED CAROUSEL VARIANT
  // ----------------------------------------------------
  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-blue-700/50 shadow-2xl group font-serif ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Optional Top Category Filter Chips */}
      {showCategoryTabs && (
        <div className="bg-slate-950/90 border-b border-blue-900/60 p-3 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none z-30 relative">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="text-[11px] text-amber-400 uppercase tracking-wider mr-1">Collection:</span>
            {[
              { id: 'all', label: 'All Photos', icon: <School className="w-3.5 h-3.5 text-amber-300" /> },
              { id: 'classrooms', label: 'Classrooms 📚', icon: <BookOpen className="w-3.5 h-3.5 text-blue-300" /> },
              { id: 'labs', label: 'Science Labs 🧪', icon: <FlaskConical className="w-3.5 h-3.5 text-emerald-300" /> },
              { id: 'libraries', label: 'Libraries 📖', icon: <Library className="w-3.5 h-3.5 text-amber-300" /> },
              { id: 'students', label: 'Students 🎓', icon: <GraduationCap className="w-3.5 h-3.5 text-purple-300" /> }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as EducationalPhotoCategory)}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap border ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-amber-400 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-xl border text-xs font-mono flex items-center gap-1 transition ${
                isPlaying ? 'bg-slate-900 text-amber-300 border-slate-800 hover:bg-slate-800' : 'bg-amber-500 text-black border-amber-400'
              }`}
              title={isPlaying ? 'Pause Auto-cycle' : 'Play Auto-cycle'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Visual Display Stage */}
      <div className={`relative w-full ${getDefaultHeight()} overflow-hidden`}>
        {/* Layered Cross-Fading Images */}
        {photos.map((p, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={p.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover object-center filter brightness-[0.75]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Elegant Gradient Overlays for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-blue-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </div>
          );
        })}

        {/* Content Details Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8 lg:p-10 text-white font-serif">
          
          {/* Top Bar: Category Pill & Index Tracker */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-amber-400/50 text-amber-300 text-xs font-bold backdrop-blur-md shadow-lg font-mono">
              {getCategoryIcon(currentPhoto.category)}
              <span className="tracking-wider uppercase">{currentPhoto.badge}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="p-2 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/20 transition-colors backdrop-blur shadow-md"
                title="Expand Full Photo"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/60 border border-white/20 text-amber-300 font-bold backdrop-blur">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          </div>

          {/* Center Info Block */}
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              {currentPhoto.subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-wide drop-shadow-md">
              {currentPhoto.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-xl italic drop-shadow">
              "{currentPhoto.caption}"
            </p>
          </div>

          {/* Bottom Bar: Action CTA, Indicators & Arrow Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            
            {/* Dots Track */}
            {showIndicators && (
              <div className="flex items-center gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? 'w-8 bg-amber-400 shadow-[0_0_10px_#f59e0b]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Actions & Arrows */}
            <div className="flex items-center gap-2">
              {currentPhoto.route && onNavigate && (
                <button
                  onClick={() => onNavigate(currentPhoto.route!)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition uppercase tracking-wider font-mono border border-amber-400/50 flex items-center gap-1.5"
                >
                  <span>Explore Topic</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </button>
              )}

              {showControls && (
                <>
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/20 transition-colors backdrop-blur"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/20 transition-colors backdrop-blur"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* LIGHTBOX MODAL FOR EXPANDED HIGH-RES VIEW */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 border border-blue-700/60 rounded-3xl overflow-hidden shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-950 border border-blue-800">
                  {currentPhoto.categoryLabel}
                </span>
                <span className="text-white font-bold text-sm">{currentPhoto.title}</span>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High Res Image */}
            <div className="relative max-h-[70vh] flex items-center justify-center p-2 bg-black">
              <img
                src={currentPhoto.imageUrl}
                alt={currentPhoto.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Caption in Lightbox */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {currentPhoto.caption}
                </p>
                <span className="text-[11px] text-amber-400 font-mono block">
                  Location: {currentPhoto.location || 'Kizimba Digital Learning Hub'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-mono text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-mono text-xs flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
