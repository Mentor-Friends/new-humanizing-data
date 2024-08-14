import mainViewClass from "../../default/mainView.class";
import { submitLoginForm } from "./login.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Login | Humanizing Data");
  }

  async getHtml(): Promise<string> {
    // Attach the function to the global window object
    (window as any).submitLoginForm = submitLoginForm;

    return `
      <!-- <link rel="stylesheet" href="src/app/pages/login/login.style.css"> -->
      <div class="grid grid-cols-1 md:grid-cols-2 overflow-y-auto text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
        <div class="hidden md:grid bg-green-900 h-screen place-content-center">
          <router-link href="/" class="cursor-pointer">
            <img alt="humanzing logo" src="/images/humanizing-data-icon.png">
          </router-link>
        </div>

        <div class="h-screen p-10">
          <h2 class="text-2xl mb-4">Sign In</h2>
          <!-- <p>Don't have an account? <span id="signup-link">Sign up</span></p>-->
          <p>Don't have an account? <router-link href="/signup" class="cursor-pointer text-sky-500 hover:text-sky-700">Sign up</router-link></p>
          <form method="post" action="/" class="mt-8" onsubmit="submitLoginForm(event)" id="login-form">
            <label for="email" class="block w-full">Email Address</label>
            <input type="text" name="email" id="email" autocomplete="user-email" class="h-10 border mt-1 rounded px-4 w-full md:w-1/2 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900" value="" placeholder="email@domain.com" />

            <label for="password" class="block w-full mt-5">Password</label>
            <input type="password" name="password" id="password" autocomplete="current-password" class="h-10 border mt-1 rounded px-4 w-full md:w-1/2 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900" value="" placeholder="******" />

            <div class="block w-full md:w-1/2 mt-5" id="login-submit">
              <button id="login-btn" type="submit" class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-md w-full">Submit</button>
            </div>
            
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
