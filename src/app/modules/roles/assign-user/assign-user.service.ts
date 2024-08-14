import { GetCompositionWithId, GetLink } from "mftsccs-browser";
import {
  addRoleToUser,
  fetchRoles,
  removeRoleFromUser,
  searchUser,
} from "../../../pages/roles/roles.apis";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../../services/helper.service";

export async function handleSearchChange(e: any) {
  console.log("here", new Date().getTime());
  const storageData: any = await getLocalStorageData();
  const token = storageData?.token;
  console.log("here 2", new Date().getTime());

  const value = e.target.value;
  const searchUserList = document.getElementById("search-users-lists");
  if (!searchUserList) return;
  console.log("here 3", new Date().getTime());
  searchUserList.innerHTML = `
  <li>Loading....</li>
  `;

  const users = await searchUser(value, token);

  console.log("here 4", new Date().getTime());

  let listItems = "";
  for (let i = 0; i < users.length; i++) {
    const user: any = users[i];
    listItems += `
      <li>
          <a role="button" onclick="getSelectedUserRoles(${
            user.id
          })" class="flex flex-row gap-2 items-center mb-2 px-4 py-2 rounded border hover:bg-gray-100 hover:border-gray-100">
              <img class="max-w-8 max-h-8 min-w-8 min-h-8 h-full w-full rounded-full border border-gray-300 dark:boarder-gray-700" 
                src="${
                  user.profile_img
                    ? user.profile_img
                    : "https://apitest.boomconcole.com/uploads/f5542452-47ea-4c1d-9a30-6e0305961a17.png"
                }" alt="Profile Image" />
              <p>${user.first_name} ${user.last_name}</p>
              <p><small class="text-sm text-gray-400 dark:text-gray-600">${
                user.email
              }</small></p>
          </a>
      </li>
    `;
  }

  searchUserList.innerHTML = listItems;

  console.log(users, "users");
}

export async function getSelectedUserRoles(userConceptId: number) {
  const userRolesList = document.getElementById("user-roles-lists");
  const searchUserList = document.getElementById("search-users-lists");

  if (userRolesList) userRolesList.innerHTML = "";
  if (searchUserList) searchUserList.innerHTML = "";

  const userRoles = await GetLink(userConceptId, "has_humanizing_data_role_s");
  // const userRoles = await GetLink(userConceptId, "humanizing_data_has_role_s");
  const user = await formatUserComposition(
    await GetCompositionWithId(userConceptId)
  );
  let assignedRoles = `
    <li>
      <a role="button" onclick="getSelectedUserRoles(${user.id})" class="flex flex-row gap-2 items-center mb-2 px-4 py-2 rounded border hover:bg-gray-100 hover:border-gray-100">
          <img class="max-w-8 max-h-8 min-w-8 min-h-8 h-full w-full rounded-full border border-gray-300 dark:boarder-gray-700" 
            src="${user.profileImg}" alt="Profile Image" />
          <p>${user.firstName} ${user.lastName}</p>
          <p><small class="text-sm text-gray-400 dark:text-gray-600">${user.email}</small></p>
      </a>
    </li>
  `;
  console.log(userRoles, " userRoles");
  const userRolesIds = userRoles.map((userRoles) => userRoles.id);
  const allRoles = await fetchRoles();

  for (let i = 0; i < allRoles.length; i++) {
    const role = allRoles[i];

    assignedRoles += `
      <li class="flex flex-row items-center justify-between px-4 py-2 rounded border mb-2">
        <p class="text-lg font-medium">${role.name}</p>
        <div class="flex flex-row items-center gap-2">
        ${
          !userRolesIds.includes(role.id)
            ? `<a role="button" id="assign-user-role" onclick="handleAssignRoleToUser(${userConceptId}, '${role.name}')" title="Assign Role" class="text-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm p-1 text-center inline-flex items-center dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#777"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            <span class="sr-only">Icon Add Circle</span>
          </a>`
            : `<a role="button" id="remove/-user-role" title="Remove Role" onclick="handleRemoveRoleFromUser(${userConceptId}, '${role.name}')" class="text-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm p-1 text-center inline-flex items-center dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#f00"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            <span class="sr-only">Icon Remove Circle</span>
          </a>
        `
        }
        </div>
      </li>
    `;
  }
  if (userRolesList) userRolesList.innerHTML = assignedRoles;
}

export async function handleAssignRoleToUser(
  userConceptId: number,
  roleName: string
) {
  console.log("assign", { userConceptId, roleName });
  await addRoleToUser({ userConceptId, roleName });
  await getSelectedUserRoles(userConceptId);
}

export async function handleRemoveRoleFromUser(
  userConceptId: number,
  roleName: string
) {
  console.log("remove");
  await removeRoleFromUser({ userConceptId, roleName });
  await getSelectedUserRoles(userConceptId);
}
