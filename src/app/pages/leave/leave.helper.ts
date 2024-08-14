import {
  FilterSearch,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../services/helper.service";
import { environment } from "../../environments/environment.dev";

export enum leaveStatus {
  Pending = "Pending",
  Approved = "Approved",
  Declined = "Declined",
  Cancelled = "Cancelled",
}

export async function getEmployeeUsers() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;
  const roleId = await getRoleId(token);
  if (!roleId) return [];
  //   if (roleId) {
  const searchQuery = new SearchQuery();
  if (roleId) searchQuery.composition = roleId;
  searchQuery.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
  searchQuery.reverse = true;
  searchQuery.inpage = 100;

  const role = await SearchLinkMultipleAll([searchQuery], token);
  const users =
    role?.data?.humanizing_data_internal_role_name
      ?.the_user_s_has_humanizing_data_role_s_reverse;
  if (!users) return [];

  return users.map((user: any) => formatUserComposition(user));
}

export async function fetchLeaveRequest(
  statusFilterItems: leaveStatus[] = [],
  userConceptId?: number
) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const roleId = await getRoleId(token);
  if (!roleId && !userConceptId) return [];
  //   if (roleId) {
  const searchQuery = new SearchQuery();
  if (roleId) searchQuery.composition = roleId;
  searchQuery.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
  searchQuery.reverse = true;
  searchQuery.inpage = 100;

  const leaveQuery = new SearchQuery();
  if (userConceptId) leaveQuery.composition = userConceptId;
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

  if (roleId) {
    const res = await SearchLinkMultipleAll(
      [searchQuery, leaveQuery, leaveDetailQuery],
      token
    );

    return formatEmployeesLeaveRequests(res);
  } else {
    const res = await SearchLinkMultipleAll(
      [leaveQuery, leaveDetailQuery],
      token
    );

    return formatUserLeaveRequests(res);
  }
  //   }
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
function formatUserLeaveRequests(user: any) {
  let leaveRequests: any[] = [];
  const formatedUser = formatUserComposition(user);
  user?.data?.the_user?.["the_user_leave_request"]?.map((leave: any) => {
    leaveRequests.push({
      user: formatedUser,
      ...formatLeave(leave),
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

/**
 * Method to get the roleId
 * @param roleName string // default - ROLE_EMPLOYEE
 * @returns number | undefined
 */
export async function getRoleId(token: string, roleName = "ROLE_EMPLOYEE") {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    environment.boomURL +
      `/api/search-api-with-data-id?composition=humanizing_data_internal_role_name&type=name&search=${roleName}`,
    {
      method: "GET",
      headers: myHeaders,
    }
  );
  const role = await response.json();
  if (role?.[0]?.id) {
    console.log("id", role[0].id);
    return role[0].id;
  }
  return;
}
