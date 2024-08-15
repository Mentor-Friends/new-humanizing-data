import {
  FilterSearch,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../../services/helper.service";
import {
  calculateAttendance,
  formatUserAttendance,
  getDuration,
} from "../attendance.helper";
import { openModal } from "../../../services/modal.service";
import { getRoleId } from "../../leave/leave.helper";

export async function getCompanyEmployee(filterDate?: string) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;
  let searchDate = `${new Date().getFullYear()}-${(
    "0" +
    (new Date().getMonth() + 1)
  ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;

  if (filterDate) {
    searchDate = filterDate;
  }

  const roleId = await getRoleId(token);
  if (!roleId) return [];

  const search1 = new SearchQuery();
  search1.composition = roleId;
  search1.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
  search1.reverse = true;
  search1.inpage = 100;

  const dateFilter = new FilterSearch();
  dateFilter.type = "date";
  dateFilter.logicoperator = "like";
  dateFilter.search = `%${searchDate}%`;
  dateFilter.composition = false;

  const search2 = new SearchQuery();
  search2.fullLinkers = ["the_user_s_attendance"];
  search2.inpage = 100;
  search2.doFilter = true;

  const search3 = new SearchQuery();
  search3.filterSearches = [dateFilter];
  search3.logic = "or";
  search3.selectors = [
    "the_attendance_date",
    "the_attendance_checkin",
    "the_attendance_checkout",
    "the_attendance_status",
  ];
  search3.fullLinkers = ["the_attendance_date"];
  search3.doFilter = true;
  search3.inpage = 100;

  const searchData = await SearchLinkMultipleAll(
    [search1, search2, search3],
    token
  );

  let users: any[] = [];
  const userList =
    searchData?.data?.humanizing_data_internal_role_name
      ?.the_user_s_has_humanizing_data_role_s_reverse;
  if (!userList) return [];

  for (let i = 0; i < userList.length; i++) {
    const user = userList[i];
    users.push({
      user: formatUserComposition(user),
      attendances: await formatUserAttendance(
        user?.data?.the_user?.["the_user_s_attendance"]
      ),
    });
  }
  users = [...new Map(users.map((item) => [item.user.id, item])).values()];
  return users;
}

export function getEmployeesAttendanceList(employees: any[]) {
  console.log("employees", employees);
  if (employees.length == 0) {
    return `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" colspan="10" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">No User Found</td>
        </tr>`;
  }

  let employeesAttendanceRows = "";

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i];

    const dailyDate = `${new Date().getFullYear()}-${(
      "0" +
      (new Date().getMonth() + 1)
    ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
    console.log(dailyDate);

    const obj = calculateAttendance(employee.attendances || [], dailyDate);
    console.log(obj, "object");

    employeesAttendanceRows += `
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                  <img 
                    title="${
                      employee?.user?.firstName
                        ? `${employee?.user?.firstName} ${employee?.user?.lastName}`
                        : employee?.user?.email
                    }" 
                    class="max-w-8 max-h-8 min-w-8 min-h-8 h-full w-full rounded-full border border-gray-300 dark:boarder-gray-700" 
                    src="${employee?.user?.profileImg}" alt="Profile Image" />
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
              ${
                employee?.user?.firstName
                  ? `${employee?.user?.firstName} ${employee?.user?.lastName}`
                  : employee?.user?.email
              }
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                    ${employee?.user?.email}
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                ${obj.checkin ? new Date(obj.checkin).toLocaleTimeString() : ""}
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                ${obj.times > 0 ? `${obj.times} time(s)` : ""}
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                ${
                  obj.checkout
                    ? new Date(obj.checkout).toLocaleTimeString()
                    : ""
                }
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                ${obj.workingTime ? getDuration(obj.workingTime) : ""}
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
              <!-- ${obj.checkin ? "Present" : obj?.status || ""} -->
              ${obj.status}
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                ${obj.remarks}
              </td>
              <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-opacity-25 ${
                obj.checkin
                  ? "bg-green-400"
                  : obj.status == "Absent" && "bg-red-400"
              }">
                  <div class="inline-block text-left">
                      <button type="button" onclick="toggleDropdownMenuOption(event, 'dropdown-menu-${
                        employee.user.id
                      }')" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="inherit"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                      </button>
                      <div id="dropdown-menu-${
                        employee.user.id
                      }" class="dropdown-menu absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                          <div class="py-1" role="none">
                              <router-link href="/employee/attendance/${
                                employee.user.id
                              }"><a role="button" onclick="viewEmployee" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-0">View</a></router-link>
                          </div>
                      </div>
                  </div>
              </td>
          </tr>
          `;
  }
  return employeesAttendanceRows;
}

export function handleExportEmployeesAteendanceModal(
  indivisualUser: boolean = false,
  userConceptId: number = 0
) {
  openModal("export-employees-ateendance");

  if (indivisualUser && userConceptId) {
    // populate userConceptId to be exported for indivisual User
    document.getElementById("export-userConceptId")?.remove();

    const exportForm = document.getElementById("exportEmployeesAttendanceForm");

    if (exportForm) {
      exportForm.insertAdjacentHTML(
        "afterbegin",
        `<input type="text" value="${userConceptId}" name="export-userConceptId" id="export-userConceptId" class="hidden" />`
      );
    }
  }
}
