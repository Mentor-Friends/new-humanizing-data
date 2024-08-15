export function toggleDropdownMenuOption(event: any, id: string) {
  // close all previous dropdown
  const dropdownMenus = document.getElementsByClassName(
    "dropdown-menu"
  ) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < dropdownMenus.length; i++) {
    const dropdownMenu = dropdownMenus[i];

    // except current target
    if (event.currentTarget != dropdownMenu.previousElementSibling)
      dropdownMenu.classList.add("hidden");
  }

  // toggle the dropdown
  const dropdown = document.getElementById(id);
  if (dropdown?.classList.contains("hidden"))
    dropdown.classList.remove("hidden");
  else dropdown?.classList.add("hidden");
}
