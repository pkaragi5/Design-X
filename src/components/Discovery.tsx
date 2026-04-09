import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, RotateCcw, Calendar, Trophy, Sparkles, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { eventService, challengeService, discoveryService } from '../services/firestoreService';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { cn } from '../lib/utils';

// ------------------ Swipe Card ------------------

const SwipeCard = ({ 
  item, 
  onSwipe, 
  indexInStack 
}: { 
  item: any; 
  onSwipe: (direction: 'left' | 'right') => void; 
  indexInStack: number;
}) => {
  const isTop = indexInStack === 0;
  const x = useMotionValue(0);
  
  // Top card animations
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
  const interestedOpacity = useTransform(x, [50, 150], [0, 1]);
  const skippedOpacity = useTransform(x, [-50, -150], [0, 1]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = (_: any, info: any) => {
    if (!isTop) return;
    if (info.offset.x > 120) {
      onSwipe('right');
    } else if (info.offset.x < -120) {
      onSwipe('left');
    }
  };

  // Stack positions
  const stackY = indexInStack * 12;
  const stackScale = 1 - (indexInStack * 0.05);
  const stackZIndex = 10 - indexInStack;

  return (
    <motion.div
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0, 
        opacity: isTop ? opacity : 1,
        scale: isTop ? scale : stackScale,
        zIndex: stackZIndex,
        y: isTop ? 0 : stackY,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      className={cn(
        "absolute inset-0 w-full h-full",
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      )}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ 
        scale: isTop ? 1 : stackScale, 
        opacity: 1, 
        y: isTop ? 0 : stackY,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
      }}
      exit={{ 
        x: x.get() > 0 ? 1000 : x.get() < 0 ? -1000 : 0, 
        opacity: 0, 
        scale: 0.5,
        rotate: x.get() > 0 ? 45 : -45,
        transition: { duration: 0.5, ease: "easeIn" } 
      }}
    >
      <div className={cn(
        "relative w-full h-full glass rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl",
        isTop && "ring-1 ring-white/20"
      )}>
        {/* Overlays */}
        {isTop && (
          <>
            <motion.div 
              style={{ opacity: interestedOpacity }}
              className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="border-4 border-emerald-500 text-emerald-500 px-8 py-3 rounded-2xl font-black text-4xl uppercase tracking-tighter rotate-[-10deg] bg-black/20 backdrop-blur-sm">
                Interested
              </div>
            </motion.div>
            <motion.div 
              style={{ opacity: skippedOpacity }}
              className="absolute inset-0 bg-rose-500/10 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="border-4 border-rose-500 text-rose-500 px-8 py-3 rounded-2xl font-black text-4xl uppercase tracking-tighter rotate-[10deg] bg-black/20 backdrop-blur-sm">
                Skipped
              </div>
            </motion.div>
          </>
        )}

        <div className="p-8 flex-1 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                item.type === 'event' ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
              )}>
                {item.type === 'event' ? <Calendar size={24} /> : <Trophy size={24} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                {item.type}
              </span>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4 tracking-tight leading-tight">{item.title}</h2>
            <p className="text-white/60 text-lg leading-relaxed line-clamp-4">{item.description}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (item.registrationLink) {
                window.open(item.registrationLink, "_blank");
              }
            }}
            className={cn(
              "mt-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95",
              item.type === 'event' ? "bg-white text-black" : "bg-primary text-black"
            )}
          >
            {item.type === 'event' ? 'Register Now' : 'Start Challenge'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ------------------ MAIN ------------------

export const Discovery = () => {
  const [items, setItems] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  // ---------------- AUTH ----------------

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // ---------------- FETCH ----------------

  useEffect(() => {
    if (!user) return;

    let currentEvents = [];
    let currentChallenges = [];

    const updateItems = () => {
      let combined = [...currentEvents, ...currentChallenges];

      // Dummy fallback
      if (combined.length === 0) {
        combined = [
          {
            id: "dummy1",
            type: "event",
            title: "Test Event",
            description: "If you see this, system works!",
            isPublished: true
          },
          {
            id: "dummy2",
            type: "challenge",
            title: "Test Challenge",
            description: "Swipe to test UI",
            isPublished: true
          }
        ];
      }

      setItems(combined);

      const firstUnseen = combined.findIndex(item => !interactions[item.id]);

      if (firstUnseen !== -1) {
        setActiveIndex(firstUnseen);
      } else {
        setActiveIndex(combined.length); // summary
      }

      setLoading(false);
    };

    const unsubEvents = eventService.subscribeToUpcomingEvents((events) => {
      currentEvents = events.map(e => ({
        id: e.id,
        type: "event",
        title: e.title,
        description: e.shortDescription,
        registrationLink: e.registrationLink
      }));
      updateItems();
    });

    const unsubChallenges = challengeService.subscribeToChallenges((challenges) => {
      currentChallenges = challenges.map(c => ({
        id: c.id,
        type: "challenge",
        title: c.title,
        description: c.description
      }));
      updateItems();
    });

    const unsubInteractions = discoveryService.subscribeToInteractions(user.uid, (data) => {
      setInteractions(data);
    });

    return () => {
      unsubEvents();
      unsubChallenges();
      unsubInteractions();
    };
  }, [user]);

  // ---------------- SAFE DISPLAY ----------------

  const displayItems = useMemo(() => {
    if (!items.length) return [];

    if (activeIndex >= items.length) return [];

    return items.slice(activeIndex, activeIndex + 3);
  }, [items, activeIndex]);

  // ---------------- SWIPE ----------------

  const handleSwipe = async (direction) => {
    if (activeIndex >= items.length) return;

    const user = auth.currentUser;
    if (!user) return;

    const item = items[activeIndex];

    setHistory(prev => [item.id, ...prev]);

    setActiveIndex(prev => Math.min(prev + 1, items.length));

    await discoveryService.saveInteraction(
      user.uid,
      item.id,
      direction === "right" ? "interested" : "skipped"
    );
  };

  // ---------------- RESET ----------------

  const handleReset = () => {
    setActiveIndex(0);
    setHistory([]);
    setInteractions({});
  };

  // ---------------- LOADING ----------------

  if (!user) {
    return <div className="text-white text-center mt-40">Login Required</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-white/5 border-t-primary rounded-full mb-6"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 animate-pulse">Scanning the Hub...</p>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative z-10">

      {/* CARDS */}
      {displayItems.length > 0 ? (
        <div className="relative w-[350px] h-[500px]">
          <AnimatePresence>
            {[...displayItems].reverse().map((item, i) => (
              <SwipeCard
                key={item.id}
                item={item}
                indexInStack={i}
                onSwipe={handleSwipe}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No More Items</h2>
          <button
            onClick={handleReset}
            className="bg-white text-black px-6 py-3 rounded-xl"
          >
            Reset
          </button>
        </div>
      )}

      {/* CONTROLS */}
      {displayItems.length > 0 && (
        <div className="flex gap-8 mt-16">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-all shadow-xl"
          >
            <X size={32} strokeWidth={3} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-xl"
          >
            <Heart size={32} fill="currentColor" />
          </motion.button>
        </div>
      )}

    </div>
  );
};