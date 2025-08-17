import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StreakPage from "@/pages/streak";
import { useLocation } from "wouter";

type User = {
  id?: string;
  username: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"idle"|"otp"|"verify"|"done">("idle");
  const [, setLocation] = useLocation();

  const [stats, setStats] = useState<{ currentStreak: number; longestStreak: number; isFirstOfMonth: boolean } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [completionRate, setCompletionRate] = useState<{ date: string; total: number; completed: number; rate: number } | null>(null);
  const [loadingCompletion, setLoadingCompletion] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        setLoadingStats(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/progress/stats/${user.id}`);
        if (res.ok) {
          const json = await res.json();
          setStats(json);
        }
      } catch {}
      finally {
        setLoadingStats(false);
      }
    };
    fetchStats();

    const fetchCompletionRate = async () => {
      if (!user?.id) return;
      try {
        setLoadingCompletion(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/progress/daily/${user.id}`);
        if (res.ok) {
          const json = await res.json();
          setCompletionRate(json);
        }
      } catch {}
      finally {
        setLoadingCompletion(false);
      }
    };
    fetchCompletionRate();
  }, [user?.id]);

  const handleRequestOtp = async () => {
    if (!user?.username || !user?.email) return;
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/auth/signup/request-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, email: user.email, purpose: "password-change" })
    });
    if (res.ok) {
      setOtpSent(true);
      setStep("otp");
    } else {
      alert("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!user?.username || !user?.email || !otp || !newPassword) return;
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/auth/signup/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, email: user.email, code: otp, password: newPassword, purpose: "password-change" })
    });
    if (res.ok) {
      setStep("done");
      alert("Password changed successfully!");
    } else {
      alert("Failed to verify OTP or change password");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setLocation("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>

        <Card className="bg-white rounded-3xl shadow-lg mb-8">
          <CardContent className="p-8">
            <h3 className="font-bold text-2xl mb-6">Profile Information</h3>
            <div className="space-y-4">
              <p><strong>Username:</strong> {user.username || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              {!showChangePassword ? (
                <Button onClick={() => setShowChangePassword(true)} className="mt-4">Change Password</Button>
              ) : (
                <div className="space-y-4 mt-4">
                  {step === "idle" && (
                    <Button onClick={handleRequestOtp}>Request OTP to Email</Button>
                  )}
                  {step === "otp" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                      <Input value={otp} onChange={e => setOtp(e.target.value)} className="mt-1" />
                      <label className="block text-sm font-medium text-gray-700 mt-4">New Password</label>
                      <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1" />
                      <Button onClick={handleVerifyOtp} className="mt-4">Set New Password</Button>
                    </div>
                  )}
                  {step === "done" && (
                    <div className="text-green-600 font-semibold">Password changed successfully!</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <h3 className="font-bold text-2xl mb-6">Streak Progress</h3>
            <StreakPage />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
