export async function openModal(modalId: string) {
  const check = document.getElementById(modalId);
  if (check) check.style.display = "block";
  document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden");

  // Close all modals when press ESC
  document.onkeydown = function (event: any) {
    if (event.code === "Escape" || event.key === "Escape") {
      // if (check) check.style.display = "none";
      closeModal(modalId);
    }
  };
}

export async function closeModal(modalId: string) {
  const modal: any = document.getElementById(modalId);

  const modalFormEl = modal.querySelector("form");
  modalFormEl.reset();

  if (modal) modal.style.display = "none";
  document
    .getElementsByTagName("body")[0]
    .classList.remove("overflow-y-hidden");
  // Close all modals when press ESC
  // document.onkeydown = function (event) {
  //   event = event || window.event;
  //   if (event.keyCode === 27) {
  //     document
  //       .getElementsByTagName("body")[0]
  //       .classList.remove("overflow-y-hidden");
  //     let modals = document.getElementsByClassName("modal");
  //     Array.prototype.slice.call(modals).forEach((i) => {
  //       i.style.display = "none";
  //     });
  //   }
  // };
}
