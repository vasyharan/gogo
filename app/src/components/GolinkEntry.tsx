import { Golink } from "../models";

type GolinkEntryProps = {
  golink: Golink;
};

export function GolinkEntry({ golink }: GolinkEntryProps) {
  return (
    <>
      <div className="border rounded-sm overflow-hidden drop-shadow-lg mb-2">
        <div className="px-4 py-2">
          <a className="font-mono font-bold mr-2" href={golink.link}>
            <span className="">go/</span>
            <span className="text-gray-700">{golink.keyword}</span>
          </a>
          <a className="text-gray-500 text-sm font-sans" href={golink.link}>
            {golink.link}
          </a>
        </div>
      </div>
    </>
  );
}
