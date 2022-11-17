export function handleFooter() {
    const footerComponent = document.querySelector(".rcw-footer");
    const footerSidebarWrapperComponent = document.querySelector(".footer-sidebar-wrapper");
    const footerWrapperComponent = document.querySelector(".footer-wrapper");
    const sidebarWrapperComponent = document.querySelector(".sidebar-wrapper");

    if (footerComponent && footerSidebarWrapperComponent && footerWrapperComponent && sidebarWrapperComponent) {
        footerComponent.style.height = "54px";
    }
}
