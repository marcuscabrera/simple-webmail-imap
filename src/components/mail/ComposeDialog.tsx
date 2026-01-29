import { useState } from "react";
import { useEmail } from "@/contexts/EmailContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Send, Paperclip, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComposeDialog({ open, onOpenChange }: ComposeDialogProps) {
  const { sendEmail, isLoading } = useEmail();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.to.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o destinatário.",
        variant: "destructive",
      });
      return;
    }

    const success = await sendEmail({
      to: formData.to.split(",").map(email => ({
        name: email.trim(),
        email: email.trim(),
      })),
      subject: formData.subject,
      body: formData.body,
    });

    if (success) {
      toast({
        title: "E-mail enviado",
        description: "Sua mensagem foi enviada com sucesso.",
      });
      setFormData({ to: "", cc: "", subject: "", body: "" });
      onOpenChange(false);
    }
  };

  const handleDiscard = () => {
    setFormData({ to: "", cc: "", subject: "", body: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Nova Mensagem
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDiscard}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 space-y-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Label htmlFor="to" className="w-16 text-sm text-muted-foreground">
                Para:
              </Label>
              <Input
                id="to"
                type="text"
                placeholder="destinatario@email.com"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="cc" className="w-16 text-sm text-muted-foreground">
                Cc:
              </Label>
              <Input
                id="cc"
                type="text"
                placeholder="copia@email.com"
                value={formData.cc}
                onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="subject" className="w-16 text-sm text-muted-foreground">
                Assunto:
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Assunto do e-mail"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>
          </div>

          <div className="flex-1 px-6 py-4 overflow-hidden">
            <Textarea
              placeholder="Escreva sua mensagem aqui..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="h-full resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            />
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Anexar
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDiscard}
              >
                Descartar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
