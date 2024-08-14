import { getLocalStorageData } from "../../services/helper.service";

export default function initNavigation() {

  // light/dark mode switcher
  const sunIcon = document.querySelector(".sun");
  const moonIcon = document.querySelector(".moon");

  // Function to set theme based on user preference
  function setTheme(theme: string) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Check for stored theme or system preference on page load
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  sunIcon?.addEventListener("click", () => {
    localStorage.theme = "dark";
    setTheme("dark"); // Change to light mode without reloading the page
  });

  moonIcon?.addEventListener("click", () => {
    localStorage.theme = "light";
    setTheme("light"); // Change to dark mode without reloading the page
  });

  
  // Burger menus
  // document.addEventListener("DOMContentLoaded", function () {
    // open
    const burger = document.querySelectorAll(".navbar-burger");
    const menu = document.querySelectorAll(".navbar-menu");

    if (burger.length && menu.length) {
      for (var i = 0; i < burger.length; i++) {
        burger[i].addEventListener("click", function () {
          for (var j = 0; j < menu.length; j++) {
            menu[j].classList.toggle("hidden");
          }
        });
      }
    }

    // close
    const close = document.querySelectorAll(".navbar-close");
    const backdrop = document.querySelectorAll(".navbar-backdrop");

    if (close.length) {
      for (var i = 0; i < close.length; i++) {
        close[i].addEventListener("click", function () {
          for (var j = 0; j < menu.length; j++) {
            menu[j].classList.toggle("hidden");
          }
        });
      }
    }

    if (backdrop.length) {
      for (var i = 0; i < backdrop.length; i++) {
        backdrop[i].addEventListener("click", function () {
          for (var j = 0; j < menu.length; j++) {
            menu[j].classList.toggle("hidden");
          }
        });
      }
    }
  // });
}

export async function checkLogIn() {
  const storageData: any = await getLocalStorageData()
  const isLoggedIn = storageData?.token ? true : false
  return isLoggedIn
}
