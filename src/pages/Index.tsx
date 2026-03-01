import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";
import heroBanner from "@/assets/posters/hero-banner.jpg";
import { products, collections, SIZES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <SEO
        title="ComicWall — Premium Comic-Style Art Posters"
        description="AI-generated original comic-style posters inspired by superhero themes. Turn your wall into a superpower."
        canonicalUrl="/"
      />
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroBanner} alt="Hero poster banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

            {/* Lightning flashes */}
            <div className="absolute inset-0 animate-lightning-1 bg-white/0 pointer-events-none" />
            <div className="absolute inset-0 animate-lightning-2 bg-white/0 pointer-events-none" />

            {/* Lightning bolts */}
            <svg className="absolute top-0 right-[30%] w-32 h-72 animate-bolt-1 pointer-events-none opacity-0" viewBox="0 0 120 280" fill="none">
              <path d="M60 0 L45 100 L75 95 L30 280 L55 150 L25 155 L60 0Z" fill="url(#boltGrad1)" filter="url(#boltGlow1)" />
              <defs>
                <linearGradient id="boltGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220 90% 80%)" />
                  <stop offset="100%" stopColor="hsl(220 90% 56%)" />
                </linearGradient>
                <filter id="boltGlow1" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
            </svg>
            <svg className="absolute top-10 right-[15%] w-20 h-56 animate-bolt-2 pointer-events-none opacity-0" viewBox="0 0 80 220" fill="none">
              <path d="M40 0 L30 80 L55 75 L15 220 L38 120 L18 125 L40 0Z" fill="url(#boltGrad2)" filter="url(#boltGlow2)" />
              <defs>
                <linearGradient id="boltGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(45 100% 80%)" />
                  <stop offset="100%" stopColor="hsl(220 90% 70%)" />
                </linearGradient>
                <filter id="boltGlow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
            </svg>

            {/* Eye glow effect */}
            <div className="absolute top-[28%] right-[38%] w-3 h-2 rounded-full bg-white animate-eye-glow pointer-events-none" style={{ boxShadow: '0 0 20px 10px rgba(255,255,255,0.8), 0 0 40px 20px rgba(200,220,255,0.4)' }} />
            <div className="absolute top-[28%] right-[35.5%] w-3 h-2 rounded-full bg-white animate-eye-glow pointer-events-none" style={{ boxShadow: '0 0 20px 10px rgba(255,255,255,0.8), 0 0 40px 20px rgba(200,220,255,0.4)' }} />

            {/* Atmospheric fog / mist movement */}
            <div className="absolute bottom-0 left-0 right-0 h-40 animate-fog-drift pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(0 0% 8% / 0.8), transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-60 animate-fog-drift-slow pointer-events-none opacity-30" style={{ background: 'radial-gradient(ellipse at 60% 100%, hsl(0 85% 55% / 0.15), transparent 70%)' }} />

            {/* Cape wind particles */}
            <div className="absolute top-[20%] right-[20%] w-1 h-1 rounded-full bg-primary/40 animate-particle-1 pointer-events-none" />
            <div className="absolute top-[30%] right-[25%] w-0.5 h-0.5 rounded-full bg-primary/30 animate-particle-2 pointer-events-none" />
            <div className="absolute top-[25%] right-[18%] w-1.5 h-1.5 rounded-full bg-primary/20 animate-particle-3 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Premium Art Posters
              </p>
              <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-wide text-foreground">
                Turn Your Wall Into a{" "}
                <span className="text-gradient">Superpower</span>
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-md leading-relaxed">
                AI-generated, original comic-style posters. Cinematic. Bold. Collectible.
              </p>
              <div className="flex gap-4 mt-8">
                <Link
                  to="/shop"
                  className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors rounded-md"
                >
                  Shop Now
                </Link>
                <Link
                  to="/collections"
                  className="border border-border text-foreground px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-muted transition-colors rounded-md"
                >
                  Explore Collections
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Posters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">Curated</p>
              <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">Featured Posters</h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Collections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">Themed Sets</p>
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">Collections</h2>
            <p className="text-muted-foreground mt-2">Save more when you buy a complete set.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </section>

        {/* Sizes Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Dimensions</p>
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">Available Sizes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SIZES.map((size, i) => (
              <motion.div
                key={size.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-lg p-8 text-center hover:border-accent/40 transition-all duration-300"
              >
                <div
                  className="mx-auto bg-muted rounded-sm flex items-center justify-center mb-6"
                  style={{
                    width: `${60 + i * 30}px`,
                    height: `${80 + i * 40}px`,
                  }}
                >
                  <span className="text-xs text-muted-foreground font-mono">{size.value}</span>
                </div>
                <h3 className="font-bebas text-2xl tracking-wide text-foreground">{size.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  From €{(12.99 + i * 6).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
};

export default Index;
