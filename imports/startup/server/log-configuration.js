import {Meteor} from "meteor/meteor";
import {isDebug} from "./dapp-configuration";

require('scribe-js')();

export const console = process.console;
export const sendModeTagColor = {msg : 'send-mode', colors : ['yellow', 'inverse']};
export const confirmModeTagColor = {msg : 'confirm-mode', colors : ['blue', 'inverse']};
export const verifyModeTagColor = {msg : 'verify-mode', colors : ['green', 'inverse']};
export const blockchainModeTagColor = {msg : 'verify-mode', colors : ['white', 'inverse']};

export function logSend(message) {
    if(isDebug()) {console.time().tag(sendModeTagColor).log(message);}
}

export function logConfirm(message) {
    if(isDebug()) {console.time().tag(confirmModeTagColor).log(message);}
}

export function logVerify(message) {
    if(isDebug()) {console.time().tag(verifyModeTagColor).log(message);}
}

export function logBlockchain(message) {
    if(isDebug()){console.time().tag(blockchainModeTagColor).log(message);}
}

export function logError(message) {
    if(isDebug()){console.time().tag(blockchainModeTagColor).error(message);}
}