"use client";

import { useReducer } from "react";
import type { DraftErrors, DraftField, DurationId, LeaseDraft, StartId, WizardStep } from "../types";

const PHONE_PATTERN = /^(\+63|0)9\d{9}$/;

type State = {
  step: WizardStep;
  draft: LeaseDraft;
  errors: DraftErrors;
};

type Action =
  | { type: "set-duration"; durationId: DurationId }
  | { type: "set-start"; startId: StartId }
  | { type: "set-contact"; field: "contactName" | "contactPhone"; value: string }
  | { type: "validate-field"; field: DraftField }
  | { type: "next" }
  | { type: "back" };

export function fieldError(draft: LeaseDraft, field: DraftField): string | undefined {
  switch (field) {
    case "durationId":
      return draft.durationId ? undefined : "Choose how long you need the battery.";
    case "contactName":
      return draft.contactName.trim().length >= 2 ? undefined : "Enter the name of the person picking up.";
    case "contactPhone":
      return PHONE_PATTERN.test(draft.contactPhone.replace(/[\s-]/g, ""))
        ? undefined
        : "Enter a mobile number like 0917 123 4567.";
  }
}

const STEP_FIELDS: Record<WizardStep, DraftField[]> = {
  0: ["durationId"],
  1: ["contactName", "contactPhone"],
  2: [],
};

export function isStepValid(draft: LeaseDraft, step: WizardStep) {
  return STEP_FIELDS[step].every((field) => !fieldError(draft, field));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set-duration":
      return { ...state, draft: { ...state.draft, durationId: action.durationId }, errors: { ...state.errors, durationId: undefined } };
    case "set-start":
      return { ...state, draft: { ...state.draft, startId: action.startId } };
    case "set-contact": {
      const draft = { ...state.draft, [action.field]: action.value };
      // Clear an existing error as soon as the value becomes valid.
      const errors = state.errors[action.field]
        ? { ...state.errors, [action.field]: fieldError(draft, action.field) }
        : state.errors;
      return { ...state, draft, errors };
    }
    case "validate-field":
      return { ...state, errors: { ...state.errors, [action.field]: fieldError(state.draft, action.field) } };
    case "next": {
      if (!isStepValid(state.draft, state.step)) {
        const errors = { ...state.errors };
        for (const field of STEP_FIELDS[state.step]) errors[field] = fieldError(state.draft, field);
        return { ...state, errors };
      }
      return state.step < 2 ? { ...state, step: (state.step + 1) as WizardStep } : state;
    }
    case "back":
      return state.step > 0 ? { ...state, step: (state.step - 1) as WizardStep } : state;
  }
}

/** One state object for the whole wizard, so going back never loses input. */
export function useLeaseDraft(batteryId: string) {
  const [state, dispatch] = useReducer(reducer, {
    step: 0,
    draft: { batteryId, durationId: null, startId: "now", contactName: "", contactPhone: "" },
    errors: {},
  });
  const isDirty = Boolean(state.draft.durationId || state.draft.contactName || state.draft.contactPhone);
  return { ...state, dispatch, isDirty };
}
