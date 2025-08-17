import React, { useEffect, useMemo, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type ProgressEntry = { routineId: string; completedAt: string };

const getUserId = (): string | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?.id ?? null;
  } catch {
    return null;
  }
};

const fetchUserProgress = async (userId: string): Promise<ProgressEntry[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/progress/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user progress");
  }
  return response.json();
};

const fetchStreakStats = async (
  userId: string
): Promise<{ currentStreak: number; longestStreak: number; isFirstOfMonth: boolean }> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/progress/stats/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch streak stats");
  }
  return response.json();
};

const fetchRoutines = async (): Promise<{ id: string; name: string }[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/routines`);
  if (!response.ok) {
    throw new Error("Failed to fetch routines");
  }
  return response.json();
};

const calculateStreaks = (progress: { completedAt: string }[]) => {
  const sortedProgress = progress
    .map((p) => ({ ...p, d: new Date(p.completedAt) }))
    .sort((a, b) => a.d.getTime() - b.d.getTime());
  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  sortedProgress.forEach((entry) => {
    const currentDate = entry.d;
    if (lastDate) {
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays === 0) {
        // same day, don't reset
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    lastDate = currentDate;
  });

  return { currentStreak, longestStreak };
};

const calculateCompletionRate = (progress: { completedAt: string; routineId: string }[], routines: { id: string }[]) => {
  const completedRoutineIds = new Set(progress.map((entry) => entry.routineId));
  const totalRoutines = routines.length;
  const completedRoutines = routines.filter((routine) => completedRoutineIds.has(routine.id)).length;
  return totalRoutines > 0 ? Math.min(Math.round((completedRoutines / totalRoutines) * 100), 100) : 0;
};

const calculateWeeklyPerformance = (progress: { completedAt: string }[]) => {
  const weeklyData = Array(7).fill(0);
  const today = new Date();

  progress.forEach((entry) => {
    const completedDate = new Date(entry.completedAt);
    const diffDays = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      weeklyData[6 - diffDays] += 1;
    }
  });

  return weeklyData;
};

const StreakPage = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [, setLocation] = useLocation();
  const userId = getUserId();

  useEffect(() => {
    if (!userId) setLocation("/login");
  }, [userId, setLocation]);

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["userProgress", userId],
    queryFn: () => fetchUserProgress(userId as string),
    enabled: !!userId,
  });

  const { data: streakStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["streakStats", userId],
    queryFn: () => fetchStreakStats(userId as string),
    enabled: !!userId,
  });

  const { data: routines, isLoading: isLoadingRoutines } = useQuery({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
  });

  const computedStreaks = useMemo(() => (progress ? calculateStreaks(progress) : { currentStreak: 0, longestStreak: 0 }), [progress]);

  const completionRate = useMemo(() => calculateCompletionRate(progress || [], routines || []), [progress, routines]);
  const weeklyPerformance = useMemo(() => calculateWeeklyPerformance(progress || []), [progress]);

  const dayKey = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
  const completedDays = useMemo(() => new Set((progress || []).map((p) => dayKey(new Date(p.completedAt)))), [progress]);

  const pieData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [completionRate, 100 - completionRate],
        backgroundColor: ["#10B981", "#E5E7EB"],
        borderWidth: 0,
        borderRadius: 5,
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Routines Completed",
        data: weeklyPerformance,
        backgroundColor: "#3B82F6",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const stats = [
    { title: "Current Streak", value: `${streakStats?.currentStreak ?? computedStreaks.currentStreak} days`, icon: <FiTrendingUp className="text-blue-500" /> },
    { title: "Longest Streak", value: `${streakStats?.longestStreak ?? computedStreaks.longestStreak} days`, icon: <FiAward className="text-yellow-500" /> },
    { title: "Completion Rate", value: `${completionRate}%`, icon: <FiCheckCircle className="text-green-500" /> },
  ];

  const tileContent = ({ date, view }: { date: Date; view: string }): React.ReactNode => {
    if (view !== 'month') return null;
    const key = dayKey(date);
    const isCompleted = completedDays.has(key);
    return isCompleted ? (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
    ) : null;
  };

  if (isLoadingProgress || isLoadingRoutines || isLoadingStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setLocation("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Streak Progress</h1>
            <p className="text-gray-600">Track your consistency and build better habits</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Active streak</span>
              {streakStats?.isFirstOfMonth ? (
                <span className="ml-3 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">First of Month</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
                </div>
                <div className="text-3xl p-3 rounded-full bg-gray-50">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <FiCalendar className="text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Activity Calendar</h2>
            </div>
            <Calendar
              onChange={(value) => setDate(value as Date | null)}
              value={date}
              tileContent={tileContent}
              className="border-0"
              prev2Label={null}
              next2Label={null}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Completion</h2>
            <div className="h-64">
              <Pie 
                data={pieData} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          return `${context.label}: ${context.raw}%`;
                        }
                      }
                    }
                  },
                  cutout: '70%',
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">You're on track to beat last month's record!</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Performance</h2>
          <div className="h-80">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: any) {
                        return `${context.raw} routine${context.raw !== 1 ? 's' : ''} completed`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    },
                    grid: {
                      drawOnChartArea: false,
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                      drawOnChartArea: false,
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <blockquote className="text-center">
            <p className="text-xl italic mb-2">"Consistency is the key to mastery. Small daily improvements lead to stunning results."</p>
            <footer className="text-blue-100">— Robin Sharma</footer>
          </blockquote>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StreakPage;
