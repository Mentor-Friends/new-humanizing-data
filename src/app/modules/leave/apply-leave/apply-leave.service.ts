import { GetTheConceptLocal, LocalSyncData } from "mftsccs-browser";
import { getLocalStorageData } from "../../../services/helper.service";
import { createEntityInstance } from "../../../services/createEntityInstance.service";
import { leaveStatus } from "../../../pages/leave/leave.helper";
import { CreateConnectionBetweenEntityLocal } from "../../../services/entity.service";
import { updateContent } from "../../../routes/renderRoute.service";

export async function applyLeaveSubmit(e: any) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formValues = Object.fromEntries(formData);

  console.log(formValues, "applu leave");
  // TODO:: validation
  // to date cannot be in the past
  const profileStorageData: any = await getLocalStorageData();
  const userConceptId = profileStorageData?.userConcept;
  const userId = profileStorageData?.userId;

  const userConcept = await GetTheConceptLocal(userConceptId);

  const leaveRequestConcept = await createEntityInstance(
    "leave_request",
    userId,
    {
      ...formValues,
      status: leaveStatus.Pending,
    }
  );
  console.log(leaveRequestConcept);

  await CreateConnectionBetweenEntityLocal(
    userConcept,
    leaveRequestConcept,
    "leave_request"
  );

  await LocalSyncData.SyncDataOnline();

  updateContent("/leave-requests");
}
