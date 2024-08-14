import { submitSignupForm } from "./signup.service";

// Attach the function to the global window object
(window as any).submitSignupForm = submitSignupForm;

export default `
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
  <div class="grid bg-green-900 h-screen place-content-center">
    <img alt="humanzing logo" src="/images/humanizing-data-icon.png" />
  </div>

  <div class="h-screen p-10">
    <h2 class="text-2xl mb-4">Sign Up</h2>
    <p>
      Don't have an accountcha? <router-link class="cursor-pointer text-sky-500 hover:text-sky-700" href="/login">Sign in</router-link>
    </p>

    <form method="post" action="/" onsubmit="submitSignupForm(event)">
      <label for="type" class="block text-sm font-medium leading-6 text-gray-900">Type <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <select id="type" name="type" autocomplete="type-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <option value="person">Person</option>
          <option value="company">Company</option>
          <option value="student">Student</option>
        </select>
      </div>

      <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <input type="text" name="username" id="username" autocomplete="username-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      </div>

      <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <input type="email" name="email" id="email" autocomplete="email-id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      </div>

      <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <select id="gender" name="gender" autocomplete="gender-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <option value="" selected disabled>--- select gender ---</option>
          <option value="mr">Mr</option>
          <option value="mrs">Mrs</option>
          <option value="miss">Miss</option>
        </select>
      </div>

      <label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">First name <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <input type="text" name="firstName" id="firstName" autocomplete="first-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      </div>

      <label for="lastName" class="block text-sm font-medium leading-6 text-gray-900">Last name <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <input type="text" name="lastName" id="lastName" autocomplete="last-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      </div>

      <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <input type="password" name="password" id="password" autocomplete="new-password" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      </div>
      <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">Confirm password <span class="text-rose-400">*</span></label>
      <div class="mt-2">
        <input type="password" name="confirmPassword" id="confirmPassword" autocomplete="confirm-password" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      </div>
      <p class="text-sm my-4">Submitting this form you are agreed to the Terms and Conditions and Privacy Policy</p>

      <button class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg" type="submit">Submit</button>
    </form>

    <!-- <section class="flex flex-row flex-wrap mt-8">
      <input
        id="tab-one"
        type="radio"
        name="tabs"
        class="peer/tab-one opacity-0 absolute"
        checked
      />
      <label
        for="tab-one"
        class="w-full md:w-1/4 bg-slate-300 hover:bg-slate-200 peer-checked/tab-one:bg-amber-200 cursor-default p-4 rounded-t-lg block"
      >
        <p>Employer</p>
        <p><small>(Join Our team)</small></p>
      </label>

      <input
        id="tab-two"
        type="radio"
        name="tabs"
        class="peer/tab-two opacity-0 absolute"
      />
      <label
        for="tab-two"
        class="w-full md:w-1/4 bg-slate-300 hover:bg-slate-200 peer-checked/tab-two:bg-amber-200 cursor-default p-4 rounded-t-lg block"
      >
        <p>Employee</p>
        <p><small>(Join Our team)</small></p>
      </label>

      <div class="basis-full h-0"></div>

      <div
        class="bg-amber-200 hidden peer-checked/tab-one:block p-4 w-full md:w-1/2"
      >
        <form method="post" action="/">
          <label for="email" class="block w-full">Email Address</label>
          <input
            type="text"
            name="email"
            id="email"
            class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
            value=""
            placeholder="email@domain.com"
          />

          <label for="password" class="block w-full mt-5">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
            value=""
            placeholder="******"
          />

          <div class="block w-full mt-5">
            <button
              id="login-btn"
              type="submit"
              class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-md w-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div
        class="bg-amber-200 hidden peer-checked/tab-two:block p-4 w-full md:w-1/2"
      >
        <p>Employee Tab</p>
      </div>
    </section> -->
  </div>
</div>
`;
