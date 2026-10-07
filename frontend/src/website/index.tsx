import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthMode } from "../component/types";
import { AuthModal } from "../component/website/AuthModal";
import { Footer } from "../component/website/Footer";
import { WebsiteHeader } from "../component/website/WebsiteHeader";
import { Hero } from "../component/website/Hero";
import { PackagesCard } from "../component/website/PackagesCard";
import { WhyUs } from "../component/website/WhyUs";

export default function Website() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const navigate = useNavigate();

  const openLogin = () => setAuthMode("login");
  const enterDashboard = () => {
    setAuthMode(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f7f8f2] text-[#12201d]">
      <WebsiteHeader onLogin={openLogin} onRegister={() => setAuthMode("register")} />
      <main>
        <Hero onLogin={openLogin} onRegister={() => setAuthMode("register")} />
        <WhyUs />
        <PackagesCard onChoosePackage={openLogin} />
      </main>
      <Footer />
      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={enterDashboard}
        />
      )}
    </div>
  );
}
