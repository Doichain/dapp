import { Meteor } from 'meteor/meteor';
import { listSinceBlock, getRawTransaction} from '../../../../server/api/doichain.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/doichain-configuration.js';
import addDoichainEntry from './add_entry_and_fetch_data.js'
import {isDebug} from "../../../startup/server/dapp-configuration";
import { Meta } from '../../../api/meta/meta.js';
import addOrUpdateMeta from '../meta/addOrUpdate.js';

const TX_NAME_START = "e/";
const LAST_CHECKED_BLOCK_KEY = "lastCheckedBlock";

const checkNewTransactions = () => {
    try {
        var lastCheckedBlock = Meta.findOne({key: LAST_CHECKED_BLOCK_KEY});
        if(lastCheckedBlock !== undefined) lastCheckedBlock = lastCheckedBlock.value;
        const ret = listSinceBlock(CONFIRM_CLIENT, lastCheckedBlock);
        if(ret === undefined || ret.transactions === undefined) return;
        const txs = ret.transactions;
        lastCheckedBlock = ret.lastblock;
        const addressTxs = txs.filter(tx => tx.address === CONFIRM_ADDRESS && tx.scriptPubKey.nameOp.op === "name_doi" && tx.category === 'receive' && tx.confirmations >= 1 && tx.name !== undefined && tx.name.startsWith(TX_NAME_START));
        addressTxs.forEach(tx => addTx(tx));
        addOrUpdateMeta({key: LAST_CHECKED_BLOCK_KEY, value: lastCheckedBlock});
        console.log("Transactions updated");
    } catch(exception) {
        throw new Meteor.Error('namecoin.checkNewTransactions.exception', exception);
    }
};
export default checkNewTransactions;

const checkNewTransaction = (txid) => {
  try {

      if(isDebug()) { console.log("txid: "+txid+' was triggered by walletnotify getting its data from blockchain'); }

      const ret = getRawTransaction(CONFIRM_CLIENT, txid);
      const txs = ret.vout;

      if(!ret || !txs || !txs.length===0){
        console.log("txid"+txid+'does not contain transaction details or transaction not found.');
          return;
      }
      const addressTxs = txs.filter(tx =>
          tx.scriptPubKey.nameOp !== undefined
          && tx.scriptPubKey.nameOp.op === "name_doi"
          && tx.scriptPubKey.addresses[0] === CONFIRM_ADDRESS
          && tx.scriptPubKey.nameOp.name !== undefined
          && tx.scriptPubKey.nameOp.name.startsWith(TX_NAME_START)
      );
     // if(isDebug()) { console.log("get transaction details:"+JSON.stringify(txs)); }
      addressTxs.forEach(tx => addTx(tx,txid));
      addOrUpdateMeta({key: LAST_CHECKED_BLOCK_KEY, value: lastCheckedBlock});

  } catch(exception) {
    throw new Meteor.Error('doichain.checkNewTransactions.exception', exception);
  }
};


function addTx(tx,txid) {

  if(isDebug()) { console.log("addTx:"+JSON.stringify(tx)); }
  const txName = tx.scriptPubKey.nameOp.name.substring(TX_NAME_START.length);
  const txValue = tx.scriptPubKey.nameOp.value;
  const txAddress = tx.scriptPubKey.addresses[0]; //a soi entry can only be sent to one address so far.

  addDoichainEntry({
    name: txName,
    value: txValue,
    address: txAddress,
    txId: txid
  });
}

export default checkNewTransaction;

