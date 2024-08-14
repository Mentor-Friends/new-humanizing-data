import { environment } from "../../environments/environment.dev";

const boomUrl = environment.boomURL;

/**
 * Method to fetch all the roles of humanizing data
 * @returns any | any[]
 */
export async function fetchRoles() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(boomUrl + "/api/humanizing/roles/list", {
    method: "GET",
    headers: myHeaders,
  });
  const data = await response.json();
  console.log(data);
  return data || [];
}

/**
 * Method to create a new Role with name
 * @param body {name: string}
 * @returns any | any[]
 */
export async function createRole(body: { name: string }) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(boomUrl + "/api/humanizing/roles/create", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data || [];
}

/**
 * Method to add permissions to the role
 * @param body {name: string, permissions: any[]}
 * @returns any | any[]
 */
export async function addPermission(body: {
  name: string;
  permissions: any[];
}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(boomUrl + "/api/humanizing/permissions/add", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data || [];
}

/**
 * Method to assign Role to the User
 * @param body { userConceptId: string, roleName: string }
 * @returns any | any[]
 */
export async function addRoleToUser(body: {
  userConceptId: string | number;
  roleName: string;
}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(boomUrl + "/api/humanizing/userrole/add", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data || [];
}

/**
 * Method to remove Role from the User
 * @param body { userConceptId: string, roleName: string }
 * @returns any | any[]
 */
export async function removeRoleFromUser(body: {
  userConceptId: string | number;
  roleName: string;
}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch(boomUrl + "/api/roles/remove", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data || [];
}

/**
 * Method to Search all the user in the database
 * @param searchValue string
 * @returns any | any[]
 */
export async function searchUser(searchValue: string, token: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    boomUrl + `/api/v1/user-search?search=${searchValue}&page=1&inpage=5`,
    {
      method: "GET",
      headers: myHeaders,
    }
  );
  const data = await response.json();
  console.log(data, "searchValue", searchValue);
  return data || [];
}
