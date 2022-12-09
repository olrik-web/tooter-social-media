import { useNavigate } from "@remix-run/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NavigateBackButton({ showText }) {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/explore");
    }
  }

  return (
    <button onClick={goBack} className="flex flex-row items-center justify-start px-4 gap-x-4 my-2">
      <ArrowLeftIcon className="h-8 w-8 border-hidden rounded-full p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors duration-300 ease-in-out" />
      {showText && <h2 className="text-xl font-bold">Back</h2>}
    </button>
  );
}
