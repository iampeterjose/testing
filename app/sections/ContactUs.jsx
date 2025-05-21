import { socialMedia } from "../constants";

const ContactUs = () => {
  return (
    <section className="w-full flex flex-col items-center py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">Contact Us</h2>
      <div className="flex items-center gap-6 md:gap-8">
        {socialMedia.map((icon) => (
          <a
            key={icon.alt}
            href={icon.href || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex justify-center items-center w-14 h-14 bg-white/80 rounded-full shadow-lg hover:bg-orange-100 transition duration-300 border-2 border-orange-100 hover:scale-110"
            aria-label={icon.alt}
          >
            <img
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
              className="duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
            />
          </a>
        ))}
      </div>
      <p className="mt-6 text-slate-200 text-center text-base max-w-xl">We'd love to hear from you! Reach out to us on any of our social platforms.</p>
    </section>
  );
};

export default ContactUs;