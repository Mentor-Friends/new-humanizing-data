import { updateAccessToken } from "mftsccs-browser";
import { environment } from "../../environments/environment.dev";
import { IUser } from "../../interfaces/IUser.interface";
import { updateContent } from "../../routes/renderRoute.service";
import { getEntityByUserconceptId } from "../../services/helper.service";

const baseURL = environment?.baseURL;
// const boomconsoleURL = environment?.boomURL

const signin = async (signinData: any) => {
  const loginURL = `${baseURL}/signin`;
  let freeschemaRes: any;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(signinData),
      redirect: "follow",
    });
    const output = await response.json();
    if (response.ok) {
      const dataObject = output?.data;
      freeschemaRes = {
        message: "success",
        status: true,
        statusCode: 200,
        data: dataObject,
      };
    } else {
      freeschemaRes = {
        message: "cannot authenticate",
        status: false,
        statusCode: response.status,
        data: "",
      };
    }
    return freeschemaRes;
  } catch (error) {
    console.error("Sign in api error", error);
    freeschemaRes = {
      message: "error",
      status: false,
      statusCode: 500,
      data: "",
    };
    return freeschemaRes;
  }
};

// const initListeners = () => {
//   const signupLinkButton = document.getElementById("signup-link");
//   signupLinkButton?.addEventListener("click", (e) => {
//     updateContent('/signup', e)
//   });
// };

export function initiateLogin() {
  // export const initiateLogin = () => {
  // initListeners();
  // const loginButton = document.getElementById("login-btn");
  // loginButton?.addEventListener("click", async (e) => {
  //   e.preventDefault();
  //   // alert("hello");
  //   const signResponse = await signin();
  //   if (signResponse.statusCode === 200) {
  //     updateContent("/dashboard", e);
  //   }
  // });
  // const loginForm = document.getElementById("login-form");
  // loginForm?.addEventListener("submit", async (e) => {
  //   e.preventDefault();
  //   const signResponse = await signin();
  //   if (signResponse.statusCode === 200) {
  //     updateContent("/dashboard", e);
  //   }
  // });
  // const path = window.location.pathname;
  // if (path.indexOf("/login") !== -1) {
  //   // load css file
  //   const styles = document.createElement("link");
  //   styles.rel = "stylesheet";
  //   styles.type = "text/css";
  //   styles.href = "src/app/pages/login/login.style.css"; // your file's URL
  //   document.getElementsByTagName("head")[0].appendChild(styles);
  // }
}

export async function submitLoginForm(e: any) {
  e.preventDefault();

  const elements = e.target;
  for (let i = 0, len = elements.length; i < len; ++i) {
    elements[i].disabled = true;
  }

  const submitWrapper = <HTMLDivElement>document.getElementById("login-submit");
  submitWrapper.innerHTML = `
    <button type="button" class="inline-flex items-center justify-center px-4 py-2 shadow rounded-md text-white bg-green-700 w-full" disabled="">
      <svg class="motion-reduce:hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Submitting...
    </button>
  `;
  const inputEmail = <HTMLInputElement>document.getElementById("email");
  const emailValue = inputEmail?.value;

  const inputPassword = <HTMLInputElement>document.getElementById("password");
  const passwordValue = inputPassword?.value;

  const signinData = {
    email: emailValue,
    password: passwordValue,
    application: "humanizing",
  };

  const signinResponse = await signin(signinData);

  if (signinResponse?.statusCode === 200) {
    await saveTolocalStorage(signinResponse);
    updateContent("/dashboard");
  } else {
    submitWrapper.innerHTML = `
      <button id="login-btn" type="submit" class="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-md w-full">
        Submit
      </button>
      <p class="text-red-500 mt-2">${signinResponse?.message}</p>
    `;
    for (let i = 0, len = elements.length; i < len; ++i) {
      elements[i].disabled = false;
    }
  }
}

export async function saveTolocalStorage(signinResponse: any) {
  const userEntity = await getEntityByUserconceptId(
    signinResponse?.data?.userConcept,
    signinResponse?.data?.token
  );

  let userProfile: IUser = {
    token: signinResponse?.data?.token,
    refreshToken: signinResponse?.data?.refreshtoken,
    email: signinResponse?.data?.email,
    userId: signinResponse?.data?.entity?.[0]?.userId,
    userConcept: signinResponse?.data?.userConcept,
    entityId: userEntity?.entity,
    amcode: btoa(JSON.stringify(signinResponse?.data?.roles)),
  };
  updateAccessToken(userProfile.token);

  localStorage.setItem("profile", JSON.stringify(userProfile));

  return true;
}
