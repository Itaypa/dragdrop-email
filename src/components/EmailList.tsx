import React, { useState, useEffect } from 'react';
import EmailItem from './EmailItem';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Email {
  id: string;
  subject: string;
  sender: string;
  excerpt: string;
  date: string;
  read: boolean;
}

const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Project Update: Q3 Goals',
    sender: 'Sarah Johnson <sarah.j@company.com>',
    excerpt: 'I wanted to share our progress on the Q3 goals. We\'ve achieved 80% of our targets and...',
    date: '10:30 AM',
    read: false
  },
  {
    id: '2',
    subject: 'Design Review Meeting',
    sender: 'Design Team <design@company.com>',
    excerpt: 'The design review for the new product page is scheduled for tomorrow at 2 PM in Meeting Room A...',
    date: 'Yesterday',
    read: true
  },
  {
    id: '3',
    subject: 'New Feature Request: Drag & Drop',
    sender: 'Product <product@company.com>',
    excerpt: 'We\'ve received multiple requests for implementing drag and drop functionality in our app...',
    date: 'Jul 10',
    read: false
  },
  {
    id: '4',
    subject: 'Weekly Team Sync',
    sender: 'Alex Morgan <alex.m@company.com>',
    excerpt: 'Hello team, Just a reminder about our weekly sync meeting today at 4 PM. Please prepare...',
    date: 'Jul 9',
    read: true
  },
  {
    id: '5',
    subject: 'Account Subscription Renewed',
    sender: 'Billing <no-reply@company.com>',
    excerpt: 'Your subscription has been successfully renewed. Your next billing date is August 15, 2023...',
    date: 'Jul 7',
    read: true
  },
  {
    id: '6',
    subject: 'Important: Security Update',
    sender: 'Security Team <security@company.com>',
    excerpt: 'We\'ve released an important security update for our service. Please take a moment to review...',
    date: 'Jul 5',
    read: false
  },
  {
    id: '7',
    subject: 'Content Calendar for July',
    sender: 'Marketing <marketing@company.com>',
    excerpt: 'Attached is the content calendar for July. Please review and provide feedback by Friday...',
    date: 'Jul 3',
    read: true
  }
];

interface EmailListProps {
  onDragStart: (id: string) => void;
  className?: string;
}

const EmailList: React.FC<EmailListProps> = ({ onDragStart, className }) => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailMoved = (event: MessageEvent) => {
      if (event.data.type === 'EMAIL_MOVED' && event.data.payload?.emailId) {
        const { emailId, folder } = event.data.payload;
        setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
        toast({
          title: "Email moved",
          description: `Email moved to ${folder}`,
        });
      }
    };

    window.addEventListener('message', handleEmailMoved);
    return () => window.removeEventListener('message', handleEmailMoved);
  }, [toast]);

  const handleDragStart = (id: string) => {
    const email = emails.find(email => email.id === id);
    if (email) {
      onDragStart(id);
    }
  };

  return (
    <div className={cn("p-4", className)}>
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-1">Inbox</h1>
        <p className="text-sm text-muted-foreground">Drag emails to folders</p>
      </div>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search emails..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-border bg-secondary bg-opacity-50 focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-all"
        />
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-2 -mr-2 space-y-2">
        {emails.map(email => (
          <EmailItem
            key={email.id}
            id={email.id}
            subject={email.subject}
            sender={email.sender}
            excerpt={email.excerpt}
            date={email.date}
            read={email.read}
            onDragStart={handleDragStart}
          />
        ))}
        
        {emails.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No emails in this folder</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
