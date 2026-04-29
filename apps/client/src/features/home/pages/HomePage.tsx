import { HomeBuyerFeatures } from "../components/HomeBuyerFeatures";
import { HomeHero } from "../components/HomeHero";
import { HomeSellerCta } from "../components/HomeSellerCta";

export const HomePage = () => {
  return (
    <>
      <HomeHero />
      <HomeBuyerFeatures />
      <HomeSellerCta />
    </>
  );
};
