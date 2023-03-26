import logo1 from "./logo1.png"; //rgba(87, 49, 30, 255)
import logo2 from "./logo2.png"; //rgba(0, 113, 188, 255)
import logo3 from "./logo3.png"; //rgba(131, 6, 6, 255)
import logo4 from "./logo4.png"; //rgba(200, 22, 31, 255)

const getLogo = (url) => {
   if (url == "/logos/logo1.png") return { logo: logo1, color: "rgba(87, 49, 30, 255)" };
   else if (url == "/logos/logo2.png")
      return { logo: logo2, color: "rgba(0, 113, 188, 255)" };
   else if (url == "/logos/logo3.png")
      return { logo: logo3, color: "rgba(131, 6, 6, 255)" };
   else if (url == "/logos/logo4.png")
      return { logo: logo4, color: "rgba(200, 22, 31, 255)" };
   else return { logo: null, color: "grey" };
};

export default getLogo;
