import { Link } from "@remix-run/react";

export default function CommentCard({ comment, author }) {
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
      <Link to={`/profile/@${comment.user.username}`} className="my-4 ml-2 w-12">
        <img src={comment.user.avatar} alt="avatar" className="h-12 w-12 rounded-full" />
      </Link>
      <div className="p-4">
        {/* Post and user info */}
        <div className="flex flex-row justify-between">
          <Link to={`/profile/@${comment.user.username}`} className="flex flex-row">
            {comment.user.firstName} {comment.user.lastName}
            <span className="mx-2 text-sm text-gray-500">
              @{comment.user.username} &#8226; {commentDate}
            </span>
          </Link>
        </div>
        <Link to={`/profile/@${author.username}`} className="text-gray-500">
          <p>
            Commenting on <span className="text-blue-500">@{author.username}</span>'s
            <Link to={`/profile/@${author.username}/${comment.post}`}>
              <span className="text-blue-500"> Toot</span>
            </Link>
          </p>
        </Link>
        <p className="text-sm my-2">{comment?.content}</p>
      </div>
    </div>
  );
}
