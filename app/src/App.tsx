import { debounce } from "lodash";
import { useEffect, useState } from "react";
import * as api from "./api";
import { GolinkEntry } from "./components/GolinkEntry";
import { Navbar } from "./components/Navbar";
import { Golink } from "./models";
import { assertNever } from "./utils";

async function _loadLinks(q: string, setGolinks: (golinks: Golink[]) => void) {
  const resp = await api.listLinks(q);
  if (resp.type === "success") {
    const links = resp.body;
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
      const updated = resp.body;
      const updatedLinks = golinks.map((link) =>
        link.id === updated.id ? updated : link
      );
      setGolinks(updatedLinks);
    } else if (resp.type === "error") {
      throw new Error(`Error updating link: ${resp.message}`);
    } else {
      assertNever(resp);
    }
  }

  async function createLink(link) {
    const resp = await api.createLink(link);
    if (resp.type === "success") {
      const created = resp.body;
      setNewLinkVisible(false);
      setGolinks([...golinks, created]);
    } else if (resp.type === "error") {
      throw new Error(`Error creating link: ${resp.message}`);
    } else {
      assertNever(resp);
    }
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
          onChange={createLink}
          onCancel={() => setNewLinkVisible(false)}
        />
      )}
      {golinks.map((link) => (
        <GolinkEntry key={link.id} golink={link} onChange={updateLink} />
      ))}
    </div>
  );
}
