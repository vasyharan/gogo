import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Golink } from "./models";
import { GolinkEntry } from "./components/GolinkEntry";

async function fetchGolinks(q: string): Promise<Golink[]> {
  const params = new URLSearchParams({ q });
  const resp = await fetch(`/go/api/link?${params.toString()}`);
  const golinks: Golink[] = await resp.json();
  return golinks;
}

async function _updateGolinks(
  q: string,
  setGolinks: (golinks: Golink[]) => void
) {
  const golinks = await fetchGolinks(q);
  setGolinks(golinks);
}
const updateGolinks = debounce(_updateGolinks, 300);

export function App() {
  const [query, setQuery] = useState("");
  const [golinks, setGolinks] = useState<Golink[]>([]);

  useEffect(() => {
    updateGolinks(query, setGolinks);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto">
      <Navbar query={query} onQueryChange={setQuery}></Navbar>
      {golinks.map((link) => (
        <GolinkEntry key={link.id} golink={link} />
      ))}
    </div>
  );
}
