import { Link, useLocation } from "react-router-dom";

export const LinkBtn = (props) => {
    const { path, variant, children, exact = false } = props;
    const location = useLocation();
    
    const isActive = exact 
        ? location.pathname === path 
        : location.pathname.startsWith(path) && (path !== "/" || location.pathname === "/");
    
    const activeClass = isActive ? "text-main" : "";
    
    return(
        <Link to={path} className={`${variant} ${activeClass}`}>
            {children}
        </Link>
    )
}