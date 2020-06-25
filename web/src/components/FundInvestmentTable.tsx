import React, {Component} from "react";

class FundInvestmentTable extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            calls: [],
            funds: [],
            fundInvestments: [],
            callsIsLoaded: false,
            fundsIsLoaded: false,
            fundInvestmentsIsLoaded: false
        }
    }

    componentDidMount(): void {
        fetch('http://localhost:5000/api/calls')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    calls: json,
                    callsIsLoaded: true
                })
            });
        fetch('http://localhost:5000/api/funds')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    funds: json,
                    fundsIsLoaded: true
                })
            });
        fetch('http://localhost:5000/api/fund_investments')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    fundInvestments: json,
                    fundInvestmentsIsLoaded: true
                })
            });
    }

    filterFundInvestments(fundInvestments: any, fund_id: number, call_id: number): number {
        let filtered = fundInvestments.filter(
            (fundInvestment: any) => fundInvestment.fund_id === fund_id && fundInvestment.call_id === call_id);

        if (!filtered.length) {
            return 0
        } else {
            // Assumption that there will only be one fundInvestment per Fund per Call
            return filtered[0].investment_amount
        }
    }

    render() {

        let {callsIsLoaded, fundsIsLoaded, fundInvestmentsIsLoaded, calls, funds, fundInvestments}: Readonly<any> = this.state;

        if (!callsIsLoaded || !fundsIsLoaded || !fundInvestmentsIsLoaded) {
            return <div>Loading</div>
        } else {

            return (
                <div className="mdc-data-table">
                    <table className="mdc-data-table__table" aria-label="Dessert calories">
                        <thead>
                        <tr className="mdc-data-table__header-row">
                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Call ID</th>
                            <th className="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
                                role="columnheader" scope="col">Date
                            </th>
                            {funds.map((row: any) => {
                                return (
                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col"
                                        key={row.fund_id}>{row.fund_name}</th>
                                )
                            })}
                        </tr>
                        </thead>
                        <tbody className="mdc-data-table__content">
                        {calls.map((call: any) => {
                            return (
                                <tr className="mdc-data-table__row" key={call.call_id}>
                                    <td className="mdc-data-table__cell">{call.call_id}</td>
                                    <td className="mdc-data-table__cell">{new Intl.DateTimeFormat("en-GB").format(Date.parse(call.date))}</td>
                                    {funds.map((fund: any) => {
                                        return (
                                            <td className="mdc-data-table__cell" key={fund.fund_id}>
                                                {new Intl.NumberFormat("en-GB", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(this.filterFundInvestments(fundInvestments, fund.fund_id, call.call_id))}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

export default FundInvestmentTable;