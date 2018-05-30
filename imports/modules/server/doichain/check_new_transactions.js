import { Meteor } from 'meteor/meteor';
import { getRawTransaction, nameShow } from '../../../../server/api/doichain.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/doichain-configuration.js';
import addDoichainEntry from './add_entry_and_fetch_data.js'
import {isDebug} from "../../../startup/server/dapp-configuration";

const TX_NAME_START = "e/";


const checkNewTransaction = (txid) => {
  try {

      if(isDebug()) { console.log("txid: "+txid+' was triggered by walletnotify getting its data from blockchain'); }

      const ret = getRawTransaction(CONFIRM_CLIENT, txid);
      if(isDebug()) { console.log('gettransaction was called via rpc'); }

      const txs = ret.vout;
      if(!ret || !txs || !txs.length===0){
        console.log("txid"+txid+'does not contain transaction details or transaction not found.');
          return;
      }
      if(isDebug()) { console.log("get transaction details:"+JSON.stringify(txs)); }

      const addressTxs = txs.filter(tx =>
          tx.scriptPubKey.nameOp !== undefined
          && tx.scriptPubKey.nameOp.op === "name_doi"
          && tx.scriptPubKey.addresses[0] === CONFIRM_ADDRESS
          && tx.scriptPubKey.nameOp.name !== undefined
          && tx.scriptPubKey.nameOp.name.startsWith(TX_NAME_START)
      );

      addressTxs.forEach(tx => addTx(tx,txid));

  } catch(exception) {
    throw new Meteor.Error('doichain.checkNewTransactions.exception', exception);
  }
};

function addTx(tx,txid) {

  if(isDebug()) { console.log("addTx:"+JSON.stringify(tx)); }
  const txName = tx.scriptPubKey.nameOp.name.substring(TX_NAME_START.length);
  const txValue = tx.scriptPubKey.nameOp.value;
  const txAddress = tx.scriptPubKey.addresses[0]; //a soi entry can only be send to one address so far.

  addDoichainEntry({
    name: txName,
    value: txValue,
    address: txAddress,
    txId: txid
  });
}

export default checkNewTransaction;
