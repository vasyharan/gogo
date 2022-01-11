import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { createLink, listLinks, updateLink } from "./api";
import { assertNever } from "./assert";
import { EditGolink, NewGolink } from "./components/GolinkEntry";
import { Navbar } from "./components/Navbar";
import { Golink } from "./models";

async function _loadLinks(q: string, setGolinks: (golinks: Golink[]) => void) {
  const resp = await listLinks(q);
  if (resp.type === "success") {
    const links = resp.value;
    setGolinks(links);
  } else if (resp.type === "error") {
    // TODO: handle error
  } else {
    assertNever(resp);
  }
}
const loadLinks = debounce(_loadLinks, 300);

export function App() {
  const [query, setQuery] = useState("");
  const [newLinkVisible, setNewLinkVisible] = useState(false);
  const [golinks, setGolinks] = useState<Golink[]>([]);

  useEffect(() => {
    // TODO: handle loading screen
    loadLinks(query, setGolinks);
  }, [query]);

  async function handleCreate(link) {
    const resp = await createLink(link);
    if (resp.type === "success") {
      const created = resp.value;
      setNewLinkVisible(false);
      setGolinks([...golinks, created]);
    }
    return resp;
  }

  async function handleUpdate(link) {
    const resp = await updateLink(link);
    if (resp.type === "success") {
      const updated = resp.value;
      const updatedLinks = golinks.map((link) =>
        link.id === updated.id ? updated : link,
      );
      setGolinks(updatedLinks);
    }
    return resp;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        onNewLink={() => setNewLinkVisible(true)}
      ></Navbar>
      {newLinkVisible && (
        <NewGolink
          golink={{ keyword: "", link: "" }}
          onCreate={handleCreate}
          onCancel={() => setNewLinkVisible(false)}
        />
      )}
      {golinks.map((link) => (
        <EditGolink key={link.id} golink={link} onUpdate={handleUpdate} />
      ))}
    </div>
  );
}
