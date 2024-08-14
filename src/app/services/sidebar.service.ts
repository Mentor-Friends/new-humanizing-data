import { hasPermission } from "../pages/roles/role.helper";
import { Permission, PermissionAction } from "../pages/roles/roles.service";

export async function sidebarHTML() {
  (window as any).openSidebar = openSidebar;
  (window as any).closeSidebar = closeSidebar;
  (window as any).toggleSidebar = toggleSidebar;
  (window as any).openSubMenu = openSubMenu;

  return `
    <div id="sidebar" class="fixed z-10 w-80 top-0 left-0 h-screen border-r-1 border-r-gray-200 drop-shadow-lg bg-gradient-to-b from-green-800 via-green-900 via-50% to-gray-900 overflow-y-auto transition ease-out duration-1000 transform opacity-100 hidden">
        <div class="flex flex-row items-center justify-center my-8">
            <img class="w-64" src="/images/humanizing-data.png" alt="Humanizing Data Logo">
        </div>
        <ul class="px-2 list-none">
            <li class="mb-1">
                <router-link href="/dashboard" class="flex flex-row items-center text-white justify-between px-4 py-2 rounded hover:bg-gray-100/25 hover:text-white">
                    <span class="flex flex-row items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M418-340q24 24 62 23.5t56-27.5l224-336-336 224q-27 18-28.5 55t22.5 61Zm62-460q59 0 113.5 16.5T696-734l-76 48q-33-17-68.5-25.5T480-720q-133 0-226.5 93.5T160-400q0 42 11.5 83t32.5 77h552q23-38 33.5-79t10.5-85q0-36-8.5-70T766-540l48-76q30 47 47.5 100T880-406q1 57-13 109t-41 99q-11 18-30 28t-40 10H204q-21 0-40-10t-30-28q-26-45-40-95.5T80-400q0-83 31.5-155.5t86-127Q252-737 325-768.5T480-800Zm7 313Z"/></svg>
                        <span>Dashboard</span>
                    </span>
                </router-link>
            </li>
            ${await getUserMenus()}
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

async function getUserMenus() {
  let menusHTML = "";
  console.log("menus", await menus());
  const menuList = await menus();
  for (let i = 0; i < menuList.length; i++) {
    const menu = menuList[i];
    if (!menu.permission) continue;
    let subMenuHTML = getSubMenu(menu.subMenus, i);

    menusHTML += `
        <li class="mb-1">
          <router-link ${
            hasSubmenuAccess(menu.subMenus) ? "" : `href="${menu.url}"`
          } class="flex flex-row items-center justify-between px-4 py-2 rounded hover:bg-gray-100/25" onclick="openSubMenu(${i})">
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
    subMenuHTML += `<ul class="ml-10 list-none subMenu hidden" id="subMenu-${index}">`;
    for (let j = 0; j < subMenus.length; j++) {
      const subMenu = subMenus[j];
      if (!subMenu.permission) continue;
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
  console.log("here", index);
  const subMenus = document.getElementsByClassName("subMenu");
  for (let i = 0; i < subMenus.length; i++) {
    const subMenu = subMenus[i];
    subMenu.classList.add("hidden");
  }
  console.log(document.getElementById(`subMenu-${index}`), "1112");
  document.getElementById(`subMenu-${index}`)?.classList.remove("hidden");
}

const menus = async () => {
  console.log(
    await hasPermission(Permission.attendance, [
      PermissionAction.create,
      PermissionAction.view,
    ])
  );
  return [
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
      permission: await hasPermission(Permission.attendance, [
        PermissionAction.create,
        PermissionAction.view,
      ]),
    },
    {
      url: "/employee/attendance",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z"/></svg>`,
      name: "Employee",
      permission: await hasPermission(
        Permission.employee,
        PermissionAction.delete
      ),
      subMenus: [
        {
          url: "/employee/hired",
          name: "Employee Hired",
        },
        {
          url: "/employee/attendance",
          name: "Employee Attendance",
          permission: await hasPermission(
            Permission.attendance,
            PermissionAction.delete
          ),
        },
      ],
    },
    {
      url: "/items",
      name: "Items",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z"/></svg>`,
      permission: await hasPermission(Permission.items, [
        PermissionAction.delete,
      ]),
    },
    {
      url: "/listing",
      name: "Listing",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z"/></svg>`,
      permission: await hasPermission(Permission.listing, [
        PermissionAction.delete,
      ]),
    },
    {
      url: "/roles",
      name: "User Roles",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm560 40-12-60q-12-5-22.5-10.5T584-204l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-460l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T732-180l-12 60h-80Zm40-120q33 0 56.5-23.5T760-320q0-33-23.5-56.5T680-400q-33 0-56.5 23.5T600-320q0 33 23.5 56.5T680-240ZM400-560q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Z"/></svg>`,
      permission: await hasPermission(Permission.role, [
        PermissionAction.view,
        PermissionAction.create,
        PermissionAction.update,
        PermissionAction.delete,
      ]),
    },
  ];
};
