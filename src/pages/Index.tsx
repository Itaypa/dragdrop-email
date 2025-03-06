
import React, { useEffect, useState } from 'react';
import EmailList from '@/components/EmailList';
import FolderFrame from '@/components/FolderFrame';
import { cn } from '@/lib/utils';
import { Inbox, Settings } from 'lucide-react';

const Index = () => {
  const [currentDraggedEmail, setCurrentDraggedEmail] = useState<string | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Simulate loading sequence
  useEffect(() => {
    // Wait a bit to show animation
    const timeout = setTimeout(() => {
      setPageLoaded(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleEmailDragStart = (id: string) => {
    setCurrentDraggedEmail(id);
  };
  
  return (
    <div className={cn(
      "min-h-screen bg-background transition-opacity duration-500 overflow-hidden",
      pageLoaded ? "opacity-100" : "opacity-0"
    )}>
      <header className="border-b border-border flex items-center justify-between py-3 px-4 backdrop-blur-subtle bg-background/80 sticky top-0 z-10">
        <div className="flex items-center">
          <div className="flex items-center h-8 w-8 bg-primary rounded-md text-white justify-center mr-3">
            <Inbox size={16} />
          </div>
          <h1 className="text-lg font-medium">DragDrop Email Demo</h1>
        </div>
        <div>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>
      </header>
      
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className={cn(
          "grid gap-6 transition-all duration-500 animate-fade-in",
          "grid-cols-1 lg:grid-cols-[1fr_280px]"
        )}>
          <div className={cn(
            "bg-card rounded-xl shadow-subtle border border-border overflow-hidden",
            "transition-all duration-400 hover:shadow-soft",
            "animate-scale-up"
          )}>
            <EmailList 
              onDragStart={handleEmailDragStart}
            />
          </div>
          
          <div className={cn(
            "bg-card rounded-xl p-4 shadow-subtle border border-border overflow-hidden",
            "animate-scale-up animation-delay-200",
            "h-[calc(100vh-130px)] lg:h-auto"
          )}>
            <FolderFrame />
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Drag an email from the inbox and drop it into a folder in the sidebar.</p>
          <p className="mt-1">This demo shows cross-frame drag and drop functionality.</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
