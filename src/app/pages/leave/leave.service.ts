import { fetchLeaveRequest } from "./leave.helper";

export async function populateLeaveRequest() {
  const leaveRequestBody = document.getElementById("leave-requests");
  if (!leaveRequestBody) return;

  const leaveRequests: any[] = await fetchLeaveRequest();

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
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">24</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">12</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">36</td>
            <td scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">0</td>
        </tr>
    `;
  }
  leaveRequestBody.innerHTML = leaveRequestHTML
}
