import topNavigation from "../../modules/top-nav/top-navigation"
// import { loadHTML } from "./profile.service"
import { popupAlert, saveProfileDetails, updateProfile } from "./profile.service"

(window as any).popupAlert = popupAlert;
(window as any).saveProfileDetails = saveProfileDetails;
(window as any).updateProfile = updateProfile;

const profile = `
  ${topNavigation}
`
export default profile