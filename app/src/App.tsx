import cx from "classnames";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { ApiError, createLink, listLinks, updateLink } from "./api";
import { assertNever } from "./assert";
import {
  CreateGolink,
  EditGolink,
  GolinkEntryErrors,
} from "./components/GolinkEntry";
import { Navbar } from "./components/Navbar";
import { Golink, NewGolink } from "./models";

async function _loadLinks(q: string, setGolinks: (links: Golink[]) => void) {
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

type Editing =
  | { state: "inactive" }
  | { state: "new"; golink: NewGolink; errors: GolinkEntryErrors; shake: boolean }
  | {
    state: "existing";
    id: number;
    golink: NewGolink;
    errors: GolinkEntryErrors;
    shake: boolean;
  };
const EDITING_INACTIVE: Editing = { state: "inactive" };
const GOLINK_NEW = { keyword: "", link: "", active: true };
const ENTRY_NO_ERRORS: GolinkEntryErrors = { keyword: "", link: "" };

export function App() {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing>(EDITING_INACTIVE);
  const [golinks, setGolinks] = useState<Golink[]>([]);

  useEffect(() => {
    // TODO: handle loading screen
    loadLinks(query, setGolinks);
  }, [query]);

  function handleError(resp: ApiError) {
    const { code } = resp.error;
    let keywordError = "";
    if (code === 101) {
      keywordError = "Only lowercase alpha, numbers, -, and _ characters are allowed.";
    } else if (code === 102) {
      keywordError = "A link with the same keyword already exists!";
    }

    if (editing.state !== "inactive") {
      setEditing({
        ...editing,
        shake: false,
        errors: { ...editing.errors, keyword: keywordError },
      });
    }
  }

  async function handleCreate(golink) {
    const resp = await createLink(golink);
    if (resp.type === "success") {
      const created = resp.value;
      setEditing(EDITING_INACTIVE);
      setGolinks([...golinks, created]);
    } else if (resp.type === "error") {
      handleError(resp);
    } else assertNever(resp);

    return resp;
  }

  async function handleUpdate(golink) {
    const resp = await updateLink(golink);
    if (resp.type === "success") {
      const updated = resp.value;
      const updatedLinks = golinks.map((golink) =>
        golink.id === updated.id ? updated : golink,
      );
      setEditing(EDITING_INACTIVE);
      setGolinks(updatedLinks);
    } else if (resp.type === "error") {
      handleError(resp);
    } else assertNever(resp);

    return resp;
  }

  function handleChange<K extends keyof NewGolink = keyof NewGolink>(
    field: K,
    value: NewGolink[K],
  ) {
    if (editing.state === "inactive") {
      console.error("huh? what?!");
    } else {
      const golink = { ...editing.golink, [field]: value };
      let { keyword, link } = editing.errors;
      if (field === "keyword") keyword = "";
      if (field === "link") link = "";
      const errors = { keyword, link };
      setEditing({ ...editing, golink, errors });
    }
  }

  function hasChanged(prev: NewGolink, curr: NewGolink) {
    const changed =
      !!prev &&
      !(
        prev.keyword === curr.keyword &&
        prev.link === curr.link &&
        prev.active === curr.active
      );
    return changed;
  }

  function updateEditing(golink: Golink | NewGolink) {
    const nextEditing: Editing = !golink
      ? EDITING_INACTIVE
      : "id" in golink
        ? {
          state: "existing",
          id: golink.id,
          golink: golink,
          shake: false,
          errors: { keyword: "", link: "" },
        }
        : {
          state: "new",
          golink: golink,
          shake: false,
          errors: { keyword: "", link: "" },
        };

    if (golink === null || editing.state === "inactive") {
      setEditing(nextEditing);
    } else if (editing.golink !== golink) {
      let existing: NewGolink;
      if (editing.state === "existing") {
        const existingId = editing.id;
        existing = golinks.find((l) => l.id === existingId);
      } else {
        existing = GOLINK_NEW;
      }

      const changed = hasChanged(existing, editing.golink);
      if (changed) {
        setEditing({ ...editing, shake: true });
        // prevent from switching to new link until saved/cancelled
      } else {
        setEditing(nextEditing);
      }
    }
  }

  const editingNew = editing.state === "new";
  const editingExisting = editing.state === "existing";

  const isEditing = editingNew || editingExisting;
  const shake = isEditing && editing.shake;
  return (
    <div className="max-w-2xl mx-auto">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        onNewLink={() => updateEditing(GOLINK_NEW)}
      ></Navbar>
      {editingNew && (
        <div
          className={cx({ "animate-shake": shake })}
          onAnimationEnd={() => {
            if (editing.state === "new") {
              setEditing({ ...editing, shake: undefined });
            }
          }}
        >
          <CreateGolink
            golink={editing.golink}
            errors={editing.errors}
            changed={editing.golink !== GOLINK_NEW}
            onChange={handleChange}
            onSubmit={handleCreate}
            onToggleEdit={(enabled) => {
              if (enabled) updateEditing(editing.golink);
              else updateEditing(null);
            }}
          />
        </div>
      )}
      {golinks.map((orig) => {
        const [mode, errors, golink, eshake] =
          editingExisting && editing.id === orig.id
            ? [
              "edit" as const,
              editing.errors,
              { ...editing.golink, id: editing.id },
              shake,
            ]
            : ["view" as const, ENTRY_NO_ERRORS, orig, undefined];
        const changed = editingExisting && hasChanged(orig, editing.golink);
        return (
          <div
            key={golink.id}
            className={cx({ "animate-shake": eshake })}
            onAnimationEnd={() => {
              if (editing.state === "existing") {
                setEditing({ ...editing, shake: undefined });
              }
            }}
          >
            <EditGolink
              mode={mode}
              golink={golink}
              errors={errors}
              changed={changed}
              onChange={handleChange}
              onSubmit={handleUpdate}
              onToggleEdit={(enabled) => {
                if (enabled) updateEditing(golink);
                else updateEditing(null);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
