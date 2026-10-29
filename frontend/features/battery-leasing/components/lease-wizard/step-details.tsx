import { TextField } from "@/components/ui/text-field";
import type { Battery } from "@/lib/types/battery";
import type { DraftErrors, LeaseDraft } from "../../types";

type StepDetailsProps = {
  battery: Battery;
  draft: LeaseDraft;
  errors: DraftErrors;
  onChange: (field: "contactName" | "contactPhone", value: string) => void;
  onBlur: (field: "contactName" | "contactPhone") => void;
};

// The contact fields are demo-only: nothing is sent or stored.
export function StepDetails({ battery, draft, errors, onChange, onBlur }: StepDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="pickup-title" className="flex flex-col gap-2 rounded-lg bg-surface p-4 shadow-card">
        <h3 id="pickup-title" className="text-lg font-semibold text-ink">
          {battery.kioskName}
        </h3>
        <p className="text-base text-ink-muted">{battery.location.label}</p>
        <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-base text-ink">
          <li>Go to the kiosk.</li>
          <li>Show your lease on this phone.</li>
          <li>Take the battery from the slot that lights up.</li>
        </ol>
      </section>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-lg font-semibold text-ink">Your name and number</legend>
        <TextField
          label="Name"
          name="contactName"
          autoComplete="name"
          value={draft.contactName}
          error={errors.contactName}
          onChange={(event) => onChange("contactName", event.target.value)}
          onBlur={() => onBlur("contactName")}
        />
        <TextField
          label="Mobile number"
          name="contactPhone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={draft.contactPhone}
          error={errors.contactPhone}
          onChange={(event) => onChange("contactPhone", event.target.value)}
          onBlur={() => onBlur("contactPhone")}
        />
      </fieldset>
    </div>
  );
}
