import { ProgressBarClient } from './ProgressBarClient';


export default function OnboardingPage() {
  // For SEO, put static title or metadata in layout or here (Next.js 13+ supports metadata export)
  
  return (
    <main 
        className="flex flex-col items-center justify-center 
            min-h-screen bg-gray-50 font-sans p-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg space-y-8">
        {/* Client component with interactivity */}
        <ProgressBarClient StepTitle='4' />
      </div>
    </main>
  );
}
