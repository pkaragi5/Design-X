import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, ArrowRight, Filter, Search, Clock } from 'lucide-react';
import { ClubEvent } from '../types';
import { eventService } from '../services/firestoreService';
import { cn } from '../lib/utils';

export const Events = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'past'>('all');

  useEffect(() => {
    // Only subscribe to published events for public view
    const unsubscribe = eventService.subscribeToUpcomingEvents((publishedEvents) => {
      setEvents(publishedEvents);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || event.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/5 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
        <div className="max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6"
          >
            Upcoming <span className="font-medium">Events</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-muted text-lg md:text-xl font-light tracking-wide"
          >
            Discover and participate in the most exciting club activities on campus. 
            From hackathons to cultural nights, find your next big moment.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-2xl pl-14 pr-8 py-4 text-sm text-white outline-none focus:ring-2 ring-white/10 focus:bg-white/10 transition-all w-full sm:w-72"
            />
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {(['all', 'upcoming', 'live', 'past'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  filter === f ? "bg-white text-black shadow-xl" : "text-text-muted hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-40 glass rounded-[3rem] border border-white/5">
          <Calendar className="mx-auto text-text-muted mb-8 opacity-10" size={80} />
          <h3 className="text-3xl font-bold text-white mb-3">No events found</h3>
          <p className="text-text-muted font-light tracking-wide">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.8, ease: "easeOut" }}
                className="group relative glass rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-700 flex flex-col h-full"
              >
                <div className="p-10 flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      event.status === 'live' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                      event.status === 'upcoming' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      "bg-white/5 text-text-muted border-white/10"
                    )}>
                      {event.status}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      <Users size={14} className="text-white/40" />
                      {event.registrations || 0} Joined
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-500 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-10 line-clamp-2 font-light tracking-wide leading-relaxed">
                    {event.shortDescription}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-text-soft">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                        <Calendar size={16} className="text-white/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</span>
                        <span className="text-sm font-medium">
                          {new Date(event.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-text-soft">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                        <Clock size={16} className="text-white/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Time</span>
                        <span className="text-sm font-medium">
                          {new Date(event.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-text-soft">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                        <MapPin size={16} className="text-white/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Location</span>
                        <span className="text-sm font-medium truncate max-w-[180px]">
                          {event.mode === 'online' ? 'Digital Hub' : event.venue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 pt-0 mt-auto">
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-[11px] font-black text-white">
                          {event.club.charAt(0)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                        {event.club}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {event.registrationLink && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
                          }}
                          className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
                        >
                          Join
                        </motion.button>
                      )}
                      <button className="flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors group/btn">
                        Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
