import { Form, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon, StarIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import Toast from "./Toast";

export default function PostCard({ post, group, user, currentUser, detailView, onSubmit, isDeleting, isFailedDelete, requestUrl }) {
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  let postDate = new Date();
  console.log(post);

  // Check if post.createdAt is today.
  const isToday = new Date(post?.createdAt).toDateString() === new Date().toDateString();

  if (isToday) {
    postDate = new Date(post?.createdAt).toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  } else {
    postDate = new Date(post?.createdAt).toLocaleDateString("da-DK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function closeDeletePostModal() {
    setShowDeletePostModal(false);
  }

  function closeDeleteToast() {
    setShowDeleteToast(false);
  }

  useEffect(() => {
    // Get all snippet card elements where the snippet id matches the snippet id of the snippet that is being deleted.
    const postCards = document.querySelectorAll(`[data-post-id="${post?._id}"]`);

    if (isFailedDelete) {
      // If the snippet failed to delete, show the delete toast.
      setShowDeleteToast(true);
      // Show all of the snippet cards that were hidden when the delete button was clicked.
      postCards.forEach((postCard) => {
        postCard.classList.remove("opacity-0");
        postCard.classList.add("opacity-100");
      });
    } else if (isDeleting) {
      // Hide all of the snippet cards that are being deleted.
      postCards.forEach((postCard) => {
        postCard.classList.remove("opacity-100");
        postCard.classList.add("opacity-0");
      });
      // Add the opacity-0 class to the snippet card element.
    }
  }, [isDeleting, isFailedDelete, post?._id]);

  function hasUserStarredPost() {
    // Check if the user has starred the post.
    if (currentUser?.starredPosts?.includes(post?._id)) {
      return true;
    }
    return false;
  }

  function hasUserBookmarkedPost() {
    // Check if the user has bookmarked the post.
    if (currentUser?.bookmarkedPosts?.includes(post?._id)) {
      return true;
    }
    return false;
  }

  return (
    <div
      data-post-id={post?._id}
      className="w-full border border-gray-600 grid grid-cols-[min-content_1fr] transition-opacity duration-500 ease-in-out"
    >
      <Link to={`/profile/@${user.username}`} className="my-4 ml-2 w-12">
        <img src={user.avatar} alt="avatar" className="h-12 w-12 rounded-full" />
      </Link>
      <div className="p-4" key={post?._id}>
        {/* Post and user info */}
        <div className="flex flex-row justify-between">
          <Link to={`/profile/@${user.username}`} className="flex flex-row">
            {user.firstName} {user.lastName}
            <span className="mx-2 text-sm text-gray-500">
              @{user.username} &#8226; {postDate}
            </span>
          </Link>
          {/* Edit post buttons */}
          {detailView && currentUser?._id === post?.createdBy && (
            <div className="flex flex-row gap-x-4">
              <Link to={`/profile/@${user.username}/${post?._id}/edit`}>
                <PencilSquareIcon className="text-blue-500 hover:text-blue-700 w-6 h-6 transition-colors duration-300 ease-in-out" />
              </Link>
              <button
                onClick={() => setShowDeletePostModal(true)}
                className="text-red-500 hover:text-red-700 w-6 h-6 transition-colors duration-300 ease-in-out"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
        {/* Post tags */}
        <Link to={`/profile/@${user.username}/${post?._id}`}>
          {!post?.isDeleted === true ? (
          <p className="text-sm mb-2">{post?.content}</p>
          ): (
          <p className="text-sm mb-2 text-gray-500 font-bold">This post has been deleted.</p>
          )}
        </Link>
        {post?.tags && !post?.isDeleted && (
          <div className="flex flex-row gap-x-2 my-2">
            {post?.tags.map((tag) => (
              <Link to={`/tags/${tag.name}`} key={tag._id}>
                <p className="text-xs text-blue-600">#{tag.name.toUpperCase()}</p>
              </Link>
            ))}
          </div>
        )}
        {/* Post images */}
        {post?.images && (
          <Link to={`/profile/@${user.username}/${post?._id}`} className="grid grid-cols-2 gap-2 ">
            {post?.images.map((image) => (
              <img
                src={image}
                alt="post"
                className="w-full h-full max-h-80 object-cover border border-gray-600 rounded-xl"
                key={image}
              />
            ))}
          </Link>
        )}
        {/* Post comments */}
        <div className="flex flex-row justify-between mt-4">
          <Link
            to={`/profile/@${user.username}/${post?._id}`}
            className="flex flex-row gap-x-2 items-center border-hidden rounded-full p-2 hover:bg-blue-500/50 transition-colors duration-300 ease-in-out"
          >
            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-gray-500" />
            <p className="text-sm text-gray-500 font-bold">{post?.comments?.length}</p>
          </Link>
          {/* Post stars */}
          <Form method="post" action={`/profile/@${user.username}/${post?._id}/star`}>
            <input type="hidden" name="postId" value={post?._id} />
            <input type="hidden" name="redirectUrl" value={requestUrl} />
            <button
              type="submit"
              name="_action"
              value="star"
              aria-label={hasUserStarredPost() ? "Unstar post" : "Star post"}
              title={hasUserStarredPost() ? "Unstar post" : "Star post"}
              className="flex flex-row gap-x-2 items-center border-hidden rounded-full p-2 hover:bg-yellow-300/20 transition-colors duration-300 ease-in-out"
            >
              <StarIcon className={`w-6 h-6 ${hasUserStarredPost() ? "text-yellow-500" : "text-gray-500"}`} />
              <p className={`text-sm font-bold ${hasUserStarredPost() ? "text-yellow-500" : "text-gray-500"}`}>
                {post?.stars?.length}
              </p>
            </button>
          </Form>
          {/* Post bookmarks */}
          <Form method="post" action={`/profile/@${user.username}/${post?._id}/bookmark`}>
            <input type="hidden" name="postId" value={post?._id} />
            <input type="hidden" name="redirectUrl" value={requestUrl} />
            <button
              type="submit"
              name="_action"
              value="bookmark"
              aria-label={hasUserBookmarkedPost() ? "Unbookmark post" : "Bookmark post"}
              title={hasUserBookmarkedPost() ? "Unbookmark post" : "Bookmark post"}
              className="flex flex-row gap-x-2 items-center border-hidden rounded-full p-2 hover:bg-blue-700/20 transition-colors duration-300 ease-in-out"
            >
              <BookmarkIcon className={`w-6 h-6 ${hasUserBookmarkedPost() ? "text-blue-500" : "text-gray-500"}`} />
            </button>
          </Form>
        </div>
      </div>

      {showDeleteToast === true && (
        <Toast message={`Post ${post?.content} could not be deleted`} type="error" onClose={closeDeleteToast} />
      )}

      {showDeletePostModal === true && (
        <Modal
          title="Delete post?"
          onClose={closeDeletePostModal}
          actionPath={`/profile/@${user.username}/${post?._id}`}
          id={post?._id}
          onSubmit={onSubmit}
        >
          <p>Are you sure you want to delete this post?</p>
          <p> Only the content will be deleted. The post and comments will still be visible.</p>
          <p>This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
