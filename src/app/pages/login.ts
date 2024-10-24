export default `
  <div class="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
    <div class="grid bg-green-900 h-screen place-content-center">
      <img alt="humanzing logo" src="/images/humanizing-data-icon.png">
    </div>

    <div class="h-screen p-10">
      <h2 class="text-2xl mb-4">Sign In</h2>
      <!-- <p>Don't have an account? <a href="/signup" id="signup-link">Sign up</a></p> -->
      <p>Don't have an account? <span id="signup-link">Sign up</span></p>
      <!-- <a href="/signup" onclick="alert('Hello'); ">A Tag</a> -->
      <form method="post" action="/" class="mt-8">
        <label for="email" class="block w-full">Email Address</label>
        <input type="text" name="email" id="email" class="h-10 border mt-1 rounded px-4 w-full md:w-1/2 bg-gray-50" value="" placeholder="email@domain.com" />

        <label for="password" class="block w-full mt-5">Password</label>
        <input type="password" name="password" id="password" class="h-10 border mt-1 rounded px-4 w-full md:w-1/2 bg-gray-50" value="" placeholder="******" />

        <div class="block w-full md:w-1/2 mt-5">
          <button id="login-btn" type="submit" class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-md w-full">Submit</button>
        </div>
      </form>
    </div>
  </div>
`;