import { useState, useRef, useEffect } from "preact/hooks";
import { h } from "preact";
import "./textarea.css";

export type TextareaProps = {
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const Textarea = (props: TextareaProps) => {
  const {
    onChange,
    onSubmit,
    value,
    defaultValue = "",
    placeholder = "",
    className = "",
    disabled = false,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const isControlled = value !== undefined;

  // Update content when value prop changes (controlled mode)
  useEffect(() => {
    if (
      isControlled &&
      contentRef.current &&
      contentRef.current.textContent !== value
    ) {
      contentRef.current.textContent = value;
    }
  }, [value, isControlled]);

  // Set initial content (uncontrolled mode)
  useEffect(() => {
    if (
      !isControlled &&
      contentRef.current &&
      !contentRef.current.textContent
    ) {
      contentRef.current.textContent = defaultValue;
    }
  }, [defaultValue, isControlled]);

  const handleInput = () => {
    if (contentRef.current && onChange && !isComposingRef.current) {
      onChange(contentRef.current.textContent || "");
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    handleInput();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Check if Enter is pressed without Ctrl, Cmd, Shift, or Alt
    // and not during IME composition
    if (
      e.key === "Enter" &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey &&
      !isComposingRef.current &&
      onSubmit
    ) {
      e.preventDefault();
      const currentValue = contentRef.current?.textContent || "";
      onSubmit(currentValue);
    }
  };

  const displayValue = isControlled
    ? value
    : contentRef.current?.textContent || "";
  const showPlaceholder = !isFocused && !displayValue;

  return (
    <div className={`textarea-component textarea-container ${className}`}>
      {showPlaceholder && (
        <div className="textarea-placeholder">{placeholder}</div>
      )}
      <div
        ref={contentRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`textarea-editable ${disabled ? "textarea-disabled" : ""}`}
        // suppressContentEditableWarning
      />
    </div>
  );
};
