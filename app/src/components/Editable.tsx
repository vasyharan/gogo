import cx from "classnames";
import { assertNever } from "../assert";

type HTMLInputElementDetailedProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
type EditableProps = HTMLInputElementDetailedProps & {
  mode: "view" | "edit";
  error?: string;
  hint?: string;
};

export function Editable(props: EditableProps) {
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
            <span
              className={cx("text-xs italic", "text-gray-700", {
                hidden: !hint || isError,
                block: hint,
              })}
            >
              {hint}
            </span>
            <span
              className={cx("text-xs italic", "text-rose-600", {
                hidden: !isError,
                block: isError,
              })}
            >
              {error}
            </span>
          </div>
        </>
      );
    default:
      assertNever(mode);
  }
}

