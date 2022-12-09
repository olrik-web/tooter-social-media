import Button from "./Button";

export default function GroupCard({ group, user, detailView = false }) {
  return (
    <div className="flex flex-row">
      <div className="w-full border-x border-b border-gray-600 p-4">
        {!detailView && <h1 className="text-2xl font-bold mb-2">{group.name}</h1>}
        <div className="flex flex-col justify-center gap-y-2">
          <div>
            <p className="font-bold text-gray-600">Description</p>
            <p>{group.description}</p>
          </div>
          <div>
            <p className="font-bold text-gray-600">Privacy:</p>
            <p>{group.privacy}</p>
          </div>
          <div>
            <p className="font-bold text-gray-600">Members:</p>
            <p>{group.members.length}</p>
          </div>
          {!detailView && <Button path={`/groups/${group._id}`}>View Group</Button>}
          {detailView && group.createdBy === user?._id && <Button path={`/groups/${group._id}/edit`}>Edit</Button>}
        </div>
      </div>
    </div>
  );
}
