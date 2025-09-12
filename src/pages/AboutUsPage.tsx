import AboutUs from '@/components/AboutUs';
import SEO from '@/components/Seo';

const AboutUsPage = () => {
  return (
    <>
      <SEO
        title="About Maashura - Leading IT Consultancy Dubai | Ready ERP UAE"
        description="Learn about Maashura's expertise in ready ERP solutions Dubai, software for real estate UAE."
        keywords="about Maashura, IT consultancy Dubai, ready ERP UAE"
        canonical="https://www.Maashura.com/about/"
      />
      <div className="navbar-content-spacing">
        <AboutUs />
      </div>
    </>
  );
};

export default AboutUsPage;
