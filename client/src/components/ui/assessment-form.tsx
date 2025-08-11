import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Sprout, Leaf, TreePine, Clock, Timer, CalendarClock, CalendarCheck } from "lucide-react";

const assessmentSchema = z.object({
  ageGroup: z.string().min(1, "Please select your age group"),
  experience: z.string().min(1, "Please select your experience level"),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
  timeAvailable: z.string().min(1, "Please select your available time"),
  healthConditions: z.array(z.string()).optional(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

export default function AssessmentForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      ageGroup: "",
      experience: "",
      goals: [],
      timeAvailable: "",
      healthConditions: [],
    },
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async (data: AssessmentFormData) => {
      return apiRequest("POST", "/api/recommendations", data);
    },
    onSuccess: () => {
      toast({
        title: "Assessment Complete!",
        description: "Your personalized routines have been generated.",
      });
      setLocation("/routines");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AssessmentFormData) => {
    generateRecommendationsMutation.mutate(data);
  };

  const ageGroups = [
    { value: "18-25", label: "18-25" },
    { value: "26-35", label: "26-35" },
    { value: "36-50", label: "36-50" },
    { value: "50+", label: "50+" },
  ];

  const experienceLevels = [
    {
      value: "beginner",
      label: "Beginner",
      icon: <Sprout className="w-6 h-6" />,
      description: "New to yoga or less than 6 months experience",
    },
    {
      value: "intermediate",
      label: "Intermediate", 
      icon: <Leaf className="w-6 h-6" />,
      description: "6 months to 2 years of regular practice",
    },
    {
      value: "advanced",
      label: "Advanced",
      icon: <TreePine className="w-6 h-6" />,
      description: "2+ years of consistent yoga practice",
    },
  ];

  const goals = [
    "flexibility",
    "strength", 
    "stress relief",
    "balance",
    "meditation",
    "weight loss",
  ];

  const timeOptions = [
    { value: "10-15 min", label: "10-15 min", icon: <Clock className="w-6 h-6" /> },
    { value: "15-30 min", label: "15-30 min", icon: <Timer className="w-6 h-6" /> },
    { value: "30-45 min", label: "30-45 min", icon: <CalendarClock className="w-6 h-6" /> },
    { value: "45+ min", label: "45+ min", icon: <CalendarCheck className="w-6 h-6" /> },
  ];

  return (
    <Card className="bg-wellness-50 border-none shadow-lg">
      <CardContent className="p-8 lg:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Age Group */}
            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-wellness-800">
                    What's your age group?
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {ageGroups.map((age) => (
                        <button
                          key={age.value}
                          type="button"
                          className={`p-4 border-2 rounded-xl transition-all text-center ${
                            selectedAgeGroup === age.value
                              ? "border-primary-400 bg-primary-50"
                              : "border-wellness-200 hover:border-primary-400 hover:bg-primary-50"
                          }`}
                          onClick={() => {
                            setSelectedAgeGroup(age.value);
                            field.onChange(age.value);
                          }}
                        >
                          <div className="font-semibold">{age.label}</div>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience Level */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-wellness-800">
                    What's your yoga experience?
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {experienceLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          className={`p-6 border-2 rounded-xl transition-all cursor-pointer text-left ${
                            selectedExperience === level.value
                              ? "border-primary-400 bg-primary-50"
                              : "border-wellness-200 hover:border-primary-400 hover:bg-primary-50"
                          }`}
                          onClick={() => {
                            setSelectedExperience(level.value);
                            field.onChange(level.value);
                          }}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-secondary-500">{level.icon}</div>
                            <span className="font-semibold text-lg">{level.label}</span>
                          </div>
                          <p className="text-wellness-600 text-sm">{level.description}</p>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goals */}
            <FormField
              control={form.control}
              name="goals"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-wellness-800">
                    What are your primary goals? (Select all that apply)
                  </FormLabel>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                      <FormField
                        key={goal}
                        control={form.control}
                        name="goals"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 p-4 border-2 border-wellness-200 rounded-xl hover:bg-wellness-100 transition-all cursor-pointer">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(goal)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, goal])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== goal)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="capitalize cursor-pointer">
                              {goal}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Availability */}
            <FormField
              control={form.control}
              name="timeAvailable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-wellness-800">
                    How much time can you dedicate daily?
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {timeOptions.map((time) => (
                        <button
                          key={time.value}
                          type="button"
                          className={`p-4 border-2 rounded-xl transition-all text-center ${
                            selectedTime === time.value
                              ? "border-primary-400 bg-primary-50"
                              : "border-wellness-200 hover:border-primary-400 hover:bg-primary-50"
                          }`}
                          onClick={() => {
                            setSelectedTime(time.value);
                            field.onChange(time.value);
                          }}
                        >
                          <div className="text-2xl mb-2 flex justify-center">{time.icon}</div>
                          <div className="font-semibold">{time.label}</div>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center pt-8">
              <Button
                type="submit"
                disabled={generateRecommendationsMutation.isPending}
                className="gradient-bg text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {generateRecommendationsMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate My Routine
                    <span className="ml-2">✨</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
