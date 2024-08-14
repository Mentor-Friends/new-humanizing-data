import { getBuyerAgents } from "./rfq-modal.service";
import { closeModal, addDocument, submitRFQForm } from "../../pages/listItem/listItem.service"
(window as any).closeModal = closeModal;
(window as any).addDocument = addDocument;
(window as any).submitRFQForm = submitRFQForm;

export default async function rfqModalHTML() {
  const buyAgentsEl = await getBuyerAgents()

  return `
    <div class="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
    <div class="flex justify-between px-4 pt-4">
      <h3 class="text-xl font-normal text-zinc-900 dark:text-white my-0">Request for Quote</h3>
      <button onclick="closeModal('rfq-modal')" type="button"
        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>

    <div class="p-6 pt-0">
      <form method="post" onsubmit="submitRFQForm(event)" name="RFQForm" id="rfq-form">
        <div class="my-4">
          <label for="title" class="block text-sm font-medium leading-6">Title<span
              class="text-rose-400">*</span></label>
          <div class="mt-2">
            <input type="text" name="title" id="title" autocomplete="rfq-title"
              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
        </div>
        <div class="my-4">
          <label for="description" class="block text-sm font-medium leading-6">Description<span
              class="text-rose-400">*</span></label>
          <div class="mt-2">
            <textarea type="text" name="description" id="description" autocomplete="rfq-description"
              class="block w-full resize-none rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"></textarea>
          </div>
        </div>
        <div class="my-4">
          <label for="budget" class="block text-sm font-medium leading-6">Budget<span
              class="text-rose-400">*</span></label>
          <div class="mt-2">
            <input type="number" name="budget" id="budget" autocomplete="rfq-budget"
              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
        </div>
        <!-- <div class="my-4">
          <label for="owner" class="block text-sm font-medium leading-6">Owner<span
              class="text-rose-400">*</span></label>
          <div class="mt-2">
            <input type="email" placeholder="owner@email.com" name="owner" id="owner" autocomplete="rfq-owner"
              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
        </div> -->
        <div class="my-4">
          <label for="attachment" class="block text-sm font-medium leading-6">Attachment<span
              class="text-rose-400">*</span></label>
          <div class="mt-2">
            <input type="file" accept=".pdf,.txt,.doc,.docx,.xls,.xlsx" onclick="addDocument()" name="attachment" id="attachment" autocomplete="rfq-attachment"
              class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
        </div>

        <div class="my-4">
          <label for="buyeragent" class="block text-sm font-medium leading-6">Buy agent<span
            class="text-rose-400">*</span></label>
          <select id="buyeragent" name="buyeragent" autocomplete="rfq-buyeragent"
            class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            <option value="" disabled selected>--- select buyer agent ---</option>
            ${buyAgentsEl}
          </select>
        </div>

        <div class="text-right">
          <button type="button" onclick="closeModal('rfq-modal')"
            class="text-gray-900 bg-white hover:bg-gray-300 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
            data-modal-toggle="delete-user-modal">
            Cancel
          </button>
          <button type="submit"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
            Send RFQ Now
          </button>
        </div>
      </form>

    </div>
  </div>
  `
}