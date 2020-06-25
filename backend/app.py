import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


def create_app():
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)

    return app


# App and database setup
app = create_app()
database = SQLAlchemy(app)
ma = Marshmallow(app)

from models import *

# SQLAlchemy setup
database.create_all()
database.session.commit()


@app.route("/api/funds", methods=["GET"])
def get_funds():
    funds_schema = FundSchema(many=True)
    all_funds = Fund.query.all()
    result = funds_schema.dump(all_funds)
    return jsonify(result)


@app.route("/api/calls", methods=["GET"])
def get_calls():
    calls_schema = CallSchema(many=True)
    all_calls = Call.query.all()
    result = calls_schema.dump(all_calls)
    return jsonify(result)


@app.route("/api/commitments", methods=["GET"])
def get_commitments():
    commitments_schema = CommitmentSchema(many=True)
    all_commitments = Commitment.query.all()
    result = commitments_schema.dump(all_commitments)
    return jsonify(result)


@app.route("/api/fund_investments", methods=["GET"])
def get_fund_investments():
    fund_investments_schema = FundInvestmentSchema(many=True)
    all_fund_investments = FundInvestment.query.all()
    result = fund_investments_schema.dump(all_fund_investments)
    return jsonify(result)


def add_call(investment_name, date, capital_requirement):
    new_call = Call(investment_name=investment_name, date=date, capital_requirement=capital_requirement)

    # Add the new call to the database
    database.session.add(new_call)
    database.session.commit()
    return new_call


def add_fund_investments(amount, commitment, call):
    new_fund_investment = FundInvestment(commitment.fund_id, commitment.commitment_id, call.call_id, amount)

    # Add the new fund investment to the database
    database.session.add(new_fund_investment)
    database.session.commit()
    return new_fund_investment


@app.route("/api/calculate", methods=["POST"])
def calculate():
    amount = request.json['amount']
    investment_name = request.json['investment_name']
    date = request.json['date']
    commit = request.json['commit']
    capital_requirement = amount
    drawdowns = []

    global new_undrawn, call, drawdown_notice, undrawn_amount

    all_commitments = Commitment.query.all()

    if commit:
        call = add_call(investment_name, date, capital_requirement)

    for commitment in all_commitments:
        all_fund_investments = FundInvestment.query.filter_by(
            commitment_id=commitment.commitment_id, fund_id=commitment.fund_id).all()

        # By default, undrawn amount is set the same as the commitment amount
        undrawn_amount = commitment.amount

        ''' If there are fund investment entries already in the db for this commitment, for each entry 
            we then subtract each investment_amount from the undrawn amount
        '''
        if all_fund_investments:
            for fund_investment in all_fund_investments:
                undrawn_amount = undrawn_amount - fund_investment.investment_amount

        if amount > 0:
            if amount < undrawn_amount:
                new_undrawn = undrawn_amount - amount
                drawdown_notice = amount
                if commit:
                    add_fund_investments(amount, commitment, call)
                amount = 0
            else:
                amount = amount - undrawn_amount
                drawdown_notice = undrawn_amount
                if commit:
                    add_fund_investments(undrawn_amount, commitment, call)
                new_undrawn = 0

            drawdown = Drawdown(commitment.commitment_id, undrawn_amount, new_undrawn, drawdown_notice)
            drawdowns.append(drawdown)

        else:
            new_undrawn = undrawn_amount
            drawdown = Drawdown(commitment.commitment_id, undrawn_amount, new_undrawn, 0)
            drawdowns.append(drawdown)

    dropdown_schema = DrawdownSchema(many=True)
    result = dropdown_schema.dump(drawdowns)

    if amount <= 0:
        return jsonify(result), 200
    else:
        return jsonify(result), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0')
