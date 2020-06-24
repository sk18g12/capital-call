import unittest

from app import app, database


class TestApi(unittest.TestCase):
    def setUp(self):
        app.config.from_object('webapp.config.Testing')
        database.session.close()
        database.drop_all()
        database.create_all()

    def test_get(self):
        tester = app.test_client(self)
        response = tester.get('/funds')
        statuscode = response.status_code
        self.assertEquals(statuscode, 200)


if __name__ == "__main__":
    unittest.main()
