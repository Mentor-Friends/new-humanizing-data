import { createRoleTitle, updateRoleTitle } from "../../modules/roles/create/create-role-modal";
import {
  submitCreateRoleForm,
  submitUpdateRoleForm,
} from "../../modules/roles/create/create-role-modal.service";
import { closeModal, openModal } from "../listItem/listItem.service";
import { fetchRoles } from "./roles.apis";

export enum Permission {
  rfq = "RFQ",
  listing = "Listing",
  attendance = "Attendance",
}

export enum PermissionAction {
  view = "view",
  create = "create",
  update = "update",
  delete = "delete",
  show_in_menu = "show_in_menu",
}

export async function getRolesList() {
  const roleList: any = await fetchRoles();

  let roleRows = "";

  for (let i = 0; i < roleList.length; i++) {
    const role = roleList[i];
    roleRows += `
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" capitalize>${role.name}</td>
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div class="flex flex-row items-center gap-2">
                <a role="button" onclick="showEditRoleModal(${role.id})" class="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#333"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    <span class="sr-only">Icon Edit</span>
                </a>
            </div>
        </td>
    </tr>
    `;
  }

  return roleRows;
}

export async function openCreateRoleModal() {
  await openModal("create-role-modal");
  const roleForm = document.getElementById("createRoleForm") as HTMLFormElement;

  roleForm?.addEventListener("submit", (e: any) => {
    e.preventDefault();
    submitCreateRoleForm(e);
  });
}

export async function showEditRoleModal(id: number) {
  const roleForm = document.getElementById("createRoleForm") as HTMLFormElement;
  const roleModalTitle = document.getElementById("roleTitle");
  const nameInput = roleForm.querySelector(`[name="name"]`) as HTMLInputElement;
  if (roleModalTitle) roleModalTitle.innerText = updateRoleTitle;

  const roles = await fetchRoles();
  await openModal("create-role-modal");

  const selectedRole = roles.find((roles: any) => roles.id == id);
  console.log(roles, "rooles", id, selectedRole);
  if (!selectedRole) {
    console.log("role not found");
    return;
  }

  // update values and add submit listener
  Object.keys(Permission).forEach((permission) => {
    Object.keys(PermissionAction).forEach((action) => {
      if (hasPermissionChecked(selectedRole.permissions, permission, action)) {
        const checkbox = document.getElementById(
          `${permission}_${action}`
        ) as HTMLInputElement;
        if (checkbox) checkbox.checked = true;
      }
    });
  });
  if (nameInput) nameInput.value = selectedRole.name;

  roleForm?.addEventListener("submit", (e: any) => {
    e.preventDefault();
    submitUpdateRoleForm(e);
  });
}

export async function closeRoleModal() {
  await closeModal("create-role-modal");

  (document.getElementById("createRoleForm") as HTMLFormElement)?.reset();

  const roleModalTitle = document.getElementById("roleTitle");
  if (roleModalTitle) roleModalTitle.innerText = createRoleTitle;
}

export function getPermissionActionRows() {
  let permissionActionRows = "";
  Object.keys(PermissionAction).forEach((action) => {
    permissionActionRows += `<th scope="col" class="px-6 py-3 border border-gray-300">${action}</th>`;
  });
  return permissionActionRows;
}
export function getPermissionRows() {
  let permissionRows = "";
  Object.keys(Permission).forEach((permission) => {
    permissionRows += `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${permission}</td>`;
    Object.keys(PermissionAction).forEach((action) => {
      permissionRows += `
            <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                <div class="flex items-center justify-center">
                    <input id="${permission}_${action}" name="${permission}_${action}" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <!-- <label for="checked-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Create</label> -->
                </div>
            </td>
            `;
    });
    permissionRows += `</tr>`;
  });

  return permissionRows;
}

function hasPermissionChecked(
  permissions: any[],
  permission: string,
  action: string
) {
  const currentPermission = permissions.find(
    (permissionItem: any) =>
      permissionItem?.internal_permission?.data?.module_name == permission
  );
  console.log(currentPermission, "current permission", permission, action);
  if (!currentPermission) return false;
  if (currentPermission?.internal_permission?.data?.[action] == 1 || currentPermission?.internal_permission?.data?.[action] == "1")
    return true;
  return false;
}
