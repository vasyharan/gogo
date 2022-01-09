import cx from "classnames";
import { useState } from "react";
import { ApiResponse } from "../api";
import { assertNever } from "../assert";
import { Golink, NewGolink } from "../models";
import { Button } from "./Button";
import { CancelIcon, EditIcon, SaveIcon } from "./Icons";
type EditableProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  mode: "view" | "edit";
  error: string;
};
function Editable(props: EditableProps) {
  const { mode, className, value, error, ...rest } = props;
  const isError = error !== "";
  switch (mode) {
    case "view":
      return <span className={className}>{value}</span>;
    case "edit":
      return (
        <div className="flex flex-col">
          <input
            className={cx(
              className,
              "p-0",
              "bg-transparent",
              "border-0 border-b",
              "selection:bg-gray-300",
              "focus:ring-0",
              {
                "placeholder-red-300 border-red-400 focus:border-red-200":
                  isError,
                "placeholder-gray-300 border-transparent focus:border-gray-300":
                  !isError,
              }
            )}
            value={value}
            {...rest}
          />
          <p
            className={cx("text-xs", "text-red-500 mb-1", {
              hidden: !isError,
              block: isError,
            })}
          >
            {error}
          </p>
        </div>
      );
    default:
      assertNever(mode);
  }
}

type State =
  | { mode: "view" }
  | { mode: "editing" }
  | {
      mode: "edit";
      keywordError?: string;
      linkError?: string;
    };

type GolinkEntryProps = {
  golink: NewGolink | Golink;
  save: (golink: NewGolink | Golink) => Promise<ApiResponse<Golink>>;
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

  const [state, setState] = useState<State>(
    isNew ? { mode: "edit" } : { mode: "view" }
  );
  const [keyword, setKeyword] = useState(golink.keyword);
  const [link, setLink] = useState(golink.link);

  async function handleSubmit(ev) {
    console.log("handleSubmit");
    ev.preventDefault();
    setState({ mode: "editing" });
    const resp = await props.save({ ...golink, keyword, link });
    if (resp.type === "success") {
      setState({ mode: "view" });
    } else if (resp.type === "error") {
      let keywordError = "";
      if (resp.error.code === 101) {
        keywordError = "A link with the same keyword already exists!";
      }
      setState({ mode: "edit", keywordError });
      console.error(resp.error);
    } else assertNever(resp);
  }

  function handleEdit(ev) {
    console.log("handleEdit");
    ev.stopPropagation();
    if (state.mode === "view") {
      ev.preventDefault();
      setState({ mode: "edit" });
    }
  }

  function handleCancel(ev) {
    console.log("handleCancel");
    ev.stopPropagation();
    setKeyword(golink.keyword);
    setLink(golink.link);
    setState({ mode: "view" });
    if (!!props.onCancel) props.onCancel();
  }

  const { mode } = state;
  const viewMode = mode === "view";
  const changed = !(keyword === golink.keyword && link === golink.link);

  let { keywordError = "", linkError = "" } = state as any;
  if (state.mode === "edit") {
    if (!keywordError) {
      if (keyword === "") {
        keywordError = "A keyword is required";
      }
    }
    if (!linkError) {
      if (!isValidURL(link)) {
        linkError = "A link is must be valid HTTP/HTTPS URL";
      }
    }
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
          <Editable
            type="text"
            name="keyword"
            className="text-gray-700"
            mode={viewMode ? "view" : "edit"}
            placeholder="keyword"
            value={keyword}
            error={keywordError}
            onChange={(ev) => setKeyword(ev.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoFocus={true}
            required={true}
          />
          <Editable
            type="url"
            name="link"
            className="text-sm text-gray-500"
            mode={viewMode ? "view" : "edit"}
            placeholder="destination link"
            value={link}
            error={linkError}
            onChange={(ev) => setLink(ev.target.value)}
            autoComplete="off"
            spellCheck={false}
            required={true}
          />
        </div>
        <div
          className={cx("invisible group-hover:visible", {
            hidden: !viewMode,
            block: viewMode,
          })}
        >
          <Button className="shadow-none hover:shadow-none">
            <EditIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div
        className={cx("flex-col bg-gray-100 rounded-b py-2", {
          hidden: viewMode,
          flex: !viewMode,
        })}
      >
        <div className="flex justify-end">
          <Button
            onClick={handleCancel}
            disabled={mode === "editing"}
            className={cx(
              "bg-gray-500",
              "text-xs text-white",
              "outline-gray-600",
              "hover:bg-gray-600 disabled:hover:bg-gray-500 focus-visible:bg-gray-600 "
            )}
          >
            <CancelIcon className="mr-1 h-4 w-4" />
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            disabled={mode === "editing" || !changed}
            className={cx(
              "bg-emerald-500",
              "text-xs text-white font-semibold",
              "outline-emerald-600",
              "hover:bg-emerald-600 disabled:hover:bg-emerald-500 focus-visible:bg-emerald-600 "
            )}
          >
            <SaveIcon className="mr-1 h-4 w-4" />
            <span>{isNew ? "Create" : "Update"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
