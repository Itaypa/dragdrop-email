
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { FolderIcon, Inbox, Trash2, Star, Archive, AlertCircle, Send, File } from 'lucide-react';

interface FolderItemProps {
  icon: React.ReactNode;
  name: string;
  count?: number;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
}

// Email data interface
interface EmailData {
  id: string;
  subject: string;
  sender: string;
}

const FolderItem: React.FC<FolderItemProps> = ({
  icon,
  name,
  count,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  const [isOver, setIsOver] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Allow drops from cross-origin
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
    if (onDragOver) onDragOver(e);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
    if (onDragLeave) onDragLeave();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    // Create highlight effect
    setIsHighlighted(true);
    setTimeout(() => setIsHighlighted(false), 600);
    
    if (onDrop) onDrop(e);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center p-3 rounded-lg mb-1 group transition-all duration-250",
        "hover:bg-muted cursor-pointer",
        isOver ? "bg-secondary drop-target-highlight" : "",
        isHighlighted ? "folder-highlight bg-muted" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "mr-3 transition-transform duration-250 text-muted-foreground",
        "group-hover:text-foreground",
        isOver ? "scale-110 text-primary" : ""
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <span className={cn(
          "text-sm font-medium",
          isOver ? "text-primary" : ""
        )}>
          {name}
        </span>
      </div>
      {count !== undefined && (
        <div className={cn(
          "px-2 py-0.5 rounded-full text-xs",
          isOver ? "bg-primary text-white" : "bg-muted text-muted-foreground"
        )}>
          {count}
        </div>
      )}
    </div>
  );
};

const Folders = () => {
  const [folderCounts, setFolderCounts] = useState({
    inbox: 7,
    starred: 2,
    sent: 15,
    drafts: 3,
    archive: 42,
    spam: 1,
    trash: 8
  });
  
  const [lastDropped, setLastDropped] = useState<EmailData | null>(null);
  const [notification, setNotification] = useState<{folder: string, email: EmailData} | null>(null);

  // Communication with parent window
  useEffect(() => {
    // Let the parent know we're ready
    window.parent.postMessage({ type: 'FOLDERS_READY' }, '*');
    
    // Setup listener for messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'EMAIL_DROPPED') {
        // Handle the dropped email
        const emailData = event.data.payload as EmailData;
        setLastDropped(emailData);
        
        // For this demo, we'll just assume it's the inbox folder
        showNotification('inbox', emailData);
        
        // Update folder count
        setFolderCounts(prev => ({
          ...prev,
          inbox: prev.inbox + 1
        }));
        
        // Notify parent window of the moved email
        window.parent.postMessage({
          type: 'EMAIL_MOVED',
          payload: {
            emailId: emailData.id,
            folder: 'inbox'
          }
        }, '*');
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  const handleFolderDrop = (folderName: keyof typeof folderCounts, e: React.DragEvent) => {
    try {
      // Try both data formats for cross-origin compatibility
      let jsonData = e.dataTransfer.getData('application/json');
      if (!jsonData) {
        jsonData = e.dataTransfer.getData('text/plain');
      }
      
      if (jsonData) {
        const emailData = JSON.parse(jsonData) as EmailData;
        
        // Update folder count
        setFolderCounts(prev => ({
          ...prev,
          [folderName]: prev[folderName] + 1
        }));
        
        // Show notification
        showNotification(folderName, emailData);
        
        // Notify parent window
        window.parent.postMessage({
          type: 'EMAIL_MOVED',
          payload: {
            emailId: emailData.id,
            folder: folderName
          }
        }, '*');
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  const showNotification = (folder: string, email: EmailData) => {
    setNotification({ folder, email });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  return (
    <div className="p-3 h-full bg-card">
      <div className="flex flex-col h-full">
        <div className="space-y-1 mb-4">
          <FolderItem 
            icon={<Inbox size={18} />}
            name="Inbox"
            count={folderCounts.inbox}
            onDrop={(e) => handleFolderDrop('inbox', e)}
          />
          <FolderItem 
            icon={<Star size={18} />}
            name="Starred"
            count={folderCounts.starred}
            onDrop={(e) => handleFolderDrop('starred', e)}
          />
          <FolderItem 
            icon={<Send size={18} />}
            name="Sent"
            count={folderCounts.sent}
            onDrop={(e) => handleFolderDrop('sent', e)}
          />
          <FolderItem 
            icon={<File size={18} />}
            name="Drafts"
            count={folderCounts.drafts}
            onDrop={(e) => handleFolderDrop('drafts', e)}
          />
        </div>
        
        <div className="mb-2 px-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Folders</h3>
        </div>
        
        <div className="space-y-1 flex-1 overflow-y-auto">
          <FolderItem 
            icon={<FolderIcon size={18} />}
            name="Personal"
            onDrop={(e) => handleFolderDrop('inbox', e)}
          />
          <FolderItem 
            icon={<FolderIcon size={18} />}
            name="Work"
            onDrop={(e) => handleFolderDrop('inbox', e)}
          />
          <FolderItem 
            icon={<FolderIcon size={18} />}
            name="Finance"
            onDrop={(e) => handleFolderDrop('inbox', e)}
          />
          <FolderItem 
            icon={<FolderIcon size={18} />}
            name="Travel"
            onDrop={(e) => handleFolderDrop('inbox', e)}
          />
          <FolderItem 
            icon={<Archive size={18} />}
            name="Archive"
            count={folderCounts.archive}
            onDrop={(e) => handleFolderDrop('archive', e)}
          />
          <FolderItem 
            icon={<AlertCircle size={18} />}
            name="Spam"
            count={folderCounts.spam}
            onDrop={(e) => handleFolderDrop('spam', e)}
          />
          <FolderItem 
            icon={<Trash2 size={18} />}
            name="Trash"
            count={folderCounts.trash}
            onDrop={(e) => handleFolderDrop('trash', e)}
          />
        </div>
        
        {/* Notification for successful drop */}
        {notification && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[300px] bg-white rounded-lg shadow-elevated p-3 border border-border animate-fade-in">
            <p className="text-xs font-medium mb-1">
              Email moved to <span className="text-primary">{notification.folder}</span>
            </p>
            <p className="text-xs truncate text-muted-foreground">
              {notification.email.subject}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Folders;
