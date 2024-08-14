import { GetTheConceptLocal, LocalSyncData } from "mftsccs-browser";
import {
  formatUserComposition,
  getLocalStorageData,
} from "../../../services/helper.service";
import { hasRole } from "../../roles/role.helper";
import {
  fetchLeaveRequest,
  getEmployeeUsers,
  leaveStatus,
} from "../leave.helper";
import { updateTypeConceptLocal } from "../../../services/UpdateTypeConcept";
import { updateContent } from "../../../routes/renderRoute.service";
import { CreateConnectionBetweenEntityLocal } from "../../../services/entity.service";
import { EmailBody, sendEmail } from "../../../services/mail.service";
import { getLinkReverse } from "../../../services/apis.service";

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

  const isEmployee = await hasRole("ROLE_EMPLOYEE");
  // filter only user details if role employee
  if (isEmployee) {
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

export async function changeLeaveRequestStatus(
  leaveRequestId: number,
  newStatus: leaveStatus
) {
  const profileStorageData: any = await getLocalStorageData();
  const userConceptId = profileStorageData?.userConcept;
  const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  const leaveRequestConcept = await GetTheConceptLocal(leaveRequestId);
  const userConceptL = await GetTheConceptLocal(userConceptId);
  const requestedData: any = await getLinkReverse(
    token,
    leaveRequestId,
    "the_user_leave_request"
  );

  if (!requestedData?.output?.[0]?.id) return;
  const requestedUserComposition = formatUserComposition(
    requestedData?.output?.[0]
  );
  if (newStatus == leaveStatus.Approved) {
    // send mail to user
    const mailBody: EmailBody = {
      heading: "Leave Request Approved",
      body: `
        Your Leave Request has been Approved.

        <a href="${location.href}">View</a>
      `,
      toAddress: requestedUserComposition.email,
    };
    sendEmail(mailBody, token);
  } else if (newStatus == leaveStatus.Declined) {
    // send mail to user
    const mailBody: EmailBody = {
      heading: "Leave Request Declined",
      body: `
        Your Leave Request has been Declined.

        <a href="${location.href}">View</a>
      `,
      toAddress: requestedUserComposition.email,
    };
    sendEmail(mailBody, token);
  }

  await updateTypeConceptLocal(
    userId,
    token,
    leaveRequestConcept,
    "status",
    "status",
    newStatus.toString()
  );

  // link to know who updated the composition
  await CreateConnectionBetweenEntityLocal(
    leaveRequestConcept,
    userConceptL,
    "updated_by"
  );

  await LocalSyncData.SyncDataOnline();
  updateContent("/leave-requests");
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
  const isEmployerOrAdmin =
    (await hasRole("ROLE_EMPLOYER")) || (await hasRole("ROLE_ADMIN"));

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
              <span class="${getStatusClass(request.status)}">
                ${request.status}
              </span>
            </td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">
              ${
                isEmployerOrAdmin || request.status == leaveStatus.Pending
                  ? `
                <div class="inline-block text-left">
                  <button type="button" 
                    onclick="toggleDropdownMenuOption(event, 'dropdown-menu-${
                      request.id
                    }')" 
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="inherit"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                  </button>
                  <div 
                    id="dropdown-menu-${request.id}" 
                    class="dropdown-menu absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                      <div class="py-1" role="none">
                        ${
                          request.status == leaveStatus.Pending
                            ? `<a 
                            role="button" 
                            onclick="changeLeaveRequestStatus(${request.id}, '${leaveStatus.Cancelled}')" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500" 
                            role="menuitem" tabindex="-1" id="menu-item-1">Mark as Cancelled</a>`
                            : ""
                        }
                        ${
                          isEmployerOrAdmin &&
                          request.status != leaveStatus.Approved
                            ? `<a 
                                role="button" 
                                onclick="changeLeaveRequestStatus(${request.id}, '${leaveStatus.Approved}')" 
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500" 
                                role="menuitem" tabindex="-1" id="menu-item-1">Mark as Accepted</a>`
                            : ""
                        }
                        ${
                          isEmployerOrAdmin &&
                          request.status != leaveStatus.Declined
                            ? `<a 
                              role="button" 
                              onclick="changeLeaveRequestStatus(${request.id}, '${leaveStatus.Declined}')" 
                              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-500" 
                              role="menuitem" tabindex="-1" id="menu-item-1">Mark as Declined</a>`
                            : ""
                        }
                      </div>
                  </div>
                </div>
                `
                  : ""
              }
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
      value = "text-gray-800 dark:text-zinc-200";
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
