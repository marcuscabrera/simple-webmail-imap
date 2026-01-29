import { useEmail } from "@/contexts/EmailContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Reply, 
  ReplyAll, 
  Forward, 
  Trash2, 
  Star, 
  Paperclip,
  Download,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function EmailReader() {
  const { selectedEmail, toggleStar, deleteEmail } = useEmail();

  if (!selectedEmail) {
    return (
      <div className="flex-1 h-full bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            Nenhum e-mail selecionado
          </h3>
          <p className="text-sm text-muted-foreground">
            Selecione um e-mail da lista para visualizá-lo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-background flex flex-col">
      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-2 bg-card">
        <Button variant="ghost" size="sm">
          <Reply className="h-4 w-4 mr-2" />
          Responder
        </Button>
        <Button variant="ghost" size="sm">
          <ReplyAll className="h-4 w-4 mr-2" />
          Responder a todos
        </Button>
        <Button variant="ghost" size="sm">
          <Forward className="h-4 w-4 mr-2" />
          Encaminhar
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleStar(selectedEmail.id)}
        >
          <Star className={cn(
            "h-4 w-4",
            selectedEmail.isStarred && "fill-warning text-warning"
          )} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteEmail(selectedEmail.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Email Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Subject */}
          <h1 className="text-xl font-semibold text-foreground mb-4">
            {selectedEmail.subject}
          </h1>

          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg shrink-0">
              {selectedEmail.from.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">
                    {selectedEmail.from.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmail.from.email}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground shrink-0">
                  {format(selectedEmail.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Para: {selectedEmail.to.map(t => t.email).join(", ")}
              </p>
            </div>
          </div>

          {/* Attachments */}
          {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {selectedEmail.attachments.length} anexo(s)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedEmail.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Paperclip className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
              {selectedEmail.body}
            </pre>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
