"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { formatMoney, formatPercent } from "@/lib/format";
import type { FleetBattery, RentDuration, RentErrors, RentInput } from "../types";
import { RENT_FIELDS, validateRent } from "../validation";

type RentFormSheetProps = {
  open: boolean;
  onClose: () => void;
  readyBatteries: FleetBattery[];
  durations: RentDuration[];
  /** Pre-selects a battery when the form is opened from the battery list. */
  initialBatteryId: string | null;
  onSubmit: (input: RentInput) => void;
};

export function RentFormSheet({ open, onClose, ...formProps }: RentFormSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Rent out a battery">
      {/* The Sheet renders children only while open, so the form resets on every open. */}
      <RentForm {...formProps} />
    </Sheet>
  );
}

type RentFormProps = Omit<RentFormSheetProps, "open" | "onClose">;

const LOW_CHARGE = 20;

function RentForm({ readyBatteries, durations, initialBatteryId, onSubmit }: RentFormProps) {
  const [values, setValues] = useState<RentInput>({
    riderName: "",
    riderPhone: "",
    batteryId: initialBatteryId ?? "",
    durationId: "",
  });
  const [errors, setErrors] = useState<RentErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const battery = readyBatteries.find((b) => b.id === values.batteryId);
  const duration = durations.find((d) => d.id === values.durationId);
  const total = battery && duration ? battery.pricePerHourMinorUnits * duration.hours : null;

  function set<K extends keyof RentInput>(field: K, value: RentInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Clear a field's error as soon as it becomes valid.
    if (errors[field]) setErrors({ ...errors, [field]: validateRent(next)[field] });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRent(values);
    setErrors(nextErrors);
    const first = RENT_FIELDS.find((field) => nextErrors[field]);
    if (first) {
      const target = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      target?.focus();
      return;
    }
    onSubmit(values);
  }

  if (readyBatteries.length === 0) {
    return (
      <p className="text-base text-ink">
        No battery is ready right now. Mark a returned battery as back, then try again.
      </p>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextField
        label="Rider's name"
        name="riderName"
        autoComplete="off"
        value={values.riderName}
        error={errors.riderName}
        onChange={(event) => set("riderName", event.target.value)}
      />
      <TextField
        label="Mobile number"
        name="riderPhone"
        type="tel"
        inputMode="tel"
        autoComplete="off"
        placeholder="0917 123 4567"
        value={values.riderPhone}
        error={errors.riderPhone}
        onChange={(event) => set("riderPhone", event.target.value)}
      />

      <ChoiceGroup legend="Which battery?" error={errors.batteryId} errorId="battery-error">
        {readyBatteries.map((b) => (
          <Choice
            key={b.id}
            name="batteryId"
            checked={values.batteryId === b.id}
            onChange={() => set("batteryId", b.id)}
            title={b.label}
            detail={`${b.kioskName} · ${formatPercent(b.chargePercent)} charged${b.chargePercent <= LOW_CHARGE ? " · Low" : ""}`}
            warn={b.chargePercent <= LOW_CHARGE}
          />
        ))}
      </ChoiceGroup>

      <ChoiceGroup legend="How long?" error={errors.durationId} errorId="duration-error">
        {durations.map((d) => (
          <Choice
            key={d.id}
            name="durationId"
            checked={values.durationId === d.id}
            onChange={() => set("durationId", d.id)}
            title={d.label}
            detail={battery ? formatMoney(battery.pricePerHourMinorUnits * d.hours) : undefined}
          />
        ))}
      </ChoiceGroup>

      {total !== null && (
        <p className="flex justify-between rounded-lg border border-line p-4 text-xl font-semibold text-ink">
          <span>Cost</span>
          <span className="tabular-nums">{formatMoney(total)}</span>
        </p>
      )}

      {/* Demo: saving adds the rental to in-memory state only (no payment, no kiosk). */}
      <Button type="submit">Save rental</Button>
    </form>
  );
}

function ChoiceGroup({
  legend,
  error,
  errorId,
  children,
}: {
  legend: string;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <fieldset aria-describedby={error ? errorId : undefined} className="flex flex-col gap-2">
      <legend className="mb-2 text-base font-medium text-ink">{legend}</legend>
      {children}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Choice({
  name,
  checked,
  onChange,
  title,
  detail,
  warn = false,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  detail?: string;
  warn?: boolean;
}) {
  return (
    <label
      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${checked ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="size-6 shrink-0 accent-primary" />
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-lg font-medium text-ink">{title}</span>
        {detail && (
          <span className={`text-base ${warn ? "font-medium text-warning" : "text-ink-muted"}`}>{detail}</span>
        )}
      </span>
    </label>
  );
}
