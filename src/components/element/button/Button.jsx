export const Button = (props) => {
    const { type, onClick, variant, children } = props;
    return(
        <button type={type} onClick={onClick} className={variant}>
            {children}
        </button>
    )
}