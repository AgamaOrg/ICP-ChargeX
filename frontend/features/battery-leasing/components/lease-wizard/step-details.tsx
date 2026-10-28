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

export function StepDetails({ battery, draft, errors, onChange, onBlur }: StepDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="pickup-title" className="flex flex-col gap-2 rounded-md bg-surface-muted p-4">
        <h3 id="pickup-title" className="text-base font-semibold text-ink">
          Pick up at {battery.kioskName}
        </h3>
        <p className="text-sm text-ink-muted">{battery.location.label}</p>
        <ol className="list-decimal pl-5 text-sm text-ink">
          <li>Open the ChargeX app at the kiosk.</li>
          <li>Show your lease code on the screen.</li>
          <li>Take {battery.label} from the slot that lights up.</li>
        </ol>
      </section>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-base font-semibold text-ink">Who&apos;s picking it up?</legend>
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
          hint="Demo only. We won't contact you."
          value={draft.contactPhone}
          error={errors.contactPhone}
          onChange={(event) => onChange("contactPhone", event.target.value)}
          onBlur={() => onBlur("contactPhone")}
        />
      </fieldset>
    </div>
  );
}
