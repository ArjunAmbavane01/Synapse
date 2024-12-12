export interface ButtonProps {
    variant:'primary'|'secondary',
    size:'sm'|'md'|'lg',
    startIcon:any,
    endIcon:any,
    onClick:()=>void,
}

export const Button = (props:ButtonProps) => {
    return <button></button>
}