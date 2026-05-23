import Hero from "@/components/home/Hero";
import Achievements from "@/components/home/Achievements";
import Philosophy from "@/components/home/Philosophy";
import Signatures from "@/components/home/Signatures";
import Spaces from "@/components/home/Spaces";
import Testimonials from "@/components/home/Testimonials";
import VisitCTA from "@/components/home/VisitCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Achievements />
      <Philosophy />
      <Signatures />
      <Spaces />
      <Testimonials />
      <VisitCTA />
    </>
  );
}
