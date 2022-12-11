import { useEffect } from "react";
import Button from "./Button";

/*
 * This component is used to display a toast message.
 * As of now, it is only used to display error messages.
 */
export default function Toast({ message, type, onClose }) {
  // Start timer to close toast
  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fade div in after 100ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const toast = document.getElementById("toast");
      toast.classList.remove("opacity-0");
      toast.classList.add("opacity-100");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  function closeToast() {
    const toast = document.getElementById("toast");
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
    setTimeout(() => {
      onClose();
    }, 500);
  }

  return (
    <div
      id="toast"
      className={`fixed z-10 p-2 left-0 bottom-0 m-4 border border-gray-900 rounded-lg shadow-lg opacity-0 transition-opacity duration-500 ease-in-out 
       ${type === "error" ? "bg-red-900" : "bg-green-900"}`}
    >
      <div className="flex flex-row justify-between items-center gap-x-4 text-white">
        <p>{message}</p>
        <Button onClick={closeToast}>&times;</Button>
      </div>
    </div>
  );
}
