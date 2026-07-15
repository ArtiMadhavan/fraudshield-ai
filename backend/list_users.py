import sqlite3

conn = sqlite3.connect('sql_app.db')
cursor = conn.cursor()
cursor.execute("SELECT id, username, email FROM users")
print("USERS:", cursor.fetchall())
conn.close()
