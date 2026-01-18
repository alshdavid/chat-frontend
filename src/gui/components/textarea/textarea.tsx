import "./textarea.css";
import { useRef, useEffect } from "preact/hooks";
import { h } from "preact";

export type TextareaProps = {
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const Textarea = ({
  onChange,
  value,
  defaultValue,
  placeholder,
  className = "",
  disabled = false,
}: TextareaProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerText = value ?? defaultValue ?? "";
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
    const text = e.currentTarget.innerText;
    if (onChange) {
      onChange(text);
    }
  };

  const handleBlur = () => {
    isFocused.current = false;
  };

  const handleFocus = () => {
    isFocused.current = true;
  };

  return (
    <div
      ref={editorRef}
      contentEditable={!disabled}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`textarea-component ${disabled ? "disabled" : ""} ${className}`}
      role="textbox"
      aria-multiline="true"
      data-placeholder={placeholder}
    />
  );
};
