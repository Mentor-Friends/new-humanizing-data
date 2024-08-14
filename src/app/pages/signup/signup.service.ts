import { environment } from "../../environments/environment.dev";
import { updateContent } from "../../routes/renderRoute.service";

export async function submitSignupForm(e: any) {
  e.preventDefault();
  // alert("Are you sure to want to signup?");

  const inputType = <HTMLInputElement>document.getElementById("type");
  const typeValue = inputType?.value;

  const inputUsername = <HTMLInputElement>document.getElementById("username");
  const usernameValue = inputUsername?.value;

  const inputEmail = <HTMLInputElement>document.getElementById("email");
  const emailValue = inputEmail?.value;

  const inputGender = <HTMLInputElement>document.getElementById("gender");
  const genderValue = inputGender?.value;

  const inputFirstName = <HTMLInputElement>document.getElementById("firstName");
  const firstNameValue = inputFirstName?.value;

  const inputLastName = <HTMLInputElement>document.getElementById("lastName");
  const lastNameValue = inputLastName?.value;

  const inputPassword = <HTMLInputElement>document.getElementById("password");
  const passwordValue = inputPassword?.value;

  const inputConfirmPassword = <HTMLInputElement>(
    document.getElementById("confirmPassword")
  );
  const confirmPasswordValue = inputConfirmPassword?.value;
  console.log("confirmPasswordValue", confirmPasswordValue);

  const signupData: any = {
    type: typeValue,
    username: usernameValue,
    title: genderValue,
    email: emailValue,
    password: passwordValue,
    timestamp: new Date().toISOString(),
    fname: firstNameValue,
    lname: lastNameValue,
  };

  const signupResponse = await signup(signupData);
  if (!signupResponse?.error && signupResponse?.data) {
    updateContent("/login");
  }
}

export async function signup(signupData: any) {
  const baseURL = environment?.baseURL;
  const response: any = await fetch(`${baseURL}/entity/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupData),
  });

  if (response.ok) {
    return response.json();
  } else {
    if (response.status === 404) throw new Error("404, Not found");
    if (response.status === 500) throw new Error("500, internal server error");
    throw new Error(response.status);
  }
}
