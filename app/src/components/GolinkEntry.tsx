import { Golink } from "../models";

type GolinkEntryProps = {
  golink: Golink;
};

export function GolinkEntry({ golink }: GolinkEntryProps) {
  const { keyword, link } = golink;
  return (
    <div className="group flex flex-row my-4 shadow-lg rounded-md p-2 bg-white hover:bg-gray-50">
      <div className="flex flex-col grow">
        <span className="font-mono font-bold">go/{keyword}</span>
        <span className="text-sm text-gray-500">{link}</span>
      </div>
      <div className="invisible group-hover:visible text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </div>
    </div>
  );
}
