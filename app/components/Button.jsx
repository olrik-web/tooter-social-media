import { useNavigate } from "@remix-run/react";

export default function Button({ type = "button", classType, path, children, onClick, disabled, name, value }) {
  const classPrimary =
    "bg-blue-500 text-white font-bold my-2 py-2 px-4 rounded-3xl hover:bg-blue-700 transition duration-300 ease-in-out";
  const classSecondary =
    "font-bold  my-2 py-2 px-4 border border-gray-600 rounded-3xl hover:bg-gray-200 dark:hover:bg-neutral-800 transition duration-300 ease-in-out";
  const classDanger =
    "bg-red-500 text-white font-bold my-2 py-2 px-4 rounded-3xl hover:bg-red-700 transition duration-300 ease-in-out";

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
