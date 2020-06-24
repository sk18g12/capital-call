CREATE TABLE fund
(
    fund_id   INTEGER      NOT NULL,
    fund_name VARCHAR(120) NOT NULL,
    PRIMARY KEY (fund_id)
);
CREATE TABLE call
(
    call_id             INTEGER      NOT NULL,
    investment_name     VARCHAR(120) NOT NULL,
    date                VARCHAR(120) NOT NULL,
    capital_requirement INTEGER      NOT NULL,
    PRIMARY KEY (call_id)
);
CREATE TABLE commitment
(
    commitment_id INTEGER      NOT NULL,
    fund_id       INTEGER      NOT NULL,
    date          VARCHAR(120) NOT NULL,
    amount        INTEGER      NOT NULL,
    PRIMARY KEY (commitment_id),
    FOREIGN KEY (fund_id) REFERENCES fund (fund_id)
);
CREATE TABLE fund_investment
(
    id                INTEGER NOT NULL,
    fund_id           INTEGER NOT NULL,
    commitment_id     INTEGER NOT NULL,
    call_id           INTEGER NOT NULL,
    investment_amount INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (fund_id) REFERENCES fund (fund_id),
    FOREIGN KEY (commitment_id) REFERENCES commitment (commitment_id),
    FOREIGN KEY (call_id) REFERENCES call (call_id)
);

INSERT INTO call (call_id, date, investment_name, capital_requirement)
VALUES (1, date('2018-01-31'), 'Investment 1', 9500000);
INSERT INTO commitment (commitment_id, fund_id, date, amount)
VALUES (1, 1, date('2017-12-31'), 10000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount)
VALUES (2, 2, date('2018-03-31'), 15000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount)
VALUES (3, 3, date('2018-06-30'), 10000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount)
VALUES (4, 4, date('2018-09-30'), 15000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount)
VALUES (5, 1, date('2018-12-31'), 10000000);
INSERT INTO fund (fund_id, fund_name) VALUES (1, 'Fund 1');
INSERT INTO fund (fund_id, fund_name) VALUES (2, 'Fund 2');
INSERT INTO fund (fund_id, fund_name) VALUES (3, 'Fund 3');
INSERT INTO fund (fund_id, fund_name) VALUES (4, 'Fund 4');
INSERT INTO fund_investment (id, call_id, commitment_id, fund_id, investment_amount) VALUES (1, 1, 1, 1, 9500000);