import { Button } from "./Button";
import { SearchIcon } from "./Icons";

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
        <div className="mx-2 flex grow items-center text-gray-500 focus-within:text-gray-700">
          <div className="">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full p-0 mx-2 text-sm border-0 border-b border-transparent placeholder-gray-500 focus:placeholder-gray-300 focus:ring-0 focus:border-gray-500"
            placeholder="Search..."
            value={query}
            onChange={(ev) => onQueryChange(ev.target.value)}
          />
        </div>
        <Button
          type="button"
          className="text-sm text-white font-semibold
          bg-gray-700 
          outline-gray-900
          hover:bg-gray-900 
          focus-visible:bg-gray-900"
          onClick={() => onNewLink()}
        >
          <span>New link</span>
        </Button>
      </div>
    </nav>
  );
}
