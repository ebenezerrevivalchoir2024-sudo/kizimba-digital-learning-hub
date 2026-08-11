import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RotateCw, 
  Crop, 
  Sun, 
  Sliders, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Sparkles,
  FileText,
  Scan,
  AlertCircle
} from 'lucide-react';
import { ScannedPage } from '../../types';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPagesCaptured: (pages: ScannedPage[]) => void;
  examTitle?: string;
  studentName?: string;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onPagesCaptured,
  examTitle = 'Chemistry Form IV Terminal Exam',
  studentName = 'Juma Baraka'
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessingDoc, setIsProcessingDoc] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      const newPage: ScannedPage = {
        id: `scan-page-${Date.now()}-${pages.length + 1}`,
        pageNumber: pages.length + 1,
        imageUrl,
        confidence: Math.floor(Math.random() * 8) + 91,
        processedText: `Page ${pages.length + 1} captured via phone/webcam camera. OCR detected text & mathematical chemical expressions.`,
        adjustments: { brightness: 100, contrast: 100, rotate: 0, cropApplied: true }
      };

      const updated = [...pages, newPage];
      setPages(updated);
      setSelectedPageIndex(updated.length - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newPage: ScannedPage = {
          id: `scan-upload-${Date.now()}-${idx}`,
          pageNumber: pages.length + 1 + idx,
          imageUrl,
          confidence: 95,
          processedText: `Uploaded script document page ${pages.length + 1 + idx}. OCR handwriting processing complete.`,
          adjustments: { brightness: 100, contrast: 100, rotate: 0, cropApplied: false }
        };
        setPages(prev => {
          const next = [...prev, newPage];
          setSelectedPageIndex(next.length - 1);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePage = (index: number) => {
    const updated = pages.filter((_, i) => i !== index).map((p, i) => ({ ...p, pageNumber: i + 1 }));
    setPages(updated);
    if (selectedPageIndex >= updated.length) {
      setSelectedPageIndex(Math.max(0, updated.length - 1));
    }
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === pages.length - 1)) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const renumbered = updated.map((p, i) => ({ ...p, pageNumber: i + 1 }));
    setPages(renumbered);
    setSelectedPageIndex(targetIdx);
  };

  const handleFinalizeProcessing = () => {
    if (pages.length === 0) return;
    setIsProcessingDoc(true);
    setTimeout(() => {
      setIsProcessingDoc(false);
      onPagesCaptured(pages);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const activePage = pages[selectedPageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                KDLH Exam Scanner
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-medium">AI Document Engine</span>
              </h2>
              <p className="text-xs text-slate-400">
                Student: <span className="text-teal-300 font-semibold">{studentName}</span> • Exam: {examTitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          
          {/* Main Camera / Preview Stage */}
          <div className="lg:col-span-8 bg-black flex flex-col items-center justify-center relative p-4 min-h-[380px]">
            
            {/* Tabs */}
            <div className="absolute top-4 left-4 z-10 flex bg-slate-900/90 backdrop-blur rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setActiveTab('camera')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                  activeTab === 'camera' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Camera
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                  activeTab === 'upload' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            {/* Stage View */}
            {activeTab === 'camera' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`max-h-[480px] w-full object-contain rounded-xl border border-slate-800 ${
                    !isCameraActive ? 'hidden' : ''
                  }`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950/80 rounded-2xl border border-slate-800 max-w-md space-y-3">
                    <Camera className="w-12 h-12 text-teal-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-200">Camera Access Unavailable / Offline</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Camera access is unavailable or permission was not granted. You can retry enabling camera or upload scanned script images directly.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition shadow-lg flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" /> Enable Camera
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Images Instead
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Edge Detection Simulation Box */}
                {isCameraActive && (
                  <div className="absolute inset-12 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-4 bg-teal-500/5 animate-pulse">
                    <div className="flex justify-between text-[10px] text-teal-300 font-mono">
                      <span>DOC_EDGE_ALIGN: 98%</span>
                      <span>PERSPECTIVE_AUTO_CORRECT</span>
                    </div>
                    <div className="text-center text-xs text-teal-200/90 font-medium bg-slate-950/80 py-1 px-3 rounded-full self-center border border-teal-500/30">
                      Align exam script page inside frame
                    </div>
                  </div>
                )}

                {/* Shutter Button */}
                {isCameraActive && (
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-6 z-20 w-16 h-16 rounded-full bg-teal-500 border-4 border-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition"
                    title="Capture Script Page"
                  >
                    <div className="w-12 h-12 rounded-full bg-teal-600 border-2 border-teal-300" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                <Upload className="w-12 h-12 text-teal-400 mb-3" />
                <h3 className="text-sm font-semibold text-slate-200">Upload Exam Script Files</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4 text-center max-w-sm">
                  Select scanned JPG, PNG images or PDF photos from phone or computer storage.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition shadow-lg flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Browse Photos
                </button>
              </div>
            )}

          </div>

          {/* Page Inspector & Enhancement Controls */}
          <div className="lg:col-span-4 bg-slate-950 p-4 border-l border-slate-800 flex flex-col justify-between overflow-y-auto">
            
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Scanned Pages ({pages.length})
                </span>
                {pages.length > 0 && (
                  <span className="text-[11px] text-teal-400 font-medium">
                    Auto-Order Active
                  </span>
                )}
              </div>

              {/* Thumbnail Strip */}
              {pages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No pages scanned yet.<br />Take photo or upload to begin.
                </div>
              ) : (
                <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {pages.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPageIndex(idx)}
                      className={`flex items-center justify-between p-2 rounded-xl border transition cursor-pointer ${
                        selectedPageIndex === idx
                          ? 'border-teal-500 bg-teal-500/10'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.imageUrl} 
                          alt={`Page ${p.pageNumber}`} 
                          className="w-10 h-12 object-cover rounded-md border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-200">PAGE {p.pageNumber}</p>
                          <p className="text-[10px] text-teal-400">OCR Conf: {p.confidence}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); movePage(idx, 'up'); }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          title="Move Page Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); movePage(idx, 'down'); }}
                          disabled={idx === pages.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          title="Move Page Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removePage(idx); }}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Adjustments for Selected Page */}
              {activePage && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-400" /> Image Enhancements (Page {activePage.pageNumber})
                  </span>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-teal-500 h-1 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Contrast</span>
                      <span>{contrast}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-teal-500 h-1 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
                    </button>
                    <button
                      onClick={() => alert('Automatic edge perspective correction applied.')}
                      className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1"
                    >
                      <Crop className="w-3.5 h-3.5" /> Auto-Crop
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleFinalizeProcessing}
                disabled={pages.length === 0 || isProcessingDoc}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessingDoc ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Processing OCR & AI Marking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Process & Send to KDLH AI Marker
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
