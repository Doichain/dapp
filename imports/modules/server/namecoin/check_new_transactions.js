import { Meteor } from 'meteor/meteor';
import { getTransaction, nameShow } from '../../../../server/api/namecoin.js';
import { CONFIRM_CLIENT } from '../../../startup/server/namecoin-configuration.js';
import addNamecoinEntry from './add_entry_and_fetch_data.js'
import {isDebug} from "../../../startup/server/dapp-configuration";

const TX_NAME_START = "doi: e/";


const checkNewTransaction = (txid) => {
  try {

      if(isDebug()) { console.log("txid"+txid+' was triggered by walletnotify getting its data from blockchain'); }

      const ret = getTransaction(CONFIRM_CLIENT, txid);
      const txs = ret.details;
      if(!ret || !txs || !txs.length===0){
        console.log("txid"+txid+'does not contain transaction details or transaction not found.');
          return;
      }
      if(isDebug()) { console.log("get transaction details:"+JSON.stringify(txs)); }

      const addressTxs = txs.filter(tx =>
          tx.category === 'receive' &&
          tx.name !== undefined &&
          tx.name.startsWith(TX_NAME_START));

      addressTxs.forEach(tx => addTx(tx));

    if(isDebug()) { console.log("Incoming Doi-Transactions checked and updated"); }

  } catch(exception) {
    throw new Meteor.Error('namecoin.checkNewTransactions.exception', exception);
  }
};

function addTx(tx) {
  var txName = tx.name.substring(TX_NAME_START.length);
  const ety = nameShow(CONFIRM_CLIENT, txName);
  addNamecoinEntry({
    name: txName,
    value: ety.value,
    address: ety.address,
    txId: ety.txid,
    expiresIn: ety.expires_in,
    expired: ety.expired
  });
}

export default checkNewTransaction;
