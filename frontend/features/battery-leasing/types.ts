export type DurationId = "1h" | "1d" | "1w";

export type DurationOption = {
  id: DurationId;
  label: string;
  hours: number;
};

export type StartId = "now" | "in-1h" | "in-3h";

export type StartOption = {
  id: StartId;
  label: string;
  offsetHours: number;
};

export type LeaseDraft = {
  batteryId: string;
  durationId: DurationId | null;
  startId: StartId;
  contactName: string;
  contactPhone: string;
};

export type DraftField = "durationId" | "contactName" | "contactPhone";

export type DraftErrors = Partial<Record<DraftField, string>>;

export type WizardStep = 0 | 1 | 2;

export type PaymentMethod = {
  id: string;
  label: string;
  detail: string;
};

export type Receipt = {
  reference: string;
  paidAt: string;
  leaseId: string;
  totalMinorUnits: number;
  methodLabel: string;
};

export type PaymentState =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "success"; receipt: Receipt }
  | { status: "failure"; message: string }
  | { status: "cancelled" };

export type LeaseTab = "current" | "past";

export type LeaseAction = "extend" | "return" | "report";

export type FinderView = "list" | "map";

export type LocationPermission = "idle" | "requesting" | "granted" | "denied";

export type SimulatedResult<T> = { ok: true; value: T } | { ok: false; message: string };
