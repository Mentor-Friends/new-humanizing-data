import mainViewClass from "../../default/mainView.class";
import { submitSignupForm } from "./signup.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Login | Humanizing Data");
  }

  async getHtml(): Promise<string> {
    // Attach the function to the global window object
    (window as any).submitSignupForm = submitSignupForm;

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 h-screen overflow-y-auto text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
        <div class="hidden md:grid bg-green-900 h-screen place-content-center">
          <img alt="humanzing logo" src="/images/humanizing-data-icon.png" />
        </div>

        <div class="min-h-screen overflow-y-auto p-10">
          <h2 class="text-2xl mb-4">Sign Up</h2>
          <p>
            Don't have an account? <router-link class="cursor-pointer text-sky-500 hover:text-sky-700" href="/login">Sign in</router-link>
          </p>

          <form method="post" action="/" onsubmit="submitSignupForm(event)">
            <div class="mt-2">
              <label for="type" class="block text-sm font-medium leading-6">Type <span class="text-rose-400">*</span></label>
              <select id="type" name="type" autocomplete="type-name" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                <option value="person">Person</option>
                <option value="company">Company</option>
                <option value"student">Student</option>
              </select>
            </div>

            <div class="mt-2">
            <label for="username" class="block text-sm font-medium leading-6">Username <span class="text-rose-400">*</span></label>
              <input type="text" name="username" id="username" autocomplete="username-name" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>

            <div class="mt-2">
            <label for="email" class="block text-sm font-medium leading-6">Email <span class="text-rose-400">*</span></label>
              <input type="email" name="email" id="email" autocomplete="email-id" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>

            <div class="mt-2">
            <label for="gender" class="block text-sm font-medium leading-6">Gender <span class="text-rose-400">*</span></label>
              <select id="gender" name="gender" autocomplete="gender-name" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                <option value="" selected disabled>--- select gender ---</option>
                <option value="mr">Mr</option>
                <option value"mrs">Mrs</option>
                <option value"miss">Miss</option>
              </select>
            </div>

            <div class="mt-2">
            <label for="firstName" class="block text-sm font-medium leading-6">First name <span class="text-rose-400">*</span></label>
              <input type="text" name="firstName" id="firstName" autocomplete="first-name" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>

            <div class="mt-2">
            <label for="lastName" class="block text-sm font-medium leading-6">Last name <span class="text-rose-400">*</span></label>
              <input type="text" name="lastName" id="lastName" autocomplete="last-name" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>

            <div class="mt-2">
            <label for="password" class="block text-sm font-medium leading-6">Password <span class="text-rose-400">*</span></label>
              <input type="password" name="password" id="password" autocomplete="new-password" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>

            <div class="mt-2">
            <label for="confirmPassword" class="block text-sm font-medium leading-6">Confirm password <span class="text-rose-400">*</span></label>
              <input type="password" name="confirmPassword" id="confirmPassword" autocomplete="confirm-password" class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
            <p class="text-sm my-4">Submitting this form you are agreed to the Terms and Conditions and Privacy Policy</p>

            <button class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg" type="submit">Submit</button>
          </form>

          <div class="py-8 block w-full md:w-1/2 text-center">
            <router-link href="/" class="cursor-pointer">
              &larr; Back to Home
            </router-link>
          </div>
          
        </div>
      </div>
    `;
  }
}
