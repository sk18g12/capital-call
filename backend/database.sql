CREATE TABLE fund (
    fund_id int,
    fund_name TEXT,
    primary key (fund_id)
                       );
CREATE TABLE commitment (
    commitment_id int,
    fund_id int,
    date TEXT,
    amount integer,
    primary key (commitment_id),
    foreign key (fund_id) references fund(fund_id)
                             );
CREATE TABLE call (
    call_id int,
    date TEXT,
    investment_name TEXT,
    capital_requirement int,
    primary key (call_id)
                       );
CREATE TABLE fund_investment (
    id int,
    call_id int ,
    commitment_id int,
    fund_id int,
    investment_amount int,
    primary key (id),
    foreign key (call_id) references call(call_id),
    foreign key (commitment_id) references commitment(commitment_id),
    foreign key (fund_id) references fund(fund_id)
                                  );

INSERT INTO call (call_id, date, investment_name, capital_requirement) VALUES (1, date('2018-01-31'), 'Investment 1', 9500000);
INSERT INTO commitment (commitment_id, fund_id, date, amount) VALUES (1, 1, date('2017-12-31'), 10000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount) VALUES (2, 2, date('2018-03-31'), 15000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount) VALUES (3, 3, date('2018-06-30'), 10000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount) VALUES (4, 4, date('2018-09-30'), 15000000);
INSERT INTO commitment (commitment_id, fund_id, date, amount) VALUES (5, 1, date('2018-12-31'), 10000000);
INSERT INTO fund (fund_id, fund_name) VALUES (1, 'Fund 1');
INSERT INTO fund (fund_id, fund_name) VALUES (2, 'Fund 2');
INSERT INTO fund (fund_id, fund_name) VALUES (3, 'Fund 3');
INSERT INTO fund (fund_id, fund_name) VALUES (4, 'Fund 4');
INSERT INTO fund_investment (id, call_id, commitment_id, fund_id, investment_amount) VALUES (1, 1, 1, 1, 9500000);