import {
  FilterSearch,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import { getRoleId, leaveStatus } from "../leave.helper";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../../services/helper.service";

export async function handleFilterLeaveStatusChange() {
  const filterStatusSelect = document.getElementById(
    "filter-leave-status"
  ) as HTMLSelectElement;
  if (!filterStatusSelect) return;

  let data: any[] = [];
  if (filterStatusSelect.value == "") data = await fetchLeaveRequest();
  else
    data = await fetchLeaveRequest([filterStatusSelect.value as leaveStatus]);

  console.log("leaveRequests", data);
  populateLeaveRequests(data);
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

export async function fetchLeaveRequest(statusFilterItems: leaveStatus[] = []) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const roleId = await getRoleId(token);
  if (roleId) {
    const searchQuery = new SearchQuery();
    searchQuery.composition = roleId;
    searchQuery.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
    searchQuery.reverse = true;
    searchQuery.inpage = 100;

    const leaveQuery = new SearchQuery();
    leaveQuery.fullLinkers = ["the_user_leave_request"];
    leaveQuery.inpage = 100;
    leaveQuery.doFilter = true;

    const leaveDetailQuery = new SearchQuery();
    leaveDetailQuery.selectors = [
      "the_leave_request_type",
      "the_leave_request_fromdate",
      "the_leave_request_todate",
      "the_leave_request_reason",
      "the_leave_request_status",
    ];
    leaveDetailQuery.doFilter = true;
    leaveDetailQuery.inpage = 100;
    leaveDetailQuery.logic = "or";
    leaveDetailQuery.fullLinkers = ["the_leave_request_status"];

    console.log(statusFilterItems, "yfsakfaskfja");
    if (Array.isArray(statusFilterItems)) {
      let filterSearches: FilterSearch[] = [];
      for (let i = 0; i < statusFilterItems.length; i++) {
        const element = statusFilterItems[i];

        const statusFilter = new FilterSearch();
        statusFilter.composition = false;
        statusFilter.type = "status";
        statusFilter.logicoperator = "=";
        statusFilter.search = element;

        filterSearches.push(statusFilter);
      }
      leaveDetailQuery.filterSearches = filterSearches;
    }

    const res = await SearchLinkMultipleAll(
      [searchQuery, leaveQuery, leaveDetailQuery],
      token
    );

    return formatEmployeesLeaveRequests(res);
  }
  return [];
}

function formatEmployeesLeaveRequests(role: any) {
  console.log("format", role);
  const users =
    role?.data?.humanizing_data_internal_role_name
      ?.the_user_s_has_humanizing_data_role_s_reverse;
  if (!users) return [];

  let leaveRequests: any[] = [];
  users.map((user: any) => {
    const formatedUser = formatUserComposition(user);
    user?.data?.the_user?.["the_user_leave_request"]?.map((leave: any) => {
      leaveRequests.push({
        user: formatedUser,
        ...formatLeave(leave),
      });
    });
  });

  return leaveRequests;
}

type LeaveRequest = {
  id: number;
  type: string;
  fromdate: string;
  todate?: string;
  reason: string;
  status: leaveStatus;
};
function formatLeave(leave: any): LeaveRequest {
  return {
    id: leave?.id,
    type:
      leave?.data?.the_leave_request?.the_leave_request_type?.[0]?.data
        ?.the_type || "",
    fromdate:
      leave?.data?.the_leave_request?.the_leave_request_fromdate?.[0]?.data
        ?.the_fromdate || "",
    todate:
      leave?.data?.the_leave_request?.the_leave_request_todate?.[0]?.data
        ?.the_todate || "",
    reason:
      leave?.data?.the_leave_request?.the_leave_request_reason?.[0]?.data
        ?.the_reason || "",
    status:
      leave?.data?.the_leave_request?.the_leave_request_status?.[0]?.data
        ?.the_status || "",
  };
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
