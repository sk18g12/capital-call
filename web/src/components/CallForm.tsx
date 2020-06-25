import React, {Component} from "react";
import {InputLabel, TextField} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import {Formik} from 'formik';
import FormControl from "@material-ui/core/FormControl";
import * as Yup from 'yup';

class CallForm extends Component {

    constructor(props: any) {
        super(props);
        this.state = {
            calculateResult: [],
        }
    }

    calculate(values: any, commit: boolean) {
        if (values.amount) {
            fetch('http://localhost:5000/api/calculate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: values.amount,
                    investment_name: values.investment_name,
                    date: values.date,
                    commit: commit
                })
            }).then(res => {
                if (res.status === 400) {
                    alert(`Looks like there isn't enough capital to add this call`);
                    this.setState({
                        calculateResult: []
                    })
                }
                return res.json()
            }).then(json => {
                this.setState({
                    calculateResult: json
                })
            }).catch(function (error) {
                alert("Error: There has been an issue with adding your call. " + error);
            });
        }
    }

    render() {
        // @ts-ignore
        var {calculateResult} = this.state;

        return (

            <div className="mdc-layout-grid__cell--span-12">
                <div className="mdc-card mdc-card--outlined">
                    <h3 className="add-new-call-header">Add New Call</h3>

                    <div className="mdc-data-table">
                        <table className="mdc-data-table__table">
                            <thead>
                            <tr className="mdc-data-table__header-row">
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">Commitment
                                    ID
                                </th>
                                <th className="mdc-data-table__header-cell"
                                    role="columnheader" scope="col">Before Drawdown
                                </th>
                                <th className="mdc-data-table__header-cell"
                                    role="columnheader" scope="col">Drawdown
                                </th>
                                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">After
                                    Drawdown
                                </th>
                            </tr>
                            </thead>
                            <tbody className="mdc-data-table__content">
                            {calculateResult.map((row: any) => (
                                <tr key={row.commitment_id} className="mdc-data-table__row">
                                    <td className="mdc-data-table__cell">{row.commitment_id}</td>
                                    <td className="mdc-data-table__cell">{new Intl.NumberFormat("en-GB", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(row.before_drawdown)}</td>
                                    <td className="mdc-data-table__cell">{new Intl.NumberFormat("en-GB", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(row.drawdown_notice)}</td>
                                    <td className="mdc-data-table__cell">{new Intl.NumberFormat("en-GB", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(row.new_undrawn)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <Formik
                        initialValues={{
                            investment_name: '',
                            date: '',
                            amount: 0
                        }}
                        validationSchema={Yup.object({
                            investment_name: Yup.string()
                                .max(15, 'Investment Name must be 15 characters or less')
                                .required('Investment Name is Required'),
                            date: Yup.string()
                                .required('Date is Required'),
                            amount: Yup.number()
                                .positive("Amount can't start with a minus")
                                .integer("Amount can't include a decimal point")
                                .moreThan(0, "Amount must be at least equal to 1")
                                .required('Amount is Required'),
                        })}
                        onSubmit={(values, {setSubmitting}) => {
                            fetch('http://localhost:5000/api/calculate', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    amount: values.amount,
                                    investment_name: values.investment_name,
                                    date: values.date,
                                    commit: true
                                })
                            }).then(res => {
                                if (res.status === 400) {
                                    alert(`Looks like there isn't enough capital to add this call`);
                                    this.setState({
                                        calculateResult: []
                                    })
                                }
                                if (res.status === 200) {
                                    alert("New call has been added to the database");
                                }
                            }).catch((e) => {
                                alert("Error: There has been an issue with adding your call " + e);
                            });

                        }}>

                        {formik => (
                            <React.Fragment>
                                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} autoComplete="on">
                                    <div className="mdc-form-field">
                                        <div className="form-controls">
                                            <FormControl>
                                                <TextField id="investment_name" name="investment_name"
                                                           label="Investment Name"
                                                           variant="outlined"
                                                           onChange={formik.handleChange('investment_name')}
                                                           value={formik.values.investment_name}/>
                                            </FormControl>
                                            <div className="form-errors">
                                                {formik.errors.investment_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mdc-form-field">
                                        <div className="form-controls">
                                            <FormControl>
                                                <TextField
                                                    id="date"
                                                    name="date"
                                                    label="Date"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={formik.handleChange('date')}
                                                    value={formik.values.date}
                                                />
                                            </FormControl>
                                            <div className="form-errors">
                                                {formik.errors.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mdc-form-field">
                                        <div className="form-controls">
                                            <FormControl>
                                                <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                                                <Input
                                                    id="standard-adornment-amount"
                                                    name="amount"
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                    type="number"
                                                    onChange={formik.handleChange('amount')}
                                                    value={formik.values.amount}
                                                />
                                            </FormControl>
                                            <div className="form-errors">
                                                {formik.errors.amount}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mdc-layout-grid__cell--span-12">
                                        <div className="form-buttons">
                                            <Button variant="contained" color="primary"
                                                    onClick={() => this.calculate(formik.values, false)}>Calculate</Button>
                                            <Button type="submit" variant="contained" color="primary">
                                                Add Call
                                            </Button>
                                            <Button type="reset" variant="contained" color="secondary">
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </React.Fragment>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }
}

export default CallForm;