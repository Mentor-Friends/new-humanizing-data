import { hasPermission } from "../pages/roles/role.helper";
import { Permission, PermissionAction } from "../pages/roles/roles.service";

(window as any).openSidebar = openSidebar;
(window as any).closeSidebar = closeSidebar;
(window as any).toggleSidebar = toggleSidebar;
(window as any).openSubMenu = openSubMenu;

export function sidebarHTML() {
  return `
    <div id="sidebar" class="fixed z-10 w-80 top-0 left-0 h-screen border-r-1 border-r-gray-200 drop-shadow-lg bg-gradient-to-b from-green-800 via-green-900 via-50% to-gray-900 overflow-y-auto hidden">
        <div class="flex flex-row items-center justify-center my-8">
            <img class="w-64" src="./../images/humanizing-data.png" alt="Humanizing Data Logo">
        </div>
        <ul class="px-2">
            <li class="mb-1">
                <router-link href="/dashboard" class="flex flex-row items-center text-white justify-between px-4 py-2 rounded hover:bg-gray-100/25 hover:text-white">
                    <span class="flex flex-row items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M418-340q24 24 62 23.5t56-27.5l224-336-336 224q-27 18-28.5 55t22.5 61Zm62-460q59 0 113.5 16.5T696-734l-76 48q-33-17-68.5-25.5T480-720q-133 0-226.5 93.5T160-400q0 42 11.5 83t32.5 77h552q23-38 33.5-79t10.5-85q0-36-8.5-70T766-540l48-76q30 47 47.5 100T880-406q1 57-13 109t-41 99q-11 18-30 28t-40 10H204q-21 0-40-10t-30-28q-26-45-40-95.5T80-400q0-83 31.5-155.5t86-127Q252-737 325-768.5T480-800Zm7 313Z"/></svg>
                        <span>Dashboard</span>
                    </span>
                </router-link>
            </li>
            ${getUserMenus()}
            <li class="mb-1">
                <a role="button" onclick="logout()" class="flex flex-row items-center text-white justify-between px-4 py-2 rounded hover:bg-gray-100/25 hover:text-white">
                    <span class="flex flex-row items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                        <span>Log out</span>
                    </span>
                </a>
            </li>
        </div>
    </div>
  `;
}

export function sidebarMenu() {
  return `
      <a class="p-1" role="button" onclick="toggleSidebar()">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
          <span class="sr-only">Icon Menu</span>
      </a>
  `;
}

export function openSidebar() {
  console.log("open");
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("hidden");
}

export function closeSidebar() {
  console.log("close");
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("hidden");
}

export function toggleSidebar() {
  console.log("toggle");
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("hidden");
}

function getUserMenus() {
  let menusHTML = "";

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    // if (!menu.permission) continue;
    let subMenuHTML = getSubMenu(menu.subMenus, i);

    menusHTML += `
        <li class="mb-1">
          <router-link ${hasSubmenuAccess(menu.subMenus) ? '' : `href="${menu.url}"`} class="flex flex-row items-center justify-between px-4 py-2 rounded hover:bg-gray-100/25" onclick="openSubMenu(${i})">
              <span class="flex flex-row items-center gap-2">
                ${menu.svg ? menu.svg : ""}
                <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m612-550 141-142-28-28-113 113-57-57-28 29 85 85ZM120-160v-80h480v80H120Zm520-280q-83 0-141.5-58.5T440-640q0-83 58.5-141.5T640-840q83 0 141.5 58.5T840-640q0 83-58.5 141.5T640-440Zm-520-40v-80h252q7 22 16 42t22 38H120Zm0 160v-80h376q23 14 49 23.5t55 13.5v43H120Z"/></svg> -->
                <span>${menu.name}</span>
              </span>
              ${
                hasSubmenuAccess(menu.subMenus)
                  ? `
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                </span>
                `
                  : ""
              }
          </router-link>
          ${subMenuHTML}
        </li>
        `;
  }
  return menusHTML;
}
function getSubMenu(subMenus: any, index: number) {
  let subMenuHTML = "";
  if (subMenus && hasSubmenuAccess(subMenus)) {
    subMenuHTML += `<ul class="ml-10 subMenu hidden" id="subMenu-${index}">`;
    for (let j = 0; j < subMenus.length; j++) {
      const subMenu = subMenus[j];
      // if (!subMenu.permission) continue
      subMenuHTML += `
        <li>
          <router-link href="${subMenu.url}" class="flex px-3 py-2 rounded hover:bg-gray-100/25 mb-1">
            <span>${subMenu.name}</span>
          </router-link>
        </li>
      `;
    }
    subMenuHTML += `</ul>`;
  }
  return subMenuHTML;
}

function hasSubmenuAccess(subMenus: any[] = []) {
  // return true;
  if (subMenus.length == 0) return false;

  for (let i = 0; i < subMenus.length; i++) {
    const subMenu = subMenus[i];
    if (subMenu.permission) return true;
  }
  return false;
}

function openSubMenu(index: number) {
  console.log('here', index)
  const subMenus = document.getElementsByClassName("subMenu");
  for (let i = 0; i < subMenus.length; i++) {
    const subMenu = subMenus[i];
    subMenu.classList.add("hidden");
  }
  console.log(document.getElementById(`subMenu-${index}`), '1112')
  document.getElementById(`subMenu-${index}`)?.classList.remove("hidden");
}

const menus = [
  {
    url: "/listing",
    icon: "",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m612-550 141-142-28-28-113 113-57-57-28 29 85 85ZM120-160v-80h480v80H120Zm520-280q-83 0-141.5-58.5T440-640q0-83 58.5-141.5T640-840q83 0 141.5 58.5T840-640q0 83-58.5 141.5T640-440Zm-520-40v-80h252q7 22 16 42t22 38H120Zm0 160v-80h376q23 14 49 23.5t55 13.5v43H120Z"/></svg>`,
    name: "My Listing",
  },
  {
    url: "/attendance",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m612-550 141-142-28-28-113 113-57-57-28 29 85 85ZM120-160v-80h480v80H120Zm520-280q-83 0-141.5-58.5T440-640q0-83 58.5-141.5T640-840q83 0 141.5 58.5T840-640q0 83-58.5 141.5T640-440Zm-520-40v-80h252q7 22 16 42t22 38H120Zm0 160v-80h376q23 14 49 23.5t55 13.5v43H120Z"/></svg>`,
    name: "Attendnace",
    permission: hasPermission(Permission.attendance, [
      PermissionAction.create,
      PermissionAction.view,
    ]),
  },
  {
    url: "/employee/attendance",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m612-550 141-142-28-28-113 113-57-57-28 29 85 85ZM120-160v-80h480v80H120Zm520-280q-83 0-141.5-58.5T440-640q0-83 58.5-141.5T640-840q83 0 141.5 58.5T840-640q0 83-58.5 141.5T640-440Zm-520-40v-80h252q7 22 16 42t22 38H120Zm0 160v-80h376q23 14 49 23.5t55 13.5v43H120Z"/></svg>`,
    name: "Employee",
    permission: hasPermission(Permission.attendance, PermissionAction.delete),
    subMenus: [
      {
        url: "/employee/attendance",
        name: "Employee Attendance",
        permission: hasPermission(
          Permission.attendance,
          PermissionAction.delete
        ),
      },
    ],
  },
];
