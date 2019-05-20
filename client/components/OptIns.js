import React, {Component} from "react"
import MUIDataTable from "mui-datatables";
import {OptInsCollection,RecipientsCollection, SendersCollection, MetaCollection} from "meteor/doichain:doichain-meteor-api";
import {withTracker} from "meteor/react-meteor-data";
import _ from 'lodash';
import {Meteor} from "meteor/meteor";

class OptInsPage  extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        const {
            theme,
            meta,
            optIns,
            recipients,
            senders
        } = this.props

        //const columns = ["_id","createdAt","nameId","ownerId","recipient","sender","error"];
        const columns = [
            "sender",
            "recipient",
            "createdAt",
            "error"];
        let data = [];

      /*  console.log(meta); */

        optIns.map(doc => {
            const _id = doc._id;
            const createdAt = doc.createdAt.toISOString();
            //const nameId = doc.nameId ? doc.nameId : "";
            //const ownerId = doc.ownerId ? doc.ownerId : "";
            const sender = doc.sender && senders.length>0 ?  _.find(senders, { _id: doc.sender}).email  : "";
            const recipientId = doc.recipient ? _.find(recipients, { _id: doc.recipient}).email: "";
            const error = doc.error ? replaceAll(doc.error,"\"", "") : "";
            //const newRecord = [_id, createdAt, nameId, ownerId, recipientId, sender, error];
            const newRecord = [sender, recipientId, createdAt, error];
            data.push(newRecord);
        });

        //see: https://www.material-ui-datatables.com/
        //https://github.com/gregnb/mui-datatables
        const options = {
            filterType: "checkbox",
            resizableColumns:true
        };
        return (
            <div id="opt-ins-wrapper" className={theme}>
                <MUIDataTable
                    title={"Opt-Ins"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </div>
        )
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

export default withTracker(() => {

    const metaHandle = Meteor.subscribe('meta.all');
    const optInsHandle = Meteor.subscribe('opt-ins.all');
    const sendersHandle = Meteor.subscribe('senders.byOwner');
    const recipientsHandle = Meteor.subscribe('recipients.byOwner');

    /*console.log('meta ready:'+metaHandle.ready());
    console.log('senders ready:'+sendersHandle.ready());
    console.log('optIns ready:'+optInsHandle.ready());
    console.log('recipientsHandle ready:'+recipientsHandle.ready());*/
    const loading = !optInsHandle.ready()||!recipientsHandle.ready();

    return {
        loading,
        meta: metaHandle.ready() ? MetaCollection.find().fetch() : [],
        optIns: !loading ? OptInsCollection.find().fetch() : [],
        recipients: recipientsHandle.ready() ? RecipientsCollection.find().fetch() : [],
        senders: sendersHandle.ready() ? SendersCollection.find().fetch() : []
    }
})(OptInsPage)