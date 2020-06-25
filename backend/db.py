import os
import sqlite3

database_file_name = 'database.sqlite'

if os.path.exists(database_file_name):
    os.remove(database_file_name)

conn = sqlite3.connect(database_file_name)
print("Opened database successfully")

with open('database.sql', 'r') as sql_file:
    sql_script = sql_file.read()

cursor = conn.cursor()
cursor.executescript(sql_script)
conn.commit()
print("Table created successfully")
conn.close()
