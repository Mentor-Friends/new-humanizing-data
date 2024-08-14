import {
  GetTheConceptLocal,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
} from "mftsccs-browser";
import { getLocalStorageData } from "../../../services/helper.service";
import { searchUserAttendance } from "../../../pages/attendance/attendance.helper";
import { CreateConnectionBetweenEntityLocal } from "../../../services/entity.service";
import { createEntityInstance } from "../../../services/createEntityInstance.service";

let processingAttendance = false;

export async function handleAttendanceClick() {
  if (processingAttendance) return;
  processingAttendance = true;
  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const userConceptId = profileStorageData?.userConcept;

  const checkInBtn = document.getElementById(
    "checkin-btn"
  ) as HTMLButtonElement;
  const checkOutBtn = document.getElementById(
    "checkout-btn"
  ) as HTMLButtonElement;

  const userConcept = await GetTheConceptLocal(userConceptId);

  // check if the user have already logged in
  const attendanceList = await searchUserAttendance(
    userConceptId,
    new Date().toISOString().slice(0, 10)
  );
  const attendanceConcept = await haveActiveAttendance(attendanceList);
  console.log(attendanceConcept);
  console.log("attendanceList", attendanceConcept);

  if (attendanceConcept) {
    // checkout
    const checkoutConcept = await MakeTheInstanceConceptLocal(
      "checkout",
      new Date().toISOString(),
      false,
      userId,
      4
    );
    await CreateConnectionBetweenEntityLocal(
      attendanceConcept,
      checkoutConcept,
      "checkout"
    );
    // enable checkin
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
  } else {
    console.log("checkin");

    // checkin
    const attendanceEntityConcept = await createEntityInstance(
      "attendance",
      userId,
      {
        date: new Date().toISOString(),
        checkin: new Date().toISOString(),
        status: "Present",
      }
    );
    await CreateConnectionBetweenEntityLocal(
      userConcept,
      attendanceEntityConcept,
      "s_attendance"
    );

    // enable checkout
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
  }

  await LocalSyncData.SyncDataOnline();
  processingAttendance = false;
  // setTimeout(() => location.reload(), 500);
  location.reload()
}

async function haveActiveAttendance(attendanceList: any) {
  if (attendanceList?.length == 0) return;

  let checkin = true;
  let attendanceId = 0;
  let ids: any[] = [];
  for (let i = 0; i < attendanceList.length; i++) {
    const attendance = attendanceList[i];
    ids.push(attendance.id);
    if (!attendance.checkin && !attendance.checkout) {
      checkin = true;
      attendanceId = attendance.id;
    } else if (attendance.checkin && !attendance.checkout) {
      checkin = false;
      attendanceId = attendance.id;
    }
  }
  console.log(ids, "ids");
  if (!checkin) return await GetTheConceptLocal(attendanceId);
  return;
  if (attendanceList[0]?.checkin && !attendanceList[0]?.checkout)
    return await GetTheConceptLocal(attendanceList[0]?.id);
  return;
}
