import React from "react"
import MUIDataTable from "mui-datatables";
import {OptInsCollection,RecipientsCollection, SendersCollection} from "meteor/doichain:doichain-meteor-api";
import {useSubscription, useTracker} from "react-meteor-hooks"
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

let data = []
let confirmations = []

let options = {
    filterType: "dropdown",
    resizableColumns:true,
    expandableRows:true,
    renderExpandableRow: (rowData, rowMeta) => {
        const valueJSON = (confirmations[rowMeta.dataIndex].value!==undefined)?JSON.parse(confirmations[rowMeta.dataIndex].value):''
        const signature = (valueJSON!==undefined)?valueJSON.signature:""
        const from =  (valueJSON!==undefined)?valueJSON.from!==undefined?valueJSON.from:"":""

        return (
            <TableRow>
                <TableCell colSpan={rowData.length}>
                    NameId: {confirmations[rowMeta.dataIndex].nameId} <br/>
                    Domain: {confirmations[rowMeta.dataIndex].domain} <br/>
                    Address: {confirmations[rowMeta.dataIndex].address} <br/>
                    TxId: {confirmations[rowMeta.dataIndex].txId} <br/>
                    Confirmations: {confirmations[rowMeta.dataIndex].confirmations} <br/>
                    States: {confirmations[rowMeta.dataIndex].status} <br/>
                    Signature: {signature} <br/>
                    From: {from.substring(0,50)}  <br/>
                    Errors: {confirmations[rowMeta.dataIndex].error?confirmations[rowMeta.dataIndex].error:'none'}
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

        console.log(confirmations[0]._id)
        Meteor.call("opt-ins.remove", confirmations[0]._id, (error, val) => {
            if(!error) {
                console.log('deleted:'+ confirmations[0]._id)
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
            name: "NameId",
            options: {
                filter: true
            }
        },
        {
            name: "Domain",
            options: {
                filter: true
            }
        },
        {
            name: "receivedByValidator",
            options: {
                filter: true
            }
        },
        {
            name: "confirmedByValidator",
            options: {
                filter: true
            }
        },
        {
            name: "ourRequestedDoi",
            options: {
                filter: true
            }
        },
        {
            name: "ourRequestedAndConfirmedDois",
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

                    if(value) {
                        if (value[value.length - 1] === 'template fetched' ||
                            value[value.length - 1] === 'template requested' ||
                            value[value.length - 1] === 'signature verified' ||
                            value[value.length - 1] === 'email configured') color = colorOrange

                        if (value[value.length - 1] === 'transaction sent' ||
                            value[value.length - 1] === 'opt-in received') color = colorYellow
                    }else{ // old versions don't have a status
                            color = colorYellow;
                    }

                    return (
                        <span>
                            <span style={{color:color,transition: 'all .3s ease'}}>
                              &#x25cf;
                            </span> { value?value[value.length-1]:'unkown status'}
                        </span>
                    );
                }
            }
        }
    ];

    const loading = useSubscription('confirmations.all')
    confirmations = useTracker(() => OptInsCollection.find({})).fetch()


    if(!loading){
        data = []
        confirmations.map(doc => {
            // const _id = doc._id;
            const createdAt = doc.createdAt.toISOString()
            const nameId = doc.nameId ? doc.nameId : "";
            const txId = doc.txId ? doc.txId : "";
            const status = doc.status;
            const domain = doc.domain;
            const newRecord = [createdAt, nameId,domain,status,
                doc.receivedByValidator,
                doc.confirmedByValidator,
                doc.ourRequestedDoi,
                doc.ourRequestedAndConfirmedDois];
            data.push(newRecord);
        });
        //see: https://www.material-ui-datatables.com/
        //https://github.com/gregnb/mui-datatables
    }
    return (
        <div id="opt-ins-wrapper">
            <MUIDataTable
                title={"Confirmations"}
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    )

}
export default OptIns;
/*
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}*/
