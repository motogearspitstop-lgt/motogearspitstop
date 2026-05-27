import React, { useRef } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useVideoStore } from '@/store/videoStore';

const VideoCard = ({ video }) => {
  const { toast } = useToast();
  const { openModal } = useVideoStore();
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    openModal(video);
  };

  const handleShopNowClick = (e) => {
    e.stopPropagation();
    toast({
      title: "🚧 Shop Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleHoverStart = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Autoplay prevented:", error));
    }
  };

  const handleHoverEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Check if it's a direct video file (mp4, webm, etc.) rather than an embed
  const isDirectVideo = video.videoUrl && !video.videoUrl.includes('youtube.com/embed');

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handlePlayClick}
      className="relative w-full aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group shadow-lg border-2 border-gray-200 hover:border-[#e63946] transition-all duration-300 bg-white"
    >
      {/* Video Preview or Thumbnail */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnail}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Category Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
          {video.category.replace('-', ' ')}
        </span>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

      {/* Play Button Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#e63946] group-hover:scale-110 transition-all duration-300 shadow-lg">
          <Play className="w-6 h-6 ml-1 text-gray-900 group-hover:text-white transition-colors" fill="currentColor" />
        </div>
      </div>

      {/* Content Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-3">
        <h3 className="text-white font-bold text-base md:text-lg leading-tight text-shadow-lg line-clamp-3">
          {video.title}
        </h3>
        
        {video.showShopNow && (
          <button
            onClick={handleShopNowClick}
            className="bg-[#e63946] text-white font-semibold px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-[#d62839] transition-colors shadow-md w-full sm:w-auto mt-1"
          >
            SHOP NOW
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;