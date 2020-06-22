import React from 'react';
import './App.css';
import 'material-components-web/dist/material-components-web.min.css'
import NavBar from "./components/NavBar";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import NewCall from "./NewCall";
import Dashboard from "./Dashboard";

function App() {
    return (
        <div className="App">
            <div className="mdc-typography">
                <NavBar/>
                <header className="App-header">
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Dashboard}/>
                            <Route path="/newcall" component={NewCall}/>
                            <Redirect path="*" to="/"/>
                        </Switch>
                    </BrowserRouter>
                </header>
            </div>
        </div>
    );
}

export default App;
