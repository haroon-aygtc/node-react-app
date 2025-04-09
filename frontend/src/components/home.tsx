import { useState } from "react";
import Header from "./layout/Header";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import EmbedOptionsSection from "./sections/EmbedOptionsSection";
import CTASection from "./sections/CTASection";
import Footer from "./layout/Footer";
import ChatWidget from "./chat/ChatWidget";
import { GuestUser } from "@/types/chat";
import { registerGuest } from "@/services/guestService";

const Home = () => {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);

  // Handle guest registration
  const handleGuestRegister = async (data: { fullName: string; email: string; phone: string }) => {
    try {
      const result = await registerGuest(data.fullName, data.email, data.phone);
      setGuestUser(result.guestUser);
      setChatSessionId(result.sessionId);
      return result;
    } catch (error) {
      console.error("Error registering guest:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <EmbedOptionsSection />
        <CTASection />
      </main>
      <Footer />

      {/* Demo Chat Widget */}
      <ChatWidget
        initiallyOpen={false}
        contextMode="restricted"
        contextName="Website Assistance"
        title="ChatEmbed Demo"
        primaryColor="#4f46e5"
        requireRegistration={true}
        guestUser={guestUser}
        onGuestRegister={handleGuestRegister}
      />
    </div>
  );
};

export default Home;
