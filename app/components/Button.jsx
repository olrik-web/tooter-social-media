import { useNavigate } from "@remix-run/react";

export default function Button({ type = "button", classType, path, children, onClick, disabled, name, value }) {
  const classPrimary =
    "bg-blue-700 hover:bg-blue-900 text-white font-bold my-2 py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1";
  const classSecondary =
    "bg-slate-200 text-blue-700 hover:text-blue-900 font-bold  my-2 py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1";
  const classDanger =
    "bg-red-700 hover:bg-red-900 text-white font-bold my-2 py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1";

  const navigate = useNavigate();
  function navigateTo() {
    navigate(path);
  }

  if (path) {
    return (
      <button
        onClick={navigateTo}
        className={classType === "primary" ? classPrimary : classType === "danger" ? classDanger : classSecondary}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classType === "primary" ? classPrimary : classType === "danger" ? classDanger : classSecondary}
      disabled={disabled}
      name={name}
      value={value}
    >
      {children}
    </button>
  );
}
