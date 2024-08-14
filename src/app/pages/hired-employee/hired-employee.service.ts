import { SearchLinkMultipleAll, SearchQuery } from "mftsccs-browser";
import { environment } from "../../environments/environment.dev";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../services/helper.service";

export async function getEmployeeList() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    environment.boomURL +
      `/api/search-api-with-data-id?composition=humanizing_data_internal_role_name&type=name&search=ROLE_EMPLOYEE`,
    {
      method: "GET",
      headers: myHeaders,
    }
  );
  const role = await response.json();
  if (role?.[0]?.id) {
    console.log("id", role[0].id);

    const searchQuery = new SearchQuery();
    searchQuery.composition = role[0].id;
    searchQuery.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
    searchQuery.reverse = true;
    searchQuery.inpage = 100;

    const profileQuery = new SearchQuery();
    profileQuery.fullLinkers = ["the_user_profile"];

    const profileDetailQuery = new SearchQuery();
    profileDetailQuery.fullLinkers = [
      "the_profile_phone",
      "the_profile_department",
    ];

    const searchData = await SearchLinkMultipleAll(
      [searchQuery, profileQuery, profileDetailQuery],
      token
    );

    const users =
      searchData.data.humanizing_data_internal_role_name
        .the_user_s_has_humanizing_data_role_s_reverse;
    console.log("users", users, searchData);
    const uniqueUser = [
      ...new Map(users?.map((user: any) => [user.id, user])).values(),
    ];
    const cleanedUser = await Promise.all(
      uniqueUser.map(async (user: any) => {
        return {
          ...(await formatUserComposition(user)),
          department:
            user?.data?.the_user?.the_user_profile?.[0]?.data?.the_profile
              ?.the_profile_department?.[0]?.data?.the_department,
          phone:
            user?.data?.the_user?.the_user_profile?.[0]?.data?.the_profile
              ?.the_profile_phone?.[0]?.data?.the_phone,
        };
      })
    );
    return cleanedUser;
  }

  return [];
}

export function getEmployeeRows(employeeList: any[]) {
  if (employeeList.length == 0) {
    return `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td scope="row" colspan="6" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">No User Found</td>
            </tr>`;
  }
  let employeesRows = "";

  for (let i = 0; i < employeeList.length; i++) {
    const employee = employeeList[i];

    employeesRows += `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <img 
                title="${
                  employee?.firstName
                    ? `${employee?.firstName} ${employee?.lastName}`
                    : employee?.email
                }" 
                class="max-w-8 max-h-8 min-w-8 min-h-8 h-full w-full rounded-full border border-gray-300 dark:boarder-gray-700" 
                src="${employee?.profileImg}" alt="Profile Image" />
          </td>
          <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${employee?.firstName} ${employee?.lastName}
          </td>
          <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              ${employee?.email}
          </td>
          <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${employee?.phone ? employee?.phone : ""}
          </td>
          <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${employee?.department ? employee?.department : ""}
          </td>
          <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div class="inline-block text-left">
              <button type="button" onclick="showDropdownMenuOption('dropdown-menu-${
                employee.id
              }')" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="inherit"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
              </button>
              <div id="dropdown-menu-${
                employee.id
              }" class="dropdown-menu absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1" role="none">
                  <a role="button" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500" role="menuitem" tabindex="-1" id="menu-item-0">View Attendance</a>
                </div>
              </div>
            </div>
          </td>
        </tr>`;
  }
  return employeesRows;
}
