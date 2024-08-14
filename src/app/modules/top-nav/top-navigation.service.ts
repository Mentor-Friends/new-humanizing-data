import { updateContent } from "../../routes/renderRoute.service";

export async function logout() {
  localStorage.removeItem("profile");
  updateContent("/");
  location.reload();
}

export async function initTopNavigation() {
  const nav = document.getElementById("top-nav");
  const navLinks: any = nav?.querySelectorAll("router-link");
  navLinks?.forEach((navlink: any) => {
    const routeName = navlink.getAttribute("href");
    if (location.pathname === routeName) {
      navlink.classList.add("active");
    }
    navlink?.addEventListener("click", () => {
      // initTopNavigation()
      navlink.classList.add("active");
    });
  });
  initToggleNavigation();
}

export async function initToggleNavigation() {
  // Burger menus
  // document.addEventListener("DOMContentLoaded", function () {
  // open
  const burger = document.querySelectorAll(".navbar-burger-login");
  const menu = document.querySelectorAll(".navbar-menu-login");

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
  const close = document.querySelectorAll(".navbar-close-login");
  const backdrop = document.querySelectorAll(".navbar-backdrop-login");

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
