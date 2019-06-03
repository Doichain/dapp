import React, { Component } from "react";
import PropTypes from "prop-types";
import OptIns from "../components/OptIns";
import Balance from "../components/Balance";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {withStyles} from "@material-ui/core";
import {useCurrentUser} from "react-meteor-hooks";
import Chain from "../components/Chain";
import Blocks from "../components/Blocks";
import Difficulty from "../components/Difficulty";
import SizeOnDisk from "../components/SizeOnDisk";
import UnconfirmedBalance from "../components/UnconfirmedBalance";

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

const User = props => {
    //console.log(props)
    const currentUser = useCurrentUser()

    return (
        <React.Fragment>
            <div style={{ padding: 20 }}>
                <Grid container className={props.classes.grid} justify="flex-start" alignItems="center" spacing={24}>
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
            <p>&nbsp;</p>
            <OptIns user={currentUser} theme={props.theme}/>
        </React.Fragment>
    )
}

User.propTypes = {
  theme: PropTypes.string.isRequired
}

export default withStyles(styles)(User);