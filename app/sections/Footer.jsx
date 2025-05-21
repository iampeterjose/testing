import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

const Footer = () => {
  return (
    <footer id="contact-us" className="bg-gradient-to-br from-orange-700 to-orange-400 text-white pt-16 pb-10 px-4 md:px-20 mt-16 rounded-t-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-20 border-b border-white/20 pb-12">
        {/* Brand & Contact */}
        <div className="flex flex-col items-start gap-6 min-w-[220px]">
          <a href="/" className="flex items-center gap-3 text-2xl font-bold font-satoshi text-white">
            <img src="/assets/images/coffeeimage.png" alt="Logo" width={44} height={44} className="rounded-full shadow-md" />
            <span>TestApp</span>
          </a>
          <ContactUs />
        </div>
        {/* About Us */}
        <div className="flex-1">
          <AboutUs />
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="font-satoshi text-white/80 text-sm">&copy; {new Date().getFullYear()} TestApp. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-white/60">
          <a href="#about-us" className="hover:text-white underline transition">About</a>
          <a href="#contact-us" className="hover:text-white underline transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;