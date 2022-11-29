import smoothscroll from "smoothscroll-polyfill";
import { handleFooter } from "./footerHandler";
smoothscroll.polyfill();

export function scrollToBottom() {
    handleFooter();
    let conversationOverlay = document.querySelector(".rcw-conversation-overlay");
    let interaction = document.querySelector(".rcw-interaction");
    let footer = document.querySelector(".rcw-footer");
    let messagesContainer = document.querySelector(".rcw-messages-container");
    let messages = document.querySelectorAll(".rcw-message");
    if(!messages) return;
    let currentMessage;
    let animation = null;
    if (messages && messages.length > 0) {
        animation = messages[messages.length - 1].querySelector('[class*="animation"]');
        currentMessage = messages[messages.length - 1];

        if (currentMessage && !currentMessage.isAnimated) {
            currentMessage.style.opacity = "0";
            let timeout = animation ? 250 : 0;

            setTimeout(() => {
                currentMessage.style.opacity = "1";
                currentMessage.isAnimated = true;
            }, timeout);
        }
    }
    if (animation && currentMessage) {
        const absoluteOffset = conversationOverlay.scrollHeight - currentMessage.offsetTop + 30;

        const delta = conversationOverlay.clientHeight - absoluteOffset + conversationOverlay.scrollHeight;

        messagesContainer.style.height = `${delta}px`;
    }

    if (interaction && interaction.clientHeight > 0 && currentMessage) {
        const interactionHeight = interaction.clientHeight;
        const messageOffset = conversationOverlay.scrollHeight - currentMessage.offsetTop - currentMessage.clientHeight - 15;
        const deltaSpace = interactionHeight - messageOffset;
        const delta = conversationOverlay.scrollHeight + deltaSpace;

        if (messageOffset < interactionHeight) {
            messagesContainer.style.height = `${delta}px`;
        }
        setTimeout(() => {
            interaction.style.bottom = `${footer.clientHeight}px`;
            interaction.style.opacity = "1";
        }, 0);
    }

    setTimeout(() => {
        if(conversationOverlay) {
            conversationOverlay.scroll({ top: conversationOverlay.scrollHeight, left: 0, behavior: "smooth" });
        }
    }, 100);
}
