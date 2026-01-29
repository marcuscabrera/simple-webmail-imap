import { useState } from "react";
import { FolderSidebar } from "@/components/mail/FolderSidebar";
import { EmailList } from "@/components/mail/EmailList";
import { EmailReader } from "@/components/mail/EmailReader";
import { ComposeDialog } from "@/components/mail/ComposeDialog";
import { EmailProvider } from "@/contexts/EmailContext";

export function MailLayout() {
  const [composeOpen, setComposeOpen] = useState(false);

  return (
    <EmailProvider>
      <div className="h-screen w-full flex bg-background">
        <FolderSidebar onCompose={() => setComposeOpen(true)} />
        <EmailList />
        <EmailReader />
        <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
      </div>
    </EmailProvider>
  );
}
