"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import type { Battery } from "@/lib/types/battery";
import { usePayment, useReservation } from "../../hooks/use-checkout";
import { isStepValid, useLeaseDraft } from "../../hooks/use-lease-draft";
import type { DurationOption, PaymentMethod, StartOption } from "../../types";
import { Payment } from "../payment/payment";
import { StepDetails } from "./step-details";
import { StepDuration } from "./step-duration";
import { StepReview } from "./step-review";

const STEPS = ["How long", "Pick up", "Check"];
const STEP_TITLES = ["How long?", "Where to pick up", "Check your lease"];

type LeaseWizardProps = {
  batteries: Battery[];
  durationOptions: DurationOption[];
  startOptions: StartOption[];
  paymentMethods: PaymentMethod[];
};

/**
 * The battery comes from `?battery=` so the wizard survives a refresh, but
 * the draft itself is in memory: refreshing restarts at step 1.
 */
export function LeaseWizard({ batteries, ...options }: LeaseWizardProps) {
  const batteryId = useSearchParams().get("battery");
  const battery = batteries.find((b) => b.id === batteryId);

  if (!battery) {
    return (
      <WizardBlocked
        title="Choose a battery first"
        description="We couldn't find the battery for this lease. Pick one from the list to start."
      />
    );
  }
  if (battery.availability !== "available") {
    return (
      <WizardBlocked
        title={`${battery.label} can't be leased right now`}
        description={
          battery.availability === "leased"
            ? "Someone else is using it. Choose another battery nearby."
            : "It's being checked by our team. Choose another battery nearby."
        }
      />
    );
  }
  return <WizardFlow key={battery.id} battery={battery} {...options} />;
}

function WizardBlocked({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-4">
      <EmptyState
        title={title}
        description={description}
        action={
          <Link
            href="/batteries"
            className="inline-flex h-12 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Find a battery
          </Link>
        }
      />
    </div>
  );
}

type WizardFlowProps = Omit<LeaseWizardProps, "batteries"> & { battery: Battery };

function WizardFlow({ battery, durationOptions, startOptions, paymentMethods }: WizardFlowProps) {
  const router = useRouter();
  const { step, draft, errors, dispatch, isDirty } = useLeaseDraft(battery.id);
  const reservation = useReservation();
  const payment = usePayment();
  const [phase, setPhase] = useState<"wizard" | "payment">("wizard");
  const [confirmLeave, setConfirmLeave] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const duration = durationOptions.find((d) => d.id === draft.durationId);
  const start = startOptions.find((s) => s.id === draft.startId) ?? startOptions[0];
  const totalMinorUnits = duration ? battery.pricePerHourMinorUnits * duration.hours : 0;
  const paid = payment.state.status === "success";
  const guardLeave = isDirty && !paid;

  // Warn before a reload or tab close would throw the draft away.
  useEffect(() => {
    if (!guardLeave) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [guardLeave]);

  // Move focus to the new step's heading so screen readers hear the change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, phase, paid]);

  function requestLeave() {
    if (guardLeave) setConfirmLeave(true);
    else router.push("/batteries");
  }

  async function continueToPayment() {
    if (await reservation.reserve()) setPhase("payment");
  }

  const title = phase === "payment" ? (paid ? "Lease confirmed" : "Payment") : STEP_TITLES[step];

  return (
    <div className="flex flex-col gap-5 px-4 pb-6">
      {phase === "wizard" && <Stepper steps={STEPS} current={step} />}

      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-ink focus:outline-none">
            {title}
          </h2>
          <p className="truncate text-base text-ink-muted">{battery.kioskName}</p>
        </div>
        {!paid && (
          <Button variant="ghost" onClick={requestLeave}>
            Cancel
          </Button>
        )}
      </div>

      {phase === "payment" && duration ? (
        <Payment
          order={{ battery, duration, start, totalMinorUnits }}
          methods={paymentMethods}
          state={payment.state}
          onPay={(method) => payment.pay({ battery, duration, start, totalMinorUnits }, method)}
          onCancel={payment.cancel}
          onReset={payment.reset}
          onBackToReview={() => {
            payment.reset();
            setPhase("wizard");
          }}
        />
      ) : (
        <>
          {step === 0 && (
            <StepDuration
              pricePerHourMinorUnits={battery.pricePerHourMinorUnits}
              durationOptions={durationOptions}
              durationId={draft.durationId}
              error={errors.durationId}
              onDuration={(durationId) => dispatch({ type: "set-duration", durationId })}
            />
          )}
          {step === 1 && (
            <StepDetails
              battery={battery}
              draft={draft}
              errors={errors}
              onChange={(field, value) => dispatch({ type: "set-contact", field, value })}
              onBlur={(field) => dispatch({ type: "validate-field", field })}
            />
          )}
          {step === 2 && duration && (
            <StepReview
              battery={battery}
              draft={draft}
              duration={duration}
              start={start}
              totalMinorUnits={totalMinorUnits}
            />
          )}

          {reservation.state.status === "error" && (
            <p role="alert" className="flex gap-2 rounded-md bg-danger-soft p-3 text-sm text-danger">
              <span aria-hidden="true">⚠</span>
              {reservation.state.message}
            </p>
          )}

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="secondary" className="h-12 flex-1" onClick={() => dispatch({ type: "back" })}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button
                className="flex-[2]"
                disabled={!isStepValid(draft, step)}
                onClick={() => dispatch({ type: "next" })}
              >
                Next
              </Button>
            ) : (
              <Button
                className="flex-[2]"
                loading={reservation.state.status === "submitting"}
                onClick={continueToPayment}
              >
                {reservation.state.status === "error" ? "Try again" : "Go to payment"}
              </Button>
            )}
          </div>
        </>
      )}

      <Sheet
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        title="Leave this lease?"
        footer={
          <>
            <Button variant="danger" onClick={() => router.push("/batteries")}>
              Leave and discard
            </Button>
            <Button variant="secondary" onClick={() => setConfirmLeave(false)}>
              Keep going
            </Button>
          </>
        }
      >
        <p className="text-base text-ink">The choices you made for {battery.label} will be lost.</p>
      </Sheet>
    </div>
  );
}
