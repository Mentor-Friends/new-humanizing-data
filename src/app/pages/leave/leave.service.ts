import {
  FilterSearch,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import {
  formatLeave,
  getLeaveDuration,
  getRoleId,
  leaveStatus,
} from "./leave.helper";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../services/helper.service";
import { getCompanyConcept } from "../settings/settings.service";

export async function populateLeaveRequest(companyLeave: {
  sickLeave: number | string;
  paidLeave: number | string;
}) {
  const leaveRequestBody = document.getElementById("leave-requests");
  if (!leaveRequestBody) return;
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const leaveRequests: any[] = await fetchLeaveRequest(token);

  if (leaveRequests.length == 0) {
    leaveRequestBody.innerHTML = `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" colspan="7" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">No Employee Found.</td>
        </tr>`;
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
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">0</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request?.unpaid
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request?.paid
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request?.sick
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              request?.unpaid + request?.paid + request?.sick
            }</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">${
              parseInt(companyLeave.paidLeave.toString()) +
              parseInt(companyLeave.sickLeave.toString()) -
              (request?.paid + request?.sick)
            }</td>
        </tr>
    `;
  }
  leaveRequestBody.innerHTML = leaveRequestHTML;
}

async function fetchLeaveRequest(token: string) {
  const roleId = await getRoleId(token);
  if (!roleId) return [];
  const searchQuery = new SearchQuery();
  if (roleId) searchQuery.composition = roleId;
  searchQuery.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
  searchQuery.reverse = true;
  searchQuery.inpage = 100;

  const leaveQuery = new SearchQuery();
  leaveQuery.fullLinkers = ["the_user_leave_request"];
  leaveQuery.inpage = 100;
  leaveQuery.doFilter = true;

  // filter
  const startRangeFilter = new FilterSearch();
  startRangeFilter.composition = false;
  startRangeFilter.type = "fromdate";
  startRangeFilter.logicoperator = "like";
  startRangeFilter.search = "%2024%";
  // filter
  const endRangeFilter = new FilterSearch();
  endRangeFilter.composition = false;
  endRangeFilter.type = "fromdate";
  endRangeFilter.logicoperator = "like";
  endRangeFilter.search = "%2024%";

  const leaveDetailQuery = new SearchQuery();
  leaveDetailQuery.selectors = [
    "the_leave_request_type",
    "the_leave_request_fromdate",
    "the_leave_request_todate",
    "the_leave_request_reason",
    "the_leave_request_status",
  ];
  leaveDetailQuery.fullLinkers = ["the_leave_request_fromdate"];
  leaveDetailQuery.doFilter = true;
  leaveDetailQuery.inpage = 100;
  leaveDetailQuery.logic = "or";
  leaveDetailQuery.filterSearches = [startRangeFilter, endRangeFilter];

  const res = await SearchLinkMultipleAll(
    [searchQuery, leaveQuery, leaveDetailQuery],
    token
  );
  const userLists =
    res?.data?.humanizing_data_internal_role_name
      ?.the_user_s_has_humanizing_data_role_s_reverse;
  let users: any[] = [];

  let leaveType = {
    unpaid: 0,
    paid: 0,
    sick: 0,
  };
  userLists?.map((user: any) => {
    user?.data?.the_user?.the_user_leave_request
      ?.map((leave: any) => {
        const formatedLeave = formatLeave(leave);
        if (formatedLeave?.status == leaveStatus.Approved) {
          if (formatedLeave.type == "unpaid") {
            // add duration to count
            leaveType.unpaid += getLeaveDuration(
              formatedLeave.fromdate,
              formatedLeave.todate
            );
          } else if (formatedLeave.type == "paid") {
            leaveType.paid += getLeaveDuration(
              formatedLeave.fromdate,
              formatedLeave.todate
            );
          } else if (formatedLeave.type == "sick") {
            leaveType.sick += getLeaveDuration(
              formatedLeave.fromdate,
              formatedLeave.todate
            );
          }
        }
      })
      ?.filter((leave: any) => leave?.status == leaveStatus.Approved);

    users.push({
      user: formatUserComposition(user),
      ...leaveType,
    });
  });

  console.log(userLists, users, "response");

  return users;
}

export async function getCompanyLeave(token: string) {
  const companyConcept = await getCompanyConcept();

  const searchQuery = new SearchQuery();
  searchQuery.composition = companyConcept.id;
  searchQuery.fullLinkers = ["the_company_sickleave", "the_company_paidleave"];

  const data = await SearchLinkMultipleAll([searchQuery], token);
  return {
    paidLeave:
      data?.data?.the_company?.the_company_paidleave?.[0]?.data
        ?.the_paidleave || 0,
    sickLeave:
      data?.data?.the_company?.the_company_sickleave?.[0]?.data
        ?.the_sickleave || 0,
  };
}
