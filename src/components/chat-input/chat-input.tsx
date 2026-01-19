import "./chat-input.css";
import { h, type HTMLAttributes } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import { ContentEditable } from "../content-editable/content-editable.tsx";
import { Button } from "../button/button.tsx";
import { Icon } from "../icon/icon.tsx";

export type ChatInputProps = HTMLAttributes<HTMLDivElement> & {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onSubmit?: () => void;
  onInput?: (e: InputEvent) => void;
  onChange?: (e: Event) => void;
  onBlur?: (e: FocusEvent) => void;
};

export function ChatInput({
  onSubmit,
  className,
  placeholder,
  onInput,
  onChange,
  onBlur,
  disabled,
  value,
  ...props
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className={classNames("component-chat-input", className)} {...props}>
      <ContentEditable
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onInput={onInput}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />
      <div className="controls">
        <div>
          <Button>
            <Icon icon="plus" height="20px" />
          </Button>
        </div>
        <Button onClick={() => onSubmit?.()}>
          <Icon icon="send" height="20px" />
        </Button>
      </div>
    </div>
  );
}
