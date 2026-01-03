import { forwardRef } from 'react';
import { User, Volume2 } from 'lucide-react';

interface VideoPanelProps {
  label: string;
  name?: string;
  isLocal?: boolean;
  isConnected?: boolean;
}

const VideoPanel = forwardRef<HTMLVideoElement, VideoPanelProps>(
  ({ label, name, isLocal = false, isConnected = false }, ref) => {
    return (
      <div className="relative group">
        {/* Glow effect */}
        <div className={`absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-500 ${
          isConnected ? 'opacity-60' : 'opacity-30'
        } ${isLocal ? 'bg-primary/30' : 'bg-secondary/30'}`} />
        
        {/* Video container */}
        <div className="relative video-container aspect-video">
          <video
            ref={ref}
            autoPlay
            playsInline
            muted={isLocal}
            onLoadedMetadata={(e) => {
              void e.currentTarget.play().catch(() => {
                // Autoplay can be blocked until a user gesture.
              });
            }}
            onClick={(e) => {
              if (!isLocal) e.currentTarget.muted = false;
              void e.currentTarget.play().catch(() => {
                // Autoplay can be blocked until a user gesture.
              });
            }}
            className="w-full h-full object-cover rounded-2xl"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-2xl" />
          
          {/* LIVE badge - Top Right */}
          {!isLocal && isConnected && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm border border-red-400/50 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold text-white">Live</span>
            </div>
          )}
          
          {/* User info overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isLocal ? 'bg-primary/20 border border-primary/50' : 'bg-secondary/20 border border-secondary/50'
                }`}>
                  <User className={`w-5 h-5 ${isLocal ? 'text-primary' : 'text-secondary'}`} />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {name || label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isLocal ? 'You' : 'Stranger'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Border glow effect */}
          <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
            isConnected ? 'glow-border' : ''
          }`} />
        </div>
      </div>
    );
  }
);

VideoPanel.displayName = 'VideoPanel';

export default VideoPanel;