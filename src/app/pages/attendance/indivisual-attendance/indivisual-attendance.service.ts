import { GetTheConceptLocal, LocalSyncData } from "mftsccs-browser";
import { submitUpdateAttendance } from "../../../modules/attendance/edit/edit-attendance.service";
import { createEntityInstance } from "../../../services/createEntityInstance.service";
import { CreateConnectionBetweenEntityLocal } from "../../../services/entity.service";
import { getLocalStorageData } from "../../../services/helper.service";
import { openModal } from "../../listItem/listItem.service";
import {
  Attendance,
  getDuration,
  searchUserAttendance,
} from "../attendance.helper";

export async function showEditAttendanceModal(
  userConceptId: string = "",
  currentDate: string = ""
) {
  if (isNaN(parseInt(userConceptId))) return;

  const attendanceList = await searchUserAttendance(
    parseInt(userConceptId),
    currentDate
  );
  console.log("open Edit Attendance Modal clicked!", attendanceList);
  await openModal("edit-attendance-modal");

  if (attendanceList.length == 0) return;
  let form = "";

  const formDataContainer = document.getElementById(
    "edit-attendance-form-data"
  );
  const editAttendanceForm = document.getElementById(
    "editAttendanceForm"
  ) as HTMLFormElement;

  editAttendanceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitUpdateAttendance(e, attendanceList);
  });

  for (let i = 0; i < attendanceList.length; i++) {
    const attendance = attendanceList[i];

    form += `
        <div class="my-4">
            <label 
                for="checkin_${attendance.id}" 
                class="block text-sm font-medium leading-6 text-gray-900">
                Check In
                <span class="text-rose-400">*</span>
            </label>
            <div class="mt-2">
                <input 
                    type="datetime-local" 
                    name="checkin_${attendance.id}" 
                    id="checkin_${attendance.id}" 
                    value="${
                      attendance.checkin
                        ? formatedLocalDate(attendance.checkin)
                        : ""
                    }"
                    class="block w-full rounded-md border-0 px-3 py-2 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
        <div class="my-4">
            <label 
                for="checkout_${attendance.id}" 
                class="block text-sm font-medium leading-6 text-gray-900">
                Check Out
                <span class="text-rose-400">*</span>
            </label>
            <div class="mt-2">
                <input
                    type="datetime-local" 
                    name="checkout_${attendance.id}" 
                    id="checkout_${attendance.id}" 
                    value="${
                      attendance.checkout
                        ? formatedLocalDate(attendance.checkout)
                        : ""
                    }"
                    class="block w-full rounded-md border-0 px-3 py-2 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
        </div>
    `;
    if (i < attendanceList.length - 1) {
      form += `<div class="flex flex-row items-center justify-center gap-4"><hr class="w-8 border border-gray-400 dark:border-gray-600"><p>Break</p><hr class="w-8 border border-gray-400 dark:border-gray-600"></div>`;
    }
  }

  form += `
        <div class="my-4">
            <label for="remarks" class="block text-sm font-medium leading-6 text-gray-900">Remarks<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
                <textarea name="remarks" id="remarks" required
                class="block w-full rounded-md border-0 px-3 py-2 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
            </div>
        </div>
    `;
  if (formDataContainer) formDataContainer.innerHTML = form;
}

export function getCalculatedAttendance(monthlyAttendanceList: Attendance[]) {
  let datesWithWorkingHour: any = {};
  let abc = {
    presentDays: 0,
    absentDays: 0,
    totalWorkingTime: 0,
    weeklyWorkingTime: 0,
    highestDailyTime: 0,
  };

  monthlyAttendanceList.map((attendance) => {
    const date = attendance?.checkin?.slice(0, 10);

    // present and absent count
    if (attendance?.status == "Absent" && !datesWithWorkingHour[date]) {
      abc.absentDays += 1;
    } else if (attendance?.status == "Present" && !datesWithWorkingHour[date]) {
      abc.presentDays += 1;
    }

    if (attendance.checkin && !datesWithWorkingHour[date]) {
      datesWithWorkingHour[date] = 0;
    }

    if (attendance.checkin && attendance.checkout) {
      // daily working hours
      datesWithWorkingHour[date] +=
        new Date(attendance.checkout).getTime() -
        new Date(attendance.checkin).getTime();

      // monthly working hours
      abc.totalWorkingTime +=
        new Date(attendance.checkout).getTime() -
        new Date(attendance.checkin).getTime();
    }

    const currentDate = new Date();
    const currentWeekStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const currentWeekEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentWeekStart.getDate() + 6
    );

    // weekly working hour
    if (
      attendance.checkin &&
      attendance.checkout &&
      new Date(attendance.checkin) >= currentWeekStart &&
      new Date(attendance.checkin) <= currentWeekEnd
    ) {
      abc.weeklyWorkingTime +=
        new Date(attendance.checkout).getTime() -
          new Date(attendance.checkin).getTime() || 0;
    }
  });

  // highest daily working hour
  for (const key in datesWithWorkingHour) {
    if (Object.prototype.hasOwnProperty.call(datesWithWorkingHour, key)) {
      const workingHour = datesWithWorkingHour[key];
      if (workingHour > abc.highestDailyTime)
        abc.highestDailyTime = workingHour;
    }
  }

  return {
    ...abc,
    totalWorkingTime: getDuration(abc.totalWorkingTime),
    weeklyWorkingTime: getDuration(abc.weeklyWorkingTime),
    highestDailyTime: getDuration(abc.highestDailyTime),
  };
}

function formatedLocalDate(date: any) {
  const timestamp = new Date(date);
  timestamp.setMinutes(timestamp.getMinutes() - timestamp.getTimezoneOffset());
  return timestamp.toISOString().slice(0, 16);
}

export function updateAttendanceCalculations(attendanceList: Attendance[]) {
  const calculatedAttendance: any = getCalculatedAttendance(attendanceList);

  for (const [key, value] of Object.entries(calculatedAttendance)) {
    let element = document.getElementById(key);
    if (element) element.innerText = value as any;
  }
}

export async function markAsAbsent(
  userConceptId: string = "",
  currentDate: string = ""
) {
  if (isNaN(parseInt(userConceptId))) return;

  const attendanceList = await searchUserAttendance(
    parseInt(userConceptId),
    currentDate
  );
  console.log("att list absent", attendanceList);
  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const currentUserConceptId = profileStorageData?.userConcept;
  console.log(userConceptId, currentUserConceptId);
  if (attendanceList.length == 0) {
    // create new Attendance Concept and mark it as absent
    const attendanceEntityConcept = await createEntityInstance(
      "attendance",
      userId,
      {
        date: new Date(currentDate).toISOString(),
        status: "Absent",
      }
    );
    console.log(attendanceEntityConcept, "acon concept");
    await CreateConnectionBetweenEntityLocal(
      await GetTheConceptLocal(parseInt(userConceptId)),
      attendanceEntityConcept,
      "s_attendance"
    );
    await LocalSyncData.SyncDataOnline();
    setTimeout(() => location.reload(), 500);
  }
}

// function getWeeklyDates(current) {
//   var week= new Array();
//   // Starting Monday not Sunday
//   current.setDate((current.getDate() - current.getDay() ));
//   for (var i = 0; i < 7; i++) {
//       week.push(
//           new Date(current)
//       );
//       current.setDate(current.getDate() +1);
//   }
//   return week;
// }
