import routes from "./routes";
import { IUser } from "../interfaces/IUser.interface";

const app = <HTMLElement>document.getElementById("app");

const checkAuthentication = () => {
  let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
  if (dataFromLocalStorage) {
    const profileData: IUser = JSON.parse(dataFromLocalStorage);
    return profileData?.token ? true : false;
  } else {
    return false;
  }
};

// const checkRouteAuthentication = async (route: string) => {

//   let routeInfo = routes?.find((routeData: any) => routeData?.path === route);

//   // Authentication check
//   if (routeInfo?.isAuthenticated) {
//     const isAuthenticationValid = checkAuthentication();
//     if (!isAuthenticationValid) {
//       const loginURL = routes.find((route: any) => route.path === "/login");
//       app.innerHTML = loginURL?.content;
//       location.pathname = loginURL?.path;
//       return;
//     }
//   }
//   checkRouting();
// };

const pathToRegex = (path: any) =>
  new RegExp("^" + path.replace(/:\w+/g, "(.+)") + "$");

const getParams = (match: any) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result: any) => result[1]
  );
  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
};

export async function checkRouting() {
  const potentialMatches = routes.map((route: any) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch: any) => potentialMatch.result !== null
  );

  // NOT FOUND PAGE
  if (!match) {
    const notFoundURL = routes.find((route: any) => route.path === "/404");
    match = {
      // route: routes[0],
      route: notFoundURL,
      result: [location.pathname],
    };
  } else {
    // check route authentication
    const routeInfo = match?.route;
    if (routeInfo?.isAuthenticated) {
      const isAuthenticationValid = checkAuthentication();
      if (!isAuthenticationValid) {
        const loginURL = routes.find((route: any) => route.path === "/login");
        match = {
          route: loginURL,
          result: loginURL?.path,
        };
        history.pushState(null, "", loginURL?.path);
      }
    }
  }

  // const view = typeof match.route.content === 'function'
  //   ? new match.route.content(getParams(match))
  //   : match.route.content;

  const view = new match.route.content(await getParams(match));

  const htmlContentDetails = await view?.getHtml();
  app.innerHTML = htmlContentDetails;
}

export const renderContent = async (route: any) => {
  history.pushState(null, "", route);
  // checkRouteAuthentication(route);
  checkRouting();
};

export const updateContent = async (route: any) => {
  window.history.pushState({ route }, "", route);
  // window.history.replaceState({ route }, "", route);
  // checkRouteAuthentication(route);
  checkRouting();
};

// const navigate = (e: any) => {
//   const route = e?.target?.location?.pathname;
//   updateContent(route);
// };

// export const registerNavLinks = () => {
//   window.addEventListener("popstate", (e: any) => {
//     navigate(e);
//   });
// };

const renderInitialPage = () => {
  const route = window.location.pathname;
  renderContent(route);
};

// <router-link> </router-link>
const initRouterLinks = () => {
  customElements.define(
    "router-link",
    class extends HTMLElement {
      constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
      }

      connectedCallback() {
        this.addEventListener("click", this.handleClick);
      }

      disconnectedCallback() {
        this.removeEventListener("click", this.handleClick);
      }

      handleClick(event: any) {
        event.preventDefault(); // Prevent default anchor tag behavior

        const href = this.getAttribute("href");
        // updateContent(href);
        if (href) renderContent(href);
        // checkRouting()
        // Simulate navigation using History API (replace with your routing logic)
        // history.pushState({}, '', href);
        // window.dispatchEvent(new PopStateEvent("popstate")); // Trigger route change event
      }

      // Optional: Set attributes through properties
      set href(val: any) {
        this.setAttribute("href", val);
      }

      get href() {
        return this.getAttribute("href");
      }
    }
  );
};

export const bootup = () => {
  // registerNavLinks();
  renderInitialPage();
  initRouterLinks();
  window.addEventListener("popstate", checkRouting);
};
