import React from "react"
import MUIDataTable from "mui-datatables";
import {OptInsCollection,RecipientsCollection, SendersCollection} from "meteor/doichain:doichain-meteor-api";
import {useSubscription, useTracker} from "react-meteor-hooks"
import _ from 'lodash';

import {withStyles} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const styles = {

};

let data = []
let optIns = []

let options = {
    filterType: "dropdown",
    resizableColumns:true,
    expandableRows:true,
    renderExpandableRow: (rowData, rowMeta) => {
        console.log(rowData, rowMeta);
        return (
            <TableRow>
                <TableCell colSpan={rowData.length}>
                    NameId: {optIns[rowMeta.dataIndex].nameId} <br/>
                    Errors: {optIns[rowMeta.dataIndex].error?optIns[rowMeta.dataIndex].error:'none'}
                </TableCell>
            </TableRow>
        );
    },
    selectableRows: 'multiple',
    onRowsSelect: (rowData) => {
        console.log("onRowsSelect",rowData)
    },
    onRowsDelete: (rowsData) => {
        console.log("onRowsDelete1",rowsData)

        console.log(optIns[0]._id)
        Meteor.call("opt-ins.remove", optIns[0]._id, (error, val) => {
            if(!error) {
                console.log('deleted:'+ optIns[0]._id)
            }else{
                console.log(val)
            }
        });
    },
    onCellClick: (colData, cellMeta) => {
        console.log("onCellClick",colData)
        console.log("onCellClick",cellMeta)
    }
}

const OptIns = props => {

    const columns = [
        {
            name: "CreatedAt",
            options: {
                filter: true
            }
        },
        {
            name: "Sender",
            options: {
                filter: true
            }
        },
        {
            name: "Recipient",
            options: {
                filter: true
            }
        },
        {
            name: "Status",
            options: {
                filter: false,
                customBodyRender: function(value, tableMeta, updateValue){

                    const colorOrange = '#ff9900'
                    const colorYellow = '#ffbf00'
                    const colorGreen = '#57d500'
                    const colorRed = '#d9534f'

                    let color = colorRed;

                    if( value[value.length-1] === 'template fetched' ||
                        value[value.length-1] === 'template requested' ||
                        value[value.length-1] === 'signature verified' ||
                        value[value.length-1] === 'email configured') color = colorOrange

                    if( value[value.length-1] === 'transaction sent' ||
                        value[value.length-1] === 'opt-in received' ) color = colorYellow


                        return (
                        <span>
                        <span style={{color:color,transition: 'all .3s ease'}}>
                          &#x25cf;
                        </span> {
                            value[value.length-1]
                        }
                    </span>
                    );
                }
            }
        }
    ];

    const loading = useSubscription('opt-ins.all')
    const loadingSenders = useSubscription('senders.byOwner')
    const loadingRecipients  = useSubscription('recipients.all')
    optIns = useTracker(() => OptInsCollection.find({})).fetch()
    const senders = useTracker(() => SendersCollection.find({})).fetch()
    const recipients = useTracker(() => RecipientsCollection.find({})).fetch()

    if(!loading && !loadingSenders && !loadingRecipients){
        data = []
        optIns.map(doc => {
            // const _id = doc._id;
            const createdAt = doc.createdAt.toISOString()
            const nameId = doc.nameId ? doc.nameId : "";
            //const ownerId = doc.ownerId ? doc.ownerId : "";
            const sender = doc.sender && senders.length>0 ?  _.find(senders, { _id: doc.sender}).email  : "";
            const recipient = doc.recipient ? _.find(recipients, { _id: doc.recipient}).email: "";
            const status = doc.status;
            // const error = doc.error ? replaceAll(doc.error,"\"", "") : "";
            const newRecord = [createdAt, sender, recipient, status];
            //const newRecord = [sender, recipientId, createdAt, error];
            data.push(newRecord);
        });
        //see: https://www.material-ui-datatables.com/
        //https://github.com/gregnb/mui-datatables
    }
    return (
        <div id="opt-ins-wrapper">
            <MUIDataTable
                title={"Opt-Ins"}
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    )

}
export default withStyles(styles)(OptIns);
/*
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}*/
