import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const AuthenticationPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
