from app import database, ma


class Call(database.Model):
    __tablename__ = 'call'
    call_id = database.Column(database.Integer, primary_key=True, autoincrement=True)
    investment_name = database.Column(database.String(120), nullable=False)
    date = database.Column(database.String(120), nullable=False)
    capital_requirement = database.Column(database.Integer, nullable=False)

    def __init__(self, investment_name, date, capital_requirement):
        self.investment_name = investment_name
        self.date = date
        self.capital_requirement = capital_requirement


class Fund(database.Model):
    __tablename__ = 'fund'
    fund_id = database.Column(database.Integer, primary_key=True, autoincrement=True)
    fund_name = database.Column(database.String(120), nullable=False)

    def __init__(self, fund_name):
        self.fund_name = fund_name


class Commitment(database.Model):
    __tablename__ = 'commitment'
    commitment_id = database.Column(database.Integer, primary_key=True, autoincrement=True)
    fund_id = database.Column(database.ForeignKey('fund.fund_id'), nullable=False)
    date = database.Column(database.String(120), nullable=False)
    amount = database.Column(database.Integer, nullable=False)

    def __init__(self, fund_id, date, amount):
        self.fund_id = fund_id
        self.date = date
        self.amount = amount


class FundInvestment(database.Model):
    __tablename__ = 'fund_investment'
    id = database.Column(database.Integer, primary_key=True, autoincrement=True)
    fund_id = database.Column(database.ForeignKey('fund.fund_id'), nullable=False)
    commitment_id = database.Column(database.ForeignKey('commitment.commitment_id'), nullable=False)
    call_id = database.Column(database.ForeignKey('call.call_id'), nullable=False)
    investment_amount = database.Column(database.Integer, nullable=False)

    def __init__(self, fund_id, commitment_id, call_id, investment_amount):
        self.fund_id = fund_id
        self.commitment_id = commitment_id
        self.call_id = call_id
        self.investment_amount = investment_amount


class Drawdown:

    def __init__(self, commitment_id, before_drawdown, new_undrawn, drawdown_notice):
        self.commitment_id = commitment_id
        self.before_drawdown = before_drawdown
        self.new_undrawn = new_undrawn
        self.drawdown_notice = drawdown_notice


class DrawdownSchema(ma.Schema):
    class Meta:
        fields = ('commitment_id', 'before_drawdown', 'new_undrawn', 'drawdown_notice')


class FundSchema(ma.Schema):
    class Meta:
        fields = ('fund_id', 'fund_name')


class CommitmentSchema(ma.Schema):
    class Meta:
        fields = ('commitment_id', 'fund_id', 'date', 'amount')


class FundInvestmentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fund_id', 'commitment_id', 'call_id', 'investment_amount')


class CallSchema(ma.Schema):
    class Meta:
        fields = ('call_id', 'investment_name', 'date', 'capital_requirement')
