import React, {Component} from "react";
import {AppBar, Button, Toolbar} from "@material-ui/core";

class NavBar extends Component {

    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <a href="/"><Button color="inherit">Dashboard</Button></a>
                    <a href="/newcall"><Button color="inherit">New Call</Button></a>
                </Toolbar>
            </AppBar>
        )
    }
}

export default NavBar;