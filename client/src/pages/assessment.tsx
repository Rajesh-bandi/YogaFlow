import Navigation from "@/components/ui/navigation";
import AssessmentForm from "@/components/ui/assessment-form";

export default function Assessment() {
  return (
    <div className="min-h-screen bg-wellness-50">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Personalized <span className="gradient-text">Assessment</span>
            </h1>
            <p className="text-xl text-wellness-600 max-w-2xl mx-auto">
              Answer a few questions to help our AI create the perfect yoga routine tailored specifically for you
            </p>
          </div>
          
          <AssessmentForm />
        </div>
      </div>
    </div>
  );
}
