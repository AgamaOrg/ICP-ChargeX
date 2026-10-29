type StepperProps = {
  steps: string[];
  current: number;
};

export function Stepper({ steps, current }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <p className="sr-only">
        Step {current + 1} of {steps.length}: {steps[current]}
      </p>
      <ol className="flex items-center gap-2" aria-hidden="true">
        {steps.map((step, index) => {
          const state = index < current ? "done" : index === current ? "current" : "todo";
          return (
            <li key={step} className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className={`h-1 rounded-full ${state === "todo" ? "bg-surface-muted" : "bg-primary"}`}
              />
              <span
                className={`truncate text-sm ${state === "current" ? "font-semibold text-ink" : "text-ink-muted"}`}
              >
                {state === "done" ? "✓ " : `${index + 1} `}
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
