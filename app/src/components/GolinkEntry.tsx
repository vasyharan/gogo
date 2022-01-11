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
  error?: string;
  hint?: string;
};
function Editable(props: EditableProps) {
  const { mode, className, value, error, hint, ...rest } = props;
  const isError = error !== "";
  switch (mode) {
    case "view":
      return <span className={className}>{value}</span>;
    case "edit":
      return (
        <>
          <input
            className={cx(
              className,
              "appearance-none",
              "rounded-sm",
              "w-full",
              "py-1 px-2",
              "leading-tight",
              "shadow",
              "border",
              "transform-gpu transition-all duration-1500",
              "border-gray-500",
              "focus:ring-gray-400",
              "focus:border-gray-400",
              "focus:ring-1",
              "selection:bg-gray-400/20",
            )}
            value={value}
            {...rest}
          />
          <div className="mt-1">
            <p
              className={cx("text-xs italic", "text-gray-700", {
                hidden: !hint || isError,
                block: hint,
              })}
            >
              {hint}
            </p>
            <p
              className={cx("text-xs italic", "text-rose-600", {
                hidden: !isError,
                block: isError,
              })}
            >
              {error}
            </p>
          </div>
        </>
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
    isNew ? { mode: "edit" } : { mode: "view" },
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
  const isError = keywordError || linkError;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onClick={handleEdit}
        className={cx("group", "relative", "m-8")}
      >
        <div
          className={cx(
            "grid grid-cols-4 items-start gap-y-2 gap-x-1",
            "p-2 mb-2",
            "rounded bg-gray-50",
          )}
        >
          <label htmlFor="keyword" className="text-right">
            <span className="font-mono font-bold bg-gray-700 text-white px-1">
              go/
            </span>
          </label>
          <div className="col-span-3 ">
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
          </div>
          <label htmlFor="link" className="text-right">
            <span className="font-mono font-bold text-sm bg-gray-500 text-white px-1">
              redirects to:
            </span>
          </label>
          <div className="col-span-3">
            <Editable
              type="url"
              name="link"
              className="text-sm text-gray-500"
              mode={viewMode ? "view" : "edit"}
              placeholder="https://somewhere.url/with/a/really/long/path"
              value={link}
              hint={`Include %s anywhere in the link to expand text following ${
                keyword || "keyword"
              }/`}
              error={linkError}
              onChange={(ev) => setLink(ev.target.value)}
              autoComplete="off"
              spellCheck={false}
              required={true}
            />
          </div>
        </div>
        <div
          className={cx("flex-row-reverse justify-between", {
            hidden: viewMode,
            flex: !viewMode,
          })}
        >
          <Button
            type="submit"
            disabled={mode === "editing" || !changed || isError}
            className={cx()}
          >
            <SaveIcon className="mr-1 h-4 w-4" />
            <span>{isNew ? "Create" : "Update"}</span>
          </Button>
        </div>
        <span className="absolute -top-4 -right-4">
          <Button
            className={cx(
              "rounded-full w-8 h-8",
              "transition-all",
              "invisible opacity-0",
              "group-hover:visible group-hover:opacity-100",
              {
                "inline-flex": viewMode,
                hidden: !viewMode,
              },
            )}
            onClick={handleEdit}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            className={cx("rounded-full w-8 h-8", {
              "inline-flex": !viewMode,
              hidden: viewMode,
            })}
            onClick={handleCancel}
          >
            <CancelIcon className="w-4 h-4" />
          </Button>
        </span>
      </form>
    </>
  );
}
