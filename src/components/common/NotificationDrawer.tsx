import React from 'react';
import { X, Bell, CheckCircle2, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead
}) => {
  if (!isOpen) return null;

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'NEW_CONTENT':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'AI':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'APPROVAL':
        return <AlertCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-2">
          {notifications.map(n => (
            <div 
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`p-3 rounded-xl transition-all cursor-pointer space-y-1 ${
                n.read ? 'bg-slate-50/60 hover:bg-slate-100/60' : 'bg-blue-50/80 border border-blue-200/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  {getNotifIcon(n.type)}
                  <span>{n.title}</span>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              <span className="text-[10px] text-slate-400 block pt-1">{n.date}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-center text-slate-500">
          KDLH System Notifications
        </div>

      </div>
    </div>
  );
};
