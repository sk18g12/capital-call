import React, {Component} from "react";

class NewCallTable extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            items: [],
            fundInvestments: [],
            funds: [],
            isLoaded: false
        }
    }

    componentDidMount(): void {
        fetch('http://localhost:5000/commitments')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            });
        fetch('http://localhost:5000/funds')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    funds: json,
                })
            });
        fetch('http://localhost:5000/fund_investments')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    fundInvestments: json,
                })
            });
    }

    calculateUndrawnCapital(fundInvestments: any, fund_id: number, commitment_id: number, commitment_amount: number): number {
        let filtered = fundInvestments.filter(
            (fundInvestment: any) => fundInvestment.fund_id === fund_id && fundInvestment.commitment_id === commitment_id);

        if (!filtered.length) {
            return commitment_amount
        } else {
            return commitment_amount - filtered[0].investment_amount
        }
    }

    getFundNameById(funds: any, fund_id: number): string {
        let filtered = funds.filter(
            (fund: any) => fund.fund_id === fund_id);

        if (!filtered.length) {
            return "N/A";
        } else {
            return filtered[0].fund_name;
        }
    }

    render() {
        // @ts-ignore
        var {isLoaded, items, fundInvestments, funds} = this.state;

        if (!isLoaded) {
            return <div>Loading</div>
        } else {

            return (
                <div className="mdc-layout-grid__cell--span-12">
                    <div className="mdc-data-table">
                        <table className="mdc-data-table__table" aria-label="Dessert calories">
                            <thead>
                            <tr className="mdc-data-table__header-row">
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Commitment
                                    ID
                                </th>
                                <th className="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
                                    role="columnheader" scope="col">Fund ID
                                </th>
                                <th className="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
                                    role="columnheader" scope="col">Date
                                </th>
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Fund Name
                                </th>
                                <th className="mdc-data-table__header-cell " role="columnheader" scope="col">Committed
                                    Amounts
                                </th>
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Undrawn
                                    Capital BEFORE
                                </th>
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Total
                                    Drawdown Notice
                                </th>
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Undrawn
                                    Capital AFTER
                                </th>
                            </tr>
                            </thead>
                            <tbody className="mdc-data-table__content">
                            {items.map((row: any) => (
                                <tr key={row.commitment_id} className="mdc-data-table__row">
                                    <td className="mdc-data-table__cell">{row.commitment_id}</td>
                                    <td className="mdc-data-table__cell">{row.fund_id}</td>
                                    <td className="mdc-data-table__cell">{new Intl.DateTimeFormat("en-GB").format(Date.parse(row.date))}</td>
                                    <td className="mdc-data-table__cell">{this.getFundNameById(funds, row.fund_id)}</td>
                                    <td className="mdc-data-table__cell">{new Intl.NumberFormat("en-GB", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(row.amount)}</td>
                                    <td className="mdc-data-table__cell">
                                        {new Intl.NumberFormat("en-GB", {
                                            style: "currency",
                                            currency: "USD",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(this.calculateUndrawnCapital(fundInvestments, row.fund_id, row.commitment_id, row.amount))}
                                    </td>
                                    <td className="mdc-data-table__cell">4.0</td>
                                    <td className="mdc-data-table__cell">Super tasty</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }
}

export default NewCallTable;