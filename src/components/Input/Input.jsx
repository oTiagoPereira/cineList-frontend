const Input = ({ id, type, placeholder, onChange }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="bg-background-input w-full px-4 py-2 border border-border rounded-lg outline-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text text-text hover:bg-background-input"
      required
    />
  );
};

export default Input;
