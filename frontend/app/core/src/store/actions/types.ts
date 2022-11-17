import { ElementType } from 'react';

import { LinkParams, FullscreenPreviewState } from '../types';

export const TOGGLE_CHAT = 'BEHAVIOR/TOGGLE_CHAT';
export const TOGGLE_INPUT_DISABLED = 'BEHAVIOR/TOGGLE_INPUT_DISABLED';
export const TOGGLE_MESSAGE_LOADER = 'BEHAVIOR/TOGGLE_MSG_LOADER';
export const SET_BADGE_COUNT = 'BEHAVIOR/SET_BADGE_COUNT';
export const ADD_NEW_USER_MESSAGE = 'MESSAGES/ADD_NEW_USER_MESSAGE';
export const ADD_NEW_RESPONSE_MESSAGE = 'MESSAGES/ADD_NEW_RESPONSE_MESSAGE';
export const ADD_NEW_LINK_SNIPPET = 'MESSAGES/ADD_NEW_LINK_SNIPPET';
export const ADD_COMPONENT_MESSAGE = 'MESSAGES/ADD_COMPONENT_MESSAGE';
export const DROP_MESSAGES = 'MESSAGES/DROP_MESSAGES';
export const HIDE_AVATAR = 'MESSAGES/HIDE_AVATAR';
export const DELETE_MESSAGES = 'MESSAGES/DELETE_MESSAGES';
export const MARK_ALL_READ = 'MESSAGES/MARK_ALL_READ';
export const SET_QUICK_BUTTONS = 'SET_QUICK_BUTTONS';
export const OPEN_FULLSCREEN_PREVIEW = 'FULLSCREEN/OPEN_PREVIEW';
export const CLOSE_FULLSCREEN_PREVIEW = 'FULLSCREEN/CLOSE_PREVIEW';
export const RENDER_INTERACTION_COMPONENT = "INTERACTION/COMPONENT";
export const RENDER_FOOTER_COMPONENT = "FOOTER/COMPONENT";
export const RENDER_OVERLAY_COMPONENT = "OVERLAY/COMPONENT";
export const SHOW_OVERLAY_COMPONENT = "OVERLAY/SHOW";

export interface ToggleChat {
  type: typeof TOGGLE_CHAT;
}

export interface ToggleInputDisabled {
  type: typeof TOGGLE_INPUT_DISABLED;
}

export interface AddUserMessage {
  type: typeof ADD_NEW_USER_MESSAGE;
  text: string;
  id?: string;
}

export interface AddResponseMessage {
  type: typeof ADD_NEW_RESPONSE_MESSAGE;
  text: string;
  id?: string;
}

export interface ToggleMsgLoader {
  type: typeof TOGGLE_MESSAGE_LOADER;
}

export interface AddLinkSnippet {
  type: typeof ADD_NEW_LINK_SNIPPET;
  link: LinkParams;
  id?: string;
}

export interface RenderCustomComponent {
  type: typeof ADD_COMPONENT_MESSAGE;
  component: ElementType;
  props: any;
  showAvatar: boolean;
  id?: string;
}

export interface RenderInteractionComponent {
  type: typeof RENDER_INTERACTION_COMPONENT;
  component: ElementType;
  props: any;
  id?: string;
}

export interface RenderFooterComponent {
  type: typeof RENDER_FOOTER_COMPONENT;
  component: ElementType;
  props: any;
  id?: string;
}

export interface RenderOverlayComponent {
  type: typeof RENDER_OVERLAY_COMPONENT;
  component: ElementType;
  props: any;
  id?: string;
}

export interface ShowOverlayComponent{
  type: typeof SHOW_OVERLAY_COMPONENT;
  toggle: boolean;
}

export interface DropMessages {
  type: typeof DROP_MESSAGES;
}

export interface HideAvatar {
  type: typeof HIDE_AVATAR;
  index: number;
}

export interface DeleteMessages {
  type: typeof DELETE_MESSAGES;
  count: number;
  id?: string;
}

export interface SetQuickButtons {
  type: typeof SET_QUICK_BUTTONS;
  buttons: Array<{ label: string, value: string | number }>;
}

export interface SetBadgeCount {
  type: typeof SET_BADGE_COUNT;
  count: number;
}

export interface MarkAllMessagesRead {
  type: typeof MARK_ALL_READ;
}

export type InteractionActions = RenderInteractionComponent;

export type FooterActions = RenderFooterComponent;

export type OverlayActions = RenderOverlayComponent | ShowOverlayComponent;

export type BehaviorActions = ToggleChat | ToggleInputDisabled | ToggleMsgLoader;

export type MessagesActions = AddUserMessage | AddResponseMessage | AddLinkSnippet | RenderCustomComponent
                              | DropMessages | HideAvatar | DeleteMessages | MarkAllMessagesRead | SetBadgeCount;

export type QuickButtonsActions = SetQuickButtons;

export interface OpenFullscreenPreview {
  type: typeof OPEN_FULLSCREEN_PREVIEW;
  payload: FullscreenPreviewState
}

export interface CloseFullscreenPreview {
  type: typeof CLOSE_FULLSCREEN_PREVIEW;
}

export type FullscreenPreviewActions = OpenFullscreenPreview | CloseFullscreenPreview;