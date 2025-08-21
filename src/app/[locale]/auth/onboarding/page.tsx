import { ProgressBarClient } from './ProgressBarClient';


export default function OnboardingPage() {
  // For SEO, put static title or metadata in layout or here (Next.js 13+ supports metadata export)
  
  return (
    <main 
        className="flex flex-col items-center justify-center 
            h-screen bg-gradient-to-t from-teal-900 to-black font-sans p-4">
        {/* Client component with interactivity */}
        <ProgressBarClient />
    </main>
  );
}
