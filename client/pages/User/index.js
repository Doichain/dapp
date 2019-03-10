import React, { Component } from "react";
import PropTypes from "prop-types";
import OptInsPage from "../../components/OptIns";
import Balance from "../../components/Balance/Balance";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {withStyles} from "@material-ui/core";


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

class User extends Component {

    constructor(props) {
        super(props);
    }
    render () {

    const {
        user,
        theme,
        classes
    } = this.props;

    return (
        <React.Fragment>
            <div style={{ padding: 20 }}>
                <Grid container className={classes.grid} justify="center" alignItems="center" spacing={24}>
                    <Grid item xs>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Current Balance in DOI: <b><Balance/></b>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    DOI requested
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    DOI confirmed
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <p>&nbsp;</p>
            <OptInsPage user={user} theme={theme}/>
        </React.Fragment>
    )
  }

}

User.propTypes = {
  theme: PropTypes.string.isRequired
}

export default withStyles(styles)(User);