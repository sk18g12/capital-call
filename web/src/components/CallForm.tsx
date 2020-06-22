import React from "react";
import {InputLabel, TextField} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import {useFormik} from "formik";

const Form = () => {

    // @ts-ignore
    const validate = values => {
        const errors = {};
        if (!values.investment_name) {
            // @ts-ignore
            errors.investment_name = 'Required';
        } else if (values.investment_name.length > 15) {
            // @ts-ignore
            errors.investment_name = 'Must be 15 characters or less';
        }

        if (!values.date) {
            // @ts-ignore
            errors.date = 'Required';
        }

        if (!values.amount) {
            // @ts-ignore
            errors.amount = 'Required';
        } else if (values.amount > 1) {
            // @ts-ignore
            errors.amount = 'Invalid amount. Must be greater than zero.';
        }

        return errors;
    };

    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            investment_name: '',
            date: '',
            amount: 0
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    return (
        <div className="mdc-layout-grid__cell--span-12">
            <div className="mdc-card mdc-card--outlined">
                <h3 className="add-new-call-header">Add New Call</h3>
                <form onSubmit={formik.handleSubmit} autoComplete="on">
                    <div className="mdc-form-field">
                        <TextField id="investment_name" label="Investment Name" variant="outlined"
                                   onChange={formik.handleChange}
                                   value={formik.values.investment_name}/>
                    </div>
                    <div className="mdc-form-field">
                        <TextField
                            id="date"
                            label="Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={formik.handleChange}
                            value={formik.values.date}
                        />
                    </div>
                    <div className="mdc-form-field">
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            type="number"
                            onChange={formik.handleChange}
                            value={formik.values.amount}
                        />
                    </div>
                    <div className="mdc-layout-grid__cell--span-12">
                        <Button type="submit" variant="contained" color="primary">
                            Add Call
                        </Button>
                        <Button type="reset" variant="contained" color="secondary">
                            Clear
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
