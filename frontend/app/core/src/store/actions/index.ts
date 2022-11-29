import { ElementType } from 'react';

import * as actionsTypes from './types';
import { LinkParams, ImageState } from '../types';

export function toggleChat(): actionsTypes.ToggleChat {
  return {
    type: actionsTypes.TOGGLE_CHAT
  };
}

export function openChat(): actionsTypes.OpenChat {
  return {
    type: actionsTypes.OPEN_CHAT
  };
}

export function closeChat(): actionsTypes.CloseChat {
  return {
    type: actionsTypes.CLOSE_CHAT
  };
}

export function toggleInputDisabled(): actionsTypes.ToggleInputDisabled {
  return {
    type: actionsTypes.TOGGLE_INPUT_DISABLED
  };
}

export function addUserMessage(text: string, id?: string): actionsTypes.AddUserMessage {
  return {
    type: actionsTypes.ADD_NEW_USER_MESSAGE,
    text,
    id
  };
}

export function addResponseMessage(text: string, id?: string): actionsTypes.AddResponseMessage {
  return {
    type: actionsTypes.ADD_NEW_RESPONSE_MESSAGE,
    text,
    id
  };
}

export function toggleMsgLoader(): actionsTypes.ToggleMsgLoader {
  return {
    type: actionsTypes.TOGGLE_MESSAGE_LOADER
  }
}

export function addLinkSnippet(link: LinkParams, id?: string): actionsTypes.AddLinkSnippet {
  return {
    type: actionsTypes.ADD_NEW_LINK_SNIPPET,
    link,
    id
  };
}

export function renderCustomComponent(
  component: ElementType,
  props: any,
  showAvatar: boolean,
  id?: string
): actionsTypes.RenderCustomComponent  {
  return {
    type: actionsTypes.ADD_COMPONENT_MESSAGE,
    component,
    props,
    showAvatar,
    id
  };
}

export function renderInteractionComponent(
  component: ElementType,
  props: any,
  id?: string
): actionsTypes.RenderInteractionComponent {
  return {
    type: actionsTypes.RENDER_INTERACTION_COMPONENT,
    component,
    props,
    id
  }
}

export function renderFooterComponent(
  component: ElementType,
  props: any,
  id?: string
): actionsTypes.RenderFooterComponent {
  return {
    type: actionsTypes.RENDER_FOOTER_COMPONENT,
    component,
    props,
    id
  }
}


export function renderOverlayComponent(
  component: ElementType,
  props: any, 
  id?: string
): actionsTypes.RenderOverlayComponent {
  return {
    type: actionsTypes.RENDER_OVERLAY_COMPONENT,
    component,
    props, 
    id
  }
}

export function showOverlayComponent(
  toggle: boolean
): actionsTypes.ShowOverlayComponent {
  return {
    type: actionsTypes.SHOW_OVERLAY_COMPONENT,
    toggle
  }
}


export function dropMessages(): actionsTypes.DropMessages {
  return {
    type: actionsTypes.DROP_MESSAGES
  };
}

export function hideAvatar(index: number): actionsTypes.HideAvatar {
  return {
    type: actionsTypes.HIDE_AVATAR,
    index
  };
}

export function setQuickButtons(buttons: Array<{ label: string, value: string | number }>): actionsTypes.SetQuickButtons {
  return {
    type: actionsTypes.SET_QUICK_BUTTONS,
    buttons
  }
}

export function deleteMessages(count: number, id?: string): actionsTypes.DeleteMessages {
  return {
    type: actionsTypes.DELETE_MESSAGES,
    count,
    id
  }
}

export function setBadgeCount(count: number): actionsTypes.SetBadgeCount {
  return {
    type: actionsTypes.SET_BADGE_COUNT,
    count
  }
}

export function markAllMessagesRead(): actionsTypes.MarkAllMessagesRead {
  return {
    type: actionsTypes.MARK_ALL_READ
  }
}

export function openFullscreenPreview(payload: ImageState): actionsTypes.FullscreenPreviewActions {
  return {
    type: actionsTypes.OPEN_FULLSCREEN_PREVIEW,
    payload
  };
}

export function closeFullscreenPreview(): actionsTypes.FullscreenPreviewActions {
  return {
    type: actionsTypes.CLOSE_FULLSCREEN_PREVIEW
  };
}
