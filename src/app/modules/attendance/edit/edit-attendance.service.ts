import {
  GetTheConceptLocal,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
} from "mftsccs-browser";
import { Attendance } from "../../../pages/attendance/attendance.helper";
import { getLocalStorageData } from "../../../services/helper.service";
import { CreateConnectionBetweenEntityLocal } from "../../../services/entity.service";
import { updateTypeConceptLocal } from "../../../services/UpdateTypeConcept";

export async function submitUpdateAttendance(
  e: any,
  attendanceList: Attendance[]
) {
  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  console.log("herer 2", e.target, attendanceList);
  const data = new FormData(e.target);

  const formValues = Object.fromEntries(data.entries());
  console.log("formValues", formValues, formValues?.["checkin_101202150"]);

  for (let i = 0; i < attendanceList.length; i++) {
    const attendance = attendanceList[i];
    const attendanceConcept = await GetTheConceptLocal(attendance.id);

    for (const key in formValues) {
      if (Object.prototype.hasOwnProperty.call(formValues, key)) {
        const value = formValues[key];
        if (!value) continue;
        const splitedText = key.split("_");

        if (splitedText[0] == "checkin" && splitedText[1] == attendance.id) {
          console.log(value, attendance, "checkin");
          if (!attendance.checkin) {
            const checkoutConcept = await MakeTheInstanceConceptLocal(
              "checkin",
              new Date(value.toString()).toISOString(),
              false,
              userId,
              4
            );
            await CreateConnectionBetweenEntityLocal(
              attendanceConcept,
              checkoutConcept,
              "checkin"
            );
          } else if (
            attendance.checkout && 
            new Date(attendance.checkout).toISOString().slice(0, 16) !=
            new Date(value.toString()).toISOString()
          ) {
            // update attendance
            // new Date(new Date(value.toString()).toISOString().slice(0, 16)+ attendance.checkin.slice(16, 24)).toISOString()
            await updateTypeConceptLocal(
              userId,
              token,
              attendanceConcept,
              "checkin",
              "checkin",
              new Date(value.toString()).toISOString()
            );
          }
        } else if (
          splitedText[0] == "checkout" &&
          splitedText[1] == attendance.id
        ) {
          console.log(value, attendance, "checkout");
          if (attendance.checkout == undefined) {
            const checkoutConcept = await MakeTheInstanceConceptLocal(
              "checkout",
              new Date(value.toString()).toISOString(),
              false,
              userId,
              4
            );
            await CreateConnectionBetweenEntityLocal(
              attendanceConcept,
              checkoutConcept,
              "checkout"
            );
          } else if (
            new Date(attendance.checkout)?.toISOString()?.slice(0, 16) !=
            new Date(value.toString()).toISOString()
          ) {
            await updateTypeConceptLocal(
              userId,
              token,
              attendanceConcept,
              "checkout",
              "checkout",
              new Date(value.toString()).toISOString()
            );
          }
        } else if (splitedText[0] == "remarks") {
          const attendanceWithRemarks = attendanceList.find(
            (attendance) => attendance.remarks
          );
          if (!attendanceWithRemarks) {
            const checkoutConcept = await MakeTheInstanceConceptLocal(
              "remarks",
              value.toString(),
              false,
              userId,
              4
            );
            await CreateConnectionBetweenEntityLocal(
              attendanceConcept,
              checkoutConcept,
              "remarks"
            );
          } else if (attendanceWithRemarks.remarks != value) {
            await updateTypeConceptLocal(
              userId,
              token,
              attendanceConcept,
              "remarks",
              "remarks",
              value.toString()
            );
          }
        }
      }
    }
  }
  await LocalSyncData.SyncDataOnline();
  setTimeout(() => location.reload(), 500)
}
