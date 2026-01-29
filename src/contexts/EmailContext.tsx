import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Email, Folder } from "@/types/email";
import { mockEmails, mockFolders } from "@/data/mockEmails";

interface EmailContextType {
  emails: Email[];
  folders: Folder[];
  selectedFolder: string;
  selectedEmail: Email | null;
  isLoading: boolean;
  setSelectedFolder: (folderId: string) => void;
  setSelectedEmail: (email: Email | null) => void;
  markAsRead: (emailId: string) => void;
  toggleStar: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;
  sendEmail: (email: Partial<Email>) => Promise<boolean>;
  refreshEmails: () => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [folders] = useState<Folder[]>(mockFolders);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const markAsRead = useCallback((emailId: string) => {
    setEmails(prev =>
      prev.map(email =>
        email.id === emailId ? { ...email, isRead: true } : email
      )
    );
  }, []);

  const toggleStar = useCallback((emailId: string) => {
    setEmails(prev =>
      prev.map(email =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  }, []);

  const deleteEmail = useCallback((emailId: string) => {
    setEmails(prev =>
      prev.map(email =>
        email.id === emailId ? { ...email, folder: "trash" } : email
      )
    );
    setSelectedEmail(null);
  }, []);

  const sendEmail = useCallback(async (email: Partial<Email>): Promise<boolean> => {
    setIsLoading(true);
    // Simulate SMTP send delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEmail: Email = {
      id: Date.now().toString(),
      from: { name: "Você", email: "usuario@webmail.com.br" },
      to: email.to || [],
      subject: email.subject || "(Sem assunto)",
      body: email.body || "",
      date: new Date(),
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      folder: "sent",
    };
    
    setEmails(prev => [newEmail, ...prev]);
    setIsLoading(false);
    return true;
  }, []);

  const refreshEmails = useCallback(async () => {
    setIsLoading(true);
    // Simulate IMAP fetch delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  return (
    <EmailContext.Provider
      value={{
        emails,
        folders,
        selectedFolder,
        selectedEmail,
        isLoading,
        setSelectedFolder,
        setSelectedEmail,
        markAsRead,
        toggleStar,
        deleteEmail,
        sendEmail,
        refreshEmails,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
}
