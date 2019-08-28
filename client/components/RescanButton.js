import React  from 'react'
import {useMethod} from "react-meteor-hooks"

const RescanButton = props => {

    const rescanBlockchanMethod  = useMethod('doichain.rescan')

    const rescanBlockchain = e => {
        e.preventDefault();
        console.log('rescanning blockchain')
        rescanBlockchanMethod.call()
    }
    return (
        <form onSubmit={rescanBlockchain}>
            <input type={"submit"} value={"Rescan"}/>
        </form>
    );
}

export default RescanButton;