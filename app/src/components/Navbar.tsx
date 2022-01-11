import { Button } from "./Button";
import { SearchIcon } from "./Icons";
import cx from "classnames";

type NavbarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onNewLink: () => void;
};

export function Navbar({ query, onNewLink, onQueryChange }: NavbarProps) {
  return (
    <nav className="flex items-center p-2 mb-6">
      <div className="mr-4 h-8">
        <span className="font-sans font-semibold tracking-tight text-xl text-emerald-500">
          <span className="font-bold">go/</span>
          <span>go</span>
        </span>
      </div>
      <div className="flex grow">
        <div
          className={cx(
            "mx-2 px-1 leading-6",
            "flex grow items-center ",
            "border-gray-700",
            "focus-within:border-b",
            "text-gray-500 focus-within:text-gray-700"
          )}
        >
          <SearchIcon className="w-4 h-4" />
          <input
            type="text"
            className={cx(
              "appearance-none",
              "border-0",
              "w-full",
              "py-1 px-2",
              "leading-tight",
              "text-sm",
              "placeholder-gray-300",
              "focus:ring-0",
              "focus:placeholder-gray-400",
              "selection:bg-gray-700/20"
            )}
            placeholder="Search..."
            value={query}
            onChange={(ev) => onQueryChange(ev.target.value)}
          />
        </div>
        <Button type="button" onClick={() => onNewLink()}>
          <span className="text-sm font-medium">New link</span>
        </Button>
      </div>
    </nav>
  );
}
