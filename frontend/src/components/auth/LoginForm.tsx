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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Lock, User, ShieldCheck, Loader2, Mail } from "lucide-react";

// Define the form schema using zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { login, loginWithRole, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with react-hook-form
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
      // Attempt to login and get success status
      const success = await login(values.email, values.password);

      if (success) {
        // Show success toast only if login was successful
        toast({
          title: "Login successful!",
          description: "Welcome back to ChatEmbed.",
          variant: "default",
        });
        // Navigate to dashboard based on user role
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const isAdmin = user?.role?.toLowerCase() === 'admin';

        if (isAdmin) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        // Show error toast if login failed but no exception was thrown
        // This shouldn't normally happen as failures throw exceptions
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login error:", error);

      // Show error toast
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
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
                  <Lock className="h-4 w-4" />
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
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 input-theme"
                              {...field}
                              onChange={(e) => {
                                clearError();
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <div className="absolute left-3 top-3 text-muted-color">
                            <Lock size={16} />
                          </div>
                        </div>
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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or login with mock accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={async () => {
                    const success = await loginWithRole("admin");
                    if (success) navigate("/admin/dashboard");
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={async () => {
                    const success = await loginWithRole("user");
                    if (success) navigate("/admin/dashboard");
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  User
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-gray-500">
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
              <p className="text-sm text-gray-500">
                <strong>User:</strong> user@example.com / user123
              </p>
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
