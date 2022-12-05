import { Form, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { PencilSquareIcon, HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFill } from "@heroicons/react/24/solid";
import Button from "./Button";
import Modal from "./Modal";
import Toast from "./Toast";

export default function SnippetCard({ snippet, snippetFolder, details, onSubmit, isDeleting, isFailedDelete }) {
  const updateText = new Date(snippet?.updatedAt).toUTCString();
  const [showDeleteSnippetFolderModal, setShowDeleteSnippetFolderModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  function closeDeleteSnippetFolderModal() {
    setShowDeleteSnippetFolderModal(false);
  }

  function closeDeleteToast() {
    setShowDeleteToast(false);
  }

  useEffect(() => {
    // Get all snippet card elements where the snippet id matches the snippet id of the snippet that is being deleted.
    const snippetCards = document.querySelectorAll(`[data-snippet-id="${snippet?._id}"]`);

    if (isFailedDelete) {
      // If the snippet failed to delete, show the delete toast.
      setShowDeleteToast(true);
      // Show all of the snippet cards that were hidden when the delete button was clicked.
      snippetCards.forEach((snippetCard) => {
        snippetCard.classList.remove("opacity-0");
        snippetCard.classList.add("opacity-100");
      });
    } else if (isDeleting) {
      // Hide all of the snippet cards that are being deleted.
      snippetCards.forEach((snippetCard) => {
        snippetCard.classList.remove("opacity-100");
        snippetCard.classList.add("opacity-0");
      });
      // Add the opacity-0 class to the snippet card element.
    }
  }, [isFailedDelete, isDeleting, snippet?._id]);

  return (
    <div data-snippet-id={snippet?._id} className="transition-opacity duration-500 ease-in-out">
      {details && (
        <>
          <h1 className="text-3xl font-bold">{snippet?.title}</h1>
          <hr className="my-4" />
        </>
      )}
      <div
        className="flex flex-col justify-between w-full p-4 my-2 bg-slate-300 rounded-lg shadow-lg"
        key={snippet?._id}
      >
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold text-slate-900">{snippet?.title}</h2>
            {details && (
              <div className="flex flex-row gap-x-4">
                <Link to={`/snippets/${snippet?.snippetFolder}/${snippet?._id}/edit`}>
                  <PencilSquareIcon className="text-blue-500 hover:text-blue-700 w-6 h-6 transition-colors duration-300 ease-in-out" />
                </Link>
                <button
                  onClick={() => setShowDeleteSnippetFolderModal(true)}
                  className="text-red-500 hover:text-red-700 w-6 h-6 transition-colors duration-300 ease-in-out"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
                <Form
                  method="post"
                  action={`/snippets/${snippet?.snippetFolder}/${snippet?._id}/favorite`}
                  className="w-6 h-6"
                >
                  <button
                    type="submit"
                    className="text-pink-400 hover:text-pink-600 transition-colors duration-300 ease-in-out"
                  >
                    {snippet?.favorite ? <HeartIconFill className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
                  </button>
                </Form>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-900">{snippet?.description}</p>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <p className="text-xs text-slate-900">{snippet?.language}</p>
            <p className="text-xs text-slate-900">{snippetFolder?.name}</p>
          </div>
          {!details && (
            <Button path={`/snippets/${snippet?.snippetFolder}/${snippet?._id}`} classType="primary">
              View
            </Button>
          )}
          <p className="text-xs text-slate-900">Updated at: {updateText}</p>
        </div>
        {showDeleteToast === true && (
          <Toast message={`Snippet ${snippet?.title} could not be deleted`} type="error" onClose={closeDeleteToast} />
        )}

        {showDeleteSnippetFolderModal === true && (
          <Modal
            title="Delete Snippet?"
            onClose={closeDeleteSnippetFolderModal}
            actionPath={`/snippets/${snippet?.snippetFolder}/${snippet?._id}/delete`}
            id={snippet?._id}
            onSubmit={onSubmit}
          >
            <p>Are you sure you want to delete this snippet?</p>
          </Modal>
        )}
      </div>
    </div>
  );
}
