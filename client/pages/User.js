import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import {useSubscription, useTracker} from "react-meteor-hooks"
import {OptInsCollection} from "meteor/doichain:doichain-meteor-api";

let data = [{createdAt:'user1'},{createdAt:'user1'},{createdAt:'user1'}]
let users = []

const User = props => {

    let options = {
        filterType: "dropdown",
        resizableColumns:true,
    }
    const columns = [
        {
            name: "Id",
            options: {
                filter: true
            }
        },
        {
            name: "username",
            options: {
                filter: true
            }
        },
        {
            name: "email",
            options: {
                filter: true
            }
        },
        {
            name: "profile",
            options: {
                filter: false,
                customBodyRender: function(value, tableMeta, updateValue){
                    console.log("profile",value)
                    return (
                        <span>
                        {
                            'test'
                        }
                    </span>
                    );
                }
            }
        }
    ]

    const loading = useSubscription('users.user')
    users = useTracker(() => Meteor.users.find({})).fetch()
    console.log(users)
    if(!loading ){
        data = []
        users.map(doc => {
            const _id = doc._id;
            const username = doc.username;
            const email = doc.emails[0].address
            const profile = doc.profile;
            const newRecord = [_id, username, email,profile];
            data.push(newRecord);
        });
        //see: https://www.material-ui-datatables.com/
        //https://github.com/gregnb/mui-datatables
    }
    return (
        <React.Fragment>
            <MUIDataTable
                title={"dApp User"}
                data={data}
                columns={columns}
                options={options}
            />
        </React.Fragment>
    )
}

User.propTypes = {
//  theme: PropTypes.string.isRequired
}

export default User;