import os

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')
app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

database = SQLAlchemy(app)
ma = Marshmallow(app)

from models import *

database.create_all()
database.session.commit()


@app.route("/funds", methods=["GET"])
def get_funds():
    funds_schema = FundSchema(many=True)
    all_funds = Fund.query.all()
    result = funds_schema.dump(all_funds)
    return jsonify(result)


@app.route("/calls", methods=["GET"])
def get_calls():
    calls_schema = CallSchema(many=True)
    all_calls = Call.query.all()
    result = calls_schema.dump(all_calls)
    return jsonify(result)


@app.route("/commitments", methods=["GET"])
def get_commitments():
    commitments_schema = CommitmentSchema(many=True)
    all_commitments = Commitment.query.all()
    result = commitments_schema.dump(all_commitments)
    return jsonify(result)


@app.route("/fund_investments", methods=["GET"])
def get_fund_investments():
    fund_investments_schema = FundInvestmentSchema(many=True)
    all_fund_investments = FundInvestment.query.all()
    result = fund_investments_schema.dump(all_fund_investments)
    return jsonify(result)


@app.route("/call", methods=["POST"])
def add_call():
    investment_name = request.json['investment_name']
    date = request.json['date']
    capital_requirement = request.json['capital_requirement']

    new_call = Call(investment_name, date, capital_requirement)

    # Add the new call to the database
    database.session.add(new_call)
    database.session.commit()

    # Return 201(Created) HTTP response after call addition
    return Response(new_call, status=201, mimetype='application/json')


@app.route("/fund_investment", methods=["POST"])
def add_fund_investment():
    call_id = request.json['call_id']
    fund_id = request.json['fund_id']
    commitment_id = request.json['commitment_id']
    investment_amount = request.json['investment_amount']

    new_fund_investment = FundInvestment(fund_id, commitment_id, call_id, investment_amount)

    # Add the new call to the database
    database.session.add(new_fund_investment)
    database.session.commit()

    # Return 201(Created) HTTP response after call addition
    return Response(new_fund_investment, status=201, mimetype='application/json')


@app.route("/calculate", methods=["POST"])
def calculate():
    amount = request.json['amount']
    drawdowns = []

    all_commitments = Commitment.query.all()

    for commitment in all_commitments:
        all_fund_investments = FundInvestment.query.filter_by(
            commitment_id=commitment.commitment_id, fund_id=commitment.fund_id).all()

        global new_undrawn
        global drawdown_notice

        undrawn_amount = commitment.amount

        if all_fund_investments:
            undrawn_amount = commitment.amount - all_fund_investments[0].investment_amount

        if amount > 0:
            if amount < undrawn_amount:
                new_undrawn = undrawn_amount - amount
                drawdown_notice = amount
                # add fund_investment of value of amount
                amount = 0
            else:
                amount = amount - undrawn_amount
                drawdown_notice = undrawn_amount
                # add fund_investment of value of undrawn
                new_undrawn = 0

            drawdown = Drawdown(commitment.commitment_id, undrawn_amount, new_undrawn, drawdown_notice)
            drawdowns.append(drawdown)

        else:
            new_undrawn = undrawn_amount
            drawdown = Drawdown(commitment.commitment_id, undrawn_amount, new_undrawn, 0)
            drawdowns.append(drawdown)

    dropdown_schema = DrawdownSchema(many=True)
    result = dropdown_schema.dump(drawdowns)

    # Return 201(Created) HTTP response after call addition
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
