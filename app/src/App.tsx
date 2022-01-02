import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Golink } from "./models";
import { GolinkEntry } from "./components/GolinkEntry";

export function App() {
  const [golinks, setGolinks] = useState<Golink[]>([]);
  useEffect(() => {
    const fetchGolinks = async () => {
      const resp = await fetch("/go/api/link");
      const golinks: Golink[] = await resp.json();
      setGolinks(golinks);
    };

    fetchGolinks();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="max-w-2xl mx-auto">
        {golinks.map((link) => (
          <GolinkEntry key={link.id} golink={link} />
        ))}
      </div>
    </>
  );
}
