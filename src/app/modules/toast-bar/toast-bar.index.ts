// import initToastBar from "./toast-bar.service";

// export async function loadToastHTML(
//   type: string,
//   heading: string,
//   msg: string,
//   position: string = "top-right",
//   autoClose: number = 5000
// ) {
//   let bgColor = "bg-white";
//   console.log('position', position)
//   console.log('autoClose', autoClose)

//   switch (type) {
//     case "info":
//       bgColor = "bg-blue-200";
//       break;
//     case "success":
//       bgColor = "bg-green-200";
//       break;
//     case "warning":
//       bgColor = "bg-yellow-200";
//       break;
//     case "error":
//       bgColor = "bg-red-200";
//       break;
//     default:
//       bgColor = "bg-white";
//   }

//   return `
//     <toast-bar position="top-right" type="${type}" class="fixed top-4 right-4 p-4 ${bgColor} text-black z-20 border border-gray-200 rounded shadow-lg">
//       <h4>${heading}</h4>
//       <p>${msg}</p>
//     </toast-bar>
//   `;
// }

export async function showToast(
  type: string = "info",
  heading: string = "This is the info toast",
  msg: string = "Info details goes here",
  position: string = "top-right",
  autoClose: number = 5000
) {
  const body: any = document.getElementById("app");
  const toastBar = document.createElement("div");

  let bgColor = "bg-white";

  switch (type) {
    case "info":
      bgColor = "bg-blue-200";
      break;
    case "success":
      bgColor = "bg-green-200";
      break;
    case "warning":
      bgColor = "bg-yellow-200";
      break;
    case "error":
      bgColor = "bg-red-200";
      break;
    default:
      bgColor = "bg-white";
  }

  const toastPositions: any = position.split("-");
  // console.log("toastPositions", toastPositions);

  // const toastHTML = await loadToastHTML(type, heading, msg, position, autoClose)
  const toastHTML = `
    <toast-bar position="${position}" type="${type}" autoClose="${autoClose}" class="fixed ${toastPositions?.[0]}-4 ${toastPositions?.[1]}-4 p-4 ${bgColor} text-black z-20 border border-gray-200 rounded shadow-lg">
      <h4>${heading}</h4>
      <p>${msg}</p>
    </toast-bar>
  `;
  // console.log("toastHTML ->", toastHTML);
  toastBar.innerHTML = `${toastHTML}`;

  body.appendChild(toastBar);
  // initToastBar();
  const toastBarEl: any = document.querySelector("toast-bar");
  setTimeout(() => {
    toastBarEl?.remove();
  }, autoClose);
}
