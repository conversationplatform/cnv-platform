import { scrollToBottom } from './scrollToBottom';

export function animateUserMessage() {
    let conversationOverlay = document.querySelector(".rcw-conversation-overlay");
    let messages = document.querySelectorAll('.rcw-message');
    let rcwMessage = messages[messages.length - 1];
    let rcwClient = rcwMessage.querySelector('.rcw-client');
    let rcwMessageText = rcwClient.querySelector('.rcw-message-text');

    const rcwDefaults = {
        opacity: rcwMessage.style.opacity,
        position: rcwMessage.style.position,
        paddingTop: rcwMessage.style.paddingTop,
        zIndex: rcwMessage.style.zIndex,
        width: rcwMessage.style.width,
        margin: rcwMessage.style.margin,
        transition: rcwMessage.style.transition
    };

    const rcwClientDefaults = {
        width: rcwClient.clientWidth,
        transition: rcwClient.style.transition
    };

    const rcwMessageTextDefaults = {
        width: rcwMessageText.clientWidth - 29,
        transition: rcwMessageText.style.transition,
    };

    rcwMessage.style.transition = "inherit";
    rcwMessage.style.zIndex = "100";
    rcwMessage.style.width = "100%";
    rcwMessage.style.margin = "0 auto";

    rcwClient.style.transition = "inherit";

    let deltaTop = conversationOverlay.scrollHeight - rcwClient.offsetTop - 80;

    rcwClient.style.marginTop = `${ deltaTop }px`;

    let rcwClientWidth = rcwClientDefaults.width

    if (deltaTop < 300) {
        rcwClientWidth = rcwClientDefaults.width
    } 
    rcwMessageText.style.width = `${rcwClientWidth}px`;
    let rcwClientMarginLeft = `calc( (100% - ${rcwClientWidth}px) / 2)`;

    rcwClient.style.marginLeft = rcwClientMarginLeft;
    rcwMessageText.style.transition = 'inherit';
    rcwMessageText.style.borderRadius = "23px";
    rcwMessageText.style.textAlign = "center";

    setTimeout(() => {
        rcwClient.style.transition = rcwClientDefaults.transition;
        rcwMessage.style.opacity = "0.5";

        rcwClient.style.marginTop = "";
        rcwMessage.style.paddingTop = rcwDefaults.paddingTop;
        rcwMessage.style.transition = rcwDefaults.transition;
        rcwClient.style.zIndex = "";

        rcwMessage.style.zIndex = "";
        rcwMessage.style.width = "";
        rcwMessage.style.margin = "";


        rcwClient.style.marginLeft = `calc( 100% - ${rcwClientDefaults.width}px)`;

    }, 25);

    setTimeout(() => {
        rcwMessageText.style.transition = rcwMessageTextDefaults.transition
        rcwMessage.style.opacity = "1";
        rcwMessageText.style.width = `${rcwMessageTextDefaults.width}px`;
        rcwMessageText.style.borderRadius = "";
        rcwMessageText.style.textAlign = "";
    }, 100);

    setTimeout(() => {
        scrollToBottom();

    }, 1200);
}

export function hideInteraction() {
    let interaction = document.querySelector(".rcw-interaction");
    interaction.style.bottom = "-300px";
    interaction.style.transition = "bottom 0.3s ease-in-out 0s, opacity 0.5s ease-in-out 0s"
    interaction.style.opacity = "0";
}