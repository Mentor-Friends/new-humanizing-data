import { SearchLinkMultipleAll, SearchQuery } from "mftsccs-browser";
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

export async function searchLeave() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const roleId = await getRoleId(token);
  if (roleId) {
    console.log("id", roleId);

    const searchQuery = new SearchQuery();
    searchQuery.composition = roleId;
    searchQuery.listLinkers = ["the_user_s_has_humanizing_data_role_s"];
    searchQuery.reverse = true;
    searchQuery.inpage = 100;

    const profileQuery = new SearchQuery();
    profileQuery.fullLinkers = ["the_user_s_leave"];

    const data = await SearchLinkMultipleAll([searchQuery], token);

    return formatLeave(data);
  }

  return [];
}

async function formatLeave(data: any) {
  console.log("format", data);
  const users =
    data?.data?.humanizing_data_internal_role_name
      ?.the_user_s_has_humanizing_data_role_s_reverse;
  if (!users) return [];
  const formatedUsers = users.map((user: any) => {
    return {
      user: formatUserComposition(user),
    };
  });

  return formatedUsers;
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
