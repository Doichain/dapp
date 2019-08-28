import React  from 'react'
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import Chain from "../components/Chain"
import Blocks from "../components/Blocks"
import Difficulty from "../components/Difficulty"
import SizeOnDisk from "../components/SizeOnDisk"
import Balance from "../components/Balance"
import UnconfirmedBalance from "../components/UnconfirmedBalance"
import AdressesByAccount from "../components/AddressesByAcccount"
import RescanButton from "../components/RescanButton"
import GenerateBlockButton from "../components/GenerateBlockButton"
import {withStyles} from "@material-ui/core"
import MetaData from "../components/MetaData"
import {
    BLOCKCHAIN_INFO_VAL_ALLREQUESTEDDOIS,
    BLOCKCHAIN_INFO_VAL_ALLCONFIRMEDDOIS,
    BLOCKCHAIN_INFO_VAL_OURREQUESTEDDOIS,
    BLOCKCHAIN_INFO_VAL_OURREQUESTEDANDCONFIRMEDDOIS,
    BLOCKCHAIN_INFO_VAL_OURRECEIVEDDOIS,
    BLOCKCHAIN_INFO_VAL_OURCONFIRMEDDOIS
} from "meteor/doichain:doichain-meteor-api"

const styles = {
    grid: {
        marginLeft:10,
        marginRight:10
    },
    card: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};


const Wallet = props => {

    const requestEmailPermission = e => {
        e.preventDefault();

        const recipientMail = e.target.recipientMail.value;
        const senderEmail = e.target.senderEmail.value;
        console.log('handleCoin clicked: email',recipientMail)

        Meteor.call("doichain.requestEmailPermission", {senderEmail,recipientMail}, (error, val) => {
            if(!error) {
                console.log('requestEmailPermission',val)
            }else{
                console.log('requestEmailPermission',error)
            }
        })
    }

    const sendCoins= e => {
        e.preventDefault();
        const address = e.target.address.value;
        const amount = e.target.amount.value;

        console.log('handleCoin clicked: amount (doi)',e.target.amount.value)
        console.log('handleCoin clicked: address',e.target.address.value)

        Meteor.call("doichain.sendToAddress", {address, amount}, (error, val) => {
            if(!error) {
                console.log('sendToAddress',val)
            }else{
                console.log('sendToAddress',error)
            }
        })
        console.log(`sendToAddress address:${address} amount:${amount} `)
    }

    return (
        <React.Fragment>
            <div style={{ padding: 20 }}>
            <Grid container className={props.classes.grid} alignItems="flex-start" spacing={24}>
                <Grid item xs>
                    <Card className={props.classes.card}>
                        <CardContent>
                            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
                                My Addresses:
                                <AdressesByAccount/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={props.classes.card}>
                        <CardContent>
                            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
                                Chain: <b><Chain/></b><br/>
                                Blocks: <b><Blocks/></b> <br/>
                                Difficulty: <b><Difficulty/></b> <br/>
                                Size on disk: <b><SizeOnDisk/></b> <br/>
                                Balance (DOI): <b><Balance/></b> <br/>
                                Unconfirmed Balance (DOI): <b><UnconfirmedBalance/></b> <br/>
                            </Typography>
                            <RescanButton/>
                            <GenerateBlockButton/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={props.classes.card}>
                        <CardContent>
                            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
                                <b>Doichain all </b><br/>
                                DOI requested: <b><MetaData metakey={BLOCKCHAIN_INFO_VAL_ALLREQUESTEDDOIS} /></b><br/>
                                DOI confirmed: <b><MetaData metakey={BLOCKCHAIN_INFO_VAL_ALLCONFIRMEDDOIS} /></b><br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={props.classes.card}>
                        <CardContent>
                            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
                                <b>This Doichain Node </b><br/>
                                DOI requested: <b><MetaData metakey={BLOCKCHAIN_INFO_VAL_OURREQUESTEDDOIS} /></b><br/>
                                DOI confirmed: <b><MetaData metakey={BLOCKCHAIN_INFO_VAL_OURREQUESTEDANDCONFIRMEDDOIS} /></b><br/>
                                DOI received Validator: <b><MetaData metakey={BLOCKCHAIN_INFO_VAL_OURRECEIVEDDOIS} /></b><br/>
                                DOI confirmed by Validator: <b><MetaData metakey={BLOCKCHAIN_INFO_VAL_OURCONFIRMEDDOIS} /></b><br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
            <h1>Email permission</h1>
            <form onSubmit={requestEmailPermission}>
                <table>
                    <tbody>
                    <tr>
                        <td>Request permission from </td>
                        <td>Sender Email:<input type={"text"} name={"senderEmail"}/></td>
                        <td>Recipient Email:<input type={"text"} name={"recipientMail"}/></td>
                        <td><input type={"submit"} value={"Request"}/></td>
                    </tr>
                    </tbody>
                </table>
            </form>
        <h1>Doicoin</h1>
            <form onSubmit={sendCoins}>
                <table>
                    <tbody>
                    <tr>
                        <td>Send </td>
                        <td>amount: <input name={"amount"} type={"number"} />DOI</td>
                        <td>to:<input name={"address"} type={"text"} />(Address)</td>
                        <td><input type={"submit"} value={"send"}/></td>
                    </tr>
                    </tbody>
                </table>
            </form>
    </React.Fragment>)
}


export default withStyles(styles)(Wallet);