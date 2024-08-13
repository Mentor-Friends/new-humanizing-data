import { getLocalStorageData } from "../../../services/helper.service";
import { hasRole } from "../../roles/role.helper";
import {
  fetchLeaveRequest,
  getEmployeeUsers,
  leaveStatus,
} from "../leave.helper";

export async function handleLeaveFilterChange() {
  const filterStatusSelect = document.getElementById(
    "filter-leave-status"
  ) as HTMLSelectElement;
  const filterUserSelect = document.getElementById(
    "filter-users"
  ) as HTMLSelectElement;
  if (!filterStatusSelect) return;
  let userConceptId =
    filterUserSelect?.value?.trim && filterUserSelect?.value?.trim() != ""
      ? parseInt(filterUserSelect?.value?.trim())
      : undefined;

  // filter only user details if role employee
  if (await hasRole("ROLE_EMPLOYEE")) {
    const profileStorageData: any = await getLocalStorageData();
    const userConceptIdStorage = profileStorageData?.userConcept;
    userConceptId = userConceptIdStorage;
  }
  let data: any[] = [];
  if (!filterStatusSelect.value || filterStatusSelect.value == "")
    data = await fetchLeaveRequest([], userConceptId);
  else
    data = await fetchLeaveRequest(
      [filterStatusSelect.value as leaveStatus],
      userConceptId
    );

  console.log("leaveRequests", data);
  populateLeaveRequests(data);
}

export async function populateUserDropdown() {
  const userSelect = document.getElementById("filter-users");
  if (!userSelect) return;
  const users: any[] = await getEmployeeUsers();

  let html = '<option value="">Select User</option>';
  console.log(users, "adsfiuasklfjaskj");
  users?.map((user) => {
    html += `<option value="${user.id}">${
      user?.firstName ? `${user?.firstName} ${user?.lastName}` : user?.email
    }</option>`;
  });
  userSelect.innerHTML = html;
}

export async function populateLeaveRequests(leaveRequests: any[] = []) {
  const leaveRequestBody = document.getElementById("leave-requests");
  if (!leaveRequestBody) return;

  if (leaveRequests.length == 0) {
    console.log("here");
    leaveRequestBody.innerHTML = `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" colspan="9" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">No Request Found</td>
        </tr>`;
    return;
  }

  let leaveRequestHTML = "";
  for (let i = 0; i < leaveRequests.length; i++) {
    const request = leaveRequests[i];

    leaveRequestHTML += `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">
                <img 
                    title="${
                      request?.user?.firstName
                        ? `${request?.user?.firstName} ${request?.user?.lastName}`
                        : request?.user?.email
                    }" 
                    class="max-w-8 max-h-8 min-w-8 min-h-8 h-full w-full rounded-full border border-gray-300 dark:boarder-gray-700" 
                    src="${request?.user?.profileImg}" alt="Profile Image" />
            </td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">
                ${
                  request?.user?.firstName
                    ? `${request?.user?.firstName} ${request?.user?.lastName}`
                    : request?.user?.email
                }
            </td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white uppercase">${
              request.type
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request.fromdate
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request.todate
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${getLeaveDuration(
              request.fromdate,
              request.todate
            )}</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request.reason
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">
            <span class="${getStatusClass(request.status)}">${
      request.status
    }</span>
            </td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">
            </td>
        </tr>
    `;
  }
  leaveRequestBody.innerHTML = leaveRequestHTML;
}

function getStatusClass(status: string) {
  let value = "";
  switch (status) {
    case leaveStatus.Approved:
      value = "text-green-600";
      break;
    case leaveStatus.Pending:
      value = "text-gray-800";
      break;
    case leaveStatus.Cancelled:
      value = "text-gray-600 dark:text-gray-400";
      break;
    default:
    case leaveStatus.Declined:
      value = "text-red-800";
      break;
      break;
  }
  return value;
}

function getLeaveDuration(fromdate: string, todate?: string) {
  if (!todate) return 1;
  if (fromdate == todate) return 1;
  return (
    (new Date("2024-08-14").getTime() - new Date("2024-08-13").getTime()) /
      (86400 * 1000) +
    1
  ); // 1 added
}
