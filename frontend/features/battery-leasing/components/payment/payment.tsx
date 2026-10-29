"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { CheckoutOrder } from "../../hooks/use-checkout";
import type { PaymentMethod as PaymentMethodOption, PaymentState } from "../../types";
import { PaymentMethod } from "./payment-method";
import { PaymentResult } from "./payment-result";
import { PaymentSummary } from "./payment-summary";

type PaymentProps = {
  order: CheckoutOrder;
  methods: PaymentMethodOption[];
  state: PaymentState;
  onPay: (method: PaymentMethodOption) => void;
  onCancel: () => void;
  onReset: () => void;
  onBackToReview: () => void;
};

export function Payment({ order, methods, state, onPay, onCancel, onReset, onBackToReview }: PaymentProps) {
  const [methodId, setMethodId] = useState(methods[0]?.id ?? "");
  const methodGroup = useRef<HTMLFieldSetElement>(null);
  const method = methods.find((m) => m.id === methodId);
  const total = formatMoney(order.totalMinorUnits);

  if (state.status === "success") {
    return (
      <PaymentResult
        receipt={state.receipt}
        batteryLabel={order.battery.label}
        kioskName={order.battery.kioskName}
        durationLabel={order.duration.label}
      />
    );
  }

  const processing = state.status === "processing";

  return (
    <div className="flex flex-col gap-6">
      {/* Required by rules.md §4: never imply a real payment. */}
      <p className="rounded-md bg-info-soft p-3 text-base font-medium text-info">
        This is a demo. No money will be taken.
      </p>

      <PaymentSummary
        totalMinorUnits={order.totalMinorUnits}
        summary={`${order.duration.label} at ${order.battery.kioskName}`}
      />

      <PaymentMethod
        methods={methods}
        selectedId={methodId}
        disabled={processing}
        onSelect={setMethodId}
        groupRef={methodGroup}
      />

      {state.status === "failure" && (
        <div role="alert" className="flex flex-col gap-3 rounded-md bg-danger-soft p-3">
          <p className="flex gap-2 text-base text-danger">
            <span aria-hidden="true">⚠</span>
            {state.message}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => method && onPay(method)}>Retry payment</Button>
            <Button
              variant="secondary"
              onClick={() => {
                onReset();
                methodGroup.current?.focus();
              }}
            >
              Change method
            </Button>
          </div>
        </div>
      )}

      {state.status === "cancelled" ? (
        <div role="status" className="flex flex-col gap-3">
          <p className="text-base text-ink">Payment stopped. Your lease is not done yet.</p>
          <Button onClick={onReset}>Try again</Button>
          <Button variant="ghost" onClick={onBackToReview}>
            Go back
          </Button>
        </div>
      ) : (
        state.status !== "failure" && (
          <div className="flex flex-col gap-2">
            <Button loading={processing} disabled={!method} onClick={() => method && onPay(method)}>
              {processing ? "Paying…" : `Pay ${total}`}
            </Button>
            <Button variant="ghost" disabled={processing} onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )
      )}
    </div>
  );
}
