import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Calendar, Image as ImageIcon, Check, Filter } from 'lucide-react';
import { Notification } from '../hooks/useNotifications';
import { cn } from '../lib/utils';
import { auth } from '../firebase';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onAction: (notification: Notification) => void;
}

export const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onAction 
}: NotificationPanelProps) => {
  const [filter, setFilter] = useState<'all' | 'event' | 'gallery'>('all');
  const userId = auth.currentUser?.uid;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.readBy?.includes(userId || '')).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[150] w-full max-w-md h-[calc(100vh-120px)] flex flex-col"
          >
            <div className="glass-floating rounded-[2.5rem] border border-white/10 flex flex-col h-full overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <Bell size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Notifications</h3>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        {unreadCount} Unread Messages
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 flex-1">
                    {(['all', 'event', 'gallery'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                          filter === t ? "bg-white text-black shadow-lg" : "text-text-muted hover:text-white"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={onMarkAllAsRead}
                      className="text-[9px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors shrink-0"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => {
                    const isRead = notification.readBy?.includes(userId || '');
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-5 rounded-3xl border transition-all group relative",
                          isRead 
                            ? "bg-white/[0.02] border-white/5 opacity-60" 
                            : "bg-white/[0.05] border-white/10 shadow-lg"
                        )}
                      >
                        {!isRead && (
                          <div className="absolute top-6 right-6 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        )}

                        <div className="flex gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            notification.type === 'event' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                          )}>
                            {notification.type === 'event' ? <Calendar size={18} /> : <ImageIcon size={18} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm mb-1 truncate pr-4">
                              {notification.title}
                            </h4>
                            <p className="text-text-muted text-xs line-clamp-2 mb-4 leading-relaxed">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-medium text-white/20">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-2">
                                {!isRead && (
                                  <button
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check size={14} />
                                  </button>
                                )}
                                <button
                                  onClick={() => onAction(notification)}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white transition-all"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Bell size={40} className="mb-4" />
                    <p className="text-sm italic">No notifications found</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.01] text-center">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em]">
                  End of Notifications
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
