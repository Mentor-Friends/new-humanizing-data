import { getLocalStorageData } from "../../../services/helper.service";
import {
  Attendance,
  getDuration,
  getUserMonthlyAttendanceRows,
  searchUserAttendance,
} from "../attendance.helper";
import { updateAttendanceCalculations } from "../indivisual-attendance/indivisual-attendance.service";

export async function handleMonthlyDateChange(
  currentUserConceptId: number = 0
) {
  const profileStorageData: any = await getLocalStorageData();
  const userConceptId = profileStorageData?.userConcept;

  const monthlyTableBody = document.getElementById(
    "monthly-attendance"
  ) as HTMLTableElement;
  const yearSelect = document.getElementById(
    "filter-attendance-year"
  ) as HTMLSelectElement;
  const monthSelect = document.getElementById(
    "filter-attendance-month"
  ) as HTMLSelectElement;
  console.log("monthlyDateChange", `${yearSelect.value}-${monthSelect.value}`);

  const monthlyDate = `${yearSelect.value}-${
    parseInt(monthSelect.value) + 1 < 9 ? "0" : ""
  }${parseInt(monthSelect.value) + 1}`;
  const monthlyAttendanceList = await searchUserAttendance(
    currentUserConceptId ? currentUserConceptId : userConceptId,
    monthlyDate
  );
  console.log("list", monthlyAttendanceList, monthlyTableBody);

  // update
  if (currentUserConceptId)
    await updateAttendanceCalculations(monthlyAttendanceList);

  const attendanceListHTML = await getUserMonthlyAttendanceRows(
    monthlyAttendanceList,
    monthlyDate,
    currentUserConceptId ? true : false,
    currentUserConceptId
  );

  monthlyTableBody.innerHTML = attendanceListHTML;
}

/**
 * Method to show active running timer
 */
export async function tickTimer() {
  const timerEl = document?.getElementById("tick-timer");
  if (timerEl)
    setInterval(() => {
      timerEl.innerText = new Date().toLocaleString();
    }, 1000);
}

/**
 * Method to get the daily attendance table rows
 * @returns string
 */
export function getActiveAttendanceRows(attendanceList: Attendance[]) {
  if (attendanceList?.length == 0) {
    return `
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td scope="row" colspan="7" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">Haven't logged today</td>
      </tr>
    `;
  }
  console.log("att", attendanceList);

  let todayAttendanceRows = "";
  for (let i = 0; i < attendanceList?.length; i++) {
    const attendance = attendanceList[i];
    let workingTime = "";
    if (attendance?.checkin && attendance?.checkout) {
      const diffTime =
        new Date(attendance.checkout).getTime() -
        new Date(attendance.checkin).getTime();

      workingTime = getDuration(diffTime);
    }

    todayAttendanceRows += `
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${
          i + 1
        }</td>
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${new Date(attendance.checkin).toLocaleTimeString()}
        </td>
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${
              attendance?.checkout
                ? new Date(attendance.checkout).toLocaleTimeString()
                : ""
            }
        </td>
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${workingTime}
        </td>
      </tr>
      `;
  }

  return todayAttendanceRows;
}

/**
 * Method to enable and disable checkin buttons
 * @param attendanceList Attendance[]
 */
export function enableButtons(attendanceList: Attendance[]) {
  const checkInBtn = document.getElementById(
    "checkin-btn"
  ) as HTMLButtonElement;
  const checkOutBtn = document.getElementById(
    "checkout-btn"
  ) as HTMLButtonElement;

  if (attendanceList?.length == 0) {
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
    return;
  }
  // for absent case checkin and checkout value is ''
  let checkin = true;
  for (let i = 0; i < attendanceList.length; i++) {
    const attendance = attendanceList[i];
    if (!attendance.checkin && !attendance.checkout) {
      checkin = true;
      break;
    } else if (attendance.checkin && !attendance.checkout) {
      checkin = false;
      break;
    }
  }
  if (checkin) {
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
  } else {
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
  }
  return;
  if (
    attendanceList?.length == 0 ||
    (!attendanceList?.[0]?.checkin && !attendanceList?.[0]?.checkout) ||
    (attendanceList?.[0]?.checkin && attendanceList?.[0]?.checkout)
  ) {
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
  } else if (attendanceList?.[0]?.checkin && !attendanceList?.[0]?.checkout) {
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
  }
}
