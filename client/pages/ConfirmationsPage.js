import React from 'react'
import styled from 'styled-components'
import { useTable,useFilters } from 'react-table'
import {useSubscription,useTracker,useMethod} from "react-meteor-hooks"
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import {OptInsCollection} from "meteor/doichain:doichain-meteor-api";
import matchSorter from 'match-sorter'

checkNpmVersions({
    'react': '16.8.6',
    'react-dom': '16.8.6',
    'react-meteor-hooks:':'0.3.1',
    "react-scripts": "3.1.1",
    "react-table": "7.0.0-alpha.30"
}, 'doichain:settings');


// Create an editable cell renderer
const StatusCell = ({
                          cell: { value: value },
                          row: { index },
                          column: { id },
                      }) => {

    const statusItems = value.map((status, index) =>
        <p key={index}>{status}</p>
    );
    return statusItems
}

const ConfirmationsPage = props => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Opt-Ins',
                columns: [
                    {
                        Header: 'CreatedAt',
                        accessor: 'createdAt',
                        Cell: ({ cell: { value } }) => value.toISOString()
                    },
                    {
                        Header: 'NameId',
                        accessor: 'nameId'
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                        Cell: StatusCell
                    },
                    {
                        Header: 'RVB',
                        accessor: 'receivedByValidator',
                        Cell: ({ cell: { value } }) => {
                            return (value&&value===true)?'1':'0'
                        }
                    },
                 /*   {
                        Header: 'CBV',
                        accessor: 'confirmedByValidator',
                        Cell: ({ cell: { value } }) => {
                            return (value&&value===true)?'1':'0'
                        }
                    },
                    {
                        Header: 'OurRDOI',
                        accessor: 'ourRequestedDoi',
                        Cell: ({ cell: { value } }) => {
                            return (value&&value===true)?'1':'0'
                        }
                    },
                    {
                        Header: 'OurRaCDoi',
                        accessor: 'ourRequestedAndConfirmedDois',
                        Cell: ({ cell: { value } }) => {
                            return (value&&value===true)?'1':'0'
                        }
                    } */
                ],
            }
        ],
        []
    )


    // Use the state and functions returned from useTable to build your UI
    // Define a default UI for filtering
    function DefaultColumnFilter({
                                     column: { filterValue, preFilteredRows, setFilter },
                                 }) {
        const count = preFilteredRows.length

        return (
            <input
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={`Search ${count} records...`}
            />
        )
    }

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    function fuzzyTextFilterFn(rows, id, filterValue) {
        return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
    }

    function Table({ columns, data}) {

        const { getTableProps, headerGroups, rows, prepareRow, state } = useTable({
                columns,
                data,
                defaultColumn, // Be sure to pass the defaultColumn option
                filterTypes,
            },
            useFilters // useFilters!
        )
        // Render the UI for your table
        return (
            <div>
                <div>
                <pre>filters:
                  <code>{(state && state.length>0 && state[0])?JSON.stringify(state[0].filters, null, 2):''}</code>
                </pre>
            </div>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                                {/* Render the columns filter UI */}
                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {rows.map(
                    (row, i) =>
                        prepareRow(row) || (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                )}
                </tbody>
            </table>
            </div>
        )
    }

    const loading = useSubscription('confirmations.all')
    const confirmations = useTracker(() => OptInsCollection.find({})).fetch()

    return (
        <Styles>
            <Table
                columns={columns}
                data={confirmations}
            />
        </Styles>
    )
}

export default ConfirmationsPage;

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

