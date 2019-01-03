import React, {Component} from "react"
import MUIDataTable from "mui-datatables";
import {OptInsCollection,RecipientsCollection} from "meteor/doichain:doichain-meteor-api";
import {withTracker} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";

class OptInsPage  extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        const {
            theme,
            optIns
        } = this.props

        //const columns = ["_id","createdAt","nameId","ownerId","recipient","sender","error"];
        const columns = ["recipient","sender","createdAt","error"];
        let data = [];

        optIns.map(doc => {
            const _id = doc._id;
            const createdAt = doc.createdAt.toISOString();
            //const nameId = doc.nameId ? doc.nameId : "";
            //const ownerId = doc.ownerId ? doc.ownerId : "";
            const recipientId = doc.recipient ? doc.recipient : "";
            const sender = doc.sender ? doc.sender : "";
            const error = doc.error ? replaceAll(doc.error,"\"", "") : "";
            //const newRecord = [_id, createdAt, nameId, ownerId, recipientId, sender, error];
            const newRecord = [recipientId, sender, createdAt, error];
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
    const optInsHandle = Meteor.subscribe('opt-ins.all');
    const recipientsHandle = Meteor.subscribe('recipients.byOwner');
    const loading = !optInsHandle.ready()||!recipientsHandle.ready();

    return {
        loading,
        optIns: !loading ? OptInsCollection.find().fetch() : [],
        recipients: recipientsHandle.ready() ? RecipientsCollection.find().fetch() : []
    }
})(OptInsPage)