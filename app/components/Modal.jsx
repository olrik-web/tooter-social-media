import { useFetcher } from "@remix-run/react";
import Button from "./Button";

export default function Modal({ title, children, onClose, actionPath, id, onSubmit }) {
  const fetcher = useFetcher();

  function closeModal() {
    // Start a timer to fade the modal out after 100ms
    const modal = document.getElementById("modal");
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");
    const timer = setTimeout(() => {
      onClose();
    }, 1000);
    return () => clearTimeout(timer);
  }

  return (
    <div
      id="modal"
      className="fixed z-10 p-24 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out"
    >
      <div className="relative dark:bg-black m-auto p-0 border border-gray-300 rounded-lg shadow-lg w-4/5">
        <div className="p-4 border-b border-gray-300 rounded-t-lg flex flex-row justify-between items-center text-lg">
          <h2>{title}</h2>
          <Button onClick={onClose}>&times;</Button>
        </div>
        <div className="p-4">{children}</div>
        <div className="p-4 mx-2 border-t border-gray-300 rounded-b-lg flex flex-row items-center">
          <Button type="button" onClick={onClose} classType="secondary">
            Cancel
          </Button>
          <fetcher.Form method="post" action={actionPath} onSubmit={onSubmit}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" classType="danger" name="_action" value="deletePost" onClick={closeModal}>
              Delete
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
