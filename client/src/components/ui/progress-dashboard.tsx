import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Clock, Trophy } from "lucide-react";

interface ProgressDashboardProps {
  userId?: string;
}

export default function ProgressDashboard({ userId = "demo-user" }: ProgressDashboardProps) {
  // Mock progress data for demo
  const progressData = {
    weeklyStats: {
      sessionsCompleted: 12,
      totalSessions: 14,
      totalMinutes: 180,
      streakDays: 7
    },
    achievements: [
      {
        id: "1",
        title: "7-Day Streak",
        description: "Completed yoga for 7 consecutive days",
        icon: "🔥",
        color: "bg-accent-400"
      },
      {
        id: "2", 
        title: "100 Minutes",
        description: "Practiced for 100+ minutes this week",
        icon: "⏰",
        color: "bg-secondary-400"
      },
      {
        id: "3",
        title: "Pose Master", 
        description: "Learned 25 new yoga poses",
        icon: "🏆",
        color: "bg-primary-400"
      }
    ]
  };

  const { weeklyStats, achievements } = progressData;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Weekly Progress */}
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-8">
          <h3 className="font-bold text-2xl mb-6">Weekly Progress</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-wellness-600">Sessions Completed</span>
              <span className="font-bold text-2xl gradient-text">
                {weeklyStats.sessionsCompleted}/{weeklyStats.totalSessions}
              </span>
            </div>
            <div className="w-full bg-wellness-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full" 
                style={{ width: `${(weeklyStats.sessionsCompleted / weeklyStats.totalSessions) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-wellness-600">Total Minutes</span>
              <span className="font-bold text-2xl gradient-text">{weeklyStats.totalMinutes}</span>
            </div>
            <div className="w-full bg-wellness-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-secondary-400 to-accent-400 h-3 rounded-full" 
                style={{ width: '72%' }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-wellness-600">Streak Days</span>
              <span className="font-bold text-2xl gradient-text">{weeklyStats.streakDays}</span>
            </div>
            <div className="w-full bg-wellness-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent-400 to-primary-400 h-3 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardContent className="p-8">
          <h3 className="font-bold text-2xl mb-6">Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-wellness-50 rounded-xl">
                <div className={`w-12 h-12 ${achievement.color} rounded-full flex items-center justify-center`}>
                  {achievement.icon === "🔥" && <Flame className="w-6 h-6 text-white" />}
                  {achievement.icon === "⏰" && <Clock className="w-6 h-6 text-white" />}
                  {achievement.icon === "🏆" && <Trophy className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-wellness-600">{achievement.description}</p>
                </div>
                <span className="text-2xl">{achievement.icon}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
