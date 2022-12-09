import { Link } from "@remix-run/react";

export default function CommentCard({ comment }) {
  let commentDate = new Date();

  // Check if comment.createdAt is today.
  const isToday = new Date(comment?.createdAt).toDateString() === new Date().toDateString();

  if (isToday) {
    commentDate = new Date(comment?.createdAt).toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  } else {
    commentDate = new Date(comment?.createdAt).toLocaleDateString("da-DK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  return (
    <div className="w-full border border-gray-600 grid grid-cols-[min-content_1fr] transition-opacity duration-500 ease-in-out">
      <Link to={`/profile/@${comment.createdBy.username}`} className="my-4 ml-2 w-12">
        <img src={comment.createdBy.avatar} alt="avatar" className="h-12 w-12 rounded-full" />
      </Link>
      <div className="p-4">
        {/* Post and user info */}
        <div className="flex flex-row justify-between">
          <Link to={`/profile/@${comment.createdBy.username}`} className="flex flex-row">
            {comment.createdBy.firstName} {comment.createdBy.lastName}
            <span className="mx-2 text-sm text-gray-500">
              @{comment.createdBy.username} &#8226; {commentDate}
            </span>
          </Link>
        </div>
        <div className="text-gray-500">
          <p>
            Commenting on <span className="text-blue-500">@{comment.createdBy.username}</span>'s
            <Link to={`/profile/@${comment.createdBy.username}/${comment.post}`}>
              <span className="text-blue-500"> Toot</span>
            </Link>
          </p>
        </div>
        <p className="text-sm my-2">{comment?.content}</p>
      </div>
    </div>
  );
}
