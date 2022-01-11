import { debounce } from "lodash";
import { useEffect, useState } from "react";
import * as api from "./api";
import { assertNever } from "./assert";
import { GolinkEntry } from "./components/GolinkEntry";
import { Navbar } from "./components/Navbar";
import { Golink } from "./models";

async function _loadLinks(q: string, setGolinks: (golinks: Golink[]) => void) {
  const resp = await api.listLinks(q);
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

  async function updateLink(link) {
    const resp = await api.updateLink(link);
    if (resp.type === "success") {
      const updated = resp.value;
      const updatedLinks = golinks.map((link) =>
        link.id === updated.id ? updated : link,
      );
      setGolinks(updatedLinks);
    }
    return resp;
  }

  async function createLink(link) {
    const resp = await api.createLink(link);
    if (resp.type === "success") {
      const created = resp.value;
      setNewLinkVisible(false);
      setGolinks([...golinks, created]);
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
        <GolinkEntry
          golink={{ keyword: "", link: "" }}
          save={createLink}
          onCancel={() => setNewLinkVisible(false)}
        />
      )}
      {golinks.map((link) => (
        <GolinkEntry key={link.id} golink={link} save={updateLink} />
      ))}
    </div>
  );
}
