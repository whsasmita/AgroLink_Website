// Images
import logoImage from "../../../assets/images/Logo.png";
import agrolinkText from "../../../assets/images/agrolink.png";

export default function NavbarCheckout(){
    return (
        <>
            {/* Main Navigation */}
            <nav className="flex justify-between items-center py-4 px-4 relative z-50 bg-white/95 backdrop-blur-md">
                {/* Logo */}
                <LinkBtn
                    path="/"
                    variant="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                >
                    <img src={logoImage} alt="logo" className="w-8 h-8" />
                    <img src={agrolinkText} alt="logo-text" className="w-28 h-4" />
                </LinkBtn>
            </nav>
        </>
    )
}