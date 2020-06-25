import unittest

from app import app, database


class TestApi(unittest.TestCase):
    def setUp(self):
        database.session.close()
        database.drop_all()
        database.create_all()

    def tearDown(self):
        database.session.close()
        database.drop_all()

    def test_get_funds(self):
        tester = app.test_client(self)
        response = tester.get('/api/funds')
        statuscode = response.status_code
        self.assertEquals(statuscode, 200)

    def test_get_calls(self):
        tester = app.test_client(self)
        response = tester.get('/api/calls')
        statuscode = response.status_code
        self.assertEquals(statuscode, 200)

    def test_get_fund_investments(self):
        tester = app.test_client(self)
        response = tester.get('/api/fund_investments')
        statuscode = response.status_code
        self.assertEquals(statuscode, 200)

    def test_get_commitments(self):
        tester = app.test_client(self)
        response = tester.get('/api/commitments')
        statuscode = response.status_code
        self.assertEquals(statuscode, 200)


if __name__ == "__main__":
    unittest.main()
