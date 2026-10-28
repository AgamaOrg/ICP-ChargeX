import type { Ref } from "react";
import type { PaymentMethod as PaymentMethodOption } from "../../types";

type PaymentMethodProps = {
  methods: PaymentMethodOption[];
  selectedId: string;
  disabled: boolean;
  onSelect: (id: string) => void;
  /** Lets the parent move focus here for "Change method". */
  groupRef?: Ref<HTMLFieldSetElement>;
};

export function PaymentMethod({ methods, selectedId, disabled, onSelect, groupRef }: PaymentMethodProps) {
  return (
    <fieldset ref={groupRef} tabIndex={-1} disabled={disabled} className="flex flex-col gap-2 focus:outline-none">
      <legend className="mb-2 text-base font-semibold text-ink">Pay with</legend>
      {methods.map((method) => {
        const checked = method.id === selectedId;
        return (
          <label
            key={method.id}
            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 has-disabled:cursor-not-allowed has-disabled:opacity-60 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${checked ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={checked}
              onChange={() => onSelect(method.id)}
              className="size-5 accent-primary"
            />
            <span className="flex flex-1 flex-col">
              <span className="text-base text-ink">{method.label}</span>
              <span className="text-xs text-ink-muted">{method.detail}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
