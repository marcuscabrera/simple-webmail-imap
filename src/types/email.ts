export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  bodyHtml?: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  folder: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  count: number;
  unread: number;
}

export interface MailCredentials {
  server: string;
  email: string;
  password: string;
  imapPort: number;
  smtpPort: number;
}

export interface User {
  email: string;
  name: string;
  isAuthenticated: boolean;
}
