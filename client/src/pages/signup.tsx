import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);

  const requestCodeMutation = useMutation({
    mutationFn: async (data: { username: string; email: string }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/auth/signup/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    onSuccess: () => {
      setCodeRequested(true);
      toast({ title: "Verification code sent", description: "Check your email for a 6-digit code." });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Could not send code", description: err?.message || "Please try again." });
    },
  });

  const verifySignupMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string; code: string }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/auth/signup/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Account created!", description: "You can now sign in." });
      setLocation("/login");
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Verification failed", description: err?.message || "Please try again." });
    },
  });

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast({ variant: "destructive", title: "Missing fields", description: "Enter username and email first." });
      return;
    }
    requestCodeMutation.mutate({ username: formData.username, email: formData.email });
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all required fields." });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Password mismatch", description: "Passwords do not match." });
      return;
    }
    if (!code || code.length < 6) {
      toast({ variant: "destructive", title: "Enter your code", description: "Enter the 6-digit verification code." });
      return;
    }
    verifySignupMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      code,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join YogaFlow and start your yoga journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>

            {!codeRequested && (
              <Button
                onClick={handleRequestCode}
                className="w-full"
                type="button"
                disabled={requestCodeMutation.isPending}
              >
                {requestCodeMutation.isPending ? "Sending code…" : "Send verification code"}
              </Button>
            )}

            {codeRequested && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={handleVerifyAndCreate}
                  className="w-full"
                  type="button"
                  disabled={verifySignupMutation.isPending}
                >
                  {verifySignupMutation.isPending ? "Creating account…" : "Verify and create account"}
                </Button>
              </>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => setLocation("/login")}
            >
              Sign in here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}