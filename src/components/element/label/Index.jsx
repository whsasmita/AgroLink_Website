export const Label = (props) => {
    const { htmlFor, variant, children } = props;
    return(
        <label htmlFor={htmlFor} className={variant}>
            {children}
        </label>
    )
}