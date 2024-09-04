import { socialMedia } from "../constants";

const ContactUs = () => {
  return (
    <div className="flex items-center gap-5 mt-8">
        {socialMedia.map((icon) => (
            <div className="flex justify-center items-center w-12 h-12 bg-white rounded-full">
            <img 
                src={icon.src} 
                alt={icon.alt}
                width={24}
                height={24}
                className="duration-500 hover:rotate-[360deg]"
            />
            </div>
        ))}
    </div>
  )
}

export default ContactUs