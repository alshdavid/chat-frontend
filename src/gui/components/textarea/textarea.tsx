import "./textarea.css";
import { useRef, useEffect } from "preact/hooks";
import { h, type HTMLAttributes } from "preact";

type StrippedDiv = Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

export type TextareaProps = StrippedDiv & {
  onChange?: (value: string) => void;
  onSubmit?: (e: Event) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  focusOnInit?: boolean;
};

export const Textarea = ({
  onChange,
  onSubmit,
  value,
  defaultValue,
  placeholder,
  className = "",
  disabled = false,
  focusOnInit,
}: TextareaProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerText = value ?? defaultValue ?? "";
    if (focusOnInit) {
      editorRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (
      editorRef.current &&
      value !== undefined &&
      value !== editorRef.current.innerText &&
      !isFocused.current
    ) {
      editorRef.current.innerText = value;
    }
  }, [value]);

  const handleInput = (e: any) => {
    onChange?.(e.currentTarget.innerText);
  };

  const handleBlur = () => {
    isFocused.current = false;
  };

  const handleFocus = () => {
    isFocused.current = true;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      isFocused.current = false;
      onSubmit?.(e);
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable={!disabled}
      onInput={handleInput}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`textarea-component ${disabled ? "disabled" : ""} ${className}`}
      role="textbox"
      aria-multiline="true"
      data-placeholder={placeholder}
    />
  );
};
