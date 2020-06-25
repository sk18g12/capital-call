import React, {Component} from 'react';
import '../App.css';
import 'material-components-web/dist/material-components-web.min.css'
import NewCallTable from "../components/NewCallTable";
import CallForm from "../components/CallForm";

class NewCall extends Component {

    render() {
        return (
            <div className="mdc-layout-grid">
                <div className="mdc-layout-grid__inner">
                    <div className="mdc-layout-grid__cell--span-12">
                        <h1>New Call</h1>
                    </div>
                    <NewCallTable/>
                    <CallForm/>
                </div>
            </div>
        );
    }
}

export default NewCall;
