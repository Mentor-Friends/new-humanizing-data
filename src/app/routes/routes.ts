import homeIndex from "../pages/home/home.index.ts";
import loginIndex from "../pages/login/login.index.ts";
import signupIndex from "../pages/signup/signup.index.ts";
import dashboardIndex from "../pages/dashboard/dashboard.index.ts";
import listingIndex from "../pages/listing/listing.index.ts";
import listItemIndex from "../pages/listItem/listItem.index.ts";
import profileIndex from "../pages/profile/profile.index.ts";
import noPageFoundIndex from "../pages/noPageFound/noPageFound.index.ts";
import addItemIndex from "../pages/addItem/addItem.index.ts";
import listingItemsIndex from "../pages/listingItems/listingItems.index.ts";
import rfqIndex from "../pages/rfq/rfq.index.ts";
import roleClass from "../pages/roles/roles.index.ts";
import attendanceClass from "../pages/attendance/attendance.index.ts";
import employeeAttendanceClass from "../pages/attendance/employees-attendance/employees-attendance.index.ts";
import indivisualAttendanceClass from "../pages/attendance/indivisual-attendance/indivisual-attendance.index.ts";

type RouteParams = {
  path: string,
  linkLabel?: string,
  content: any
  isAuthenticated?: boolean
}

const routes: RouteParams[] = [
  {
    path: "/",
    linkLabel: "Home",
    content: homeIndex,
  },
  {
    path: "/about",
    linkLabel: "About",
    content: `I am in about page`,
  },
  {
    path: "/login",
    linkLabel: "Login",
    content: loginIndex,
  },
  {
    path: "/signup",
    linkLabel: "signup",
    content: signupIndex,
  },
  {
    path: "/404",
    linkLabel: "404",
    content: noPageFoundIndex,
  },
  {
    path: "/dashboard",
    linkLabel: "dashboard",
    content: dashboardIndex,
    isAuthenticated: true,
  },
  {
    path: "/profile",
    linkLabel: "profile",
    content: profileIndex,
    isAuthenticated: true,
  },
  {
    path: "/listing",
    linkLabel: "listing",
    content: listingIndex,
    isAuthenticated: true,
  },
  {
    path: "/listitem/:id",
    linkLabel: "listitem",
    content: listItemIndex,
    isAuthenticated: true,
  },
  {
    path: "/additem",
    linkLabel: "additem",
    content: addItemIndex,
    isAuthenticated: true,
  },
  {
    path: "/items",
    linkLabel: "items",
    content: listingItemsIndex,
    isAuthenticated: true,
  },
  {
    path: "/rfq",
    linkLabel: "rfq",
    content: rfqIndex,
    isAuthenticated: true,
  },
  {
    path: "/roles",
    content: roleClass,
    isAuthenticated: true
  },
  // attendance
  {
    path: "/attendance",
    content: attendanceClass,
    isAuthenticated: true
  },
  {
    path: "/employee/attendance",
    content: employeeAttendanceClass,
    isAuthenticated: true
  },
  {
    path: "/employee/attendance/:userConcept",
    content: indivisualAttendanceClass,
    isAuthenticated: true
  }
];

export default routes;
