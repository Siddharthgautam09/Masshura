import Products from '@/components/Products';
import SEO from '@/components/Seo';

const ProductsPage = () => {
  return (
    <>
      <SEO
        title="IT Products Dubai - Ready ERP Solutions | Business Software UAE"
        description="Complete IT products including ready ERP Dubai, software for real estate UAE, business automation solutions."
        keywords="ready ERP in Dubai, software for real estate UAE, IT products Dubai"
        canonical="https://www.Maashura.com/products/"
      />
      <div className="navbar-content-spacing">
        <Products />
      </div>
    </>
  );
};

export default ProductsPage;