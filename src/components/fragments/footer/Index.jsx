// Images
import logoImage from "../../../assets/images/Logo.png";
import whatsappIcon from "../../../assets/icons/whatsapp.svg";
import instagramIcon from "../../../assets/icons/instagram.svg";
import tiktokIcon from "../../../assets/icons/tiktok.svg";
import youtubeIcon from "../../../assets/icons/youtube.svg";

// Components
import { LinkBtn } from "../../element/button/LinkBtn";
import { AnchorBtn } from "../../element/button/AnchorBtn";

const Footer = () => {
  return (
    <footer className="py-8 px-4">
      <div className="flex justify-between items-start max-w-6xl mx-auto">
        <LinkBtn path="/" variant="flex flex-col items-center">
          <img src={logoImage} alt="logo" className="w-14 h-14 mb-2" />
          <p className="text-gray-600 text-sm">&copy; agrolink 2025</p>
        </LinkBtn>

        <div className="flex flex-col">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">Halaman</h3>
          <div className="flex flex-col space-y-2">
            <LinkBtn path="/farmer" variant="text-main_text hover:text-green-600 transition-colors">Petani</LinkBtn>
            <LinkBtn path="/expedition" variant="text-main_text hover:text-green-600 transition-colors">Ekspedisi</LinkBtn>
            <LinkBtn path="/worker" variant="text-main_text hover:text-green-600 transition-colors">Pekerja</LinkBtn>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">
            Hubungi Kami
          </h3>
          <div className="flex justify-center items-center gap-2">
            <AnchorBtn path="https://wa.me/6283114755807" alt="WhatsApp" variant="">
              <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
            </AnchorBtn>
            <AnchorBtn path="https://www.instagram.com/p2mw_agrolink25?igsh=NnVpMjl3aHoxdnZn" alt="Instagram" variant="">
              <img src={instagramIcon} alt="Instagram" className="w-5 h-5" />
            </AnchorBtn>
            <AnchorBtn path="https://www.tiktok.com/@agro.link.2025?_t=ZS-8yNO9o8FDaT&_r=1" alt="TikTok" variant="">
              <img src={tiktokIcon} alt="TikTok" className="w-5 h-5" />
            </AnchorBtn>
            <AnchorBtn path="https://youtube.com/@agrolink-p2mw?si=TS5Q83sbfTUKXLSx" alt="YouTube" variant="">
              <img src={youtubeIcon} alt="YouTube" className="w-5 h-5" />
            </AnchorBtn>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
