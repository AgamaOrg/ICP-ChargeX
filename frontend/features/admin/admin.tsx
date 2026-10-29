import { Suspense } from "react";
import { AdminWorkspace, AdminWorkspaceSkeleton } from "./components/admin-workspace";
import { mockAdminName, mockBranches, mockFleet, mockRentals, mockRentDurations } from "./data/mock";

// The rental admin's app: who has which battery, what is late, renting a
// battery out, and what is ready at each branch. The workspace reads search
// params, so it sits in a Suspense boundary whose fallback is its skeleton.
export default function Admin() {
  return (
    <Suspense fallback={<AdminWorkspaceSkeleton />}>
      <AdminWorkspace
        adminName={mockAdminName}
        initialRentals={mockRentals}
        fleet={mockFleet}
        branches={mockBranches}
        durations={mockRentDurations}
      />
    </Suspense>
  );
}
