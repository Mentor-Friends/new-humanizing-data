import {
  FilterSearch,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import { MONTHS } from "../../constants/time.constants";
import { getLocalStorageData } from "../../services/helper.service";
import { getCompanyEmployee } from "./employees-attendance/employees-attendance.service";

export type Attendance = {
  id: any;
  checkin: any;
  checkout?: any;
  date: any;
  status: any;
  createdAt?: any;
  remarks?: any;
};

export function generateYearOptions() {
  let yearOptions = "";
  let currentYear = 2024;
  do {
    yearOptions += `
          <option value="${currentYear}" ${
      currentYear == new Date().getFullYear() && "selected"
    }>
        ${currentYear}
        </option>`;
    currentYear += 1;
  } while (currentYear <= new Date().getFullYear());

  return yearOptions;
}

export function generateMonthOptions() {
  let monthOptions = "";
  for (let i = 0; i < MONTHS.length; i++) {
    const month = MONTHS[i];
    monthOptions += `
        <option value="${i <= 9 ? `0${i}` : i}" ${
      i == new Date().getMonth() && "selected"
    }>
        ${month}
        </option>
        `;
  }
  return monthOptions;
}

export function getDuration(timeMs: number) {
  const days = Math.floor(timeMs / (60 * 60 * 24 * 1000));
  const hours = Math.floor(timeMs / (60 * 60 * 1000)) - days * 24;
  const minutes =
    Math.floor(timeMs / (60 * 1000)) - (days * 24 * 60 + hours * 60);
  const seconds =
    Math.floor(timeMs / 1000) -
    (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
  let timeFormat = "";
  if (hours) timeFormat += `${hours}h `;
  if (minutes) timeFormat += `${minutes}m `;
  if (seconds) timeFormat += `${seconds}s `;

  return timeFormat;
}

export function getDateInMonth(year: number, month: number) {
  let date = new Date(year, month - 1, 1);
  let dates = [];

  while (date.getMonth() === month - 1) {
    if (
      date.getTime() >
      new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 1
    )
      break;
    if (date) dates.push(formatDate(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

/**
 * Method to search the user attendance
 * @param compositionId string
 * @param searchDate string
 * @returns Promise<Attendance[]>
 */
export async function searchUserAttendance(
  compositionId: number,
  searchDate: string
) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const dateFilter = new FilterSearch();
  dateFilter.type = "date";
  dateFilter.logicoperator = "like";
  dateFilter.search = `%${searchDate}%`;
  dateFilter.composition = false;

  // const absentFilter = new FilterSearch();
  // absentFilter.type = "status";
  // absentFilter.logicoperator = "=";
  // absentFilter.search = `Absent`;
  // absentFilter.composition = false;

  // const checkOutFilter = new FilterSearch();
  // checkOutFilter.type = "checkout";
  // checkOutFilter.logicoperator = "=";
  // checkOutFilter.search = `%${searchDate}%`;
  // checkOutFilter.composition = false;

  const searchQuery = new SearchQuery();
  searchQuery.composition = compositionId;
  searchQuery.fullLinkers = ["the_user_s_attendance"];
  searchQuery.page = 1;
  searchQuery.inpage = 100;
  searchQuery.doFilter = true;

  const attendanceQuery = new SearchQuery();
  attendanceQuery.logic = "or";
  attendanceQuery.selectors = [
    "the_attendance_date",
    "the_attendance_checkin",
    "the_attendance_checkout",
    "the_attendance_status",
  ];
  attendanceQuery.fullLinkers = ["the_attendance_date"];
  attendanceQuery.inpage = 100;
  attendanceQuery.logic = "or";
  attendanceQuery.filterSearches = [dateFilter];
  attendanceQuery.doFilter = true;

  console.log(searchQuery);

  const user = await SearchLinkMultipleAll(
    [searchQuery, attendanceQuery],
    token
  );
  console.log(
    searchDate,
    "abcbedaa",
    //user?.data?.["the_user"]?.["the_user_s_attendance"]
    user
  );

  return await formatUserAttendance(
    user?.data?.["the_user"]?.["the_user_s_attendance"]
  );
}

/**
 * Method to format Indivisual User Attendance
 * @param attendanceList any[]
 * @returns Promise<Attendance[]>
 */
export async function formatUserAttendance(attendanceList: any[]) {
  if (attendanceList?.length == 0) return [];
  return Promise.all(
    attendanceList?.map((attendance: any) => {
      return {
        id: attendance.id,
        date: attendance?.data?.[`the_attendance`]?.[`the_attendance_date`]?.[0]
          ?.data?.["the_date"],
        checkin:
          attendance?.data?.[`the_attendance`]?.[`the_attendance_checkin`]?.[0]
            ?.data?.["the_checkin"],
        checkout:
          attendance?.data?.[`the_attendance`]?.[`the_attendance_checkout`]?.[0]
            ?.data?.["the_checkout"],
        status:
          attendance?.data?.[`the_attendance`]?.[`the_attendance_status`]?.[0]
            ?.data?.["the_status"],
        remarks:
          attendance?.data?.[`the_attendance`]?.[`the_attendance_remarks`]?.[0]
            ?.data?.["the_remarks"],
        createdAt: attendance?.created_at,
      };
    }) || []
  );
}

/**
 * Method to fetch the monthly attendance which returns table rows
 * @returns string
 */
export async function getUserMonthlyAttendanceRows(
  monthlyAttendance: Attendance[],
  monthlyDate: string,
  showActions: boolean = false,
  userConceptId?: number
) {
  let dateList: string[];
  if (monthlyAttendance?.[0]?.checkin) {
    dateList = getDateInMonth(
      new Date(monthlyAttendance?.[0]?.checkin).getFullYear(),
      new Date(monthlyAttendance?.[0]?.checkin).getMonth() + 1
    );
  } else {
    dateList = getDateInMonth(
      new Date(monthlyDate).getFullYear(),
      new Date(monthlyDate).getMonth() + 1
    );
  }
  if (
    dateList.length == 0
    // ||
    // monthlyAttendance.length == 0 ||
    // (monthlyAttendance?.[0]?.checkin?.split(0, 4) < new Date().getFullYear() &&
    //   monthlyAttendance?.[0]?.checkin?.split(5, 6) < new Date().getMonth())
  ) {
    return `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" colspan="8" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">No Attendance Found</td>
        </tr>`;
  }

  let attendanceRows = "";

  dateList.forEach((date: string) => {
    const obj = calculateAttendance(monthlyAttendance, date);

    attendanceRows +=
      '<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">';
    attendanceRows += `
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">${obj.currentDate}</td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            ${
              obj.currentDate
                ? new Date(obj.currentDate).toLocaleString("en-us", {
                    weekday: "short",
                  })
                : ""
            }
        </td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            ${obj.checkin ? new Date(obj.checkin).toLocaleTimeString() : ""}
        </td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            ${obj.times > 0 ? `${obj.times} time(s)` : ""}
        </td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            ${obj.checkout ? new Date(obj.checkout).toLocaleTimeString() : ""}
        </td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            ${obj.workingTime ? getDuration(obj.workingTime) : ""}
        </td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            <!-- ${obj.count > 0 ? `Present` : ""} -->
            <!-- ${obj.checkin ? "Present" : obj?.status || ""} -->
            ${obj.status}
        </td>
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
            ${obj.remarks}
        </td>
        `;
    if (showActions && userConceptId) {
      attendanceRows += `
        <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
          obj.checkin ? "bg-green-400" : obj.status == "Absent" && "bg-red-400"
        }">
          <div class="inline-block text-left">
              <button type="button" onclick="showDropdownMenuOption('dropdown-menu-${
                obj.currentDate
              }')" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="inherit"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
              </button>
              <div id="dropdown-menu-${
                obj.currentDate
              }" class="dropdown-menu absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                  <div class="py-1" role="none">
                    <a 
                      role="button" 
                      onclick="showEditAttendanceModal(
                        '${userConceptId}', '${obj.currentDate}')" 
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500" role="menuitem" tabindex="-1" id="menu-item-0">Edit Attendance</a>
                    <a 
                      role="button" 
                      onclick="markAsAbsent(
                        '${userConceptId}', '${obj.currentDate}')" 
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500" role="menuitem" tabindex="-1" id="menu-item-1">Mark As Absent</a>
                  </div>
              </div>
          </div>
        </td>
        `;
    }
    attendanceRows += "</tr>";
  });

  return attendanceRows;
}

export function calculateAttendance(
  attendanceList: Attendance[],
  date: string
) {
  const attendances = attendanceList?.filter(
    (attendance) => attendance.date?.includes(date)
    // attendance?.checkin?.includes(date) ||
    // attendance?.checkout?.includes(date)
  );
  console.log("date", date, attendances);
  const obj: any = {
    ids: [],
    currentDate: date,
    times: -1,
    status: "",
    remarks: "",
  };
  attendances?.map((attendance) => {
    obj.ids.push(attendance.id);
    console.log("att", date, attendance.createdAt);
    console.log(
      !obj.status || obj.status == "",
      attendance.status == "Present" || obj.status == "Absent",
      attendance.status
    );

    if (attendance.remarks && !obj.remarks) obj.remarks = attendance.remarks;

    if (!obj.status || obj.status == "") obj.status = attendance.status;
    else if (attendance.status == "Present" || obj.status == "Absent")
      obj.status = attendance.status;
    else obj.status = attendance.status;

    if (!obj.checkin && attendance.checkin) obj.checkin = attendance.checkin;
    else if (obj.checkin && attendance.checkin) {
      if (
        new Date(attendance.checkin).getTime() -
          new Date(obj.checkin).getTime() <=
        0
      ) {
        obj.checkin = attendance.checkin;
      }
    }

    if (!obj.checkout && attendance.checkout)
      obj.checkout = attendance.checkout;
    else if (obj.checkout && attendance.checkout) {
      if (
        new Date(attendance.checkout).getTime() -
          new Date(obj.checkout).getTime() >=
        0
      ) {
        obj.checkout = attendance.checkout;
      }
    }
    if (attendance.checkin && attendance.checkout) {
      if (!obj.workingTime)
        obj.workingTime =
          new Date(attendance.checkout).getTime() -
          new Date(attendance.checkin).getTime();
      else
        obj.workingTime +=
          new Date(attendance.checkout).getTime() -
          new Date(attendance.checkin).getTime();
    }
    obj.times += 1;
  });
  return obj;
}

function formatDate(date: any) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, so add 1
  let day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function exportAttendance(
  searchDate: string,
  type: "pdf" | "csv",
  userIds?: string[]
) {
  // const dailyDate = `${new Date().getFullYear()}-${(
  //   "0" +
  //   (new Date().getMonth() + 1)
  // ).slice(-2)}-${("0" + (new Date().getMonth() + 1)).slice(-2)}`;

  const emploeyeeList = await getCompanyEmployee(searchDate);
  const headers = [
    "Date",
    "Day",
    "First Check In",
    "Breaks",
    "Check Out",
    "Working Time",
    "Status",
  ];

  let pdfHTML = "";

  for (let i = 0; i < emploeyeeList.length; i++) {
    const employee = emploeyeeList[i];

    const user = employee.user;
    const monthlyAttendance = employee.attendances;

    if (userIds && userIds.length && !userIds.includes(user.id.toString()))
      continue;

    let dateList: string[];
    if (monthlyAttendance?.[0]?.checkin) {
      dateList = getDateInMonth(
        new Date(monthlyAttendance?.[0]?.checkin).getFullYear(),
        new Date(monthlyAttendance?.[0]?.checkin).getMonth() + 1
      );
    } else {
      dateList = getDateInMonth(
        new Date(searchDate).getFullYear(),
        new Date(searchDate).getMonth() + 1
      );
    }

    const datas: any[] = [];
    dateList.forEach((date: string) => {
      const obj = calculateAttendance(monthlyAttendance, date);

      let data = {
        date: `"${date}"`,
        day: obj.currentDate
          ? new Date(obj.currentDate).toLocaleString("en-us", {
              weekday: "short",
            })
          : "",
        checkin: obj.checkin ? new Date(obj.checkin).toLocaleTimeString() : "",
        breaks: obj.times > 0 ? `${obj.times} time(s)` : "",
        checkout: obj.checkout
          ? `"${new Date(obj.checkout).toLocaleTimeString()}"`
          : "",
        workingTime: obj.workingTime ? `"${getDuration(obj.workingTime)}"` : "",
        status: obj.checkin ? "Present" : `${obj?.status || ""}` || "",
      };
      datas.push(csvmaker(data));
    });

    if (type == "csv") {
      let final =
        headers.join(",") +
        "\n" +
        datas.map((data) => data.join(",")).join("\n");

      const blob = new Blob([final], { type: "text/csv" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `attendance-${user.firstName}.csv`;

      a.click();
    } else if (type == "pdf") {
      pdfHTML += await getPrintableUserAttendanceTable(
        monthlyAttendance,
        searchDate,
        user
      );
    }
  }

  if (type == "pdf" && pdfHTML != "") {
    document.getElementById("app")?.classList.add("hidden");
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div id="print_delete">${pdfHTML}</div>`
    );
    window.print();
    document.getElementById("print_delete")?.remove();
    document.getElementById("app")?.classList.remove("hidden");
  }
}

// Function to create a CSV string from an object
const csvmaker = (data: any) => {
  // Get the keys (headers) of the object
  const headers = Object.keys(data);

  // Get the values of the object
  const values = Object.values(data);
  // console.log(values, " values");
  // console.log([headers.join(","), values.join(",")].join("\n"), " return");

  return values;
  return values.join(",");
  // Join the headers and values with commas and newlines to create the CSV string
  return [headers.join(","), values.join(",")].join("\n");
};

async function getPrintableUserAttendanceTable(
  monthlyAttendance: any,
  monthlyDate: string,
  user: any
) {
  const employeeAttendanceRows = await getUserMonthlyAttendanceRows(
    monthlyAttendance,
    monthlyDate
  );
  return `
    <div class="block" style="display: block; page-break-after: always;">
      <h2 class="text-3xl text-gray-800 dark:text-white font-bold mb-6" style="text-align:center;">Addendance of <span class="capitalize">${
        user.firstName ? user.firstName + " " + user.lastName : user.email
      }</span></h2>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3">Day</th>
                    <th scope="col" class="px-6 py-3">First In</th>
                    <th scope="col" class="px-6 py-3">Breaks</th>
                    <th scope="col" class="px-6 py-3">Last Out</th>
                    <th scope="col" class="px-6 py-3">Working Time</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                </tr>
            </thead>
            <tbody>
                ${employeeAttendanceRows}
            </tbody>
      </table>
    </div>`;
}
