import {isDebug} from "./dapp-configuration";

require('scribe-js')();

export const console = process.console;
export const sendModeTagColor = {msg : 'send-mode', colors : ['yellow', 'inverse']};
export const confirmModeTagColor = {msg : 'confirm-mode', colors : ['blue', 'inverse']};
export const verifyModeTagColor = {msg : 'verify-mode', colors : ['green', 'inverse']};
export const blockchainModeTagColor = {msg : 'blockchain-mode', colors : ['white', 'inverse']};

export function logSend(message,param) {
    if(isDebug()) {console.time().tag(sendModeTagColor).log(message,param?param:'');}
}

export function logConfirm(message,param) {
    if(isDebug()) {console.time().tag(confirmModeTagColor).log(message, param?param:'');}
}

export function logVerify(message, param) {
    if(isDebug()) {console.time().tag(verifyModeTagColor).log(message, param?param:'');}
}

export function logBlockchain(message, param) {
    if(isDebug()){console.time().tag(blockchainModeTagColor).log(message, param?param:'');}
}

export function logMain(message, param) {
    if(isDebug()){console.time().tag(blockchainModeTagColor).log(message, param?param:'');}
}

export function logError(message, param) {
    if(isDebug()){console.time().tag(blockchainModeTagColor).error(message, param?param:'');}
}
