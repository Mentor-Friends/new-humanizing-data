import homeNavigation from "../../modules/home-nav/home-navigation"

export default `
  ${homeNavigation}
  <!-- <h1>Home page</h1>
  <router-link href="/login"
    class="bg-green-600 hover:bg-green-900 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg">Login</router-link>
  <router-link href="/signup"
    class="bg-green-600 hover:bg-green-900 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg">Signup</router-link>
  <router-link href="/dashboard"
    class="bg-green-600 hover:bg-green-900 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg">Dashboard</router-link> -->

  <div class="w-full px-8 py-24 text-center bg-slate-200">
    <div class="lg:w-1/2 mx-auto">
      <h1 class="my-4">Humanizing Data</h1>
      <h2 class="text-2xl">using the best practices to find staff and develop the software concepts you want.</h2>
    </div>
    <div class="flex justify-center mt-8">
      <router-link href="/login"
        class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg">Join
        our team</router-link>
      <router-link href="/signup"
        class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg">Hire
        our team</router-link>
    </div>
  </div>

  <!-- About -->
  <div class="my-8">
    <h2 class="text-center text-5xl">ABOUT US</h2>
    <div class="w-4/5 flex justify-center mx-auto my-8 gap-8">
      <div class="w-1/2">
        <p>HumanizingData.com is the premier software development source with a mission to serve your unique software
          development needs on time in budget with speed and style, on any device.</p>
        <p>Our services include:</p>
        <ul class="list-disc ps-8 mt-8">
          <li>Seamless data consolidation (files, programs, procedures, SQL data & structures)</li>
          <li>Create new websites.</li>
          <li>Create, manipulate, store and search web data.</li>
          <li>Create apps on any device (Computers, servers, phones, tablets, microchips)</li>
          <li>Reading web pages of your sources and competitors for current information.</li>
        </ul>
      </div>

      <div class="w-1/2">
        <p>HumanizingData.com has adopted a more relatable and personable communications style for interacting with
          clients and building their software with the unique freeSCHEMA.com Semantic Concept Connection System framework.
          Our teams produce well documented, secure, adaptable, scalable multi-user, multi-enterprise and multi-platform
          data solutions for clients like you.</p>

        <p>By using the freeSCHEMA.com data fabric we are able to provide</p>
        <ul class="list-disc ps-8 mt-8">
          <li>Making data easy to understand.</li>
          <li>Relatable, reliable, readable and personable software communications.</li>
          <li>A multi-user, multi-enterprise and multi-device data structure.</li>
          <li>Flexibility and accessibility for Enterprise wide data processing.</li>
          <li>Efficiency and security for your data.</li>
          <li>Speed in the planning, development and production of data.</li>
          <li>Happy programmers who preform with grace and competence.</li>
        </ul>
      </div>
    </div>
  </div>
`