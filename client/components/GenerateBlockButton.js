import React  from 'react'
import {useMethod} from "react-meteor-hooks"

const GenerateBlockButton = props => {

    const generateBlockMethod  = useMethod('doichain.generate')

    const generateBlock = e => {
        e.preventDefault();
        console.log('generating block if thats a regtest blockchain')
        generateBlockMethod.call({blocks:1})
    }

    return (
        <button onClick={generateBlock} onTouchEnd={generateBlock}>Generate Block</button>
    );
}

export default GenerateBlockButton;