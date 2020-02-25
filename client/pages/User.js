import React,{ useState,useEffect } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { useTable } from 'react-table'
import {useSubscription,useTracker,useMethod} from "react-meteor-hooks"
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    'react': '16.8.6',
    'react-dom': '16.8.6',
    'react-meteor-hooks:':'0.3.1',
    "react-scripts": "3.1.1",
    "react-table": "7.0.0-alpha.30"
}, 'doichain:settings');

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`


const EditableCell = ({
                          cell: { value: initialValue },
                          row: { index },
                          column: { id },
                          updateMyData, // This is a custom function that we supplied to our table instance
                      }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input value={value} onChange={onChange} onBlur={onBlur} />
}
EditableCell.propTypes = {
    cell: PropTypes.shape({ value: PropTypes.object }),
    row: PropTypes.shape({ index: PropTypes.object }),
    column: PropTypes.shape({ id: PropTypes.object }),
    updateMyData: PropTypes.func
}

const editableColumn = {
    Cell: EditableCell,
}

function Table({ columns, data, updateMyData, disablePageResetOnDataChange }) {
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
        defaultColumn: editableColumn,
        disablePageResetOnDataChange,
        // updateMyData isn't part of the API, but
        // anything we put into these options will
        // automatically be available on the instance.
        // That way we can call this function from our
        // cell renderer!
        updateMyData
    })

    // Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
                <tr key={headerGroupIndex} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, headerIndex) => (
                        <th key={headerIndex} {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {rows.map(
                (row, rowIndex) =>
                    prepareRow(row) || (
                        <tr key={rowIndex} {...row.getRowProps()}>
                            {row.cells.map((cell, cellIndex) => {
                                return <td key={cellIndex} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
            )}
            </tbody>
        </table>
    )
}
Table.propTypes = {
    columns: PropTypes.object,
    data: PropTypes.object,
    updateMyData: PropTypes.func,
    disablePageResetOnDataChange: PropTypes.bool
};

const User = () => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Users',
                columns: [
                    {
                        Header: 'Username',
                        accessor: 'username',
                        Cell: ({ cell: { value } }) => value?value:''
                    },
                    {
                        Header: 'Email',
                        accessor: 'email'
                    }
                ],
            },
            {
                Header: 'Mail Template',
                columns: [
                    {
                        Header: 'Sender Name',
                        accessor: 'profile.mailTemplate.senderName',
                        defaultColumn: editableColumn
                    },
                    {
                        Header: 'Email Subject',
                        accessor: 'profile.mailTemplate.subject',
                        defaultColumn: editableColumn
                    },
                    {
                        Header: 'Redirect URL (after confirmation)',
                        accessor: 'profile.mailTemplate.redirect',
                        defaultColumn: editableColumn
                    },
                    {
                        Header: 'returnPath (email)',
                        accessor: 'profile.mailTemplate.returnPath',
                        defaultColumn: editableColumn
                    },
                    {
                        Header: 'Template URL (after confirmation)',
                        accessor: 'profile.mailTemplate.templateURL',
                        defaultColumn: editableColumn
                    }
                ],
            }
        ],
        []
    )

    const usersUpdate  = useMethod('users.update')

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.
    const skipPageResetRef = React.useRef(false)
    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnID and new value to update the
    // original data
    const updateMyData = (rowIndex, columnID, value) => {
        // We also turn on the flag to not reset the page
        skipPageResetRef.current = true
        usersUpdate.call({_id:listItems[rowIndex]._id,columnID:columnID,value:value})

        setData(old =>
              old.map((row, index) => {
                  if (index === rowIndex) {
                      return {
                          ...old[rowIndex],
                          [columnID]: value,
                      }
                  }
                  return row
              })
          )
    }
    const listItems = []

    const loading = useSubscription('users.user')
    const users = useTracker(() => Meteor.users.find({}))

    if(!loading ){
        users.map(doc => {
            const _id = doc._id;
            const username = doc.username;
            const senderName = doc.senderName;
            const email = doc.emails[0].address
            const profile = doc.profile;
            const newRecord = {_id, username, senderName, email,profile};
            listItems.push(newRecord);
        });
    }

    const [data, setData] =  useState(listItems)

    useEffect( () => {
        setData(listItems)
    }, [loading]);
    return (
        <Styles>
            <Table
                columns={columns}
                updateMyData={updateMyData}
                data={data}
                disablePageResetOnDataChange={skipPageResetRef.current}
            />
        </Styles>
    )
}

export default User
