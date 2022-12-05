export default function SnippetFolderCard({ snippet }) {
  return (
    <div >
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-center">{snippet.name}</h2>
      </div>
    </div>
  );
}
