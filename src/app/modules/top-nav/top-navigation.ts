import { logout } from "./top-navigation.service";
import "./top-navigation.style.css";

// Attach the function to the global window object
(window as any).logout = logout;

export default `
  <!-- <link rel="stylesheet" href="src/app/modules/top-nav/top-navigation.style.css"> -->
  <!-- <div class="flex items-center justify-around shadow-md z-10 relative"> -->
  <div class="relative px-4 py-4 flex justify-between items-center bg-white shadow-md z-10">
    <router-link href="/" class="cursor-pointer">
      <img src="../images/humanizing-data.png" alt="humanizing data logo" class="w-16 md:w-32 lg:w-48">
    </router-link>
    <ul id="top-nav" class="hidden lg:flex lg:mx-auto lg:flex lg:items-center lg:mr-8 justify-end lg:w-auto lg:space-x-6">
      <li><router-link href="/dashboard" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Dashboard</router-link></li>
      <li><router-link href="/attendance" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Attendance</router-link></li>
      <li><router-link href="/calendar" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Calendar</router-link></li>
      <li><router-link href="/items" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Items</router-link></li>
      <li><router-link href="/jobs" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Career</router-link></li>
      <li>
        <div class="relative group">
          <router-link class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
            My List 
            <svg viewBox="0 0 360 360" xml:space="preserve" class="w-[12px] h-[12px] inline ms-1">
              <g id="SVGRepo_iconCarrier">
                <path
                  id="XMLID_225_"
                  d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                ></path>
              </g>
            </svg>
          </router-link>

          <div class="absolute z-10 hidden group-hover:block">
              <div class="dropdown-menu w-32 bg-gray-200 px-4 py-2 shadow-lg rounded">
                <ul class="ps-0">
                  <li class="list-none">
                    <router-link href="/listing" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                      My Items
                    </router-link>
                  </li>
                  <li class="list-none">
                    <router-link href="/rfq" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                      My RFQs
                    </router-link>
                  </li>
                  <li class="list-none">
                    <router-link href="/appliedJobs" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                      Applied Jobs
                    </router-link>
                  </li>
                  <li class="list-none">
                    <router-link href="/postedJobs" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                      Posted Jobs
                    </router-link>
                  </li>
                <ul>
            </div>
          </div>
        </div>
      </li>
      
      <!-- <li><router-link href="/listing" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">My Listing</router-link></li>
      <li><router-link href="/rfq" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">RFQ</router-link></li> -->

      <li><router-link href="/profile" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Profile</router-link></li>
      <li><button type="button" class="cursor-pointer text-sm text-red-400 hover:text-red-700" onclick="logout()">Log out</button></li>
      
    </ul>

    <div class="lg:hidden">
      <button class="navbar-burger-login flex items-center text-blue-600 p-3">
        <svg class="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
    </div>

    <div class="navbar-menu-login relative z-50 hidden">
    <div class="navbar-backdrop-login fixed inset-0 bg-gray-800 opacity-25"></div>
    <nav class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
      <div class="flex items-center mb-8">
        <a class="mr-auto text-3xl font-bold leading-none" href="#">
          <img src="./images/humanizing-data.png" alt="humanizing data logo" class="w-16 md:w-32 lg:w-48">
        </a>
        <button class="navbar-close-login">
          <svg class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div>
        <ul>
          <li><router-link href="/dashboard" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Dashboard</router-link></li>
          <li><router-link href="/attendance" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Attendance</router-link></li>
          <li><router-link href="/calendar" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Calendar</router-link></li>
          <li><router-link href="/items" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Items</router-link></li>
          <li><router-link href="/jobs" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Career</router-link></li>
          <!-- <li><router-link href="/listing" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">My Listing</router-link></li>
          <li><router-link href="/rfq" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">RFQ</router-link></li> -->
          <li>
            <div class="relative group">
              <router-link class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                My List 
                <svg viewBox="0 0 360 360" xml:space="preserve" class="w-[12px] h-[12px] inline ms-1">
                  <g id="SVGRepo_iconCarrier">
                    <path
                      id="XMLID_225_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    ></path>
                  </g>
                </svg>
              </router-link>

              <div class="absolute z-10 hidden group-hover:block">
                  <div class="dropdown-menu w-32 bg-gray-200 px-4 py-2 shadow-lg rounded">
                    <ul class="ps-0">
                      <li class="list-none">
                        <router-link href="/listing" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                          My Items
                        </router-link>
                      </li>
                      <li class="list-none">
                        <router-link href="/rfq" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                          My RFQs
                        </router-link>
                      </li>
                      <li class="list-none">
                        <router-link href="/appliedJobs" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                          Applied Jobs
                        </router-link>
                      </li>
                      <li class="list-none">
                        <router-link href="/postedJobs" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">
                          Posted Jobs
                        </router-link>
                      </li>
                    <ul>
                </div>
              </div>
            </div>
          </li>
          <li><router-link href="/profile" class="top-nav-item cursor-pointer text-sm text-gray-600 hover:text-gray-500">Profile</router-link></li>
          <li><button type="button" class="cursor-pointer text-sm text-red-400 hover:text-red-700" onclick="logout()">Log out</button></li>
        </ul>
      </div>
    </nav>
  </div>
  </div>
`;

// setTimeout(() => {
//   initTopNavigation();
// }, 1000);
