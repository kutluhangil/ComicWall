import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="font-bebas text-2xl tracking-wider mb-3">
              COMIC<span className="text-primary">WALL</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium AI-generated comic-style posters. Turn your walls into a superpower.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">All Posters</Link></li>
              <li><Link to="/collections" className="hover:text-foreground transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Shipping & Returns</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">FAQ</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-muted border border-border text-sm px-3 py-2 flex-1 rounded-l-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors font-semibold">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-xs text-muted-foreground">
          © 2026 ComicWall. All rights reserved. All artwork is AI-generated original art.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
