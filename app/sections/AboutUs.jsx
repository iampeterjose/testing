import { aboutUs } from "../constants";

const AboutUs = () => {
  return (
    <div  id='about-us' className="flex flex-1 justify-between lg:gap-10 gap-20 flex-wrap mt-10">
        {aboutUs.map((items) => (
            <div key={items.title}>
            <h3 className="text-slate-100 text-xl font-satoshi font-semibold">{items.title}</h3>
            {items.description != "" && <p className="text-slate-100 font-satoshi">{items.description}</p>}
            {console.log(items.moreDetail)}
            <ul>
                {items.moreDetail && items.moreDetail.length > 0 ? (
                items.moreDetail.map((item) => (
                    <li key={item.id}>
                    <p className="text-slate-100 font-satoshi text-md font-semibold pl-5">{item.info}
                        <span className="font-normal"> - {item.detail}</span>
                    </p>
                    
                    </li>
                ))
                ) : (
                <p></p>
                )}
            </ul>
            </div>
        ))}
    </div>
  )
}

export default AboutUs