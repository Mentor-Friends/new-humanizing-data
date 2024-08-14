export default async function initToastBar () {
  class ToastBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      // Fetch and attach template
      this.loadTemplate();
    }

    async loadTemplate() {
      try {
        const response = await fetch("src/app/modules/toast-bar/toast-bar.template.html");
        const data = await response.text();
        console.log("data ->", data);

        const template = document.createElement("template");
        template.innerHTML = data;
        console.log("template ->", template);

        // const innerTemplate: any = template.content.firstElementChild;
        const innerTemplate: any = template.content.querySelector('template');
        console.log("innerTemplate", innerTemplate);

        const clone: any = innerTemplate.content.cloneNode(true);
        this.shadowRoot?.appendChild(clone);

        // const heading: any = this.shadowRoot?.querySelector("h3");
        // heading.innerHTML = "test heading text";

        console.log("position attribute", this.toastPositionAttribute);
        console.log("type attribute", this.toastTypeAttribute);
        console.log("type attribute", this.toastAutoCloseAttribute);

        const toastBar: any = document.querySelector("toast-bar");
        console.log('toastBar ->', toastBar)
        // if (this.toastTypeAttribute === "info") {
        //   toastBar.style.backgroundColor = "aqua";
        // }

        setTimeout(() => {
          toastBar?.remove();
        }, this.toastAutoCloseAttribute);

      } catch (error) {
        console.error("Error loading template:", error);
      }
    }

    get toastPositionAttribute() {
      return this.getAttribute("position");
    }

    get toastTypeAttribute() {
      return this.getAttribute("type");
    }

    get toastAutoCloseAttribute() {
      const autoCloseNumber: number = Number(this.getAttribute("autoClose"))
      return autoCloseNumber
    }
  }

  customElements.define("toast-bar", ToastBar);
};
