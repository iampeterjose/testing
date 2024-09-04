
import Hero from "./sections/Hero";
import PopularProducts from "./sections/PopularProducts";
import Products from "./sections/Products";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section>
          <Hero />
        </section>
        <section>
          <PopularProducts />
        </section>
        <section>
          <Products />
        </section>
      </main>
    </div>
  );
}
