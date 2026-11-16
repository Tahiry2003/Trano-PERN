
import HeroSection from "./HeroSection";
import SearchSection from "./SearchSection";
import FeaturedProperties from "./FeaturedProperties";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <HeroSection />
      <SearchSection />
      <FeaturedProperties />
    </div>
  );
}
