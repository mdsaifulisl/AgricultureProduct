import { CategoryShowcase } from "../../../components/public/home/CategoryShowcase";
import { FeaturedProducts } from "../../../components/public/home/FeaturedProducts";
import { Hero } from "../../../components/public/home/Hero";
import { HomeBlogSection } from "../../../components/public/home/HomeBlogSection";
import { PartnerLogosSection } from "../../../components/public/home/PartnerLogosSection";

export default function Home() {
    return (
        <>
            <Hero />
            <CategoryShowcase />
            <FeaturedProducts />
            <HomeBlogSection />
            <PartnerLogosSection />
        </>
    )
}