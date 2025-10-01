// import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import LoginForm from "./components/login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthenticationPage = async () => {
  // const session = await getSession();

  // if (session) {
  //   if (session.user.role === "athlete") {
  //     redirect("/dashboard/athlete");
  //   } else if (session.user.role === "admin") {
  //     redirect("/dashboard/admin");
  //   } else {
  //     redirect("/dashboard"); // donor
  //   }
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">{/* <SignUpForm /> */}</TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
