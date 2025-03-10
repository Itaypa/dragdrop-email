import React, { useState } from 'react';
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

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // Set data for drag operation
    const data = { id, subject, sender };
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    
    // Create ghost image
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('fixed', 'top-0', 'left-0', '-translate-x-full');
    ghostElement.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-lg border border-primary w-64">
        <p class="font-medium text-sm truncate">${subject}</p>
        <p class="text-xs text-muted-foreground truncate">${sender}</p>
      </div>
    `;
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 10, 10);
    
    // Clean up ghost element
    requestAnimationFrame(() => {
      document.body.removeChild(ghostElement);
    });
    
    onDragStart(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "p-4 rounded-lg transition-all duration-250 border border-border hover:border-primary",
        "backdrop-blur-[2px] bg-white bg-opacity-90 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-105 shadow-lg border-primary",
        read ? "bg-opacity-75" : "border-l-4 border-l-primary"
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
