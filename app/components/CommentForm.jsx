import { Form, Link } from "@remix-run/react";
import Button from "~/components/Button";

export default function CommentForm({ postId, user, currentUser }) {
  return (
    <Form method="post">
      <input type="hidden" name="postId" value={postId} />
      <div className="flex flex-row items-center gap-x-4 py-2 mx-4">
        <Link to={`/profile/@${currentUser?.username}`}>
          <img src={currentUser?.avatar} alt="avatar" className="h-16 w-16 rounded-full border-hidden" />
        </Link>
        <div className="w-full dark:text-gray-500">
          <p>
            Commenting on{" "}
            <Link to={`/profile/@${user.username}`} className="font-bold text-blue-600">
              @{user.username}
            </Link>
            's <Link to={`/profile/@${user.username}/${postId}`} className="font-bold text-blue-600">Toot</Link>
          </p>
          <textarea
            name="comment"
            placeholder="Toot your comment"
            className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-black dark:text-gray-100"
          />
        </div>

        <Button type="submit" classType="primary" name="_action" value="comment">
          Comment
        </Button>
      </div>
    </Form>
  );
}
