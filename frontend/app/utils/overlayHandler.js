const widgetSelector = [
    //"resultOverlay",
    "glossary"
]

export function handleOverlayNavbar(widgetName) {
    const overlayComponent = document.querySelector(".rcw-conversation-container-overlay");
    if(widgetSelector.indexOf(widgetName) > -1) {
        overlayComponent.style.height = "calc( 100% - 50px )";
    } else {
        overlayComponent.style.height = "100%";
    }
}