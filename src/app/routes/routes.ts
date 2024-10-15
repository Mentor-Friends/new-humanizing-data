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
import roleIndex from "../pages/roles/roles.index.ts";
import attendanceIndex from "../pages/attendance/user-attendance/attendance.index.ts";
import employeeHiredIndex from "../pages/hired-employee/hired-employee.index.ts";
import employeeAttendanceIndex from "../pages/attendance/employees-attendance/employees-attendance.index.ts";
import indivisualAttendanceIndex from "../pages/attendance/indivisual-attendance/indivisual-attendance.index.ts";
import leaveIndex from "../pages/leave/leave.index.ts";
import leaveRequestsIndex from "../pages/leave/leave-requests/leave-requests.index.ts";
import jobListIndex from "../pages/jobs/jobList/jobList.index.ts";
import jobIndex from "../pages/jobs/job/job.index.ts";
import appliedJobsIndex from "../pages/jobs/appliedJobs/appliedJobs.index.ts";
import postedJobsIndex from "../pages/jobs/postedJobs/postedJobs.index.ts";
import calendarIndex from "../pages/calendar/calendar.index.ts";
import settingsIndex from "../pages/settings/settings.index.ts";
import accountingIndex from "../pages/accounting/accounting.index.ts";
import { Salary } from "../pages/salary/salary.index.ts";
import { others } from "../pages/salary/others.index.ts";
import { userdata } from "../pages/salary/userdata.index.ts";
import { list } from "../pages/salary/list.index.ts";

type RouteParams = {
  path: any;
  linkLabel?: string;
  content: any;
  isAuthenticated?: boolean;
};

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
    content: roleIndex,
    isAuthenticated: true,
  },
  // attendance
  {
    path: "/attendance",
    content: attendanceIndex,
    isAuthenticated: true,
  },
  {
    path: "/employee/hired",
    content: employeeHiredIndex,
    isAuthenticated: true,
  },
  {
    path: "/employee/attendance",
    content: employeeAttendanceIndex,
    isAuthenticated: true,
  },
  {
    path: "/employee/attendance/:userConcept",
    content: indivisualAttendanceIndex,
    isAuthenticated: true,
  },
  {
    path: "/jobs",
    content: jobListIndex,
    isAuthenticated: true,
  },
  {
    path: "/job/:id",
    content: jobIndex,
    isAuthenticated: true,
  },
  {
    path: "/appliedJobs",
    content: appliedJobsIndex,
    isAuthenticated: true,
  },
  {
    path: "/postedJobs",
    content: postedJobsIndex,
    isAuthenticated: true,
  },
  {
    path: "/calendar",
    content: calendarIndex,
    isAuthenticated: true,
  },
  {
    path: "/leave",
    content: leaveIndex,
    isAuthenticated: true,
  },
  {
    path: "/leave-requests",
    content: leaveRequestsIndex,
    isAuthenticated: true,
  },
  {
    path: "/salary",
    content: Salary,
    isAuthenticated: true,
  },
  {
    path: "/others",
    content: others,
    isAuthenticated: true,
  },
  {
    path: "/mywidget",
    content: list,
    isAuthenticated: true,
  },
  {
    path: "/userdata",
    content: userdata,
    isAuthenticated: true,
  },
  {
    path: "/settings",
    content: settingsIndex,
    isAuthenticated: true,
  },{
    path: "/accounting",
    content: accountingIndex,
    isAuthenticated: true,
  }
];

export default routes;
