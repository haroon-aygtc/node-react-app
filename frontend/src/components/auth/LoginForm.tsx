import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, User, ShieldCheck, Loader2, Mail } from "lucide-react";
import PasswordInput from "./PasswordInput";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { login, isLoading, clearError, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    clearError();

    try {
      const success = await login(values.email, values.password);

      if (success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to ChatEmbed. Redirecting to dashboard...",
          variant: "default",
          className: "bg-green-500 border-green-600 text-white",
        });
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const isAdmin = user?.role?.toLowerCase() === 'admin';

        setTimeout(() => {
          if (isAdmin) {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }, 1500);
      } else {
        const errorMessage = error || "Invalid credentials";
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dashboard-content">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        {/* Left side - Image and welcome message */}
        <div className="hidden md:block md:w-1/2 bg-primary/90">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="mb-6 rounded-full bg-white/10 p-6">
              <MessageSquare className="h-12 w-12" />
            </div>
            <h2 className="mb-2 text-3xl font-bold">Welcome Back</h2>
            <p className="mb-6 text-center text-white/80">
              Access your dashboard to manage your chat widget, context rules, and more.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Manage context rules and templates</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <User className="h-4 w-4" />
                </div>
                <span>Configure widget appearance</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Secure admin access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 bg-card p-8">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-foreground-color">
                Admin Login
              </CardTitle>
              <CardDescription className="text-center text-muted-color">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="admin@example.com"
                              className="pl-10 input-theme"
                              {...field}
                              onChange={(e) => {
                                clearError();
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <div className="absolute left-3 top-3 text-muted-color">
                            <Mail size={16} />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <PasswordInput
                          {...field}
                          onChange={(e) => {
                            clearError();
                            field.onChange(e);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full button-primary-theme" disabled={isLoading || form.formState.isSubmitting}>
                    {isLoading || form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-muted-foreground mt-4">
                Don't have an account?{" "}
                <Link to="/auth/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
