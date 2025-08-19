export const AnchorBtn = (props) => {
    const { path, alt, variant, children } = props;
    return(
        <a href={path} alt={alt} className={variant} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    )
}