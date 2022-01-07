type NavbarProps = {
  query: string;
  onQueryChange: (q: string) => void;
};

export function Navbar({ query, onQueryChange }: NavbarProps) {
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full py-0 pl-2 pr-0 mr-2 text-sm border-0 placeholder-gray-500 focus:placeholder-gray-300 focus:ring-0"
            placeholder="Search..."
            value={query}
            onChange={(ev) => onQueryChange(ev.target.value)}
          />
        </div>
        <button
          type="button"
          className="flex-shrink-0 border-0 rounded-sm bg-gray-500 hover:bg-gray-700 hover:drop-shadow-lg focus:outline-0 focus:bg-gray-700 focus:drop-shadow-xl text-sm text-white py-1 px-2"
        >
          New link
        </button>
      </div>
    </nav>
  );
}
