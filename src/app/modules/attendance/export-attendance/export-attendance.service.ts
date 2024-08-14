import { exportAttendance } from "../../../pages/attendance/attendance.helper";

export function exportUserAttendance(e: any) {
  e.preventDefault();
  console.log(e);

  const formData = new FormData(e.target);
  const fromValues = Object.fromEntries(formData);

  console.log(fromValues, "values");

  let year = fromValues?.[`export-year`].toString();
  let unformatedMonth = parseInt(fromValues?.[`export-month`].toString());
  let month = ("0" + (new Date(`${year}-${unformatedMonth + 1}`).getMonth() + 1)).slice(-2);
  const date = `${year}-${month}`;
  const type: any = fromValues?.["export-format"].toString();

  if (fromValues?.["export-userConceptId"]) {
    const userConceptIds = fromValues["export-userConceptId"].toString().split(",");
    exportAttendance(date, type, userConceptIds);
  } else {
    exportAttendance(date, type);
  }
}
