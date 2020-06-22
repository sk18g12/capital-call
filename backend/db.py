import os
import sqlite3

if os.path.exists('database.sqlite'):
    os.remove('database.sqlite')

conn = sqlite3.connect('database.sqlite')
print("Opened database successfully")

with open('database.sql', 'r') as sql_file:
    sql_script = sql_file.read()

cursor = conn.cursor()
cursor.executescript(sql_script)
conn.commit()
print("Table created successfully")
conn.close()
