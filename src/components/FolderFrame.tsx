
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface FolderFrameProps {
  className?: string;
}

const FolderFrame: React.FC<FolderFrameProps> = ({ className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  // Handle messaging between parent and iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle any messages from the iframe
      if (event.data.type === 'FOLDERS_READY') {
        setIsLoaded(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
    
    // Send message to iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'DRAG_OVER' }, '*');
    }
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
    
    // Send message to iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'DRAG_LEAVE' }, '*');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Send the dropped email data to the iframe
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'EMAIL_DROPPED',
          payload: data
        }, '*');
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  
  return (
    <div 
      className={cn(
        "w-full h-full transition-all duration-300 flex flex-col",
        dragOver ? "scale-[1.01]" : "",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-3 pl-3">
        <h2 className="text-lg font-medium">Folders</h2>
        <p className="text-xs text-muted-foreground">Drop emails to organize</p>
      </div>
      
      <div className={cn(
        "w-full flex-1 transition-all duration-400 elastic-transform",
        dragOver ? "ring-2 ring-primary ring-opacity-70 shadow-elevated" : "ring-1 ring-border ring-opacity-50",
        !isLoaded ? "bg-secondary animate-pulse" : ""
      )}>
        <iframe
          ref={iframeRef}
          src="/folders"
          className="w-full h-full rounded-md"
          title="Email Folders"
          onLoad={() => {
            // When iframe loads, check if we can communicate
            if (iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: 'HELLO_FROM_PARENT' }, '*');
            }
          }}
        />
      </div>
    </div>
  );
};

export default FolderFrame;
