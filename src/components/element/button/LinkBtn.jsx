import { Link } from "react-router-dom";

export const LinkBtn = (props) => {
    const { path, variant, children } = props;
    return(
        <Link to={path} className={variant}>
            {children}
        </Link>
    )
}