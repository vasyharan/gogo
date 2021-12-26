
export function Navbar() {
    return (
        <nav className="flex items-center justify-center flex-wrap bg-emerald-500 drop-shadow-lg p-2">
            <div className="flex items-center flex-grow max-w-2xl">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-mono tracking-tight">
                        <span className="font-semibold">go/</span>
                        <span>go</span>
                    </span>
                </div>
                <div className="w-full mr-2 flex flex-grow items-center text-emerald-200 focus-within:bg-white focus-within:text-gray-600">
                    <div className="w-min pl-2">
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
                        className="w-full bg-emerald-500 border-none shadow-none placeholder-emerald-200 focus:placeholder-gray-200 shadow-sm pl-2 pr-0 mr-2 py-1 text-sm focus:bg-white focus:ring-0"
                        placeholder='Search...'
                    />
                </div>
                <button type='button' className='flex-shrink-0 border-1 bg-emerald-700 hover:bg-emerald-800 text-sm text-white py-1 px-2'>New link</button>
            </div>
        </nav>
    );
}
