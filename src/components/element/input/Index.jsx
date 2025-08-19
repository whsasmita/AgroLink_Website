export const Input = (props) => {
    const { type, placeholder, variant } = props;
    return(
        <input type={type} placeholder={placeholder} className={variant}/>
    )
}