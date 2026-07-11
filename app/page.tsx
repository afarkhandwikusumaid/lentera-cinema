import Nav from '@/components/PublicNav';
import Footer from '@/components/PublicFooter';
import Hero from '@/components/home/Hero';
import BrandMarquee from '@/components/home/BrandMarquee';
import PopularServices from '@/components/home/PopularServices';
import StudioShowcase from '@/components/home/StudioShowcase';
import TrustSection from '@/components/home/TrustSection';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <BrandMarquee />
      <PopularServices />
      <StudioShowcase />
      <TrustSection />
      <FAQ />
      <Footer />
    </>
  );
}
