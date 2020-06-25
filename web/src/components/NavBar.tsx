import React, {Component} from "react";
import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";

class NavBar extends Component {

    render() {
        return (
            <AppBar variant="elevation" position="static">
                <Toolbar>
                    <Typography variant="h6" className="mdc-top-app-bar__title">
                        Capital Call
                    </Typography>
                    <Button href="/" color="inherit">Dashboard</Button>
                    <Button href="/newcall" color="inherit">New Call</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default NavBar;