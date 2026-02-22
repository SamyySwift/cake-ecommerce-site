import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white pt-24 pb-8 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Brand/About */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-serif mb-6 tracking-wide">AURA</h3>
            <p className="text-white/50 font-light text-sm max-w-xs leading-relaxed mb-8">
              Redefining modern luxury through sustainable practices and timeless silhouettes. Designed for the discerning individual.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-white/50 hover:text-white transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-colors">
                <Twitter size={18} strokeWidth={1.5} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-colors">
                <Facebook size={18} strokeWidth={1.5} />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-6 font-semibold">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/shop?category=womenswear" className="text-white/70 hover:text-white transition-colors text-sm font-light">Womenswear</Link>
              </li>
              <li>
                <Link to="/shop?category=menswear" className="text-white/70 hover:text-white transition-colors text-sm font-light">Menswear</Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="text-white/70 hover:text-white transition-colors text-sm font-light">Accessories</Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="text-white/70 hover:text-white transition-colors text-sm font-light">New Arrivals</Link>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-6 font-semibold">Client Services</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors text-sm font-light">Contact Us</Link>
              </li>
              <li>
                <Link to="/delivery" className="text-white/70 hover:text-white transition-colors text-sm font-light">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/returns" className="text-white/70 hover:text-white transition-colors text-sm font-light">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/70 hover:text-white transition-colors text-sm font-light">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-white/40 mb-6 font-semibold">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/terms" className="text-white/70 hover:text-white transition-colors text-sm font-light">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-white transition-colors text-sm font-light">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-white/70 hover:text-white transition-colors text-sm font-light">Accessibility</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Massive Logo */}
        <div className="w-full flex justify-center items-center border-t border-white/10 pt-12 pb-8">
          <h1 className="text-[15vw] leading-none font-serif text-white tracking-tighter opacity-90 select-none pointer-events-none">
            AURA
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/30 tracking-wide">
          <p>&copy; {new Date().getFullYear()} AURA TRADEMARK. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>INDEX</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
