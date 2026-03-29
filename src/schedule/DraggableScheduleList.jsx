import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "react-use-draggable-scroll";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DraggableScheduleList = ({ schedules, onScheduleClick, formatTimeFromString, formatDuration }) => {
  const ref = useRef();
  const progressRef = useRef();
  const { events } = useDraggable(ref);

  useEffect(() => {
    const container = ref.current;
    const progressBar = progressRef.current;
    if (!container || !progressBar) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth - container.clientWidth;
        const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        rafId = null;
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [schedules]);

  return (
    <>
      <style>
        {`
          .schedule-scroll-container::-webkit-scrollbar {
            display: none;
          }
          
          .scroll-progress-bar {
            position: relative;
            width: 100%;
            height: 4px;
            background: var(--color-bg-secondary);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 8px;
          }
          
          .scroll-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #B88300 0%, #D4A017 100%);
            border-radius: 2px;
            box-shadow: 0 0 8px rgba(184, 131, 0, 0.4);
            will-change: width;
          }
          
          .dark .scroll-progress-fill {
            background: linear-gradient(90deg, #EAAA00 0%, #FFD700 100%);
            box-shadow: 0 0 8px rgba(234, 170, 0, 0.4);
          }
        `}
      </style>
      <div className="scroll-progress-bar">
        <div 
          ref={progressRef}
          className="scroll-progress-fill"
          style={{ width: "0%" }}
        />
      </div>
      <div 
        ref={ref}
        {...events}
        className="flex gap-3 overflow-x-auto pb-2 schedule-scroll-container"
        style={{
          cursor: "grab",
          userSelect: "none",
          scrollbarWidth: "none"
        }}
      >
        {schedules.map((schedule, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
            onClick={() => onScheduleClick(schedule)}
            className="cursor-pointer"
            onDragStart={(e) => e.preventDefault()}
            style={{ willChange: "transform" }}
          >
            <div className="flex-shrink-0 w-64 h-32 rounded overflow-hidden relative block shadow-md hover:shadow-lg transition-shadow duration-200">
              <AnimatePresence>
                {schedule.youtubeChannelBanner ? (
                  <motion.img
                    key="banner"
                    src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelBanner)}`}
                    alt={`${schedule.username} banner`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <motion.div
                    key="fallback"
                    className="absolute inset-0 w-full h-full bg-[var(--color-index-bg)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0"></div>
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className="flex items-start gap-2 align-center">
                  {schedule.youtubeChannelAvatar && (
                    <img
                      src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelAvatar)}`}
                      alt={schedule.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/50"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="bg-[var(--color-overlay-dark)] rounded px-2 py-1">
                      <div className="text-sm font-semibold truncate text-[var(--color-text)] drop-shadow-lg">{schedule.username}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="bg-[var(--color-overlay-dark)] rounded px-2 py-1">
                    {schedule.title && (
                      <div className="text-sm font-medium truncate text-[var(--color-text)] drop-shadow-lg mb-1" title={schedule.title}>{schedule.title}</div>
                    )}
                    <div className="flex items-center text-xs text-[var(--color-text)] drop-shadow-lg">
                      <span>{formatTimeFromString(schedule.time, schedule.timezone)}</span>
                      <span className="mx-1">for</span>
                      <span>{formatDuration(schedule.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default DraggableScheduleList;
