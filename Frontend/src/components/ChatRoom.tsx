import { RefObject, useState, useRef, useEffect } from 'react';
import { SkipForward, Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPanel from './VideoPanel';
import StatusBadge from './StatusBadge';
import SearchingOverlay from './SearchingOverlay';
import DisconnectedCard from './DisconnectedCard';

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
  isOwn: boolean;
}

interface ChatRoomProps {
  name: string;
  peerName: string;
  roomCode: string;
  status: string;
  isInitiator: boolean | null;
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteVideoRef: RefObject<HTMLVideoElement>;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onSkip: () => void;
  onFindNext: () => void;
}

const ChatRoom = ({
  name,
  peerName,
  roomCode,
  status,
  isInitiator,
  localVideoRef,
  remoteVideoRef,
  messages,
  onSendMessage,
  onSkip,
  onFindNext,
}: ChatRoomProps) => {
  const isConnected = status === 'connected';
  const isDisconnected = status === 'peer-disconnected';
  const isSearching = status === 'queued' || status === 'searching';
  const isConnecting = status === 'matched' || status === 'verified';

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">
                <span className="gradient-text">Nexus</span> Chat
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StatusBadge status={status} />
            
            {isConnected && (
              <Button
                onClick={onSkip}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {isDisconnected ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <DisconnectedCard onFindNext={onFindNext} />
          </div>
        ) : (
          <>
            {/* Video Section */}
            <div className="flex-1 relative bg-black p-4">
              {/* Remote Video - Fit to container */}
              <div className="w-full h-full flex items-center justify-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="relative w-full h-full">
                  <VideoPanel
                    ref={remoteVideoRef}
                    label="Stranger"
                    name={peerName}
                    isConnected={isConnected}
                  />
                  
                  {/* Searching/Connecting overlay */}
                  {(isSearching || isConnecting) && !isConnected && (
                    <SearchingOverlay isConnecting={isConnecting} />
                  )}
                  
                  {/* Local Video - PiP style positioned within remote video */}
                  <div 
                    className="absolute bottom-4 right-4 w-80 animate-fade-in z-10 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30"
                    style={{ animationDelay: '200ms' }}
                  >
                    <VideoPanel
                      ref={localVideoRef}
                      label="You"
                      name={name}
                      isLocal
                      isConnected={isConnected}
                    />
                  </div>
                </div>
              </div>

              {/* Info bar - positioned top left */}
              {peerName && (
                <div className="absolute top-8 left-8 z-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                    <span className="font-medium text-white">Talking to:</span>
                    <span className="px-2 py-1 rounded-md bg-primary/20 text-primary font-semibold">
                      {peerName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Section */}
            <div className="w-96 border-l border-border/50 bg-background flex flex-col min-h-0 h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50">
                <h2 className="font-semibold text-lg">Chat</h2>
                {!isConnected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect to start chatting
                  </p>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm mt-8">
                    No messages yet. Say hi! 👋
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!isConnected || !inputMessage.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ChatRoom;
