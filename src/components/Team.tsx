import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { TEAM } from '../constants/mockData';
import { cn } from '../lib/utils';

const CLUBS = ['All', 'Tech', 'Music', 'Dance', 'Drama', 'Robotics'];

const TeamCard = ({ member, size = 'md' }: { member: any, size?: 'sm' | 'md' | 'lg' }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -10 }}
    className={cn(
      "glass rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center group transition-all duration-500",
      size === 'lg' ? "p-10" : size === 'md' ? "p-8" : "p-6"
    )}
  >
    <div className={cn(
      "relative mb-6 rounded-3xl overflow-hidden border border-white/10 p-1 bg-white/5 group-hover:border-primary/50 transition-colors duration-500",
      size === 'lg' ? "w-32 h-32" : size === 'md' ? "w-24 h-24" : "w-20 h-20"
    )}>
      <img 
        src={member.image} 
        alt={member.name}
        className="w-full h-full rounded-[1.25rem] object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
    </div>
    
    <h3 className={cn(
      "font-bold text-white mb-1 group-hover:text-primary transition-colors",
      size === 'lg' ? "text-2xl" : "text-lg"
    )}>
      {member.name}
    </h3>
    <div className="flex flex-col items-center gap-1 mb-6">
      <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
        {member.role}
      </p>
      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-primary uppercase tracking-widest">
        {member.club}
      </span>
    </div>

    {member.socials && (
      <div className="flex items-center gap-4">
        {Object.entries(member.socials).map(([platform, url]) => (
          <motion.a
            key={platform}
            href={url as string}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="text-text-muted hover:text-white transition-colors"
          >
            {platform === 'github' && <Github size={16} />}
            {platform === 'twitter' && <Twitter size={16} />}
            {platform === 'linkedin' && <Linkedin size={16} />}
          </motion.a>
        ))}
      </div>
    )}
  </motion.div>
);

export const Team = () => {
  const [selectedClub, setSelectedClub] = useState('All');

  const filterMembers = (members: any[]) => {
    if (selectedClub === 'All') return members;
    return members.filter(m => m.club === selectedClub);
  };

  const filteredLeads = filterMembers(TEAM.leads);
  const filteredCore = filterMembers(TEAM.core);
  const filteredMembers = filterMembers(TEAM.members);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-20"
      >
        <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">
          Meet the <span className="font-medium">Team</span>
        </h2>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide mb-12">
          The passionate individuals driving innovation and building the 
          future of our community.
        </p>

        {/* Club Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {CLUBS.map((club) => (
            <button
              key={club}
              onClick={() => setSelectedClub(club)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border",
                selectedClub === club 
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                  : "bg-white/5 text-text-muted border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              {club}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedClub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-32"
          >
            {/* Leads Section */}
            {filteredLeads.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">Executive Leads</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto"
                >
                  {filteredLeads.map(member => (
                    <TeamCard key={member.id} member={member} size="lg" />
                  ))}
                </motion.div>
              </section>
            )}

            {/* Core Section */}
            {filteredCore.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">Core Team</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredCore.map(member => (
                    <TeamCard key={member.id} member={member} size="md" />
                  ))}
                </motion.div>
              </section>
            )}

            {/* Members Section */}
            {filteredMembers.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">Active Members</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  {filteredMembers.map(member => (
                    <TeamCard key={member.id} member={member} size="sm" />
                  ))}
                </motion.div>
              </section>
            )}

            {filteredLeads.length === 0 && filteredCore.length === 0 && filteredMembers.length === 0 && (
              <div className="text-center py-20 opacity-30">
                <p className="text-xl italic">No members found in the {selectedClub} club.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
