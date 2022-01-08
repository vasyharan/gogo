import cx from "classnames";
import { useState } from "react";
import { Golink, NewGolink } from "../models";

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

type Mode = "view" | "edit" | "locked" | "error";
type GolinkEntryProps = {
  golink: NewGolink | Golink;
  onChange: (golink: NewGolink | Golink) => Promise<void>;
  onCancel?: () => void;
};

function isValidURL(s: string): boolean {
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
export function GolinkEntry(props: GolinkEntryProps) {
  const { golink } = props;
  const isNew = !("id" in golink);

  const [mode, setMode] = useState<Mode>(isNew ? "edit" : "view");
  const [keyword, setKeyword] = useState(golink.keyword);
  const [link, setLink] = useState(golink.link);
  const [error, setError] = useState("");

  const viewMode = mode === "view";
  const invalid = keyword === "" || !isValidURL(link);

  async function handleSubmit(ev) {
    try {
      ev.preventDefault();
      setMode("locked");
      await props.onChange({ ...golink, keyword, link });
      setMode("view");
    } catch (err) {
      setMode("error");
      setError(err.message);
      console.error(err);
    }
  }

  function handleEdit(ev) {
    ev.stopPropagation();
    if (viewMode) {
      setMode("edit");
    }
  }

  function handleCancel(ev) {
    ev.stopPropagation();
    setMode("view");
    setKeyword(golink.keyword);
    setLink(golink.link);
    props.onCancel && props.onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      onClick={handleEdit}
      className={cx(
        "group flex flex-col my-4 rounded hover:bg-gray-50 hover:drop-shadow",
        {
          "drop-shadow": !viewMode,
        }
      )}
    >
      <div
        className={cx("flex flex-row p-2 rounded", {
          "bg-gray-50": !viewMode,
          "rounded-b-none": !viewMode,
        })}
      >
        <div>
          <span className="font-mono font-bold bg-gray-700 text-white px-1">
            go/
          </span>
        </div>
        <div className="flex flex-col grow ml-1 mr-0">
          {(viewMode && <span className="text-gray-700">{keyword}</span>) || (
            <input
              className="p-0 
              placeholder-gray-300
              bg-transparent 
              text-gray-700
              border-0 border-b border-transparent 
              selection:bg-gray-300
              focus:ring-0 focus:border-b focus:border-gray-300"
              type="text"
              name="keyword"
              value={keyword}
              placeholder="keyword"
              autoComplete="off"
              spellCheck={false}
              autoFocus={true}
              required={true}
              onChange={(ev) => setKeyword(ev.target.value)}
            />
          )}
          {(viewMode && (
            <span className="text-sm text-gray-500">{link}</span>
          )) || (
            <input
              className="p-0 
              text-sm text-gray-500 
              placeholder-gray-300
              selection:bg-gray-300
              bg-transparent 
              border-0 border-b border-transparent 
              focus:ring-0 focus:border-b focus:border-gray-300"
              type="url"
              name="link"
              value={link}
              placeholder="destination link"
              autoComplete="off"
              spellCheck={false}
              required={true}
              onChange={(ev) => setLink(ev.target.value)}
            />
          )}
        </div>
        <div
          className={cx("invisible group-hover:visible", {
            hidden: !viewMode,
            block: viewMode,
          })}
        >
          <button
            tabIndex={0}
            className="inline-flex items-center text-sm focus:outline-0 text-gray-700 hover:text-gray-900"
          >
            <EditIcon />
          </button>
        </div>
      </div>
      <div
        className={cx("flex-col bg-gray-100 rounded-b py-2", {
          hidden: viewMode,
          flex: !viewMode,
        })}
      >
        {mode === "error" && (
          <p className="mx-2 mb-2 text-xs text-red-500">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={mode === "locked"}
            className="flex-shrink-0 border-0 rounded 
          text-xs text-white mr-2 py-1 px-2
          disabled:opacity-30
          bg-gray-500 
          hover:bg-gray-600 hover:drop-shadow-xl 
          disabled:hover:bg-gray-500 disabled:hover:drop-shadow-none
          focus-visible:bg-gray-600 focus:drop-shadow-xl focus:outline-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mode === "locked" || invalid}
            className="flex-shrink-0 border-0 rounded 
          text-xs text-white font-medium mr-2 py-1 px-2
          disabled:opacity-30
          bg-emerald-500 
          hover:bg-emerald-600 hover:drop-shadow-xl 
          disabled:hover:bg-emerald-500 disabled:hover:drop-shadow-none
          focus-visible:bg-emerald-600 focus:drop-shadow-xl focus:outline-0"
          >
            {isNew ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
}
