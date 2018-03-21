import { Meteor } from 'meteor/meteor';
import { listSinceBlock, nameShow } from '../../../../server/api/namecoin.js';
import { CONFIRM_CLIENT, CONFIRM_ADDRESS } from '../../../startup/server/namecoin-configuration.js';
import { Settings } from '../../../api/settings/settings.js';
import addOrUpdateSetting from '../settings/addOrUpdate.js';
import addNamecoinEntry from './add_entry_and_fetch_data.js'

const TX_NAME_START = "update: e/";
const LAST_CHECKED_BLOCK_KEY = "lastCheckedBlock";

const checkNewTransactions = () => {
  try {
    var lastCheckedBlock = Settings.findOne({key: LAST_CHECKED_BLOCK_KEY});
    if(lastCheckedBlock !== undefined) lastCheckedBlock = lastCheckedBlock.value;
    const ret = listSinceBlock(CONFIRM_CLIENT, lastCheckedBlock);
    if(ret === undefined || ret.transactions === undefined) return;
    const txs = ret.transactions;
    lastCheckedBlock = ret.lastblock;
    const addressTxs = txs.filter(tx =>
      tx.address === CONFIRM_ADDRESS &&
      tx.category === 'receive' &&
      tx.confirmations >= 1 &&
      tx.name !== undefined &&
      tx.name.startsWith(TX_NAME_START));
    addressTxs.forEach(tx => addTx(tx));
    addOrUpdateSetting({key: LAST_CHECKED_BLOCK_KEY, value: lastCheckedBlock});
    console.log("Transactions updated");
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

export default checkNewTransactions;
