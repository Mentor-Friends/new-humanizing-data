import {
  LocalSyncData,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import { getLocalStorageData } from "../../../services/helper.service";
import { getCompanyConcept, getCompanyConceptL } from "../settings.service";
import { updateTypeConceptLocal } from "../../../services/UpdateTypeConcept";

export async function populateAttendanceForm() {
  const attendanceData = await getAttendanceSetting();
  console.log("datas", attendanceData);

  const paidLeave = document.getElementById("paidleave") as HTMLInputElement;
  const sickLeave = document.getElementById("sickleave") as HTMLInputElement;
  paidLeave.value = attendanceData.paidLeave.toString();
  sickLeave.value = attendanceData.sickLeave.toString();

  document
    .getElementById("attendance-setting-btn")
    ?.removeAttribute("disabled");
}

export async function saveAttendanceSetting(e: any) {
  e.preventDefault();

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  const formData = new FormData(e.target);
  const formValues = Object.fromEntries(formData);
  console.log(formValues, "form valies attedance setting");
  const companyConcept = await getCompanyConceptL();

  let workingdays = JSON.parse(JSON.stringify(formValues));
  delete workingdays.paidleave;
  delete workingdays.sickleave;
  console.log(formValues, workingdays, typeof workingdays, "yay");

  const data = await getAttendanceSetting();

  // working days
  for (let [key] of Object.entries(workingdays)) {
    // console.log(key, value);
    if (!data.workingDays?.includes(key)) {
      await updateTypeConceptLocal(
        userId,
        token,
        companyConcept,
        "s_workingday",
        "workingday",
        key
      );
    }
  }

  // paid leave
  await updateTypeConceptLocal(
    userId,
    token,
    companyConcept,
    "paidleave",
    "paidleave",
    formValues.paidleave.toString()
  );

  // sick leave
  await updateTypeConceptLocal(
    userId,
    token,
    companyConcept,
    "sickleave",
    "sickleave",
    formValues.sickleave.toString()
  );

  await LocalSyncData.SyncDataOnline();
}

export async function getAttendanceSetting() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;
  const companyConcept = await getCompanyConcept();
  console.log("company", companyConcept.id);

  const searchQuery = new SearchQuery();
  searchQuery.composition = companyConcept.id;
  searchQuery.fullLinkers = [
    "the_company_paidleave",
    "the_company_sickleave",
    "the_company_s_workingday",
  ];

  const response = await SearchLinkMultipleAll([searchQuery], token);
//   console.log(response, "response");
  return formatAttendanceSetting(response);

}

async function formatAttendanceSetting(company: any) {
  console.log(company, "datas safasddfas");
  let days =
    company?.data?.["the_company"]?.["the_company_s_workingday"]?.map(
      (day: any) => day?.data?.["the_workingday"]
    ) || [];
  return {
    paidLeave:
      company?.data?.["the_company"]?.["the_company_paidleave"]?.[0]?.data?.[
        "the_paidleave"
      ] || "",
    sickLeave:
      company?.data?.["the_company"]?.["the_company_paidleave"]?.[0]?.data?.[
        "the_paidleave"
      ] || "",
    // workingDays: ["sunday", "monday", "tuesday", "wednesday"],
    workingDays: days,
  };
}
