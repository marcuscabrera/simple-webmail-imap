import { useEmail } from "@/contexts/EmailContext";
import { Email } from "@/types/email";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, Paperclip } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function formatEmailDate(date: Date): string {
  if (isToday(date)) {
    return format(date, "HH:mm");
  }
  if (isYesterday(date)) {
    return "Ontem";
  }
  return format(date, "dd/MM", { locale: ptBR });
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

function EmailListItem({ email, isSelected, onClick, onToggleStar }: EmailListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-4 py-3 border-b border-border cursor-pointer transition-all hover:bg-accent/50",
        isSelected && "bg-accent border-l-2 border-l-primary",
        !email.isRead && "bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleStar}
          className={cn(
            "mt-0.5 shrink-0 transition-colors",
            email.isStarred ? "text-warning" : "text-muted-foreground/40 hover:text-warning"
          )}
        >
          <Star className={cn("h-4 w-4", email.isStarred && "fill-current")} />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={cn(
              "text-sm truncate",
              !email.isRead && "font-semibold text-foreground"
            )}>
              {email.from.name}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatEmailDate(email.date)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-sm truncate flex-1",
              !email.isRead ? "font-medium text-foreground" : "text-muted-foreground"
            )}>
              {email.subject}
            </p>
            {email.hasAttachment && (
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate mt-1">
            {email.body.substring(0, 80)}...
          </p>
        </div>
      </div>
    </div>
  );
}

export function EmailList() {
  const { emails, selectedFolder, selectedEmail, setSelectedEmail, markAsRead, toggleStar } = useEmail();

  const filteredEmails = emails.filter(email => email.folder === selectedFolder);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const handleToggleStar = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    toggleStar(emailId);
  };

  if (filteredEmails.length === 0) {
    return (
      <div className="w-80 h-full border-r border-border bg-card flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-muted-foreground">Nenhum e-mail nesta pasta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full border-r border-border bg-card flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-sm">
          {filteredEmails.length} {filteredEmails.length === 1 ? "mensagem" : "mensagens"}
        </h2>
      </div>
      <ScrollArea className="flex-1">
        {filteredEmails.map(email => (
          <EmailListItem
            key={email.id}
            email={email}
            isSelected={selectedEmail?.id === email.id}
            onClick={() => handleEmailClick(email)}
            onToggleStar={(e) => handleToggleStar(e, email.id)}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
