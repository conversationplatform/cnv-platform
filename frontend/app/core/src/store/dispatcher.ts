import { ElementType } from 'react';

import store from '.';
import * as actions from './actions';
import { LinkParams, ImageState } from './types';

export function renderInteractionComponent(component: ElementType, props: any, id?: string){
  store.dispatch(actions.renderInteractionComponent(component, props, id));
}

export function renderFooterComponent(component: ElementType, props: any, id?: string){
  store.dispatch(actions.renderFooterComponent(component, props, id));
}


export function renderOverlayComponent(component: ElementType, props: any, id?: string){
  store.dispatch(actions.renderOverlayComponent(component, props, id));
}

export function showOverlayComponent(toggle: boolean){
  store.dispatch(actions.showOverlayComponent(toggle));
}

export function addUserMessage(text: string, id?: string) {
  store.dispatch(actions.addUserMessage(text, id));
}

export function addResponseMessage(text: string, id?: string) {
  store.dispatch(actions.addResponseMessage(text, id));
}

export function addLinkSnippet(link: LinkParams, id?: string) {
  store.dispatch(actions.addLinkSnippet(link, id));
}

export function toggleMsgLoader() {
  store.dispatch(actions.toggleMsgLoader());
}

export function renderCustomComponent(component: ElementType, props: any, showAvatar = false, id?: string) {
  store.dispatch(actions.renderCustomComponent(component, props, showAvatar, id));
}

export function toggleWidget() {
  store.dispatch(actions.toggleChat());
}

export function openWidget() {
  store.dispatch(actions.openChat());
}

export function closeWidget() {
  store.dispatch(actions.closeChat());
}

export function toggleInputDisabled() {
  store.dispatch(actions.toggleInputDisabled());
}

export function dropMessages() {
  store.dispatch(actions.dropMessages());
}

export function isWidgetOpened(): boolean {
  return store.getState().behavior.showChat;
}

export function setQuickButtons(buttons: Array<{ label: string, value: string | number }>) {
  store.dispatch(actions.setQuickButtons(buttons));
}

export function deleteMessages(count: number, id?: string) {
  store.dispatch(actions.deleteMessages(count, id));
}

export function markAllAsRead() {
  store.dispatch(actions.markAllMessagesRead());
}

export function setBadgeCount(count: number) {
  store.dispatch(actions.setBadgeCount(count));
}

export function openFullscreenPreview(payload: ImageState) {
  store.dispatch(actions.openFullscreenPreview(payload));
}

export function closeFullscreenPreview() {
  store.dispatch(actions.closeFullscreenPreview());
}
