
import React, { useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

interface EmailItemProps {
  id: string;
  subject: string;
  sender: string;
  excerpt: string;
  date: string;
  read: boolean;
  onDragStart: (id: string) => void;
}

const EmailItem: React.FC<EmailItemProps> = ({
  id,
  subject,
  sender,
  excerpt,
  date,
  read,
  onDragStart
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // Create a custom ghost image
    const ghost = document.createElement('div');
    ghost.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-elevated', 'text-sm', 'max-w-md');
    ghost.innerText = subject;
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    
    e.dataTransfer.setDragImage(ghost, 10, 10);
    
    // Set both text/plain and application/json formats
    // This is crucial for cross-origin drag and drop
    const data = JSON.stringify({ id, subject, sender });
    e.dataTransfer.setData('text/plain', data);
    e.dataTransfer.setData('application/json', data);
    e.dataTransfer.effectAllowed = 'move';
    
    if (emailRef.current) {
      emailRef.current.classList.add('dragging');
    }
    
    // Notify parent component
    onDragStart(id);
    
    // Clean up the ghost element after dragging
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (emailRef.current) {
      emailRef.current.classList.remove('dragging');
    }
  };
  
  return (
    <div
      ref={emailRef}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "p-4 mb-2 rounded-lg transition-all duration-250 border border-border draggable-email hover-lift group",
        "backdrop-blur-[2px] bg-white bg-opacity-90",
        isDragging ? "dragging" : "",
        read ? "bg-opacity-75" : "shadow-subtle border-l-4 border-l-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            <div className={cn(
              "p-2 rounded-full w-10 h-10 flex items-center justify-center",
              "bg-primary bg-opacity-10 text-primary group-hover:scale-110 transition-transform"
            )}>
              <Mail size={18} className="text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className={cn(
                "text-sm font-medium truncate mr-2",
                read ? "text-muted-foreground" : "text-foreground"
              )}>
                {subject}
              </h3>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {date}
              </span>
            </div>
            <p className={cn(
              "text-xs truncate",
              read ? "text-muted-foreground" : "text-foreground font-medium"
            )}>
              {sender}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailItem;
