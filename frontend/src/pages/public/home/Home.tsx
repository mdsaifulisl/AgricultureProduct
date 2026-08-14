import { CategoryShowcase } from "../../../components/public/home/CategoryShowcase";
import { FeaturedProducts } from "../../../components/public/home/FeaturedProducts";
import { Hero } from "../../../components/public/home/Hero";

export default function Home() {
    return (
        <>
            <Hero />
            <CategoryShowcase />
            <FeaturedProducts />
        </>
    )
}