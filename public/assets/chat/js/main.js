import { loadUserProfile, emitSocketLogin } from './profile.js';
import { loadMessagesHistory, initScrollListener } from './messages.js';
import {initSendEvent, initTypingEvent, initLogoutEvent} from './events.js';
import { initSocketListeners } from './socketEvents.js';
import {requestNotificationPermission} from './settings/notification.js';
import {initSettings} from "./settings/settings.js";
initScrollListener();
initSendEvent();
initTypingEvent();
initLogoutEvent();
initSocketListeners();

emitSocketLogin();
loadUserProfile().then(() => {
    loadMessagesHistory();
});
requestNotificationPermission();
initSettings()

