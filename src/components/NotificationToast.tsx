import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react';
import { Notification } from '../hooks/useNotifications';
import { cn } from '../lib/utils';

interface NotificationToastProps {
  notification: Notification | null;
  onDismiss: () => void;
  onAction: (notification: Notification) => void;
}

export const NotificationToast = ({ notification, onDismiss, onAction }: NotificationToastProps) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-8 right-8 z-[100] w-full max-w-sm"
        >
          <div className="glass-floating p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
            {/* Background Accent */}
            <div className={cn(
              "absolute top-0 left-0 w-1 h-full",
              notification.type === 'event' ? "bg-primary" : "bg-secondary"
            )} />
            
            <button 
              onClick={onDismiss}
              className="absolute top-4 right-4 p-1 text-white/20 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                notification.type === 'event' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
              )}>
                {notification.type === 'event' ? <Calendar size={24} /> : <ImageIcon size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    New {notification.type}
                  </span>
                  <span className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className="text-[10px] font-medium text-white/30">Just now</span>
                </div>
                
                <h4 className="text-white font-bold text-lg mb-1 truncate">
                  {notification.title}
                </h4>
                <p className="text-text-muted text-sm line-clamp-2 mb-4 leading-relaxed">
                  {notification.message}
                </p>

                <button
                  onClick={() => onAction(notification)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    notification.type === 'event' 
                      ? "bg-primary text-white hover:bg-primary/80" 
                      : "bg-secondary text-white hover:bg-secondary/80"
                  )}
                >
                  {notification.type === 'event' ? 'View Event' : 'Open Gallery'}
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
