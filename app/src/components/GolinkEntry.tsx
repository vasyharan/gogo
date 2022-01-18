import cx from "classnames";
import { useState } from "react";
import { ApiResponse } from "../api";
import { Golink, NewGolink } from "../models";
import { Button } from "./Button";
import { Editable } from "./Editable";
import { CancelIcon, EditIcon, SaveIcon } from "./Icons";

export type Mode = "view" | "edit";

function isValidURL(s: string): boolean {
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type CreateGolinkProps = {
  golink: NewGolink;
  errors: GolinkEntryErrors;
  changed: boolean;
  onSubmit: (golink: NewGolink) => Promise<ApiResponse<Golink>>;
  onChange: <K extends keyof NewGolink = keyof NewGolink>(
    field: K,
    value: NewGolink[K],
  ) => void;
  onToggleEdit: (enabled: boolean) => void;
};
export function CreateGolink({
  golink,
  errors,
  changed,
  onSubmit,
  onChange,
  onToggleEdit,
}: CreateGolinkProps) {
  return (
    <GolinkEntry
      golink={golink}
      errors={errors}
      changed={changed}
      mode="edit"
      onChange={onChange}
      onSubmit={onSubmit}
      onToggleEdit={onToggleEdit}
    />
  );
}

type EditGolinkProps = {
  golink: Golink;
  mode: Mode;
  changed: boolean;
  errors: GolinkEntryErrors;
  onSubmit: (golink: Golink) => Promise<ApiResponse<Golink>>;
  onChange: <K extends keyof NewGolink = keyof NewGolink>(
    field: K,
    value: NewGolink[K],
  ) => void;
  onToggleEdit: (enabled: boolean) => void;
};
export function EditGolink({
  golink,
  errors,
  mode,
  changed,
  onSubmit,
  onChange,
  onToggleEdit,
}: EditGolinkProps) {
  return (
    <GolinkEntry
      golink={golink}
      errors={errors}
      mode={mode}
      changed={changed}
      onChange={onChange}
      onSubmit={onSubmit}
      onToggleEdit={onToggleEdit}
    />
  );
}

export type GolinkEntryErrors = {
  keyword: string;
  link: string;
};
type GolinkEntryProps<T extends NewGolink | Golink> = {
  golink: T;
  mode: Mode;
  changed: boolean;
  errors: GolinkEntryErrors;
  onSubmit: (golink: T) => Promise<ApiResponse<Golink>>;
  onChange: <K extends keyof NewGolink = keyof NewGolink>(
    field: K,
    value: NewGolink[K],
  ) => void;
  onToggleEdit: (enabled: boolean) => void;
};

function GolinkEntry<T extends NewGolink | Golink>(props: GolinkEntryProps<T>) {
  const { golink, mode } = props;
  const isNew = !("id" in golink);

  const [submitting, setSubmitting] = useState(false);

  function handleEdit(ev) {
    console.log("handleEdit");
    ev.stopPropagation();
    props.onToggleEdit(true);
  }

  async function handleSubmit(ev) {
    console.log("handleSubmit");
    ev.preventDefault();

    setSubmitting(true);
    await props.onSubmit({ ...golink });
    setSubmitting(false);
  }

  function handleCancel(ev) {
    console.log("handleCancel");
    ev.stopPropagation();
    props.onToggleEdit(false);
  }

  const viewMode = mode === "view";

  let { keyword: keywordError, link: linkError } = props.errors;
  if (mode === "edit") {
    if (keywordError === "") {
      if (golink.keyword === "") {
        keywordError = "A keyword is required.";
      } else if (/^[a-z0-9\-_]+$/.test(golink.keyword) === false) {
        keywordError =
          "Only lowercase alpha, numbers, -, and _ characters are allowed.";
      }
    }

    if (linkError === "") {
      if (!isValidURL(golink.link)) {
        linkError = "A link is must be valid HTTP/HTTPS URL.";
      }
    }
  }
  const isError = !!keywordError || !!linkError;

  return (
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
          {
            "opacity-80": viewMode && !isNew && !golink.active,
          },
        )}
      >
        <label htmlFor="keyword" className="text-right">
          <span className="font-mono font-medium bg-gray-700 text-white p-1">
            go/
          </span>
        </label>
        <div className="col-span-3 ">
          <Editable
            type="text"
            id="keyword"
            name="keyword"
            className="text-gray-700"
            mode={viewMode ? "view" : "edit"}
            placeholder="keyword"
            value={golink.keyword}
            error={keywordError}
            onChange={(ev) => props.onChange("keyword", ev.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoFocus={true}
            required={true}
          />
        </div>
        <label htmlFor="link" className="text-right">
          <span
            className={cx(
              "font-mono font-medium text-sm bg-gray-500 text-white p-1",
              {
                "line-through": viewMode && !isNew && !golink.active,
              },
            )}
          >
            redirects to:
          </span>
        </label>
        <div className="col-span-3">
          <Editable
            type="url"
            id="link"
            name="link"
            className="text-sm text-gray-500"
            mode={viewMode ? "view" : "edit"}
            placeholder="https://somewhere.url/with/a/really/long/path"
            value={golink.link}
            hint={`Include %s anywhere in the link to expand text following ${
              golink.keyword || "keyword"
            }/`}
            error={linkError}
            onChange={(ev) => props.onChange("link", ev.target.value)}
            autoComplete="off"
            spellCheck={false}
            required={true}
          />
        </div>
        <label
          htmlFor="active"
          className={cx("text-right", { hidden: viewMode || isNew })}
        >
          <span className="font-mono font-bold text-sm bg-gray-500 text-white px-1">
            enabled:
          </span>
        </label>
        <div className={cx("col-span-3", { hidden: viewMode || isNew })}>
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={isNew ? true : golink.active}
            onClick={(ev) => ev.stopPropagation()}
            onChange={(ev) => props.onChange("active", ev.target.checked)}
            className={cx(
              "appearance-none",
              "rounded-sm",
              "shadow",
              "transform-gpu transition-all duration-1500",
              "text-gray-700",
              "border-gray-500",
              "focus:ring-gray-400",
              "focus:ring-1",
              "focus:ring-offset-0",
              "focus:border-gray-400",
            )}
          />
        </div>
      </div>
      <div
        className={cx("flex-row-reverse", {
          hidden: viewMode,
          flex: !viewMode,
        })}
      >
        <Button
          type="submit"
          disabled={submitting || isError || !props.changed}
          className={cx()}
        >
          <SaveIcon className="mr-1 h-4 w-4" />
          <span>{isNew ? "Create" : "Update"}</span>
        </Button>
      </div>
      <span className="absolute -top-4 -left-4">
        <span
          className={cx(
            "text-xs text-white italic rounded-full mr-2 px-2 py-1 bg-gray-500",
            {
              hidden: isNew || !viewMode || golink.active,
            },
          )}
        >
          disabled
        </span>
      </span>
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
  );
}
