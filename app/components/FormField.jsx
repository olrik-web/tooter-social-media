export default function FormField({
  label,
  name,
  type,
  errors,
  element,
  children,
  defaultValue,
  handleLanguageChange,
  placeholderText,
  isRequired,
  autoFocus,
}) {
  const styleClass =
    "w-full p-2 rounded-xl my-2 text-slate-900 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400 focus:border-transparent";
  return (
    <>
      <label htmlFor={name} defaultValue={defaultValue}>
        {label}
      </label>
      {element == "input" ? (
        <input
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
          className={styleClass}
          placeholder={placeholderText}
          required={isRequired}
          autoFocus={autoFocus}
          aria-label={label}
          aria-required={isRequired}
        />
      ) : element == "textarea" ? (
        <textarea
          type="text"
          id={name}
          name={name}
          defaultValue={defaultValue}
          className={styleClass}
          placeholder={placeholderText}
          required={isRequired}
          autoFocus={autoFocus}
          aria-label={label}
          aria-required={isRequired}
        />
      ) : (
        <select
          name={name}
          id={name}
          className={styleClass}
          defaultValue={defaultValue}
          onChange={handleLanguageChange}
          required={isRequired}
          autoFocus={autoFocus}
          aria-label={label}
          aria-required={isRequired}
        >
          {children}
        </select>
      )}
      {/* TODO: Fix this */}
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errors?.message || errors?.error || errors?.name?.message}
      </div>
    </>
  );
}
