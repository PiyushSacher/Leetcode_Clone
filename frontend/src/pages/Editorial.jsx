import { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle Play/Pause
  const togglePlay = async () => {
  const video = videoRef.current;
  if (!video) return;

  try {
    if (isPlaying) {
      await video.pause();
    } else {
      await video.play();
    }
    setIsPlaying(!isPlaying);
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Video playback error:", err);
    }
  }
};

  // Update current time as video plays
  useEffect(() => {
  const video = videoRef.current;
  const updateTime = () => setCurrentTime(video.currentTime);
  video.addEventListener("timeupdate", updateTime);

  return () => {
    video.removeEventListener("timeupdate", updateTime);
    video.pause(); // safely pause before unmounting
  };
}, []);

  // Handle progress slider change
  const handleSeek = (e) => {
    const video = videoRef.current;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl bg-black"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          preload="metadata"
          className="w-full h-auto max-h-[80vh] object-contain bg-black"
        ></video>

        {/* Play/Pause Button (Center Overlay) */}
        {isHovering && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition"
          >
            {isPlaying ? (
              <Pause size={48} className="text-white" />
            ) : (
              <Play size={48} className="text-white" />
            )}
          </button>
        )}

        {/* Progress & Time Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 flex items-center gap-3 text-sm text-gray-200">
          {/* Progress Slider */}
          <input
            type="range"
            min="0"
            max={duration || videoRef.current?.duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 cursor-pointer accent-blue-500"
          />

          {/* Time Display */}
          <div className="min-w-[80px] text-right font-mono">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
