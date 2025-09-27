import { useState } from "react"
import LoadingSpinnerButton from "../../LoadingSpinnerButton/LoadingSpinnerButton";

const Button = ({ label, onClick, variant, type = "button", disabled = false }) => {
    const [loading, setLoading] = useState(false)

    const handleClick = async (e) => {
        if (!onClick) return;

        setLoading(true);
        try {
            await onClick(e);
        } catch (error) {
            console.error('Erro ao executar a ação', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            type={type}
            onClick={type !== "submit" ? handleClick : undefined}
            disabled={disabled}
            className={`${styleBase[variant]} ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
        >
            {loading ? (
                <LoadingSpinnerButton />)
                :
                (label)
            }
        </button>
    )
}

const styleBase = {
    primary: "w-full bg-primary hover:bg-primary-hover text-text-button font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition",
    secondary: "w-full bg-transparent text-text hover:bg-primary hover:text-text-button font-bold py-2 px-4 border border-primary rounded-lg focus:outline-none focus:shadow-outline transition",
    delete: "w-full bg-transparent text-text hover:bg-danger hover:text-text font-bold py-2 px-4 border border-danger rounded-lg focus:outline-none focus:shadow-outline transition",
    sucess: "w-full bg-sucess hover:bg-sucess-hover text-text-button font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition",
}



export default Button
