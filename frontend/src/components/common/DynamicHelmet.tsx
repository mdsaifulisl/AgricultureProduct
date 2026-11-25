import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const DynamicHelmet = () => {
  const location = useLocation();

  const canonicalUrl = `https://reliablekrishi.com${location.pathname}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default DynamicHelmet;