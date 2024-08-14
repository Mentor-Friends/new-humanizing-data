import { closeProfileModal } from "../../pages/profile/profile.service";
import'./profile-modal.style.css';


export default async function createProfileModalHTML() {
    (window as any).closeModal = closeProfileModal;
  return `
    <div id="create-profile-modal" class="fixed hidden z-50 inset-0 bg-white-900 bg-opacity-60 dark:bg-white-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
        <div class="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-3xl text-zinc-900 bg-zinc-50 dark:text-white dark:bg-white-900">
            <div class="flex justify-between px-4 pt-4">
                <h3 class="text-xl font-normal text-zinc-900 dark:text-black my-0">User Profile</h3>
                <button onclick="closeModal('create-profile-modal')" type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
                </button>
            </div>
        
         <div class="resume">
        <header>
            <h1 id="fullName">John Doe</h1>
            <p id="workingPosition">Software Developer</p>
            <p id="contact">Email: johndoe@example.com | Phone: (123) 456-7890</p>
        </header>
        <section id="profile" style="display:block">
            <h2>Profile</h2>
            <p id="about" style="color:black">A highly motivated software developer with 5 years of experience in developing web applications. Strong background in JavaScript, HTML, CSS, and modern frameworks.</p>
        </section>
        <section id="exp" style="display:block">
          <h2>Experience</h2>
          <div id="experience"></div>
        </section>
        <section id="edu" style="display:block">
            <h2>Education</h2>
              <div id="education"></div>
        </section>
        <section id="skill" style="display:block">
            <h2>Skills</h2>
            <ul style="color:black">
            <div id="skills"></div>
            </ul>
        </section>
    </div>
        </div>
    </div>
    `;
}
