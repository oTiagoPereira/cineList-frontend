import { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

const Input = ({
  id,
  type,
  placeholder,
  onChange,
  value,
  showToggle = false,
  showClearButton = false,
  onClear
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const paddingRight = showToggle && showClearButton && value ? "pr-20" :
                       (showToggle || (showClearButton && value)) ? "pr-12" : "pr-4";

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={`bg-background-input w-full px-4 py-2 ${paddingRight} border border-border rounded-lg outline-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text text-text hover:bg-background-input`}
        required
      />

      {/* Botão de limpar - só aparece se tem valor e showClearButton está ativo */}
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text opacity-60 hover:opacity-100 focus:outline-none hover:text-red-500 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}

      {/* Botão de toggle senha */}
      {showToggle && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute ${showClearButton && value ? 'right-12' : 'right-4'} top-1/2 transform -translate-y-1/2 text-text opacity-60 hover:opacity-100 focus:outline-none`}
        >
          {showPassword ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
