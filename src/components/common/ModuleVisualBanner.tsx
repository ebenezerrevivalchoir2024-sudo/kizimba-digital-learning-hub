import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, BookOpen, FlaskConical, Video, Headphones, FileText, Library, Brain, Award } from 'lucide-react';

export interface ModuleBannerConfig {
  title: string;
  subtitle: string;
  tagline: string;
  badgeText: string;
  category: 'NOTES' | 'PRACTICALS' | 'PAST_PAPERS' | 'VIDEOS' | 'BOOKS' | 'AUDIO' | 'EXAM_SCANNER' | 'AI';
  images: {
    url: string;
    caption: string;
  }[];
  actionLabel?: string;
  onAction?: () => void;
}

export const MODULE_VISUALS: Record<string, ModuleBannerConfig> = {
  NOTES: {
    title: 'Curriculum Notes & Syllabus',
    subtitle: 'Verified Form I to Form VI Tanzanian Secondary Notes',
    tagline: 'Structured topic summaries, key formulas, diagrams, and revision notes prepared by certified Tanzanian educators.',
    badgeText: 'Curriculum Verified 📚',
    category: 'NOTES',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
        caption: 'Students taking comprehensive revision notes in science and humanities.'
      },
      {
        url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Classroom teaching and chalkboard problem breakdowns.'
      },
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
        caption: 'Deep focus study session for Form IV and Form VI national examinations.'
      }
    ]
  },
  PRACTICALS: {
    title: 'Science Practical Laboratory',
    subtitle: 'Chemistry Titrations, Physics Mechanics & Biology Dissections',
    tagline: 'Step-by-step practical guides, apparatus setup diagrams, specimen observation guides, and NECTA practical instructions.',
    badgeText: 'Hands-on Science Labs 🧪',
    category: 'PRACTICALS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Chemistry laboratory titration, reagent qualitative analysis and volumetric setups.'
      },
      {
        url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Physics optics, electricity circuits, and mechanics experiments.'
      },
      {
        url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
        caption: 'Biology specimen microscopy and physiological experimental procedures.'
      }
    ]
  },
  PAST_PAPERS: {
    title: 'NECTA Past Papers & Solutions',
    subtitle: 'Form II, CSEE Form IV & ACSEE Form VI Examination Archive',
    tagline: 'Authentic past examination papers with official marking schemes, model solutions, and common mistake analyses.',
    badgeText: 'Official NECTA Repository 📝',
    category: 'PAST_PAPERS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80',
        caption: 'National examination preparation and structured marking scheme evaluation.'
      },
      {
        url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Timed exam practice and solution verification for high academic achievement.'
      }
    ]
  },
  VIDEOS: {
    title: 'Video Lessons & Demonstrations',
    subtitle: 'Recorded Classroom Lectures & Practical Lab Experiments',
    tagline: 'Visual topic explanations, teacher board work, and video recordings designed to simplify complex STEM concepts.',
    badgeText: 'HD Video Learning Hub 🎥',
    category: 'VIDEOS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Interactive digital classroom lessons with video explanations.'
      },
      {
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Collaborative group video study and peer academic review.'
      }
    ]
  },
  BOOKS: {
    title: 'Digital Reference Library',
    subtitle: 'Approved Textbooks, Supplementary Books & Study Guides',
    tagline: 'Access certified Tanzanian curriculum textbooks, reference manuals, literature set-books, and academic resources.',
    badgeText: 'Digital Bookshelf 📖',
    category: 'BOOKS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Extensive digital library collection across all secondary subjects.'
      },
      {
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        caption: 'Textbook collections for O-Level and A-Level secondary studies.'
      }
    ]
  },
  AUDIO: {
    title: 'Audio Lessons & Podcasts',
    subtitle: 'Spoken Subject Summaries & Audio Revision Guides',
    tagline: 'Listen to clear, teacher-narrated topic reviews on your phone or computer anytime, even when on the go.',
    badgeText: 'Audio Study Hub 🎧',
    category: 'AUDIO',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
        caption: 'Clear audio narration and spoken revision for audio learners.'
      }
    ]
  }
};

interface ModuleVisualBannerProps {
  moduleKey: 'NOTES' | 'PRACTICALS' | 'PAST_PAPERS' | 'VIDEOS' | 'BOOKS' | 'AUDIO';
  customTitle?: string;
  customSubtitle?: string;
  actionButton?: React.ReactNode;
}

export const ModuleVisualBanner: React.FC<ModuleVisualBannerProps> = ({
  moduleKey,
  customTitle,
  customSubtitle,
  actionButton
}) => {
  const config = MODULE_VISUALS[moduleKey] || MODULE_VISUALS.NOTES;
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (config.images.length <= 1) return;
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % config.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [config.images.length]);

  const activeImage = config.images[imageIndex] || config.images[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-blue-800/60 bg-slate-950 shadow-2xl font-serif">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {config.images.map((img, idx) => (
          <img
            key={img.url}
            src={img.url}
            alt={img.caption}
            className={`w-full h-full object-cover transition-opacity duration-1000 absolute inset-0 ${
              idx === imageIndex ? 'opacity-35 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />
        ))}
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-blue-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/80 border border-amber-400/50 text-amber-300 text-xs font-bold font-mono shadow-md backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {config.badgeText}
            </span>

            {config.images.length > 1 && (
              <span className="text-[10px] text-blue-200/80 font-mono px-2 py-0.5 bg-black/50 rounded-md border border-blue-900/50">
                Visual {imageIndex + 1}/{config.images.length}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide leading-tight drop-shadow-md">
            {customTitle || config.title}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl font-sans drop-shadow">
            {customSubtitle || config.tagline}
          </p>

          <p className="text-[11px] text-amber-300/80 font-mono italic">
            📷 {activeImage.caption}
          </p>
        </div>

        {/* Action Button */}
        {actionButton && (
          <div className="flex-shrink-0 self-start md:self-auto">
            {actionButton}
          </div>
        )}

      </div>

    </div>
  );
};
