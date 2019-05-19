import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {AccountsReact} from "meteor/meteoreact:accounts";
import DoichainVersion from "../../components/DoichainVersion";
import {useCurrentUser} from "react-meteor-hooks";
const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

const Navbar = props => {

    return (
        <div className={props.classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={props.classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" className={props.classes.grow}>
                        Doichain - dApp
                    </Typography>
                    <DoichainVersion />
                    <Button color="inherit" onClick={() =>  AccountsReact.logout()}>{useCurrentUser?'Logout':'Login'}</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);