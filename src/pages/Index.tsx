import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { MailLayout } from "@/components/mail/MailLayout";

const Index = () => {
  const { user } = useAuth();

  if (!user?.isAuthenticated) {
    return <LoginForm />;
  }

  return <MailLayout />;
};

export default Index;
