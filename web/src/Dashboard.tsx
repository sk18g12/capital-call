import React, {Component} from 'react';
import './App.css';
import 'material-components-web/dist/material-components-web.min.css'
import FundInvestmentTable from "./components/FundInvestmentTable";

class Dashboard extends Component {
    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <FundInvestmentTable/>
            </div>
        );
    }
}

export default Dashboard;
