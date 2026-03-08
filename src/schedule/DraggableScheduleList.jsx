import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "react-use-draggable-scroll";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DraggableScheduleList = ({ schedules, onScheduleClick, formatTimeFromString, formatDuration }) => {
  const ref = useRef();
  const { events } = useDraggable(ref);

  return (
    <>
      <style>
        {`
          .schedule-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
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
            transition={{ duration: 0.2 }}
            onClick={() => onScheduleClick(schedule)}
            className="cursor-pointer"
            onDragStart={(e) => e.preventDefault()}
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
                    <div className="flex text-xs text-[var(--color-text)] drop-shadow-lg">
                      <span>{formatTimeFromString(schedule.time, schedule.timezone)}</span> for 
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
