import React  from 'react'
import {useMethod} from "react-meteor-hooks"

const RescanButton = () => {

    const rescanBlockchanMethod  = useMethod('doichain.rescan')

    const rescanBlockchain = e => {
        e.preventDefault();
        rescanBlockchanMethod.call()
    }
    return (
        <form onSubmit={rescanBlockchain}>
            <input type={"submit"} value={"Rescan"}/>
        </form>
    );
}

export default RescanButton;