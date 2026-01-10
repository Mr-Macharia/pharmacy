import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import TelehealthBanner from "@/components/home/TelehealthBanner";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <TelehealthBanner />
      <ServicesSection />
      <FeaturedProducts />
    </>
  );
}
