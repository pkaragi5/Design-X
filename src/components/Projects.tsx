import { motion } from 'motion/react';
import { Github, ExternalLink, Code } from 'lucide-react';
import { PROJECTS } from '../constants/mockData';
import { cn } from '../lib/utils';

export const Projects = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-24"
      >
        <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">
          Our <span className="font-medium">Projects</span>
        </h2>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
          A showcase of innovation, craftsmanship, and technical excellence 
          built by our community.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -10 }}
            className="group relative glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative h-60 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
              
              {/* Tech Tags Overlay */}
              <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
                {project.tech.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8 font-light tracking-wide flex-1">
                {project.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <motion.a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Github size={18} />
                  </motion.a>
                  <motion.a 
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all"
                  >
                    <ExternalLink size={18} />
                  </motion.a>
                </div>
                
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors">
                  Case Study <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
