import HelpaAuth from "./HelpaAuth";

export default function HelpaOnboardingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
      <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-700">Become a Helpa</h1>
        <p className="text-center text-gray-500 mb-8">Sign up or log in to start your journey as a verified Helpa. Choose Google, email, or phone number to get started.</p>
        <HelpaAuth onAuthSuccess={() => onNavigate('provider-dashboard')} />
      </div>
    </div>
  );
}


