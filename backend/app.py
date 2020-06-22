import os

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

import models

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')
app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

database = SQLAlchemy(app)
ma = Marshmallow(app)


@app.route("/funds", methods=["GET"])
def get_funds():
    funds_schema = models.FundSchema(many=True)
    all_funds = models.Fund.query.all()
    result = funds_schema.dump(all_funds)
    return jsonify(result)


@app.route("/calls", methods=["GET"])
def get_calls():
    calls_schema = models.CallSchema(many=True)
    all_calls = models.Call.query.all()
    result = calls_schema.dump(all_calls)
    return jsonify(result)


@app.route("/commitments", methods=["GET"])
def get_commitments():
    commitments_schema = models.CommitmentSchema(many=True)
    all_commitments = models.Commitment.query.all()
    result = commitments_schema.dump(all_commitments)
    return jsonify(result)


@app.route("/fund_investments", methods=["GET"])
def get_fund_investments():
    fund_investments_schema = models.FundInvestmentSchema(many=True)
    all_fund_investments = models.FundInvestment.query.all()
    result = fund_investments_schema.dump(all_fund_investments)
    return jsonify(result)


@app.route("/call", methods=["POST"])
def add_call():
    investment_name = request.json['investment_name']
    date = request.json['date']
    capital_requirement = request.json['capital_requirement']

    new_call = models.Call(investment_name, date, capital_requirement)

    # Add the new call to the database
    database.session.add(new_call)
    database.session.commit()

    # Return 201(Created) HTTP response after call addition
    return Response(new_call, status=201, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
