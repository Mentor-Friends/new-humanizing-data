import { updateContent } from "../../routes/renderRoute.service";

export async function logout() {
  localStorage.removeItem("profile");
  location.reload()
  updateContent("/");
}

export async function initTopNavigation() {
  console.log('INIT NAVIGATION')
  const nav = document.getElementById('top-nav')
  const navLinks: any = nav?.querySelectorAll('router-link')

  navLinks?.forEach((navlink: any) => {
    const routeName = navlink.getAttribute("href");
    if (location.pathname === routeName) {
      navlink.classList.add("active");
    }

    navlink?.addEventListener('click', () => {
      initTopNavigation()
    })
  })
}