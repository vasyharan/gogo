import cx from "classnames";

type Mode = "primary" | "warn" | "default";
type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  mode?: Mode;
};

function calcMode(props: ButtonProps): Mode {
  const { mode, type = "button" } = props;
  if (mode) return mode;
  if (type === "submit") return "primary";
  return "default";
}
export function Button(props: ButtonProps) {
  const { type = "button", className, disabled, children, ...rest } = props;
  const mode = calcMode(props);
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(className, "button", mode)}
      {...rest}
    >
      {children}
    </button>
  );
}
