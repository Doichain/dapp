import React  from 'react'
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Chain from "../components/Chain";
import Blocks from "../components/Blocks";
import Difficulty from "../components/Difficulty";
import SizeOnDisk from "../components/SizeOnDisk";
import Balance from "../components/Balance";
import UnconfirmedBalance from "../components/UnconfirmedBalance";
import AdressesByAccount from "../components/AddressesByAcccount"
import {withStyles} from "@material-ui/core";
import {useCurrentUser} from "react-meteor-hooks";

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
    const currentUser = useCurrentUser()
    const requestDoubleOptInClick = e => (
        console.log('requestDoubleOptInClick clicked',e.target)
    )
    const sendCoinClick= e => (
        console.log('handleCoin clicked',e)
        Meteor.call("opt-ins.remove", optIns[0]._id, (error, val) => {
            if(!error) {
                console.log('deleted:'+ optIns[0]._id)
            }else{
                console.log(val)
            }
        });
    )
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
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={props.classes.card}>
                        <CardContent>
                            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
                                DOI requested Doichain all<br/>
                                DOI requested this Doichain dApp <br/>
                                DOI requested by user {currentUser.username}  <br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={props.classes.card}>
                        <CardContent>
                            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
                                DOI confirmed Doichain all <br/>
                                DOI confirmed this Doichain dApp <br/>
                                DOI confirmed by user {currentUser.username}  <br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
            <h1>Email permission</h1>
            <table>
                <tbody>
                <tr>
                    <td>Request permission from </td>
                    <td>Email:<input type={"text"} name="email"/></td>
                    <td><input type={"button"} value={"Request"}  onClick={requestDoubleOptInClick}/></td>
                </tr>
                </tbody>
            </table>
        <h1>Doicoin</h1>
            <table>
                <tbody>
                <tr>
                    <td>Send </td>
                    <td><input type={"text"} />DOI</td>
                    <td>to:<input type={"text"} />DOI</td>
                    <td><input type={"button"} value={"send"}  onClick={sendCoinClick}/></td>
                </tr>
                </tbody>
            </table>
    </React.Fragment>)
}


export default withStyles(styles)(Wallet);