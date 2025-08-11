import { ProgressBarClient } from './ProgressBarClient';

export default function OnboardingPage() {
  // For SEO, put static title or metadata in layout or here (Next.js 13+ supports metadata export)
  
  return (
    <main 
        className="flex flex-col items-center justify-center 
            min-h-screen bg-teal-50 font-sans p-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">Onboarding Process</h1>

        {/* Client component with interactivity */}
        <ProgressBarClient totalSteps={5} />
      </div>
    </main>
  );
}
