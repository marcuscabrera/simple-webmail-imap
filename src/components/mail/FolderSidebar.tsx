import { useEmail } from "@/contexts/EmailContext";
import { cn } from "@/lib/utils";
import { 
  Inbox, 
  Send, 
  FileEdit, 
  Star, 
  ShieldAlert, 
  Trash2,
  Mail,
  LogOut,
  RefreshCw,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StorageIndicator } from "./StorageIndicator";

const iconMap: Record<string, React.ElementType> = {
  Inbox,
  Send,
  FileEdit,
  Star,
  ShieldAlert,
  Trash2,
};

interface FolderSidebarProps {
  onCompose: () => void;
}

export function FolderSidebar({ onCompose }: FolderSidebarProps) {
  const { folders, selectedFolder, setSelectedFolder, emails, refreshEmails, isLoading } = useEmail();
  const { user, logout } = useAuth();

  const getUnreadCount = (folderId: string) => {
    return emails.filter(e => e.folder === folderId && !e.isRead).length;
  };

  return (
    <div className="w-64 h-full bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Mail className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sidebar-foreground text-sm truncate">
              WebMailForcenecedor
            </h1>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={onCompose} 
          className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo E-mail
        </Button>
      </div>

      {/* Folders */}
      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-1">
          {folders.map((folder) => {
            const Icon = iconMap[folder.icon] || Inbox;
            const unread = getUnreadCount(folder.id);
            
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  selectedFolder === folder.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                {unread > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-sidebar-primary text-sidebar-primary-foreground rounded-full">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Storage */}
      <div className="border-t border-sidebar-border">
        <StorageIndicator usedGB={2.8} totalGB={5} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshEmails}
          disabled={isLoading}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Atualizar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
