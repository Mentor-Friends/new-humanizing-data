import mainViewClass from "../../default/mainView.class";
import { showDropdownMenuOption } from "../../services/dropdown.service";
import { getEmployeeList, getEmployeeRows } from "./hired-employee.service";

export default class extends mainViewClass {
  async getHtml(): Promise<string> {
    (window as any).showDropdownMenuOption = showDropdownMenuOption;

    const employeeList = await getEmployeeList();
    const employeeRows = await getEmployeeRows(employeeList);

    return `
        <div class="container mx-auto my-5 text-gray-800 dark:text-white">
            <h3 class="text-3xl font-bold">Hired Employees</h3>
            <div class="w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th scope="col" class="px-6 py-3">DP</th>
                              <th scope="col" class="px-6 py-3">Name</th>
                              <th scope="col" class="px-6 py-3">Email</th>
                              <th scope="col" class="px-6 py-3">Phone</th>
                              <th scope="col" class="px-6 py-3">Department</th>
                              <th scope="col" class="px-6 py-3">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                        ${employeeRows}
                      </tbody>
                  </table>
                </div>
            </div>
        </div>
        `;
  }
}
