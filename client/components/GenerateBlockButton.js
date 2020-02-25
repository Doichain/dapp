import React  from 'react'
import {useMethod} from "react-meteor-hooks"

const GenerateBlockButton = () => {

    const generateBlockMethod  = useMethod('doichain.generate')

    const generateBlock = e => {
        e.preventDefault();
        generateBlockMethod.call({blocks:1})
    }

    //TODO only display button if on regtest network !
    // if(isRegtest)
    return (
        <button onClick={generateBlock} onTouchEnd={generateBlock}>Generate Block</button>
    );
}

export default GenerateBlockButton;