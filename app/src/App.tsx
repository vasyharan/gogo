import { Navbar } from "./components/Navbar";
import { Golink } from "./models";
import { GolinkEntry } from "./components/GolinkEntry";

export function App() {
  const golinks: Golink[] = [
    { id: 1, keyword: "google", link: "http://www.google.com/" },
  ];

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
