export class FormField extends EventTarget {
  #value: string;

  get value(): string {
    return this.#value;
  }

  set value(update: string) {
    if (this.#value === update) {
      return;
    }
    this.#value = update;
    this.dispatchEvent(new CustomEvent("change"));
  }

  asProps() {
    return { onInput: this.fromEvent, value: this.#value };
  }

  fromEvent = (event: Event) => {
    this.fromValue(
      // @ts-expect-error
      event?.target?.value,
    );
  };

  fromValue = (value?: string) => {
    if (!value) return;
    this.value = value;
  };

  constructor(initialValue: string = "") {
    super();
    this.#value = initialValue;
  }
}
