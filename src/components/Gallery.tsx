import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ZoomIn } from 'lucide-react';
import { GALLERY_IMAGES } from '../constants/mockData';
import { cn } from '../lib/utils';

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);

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
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1
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
          Visual <span className="font-medium">Gallery</span>
        </h2>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
          Capturing moments of collaboration, innovation, and community 
          excellence.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
      >
        {GALLERY_IMAGES.map((image) => (
          <motion.div
            key={image.id}
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedImage(image)}
            className="relative group rounded-[2rem] overflow-hidden cursor-zoom-in break-inside-avoid glass border border-white/5"
          >
            <img 
              src={image.url} 
              alt={image.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                  {image.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-4">
                  {image.title}
                </h3>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <ZoomIn size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-20 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-10 right-10 p-4 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="mt-8 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2 block">
                  {selectedImage.category}
                </span>
                <h3 className="text-3xl font-bold text-white">
                  {selectedImage.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
