import sqlite3

def alter_db():
    conn = sqlite3.connect('sql_app.db')
    try:
        conn.execute('ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0')
    except Exception as e:
        print("Failed to add failed_login_attempts", e)

    try:
        conn.execute('ALTER TABLE users ADD COLUMN is_locked BOOLEAN DEFAULT 0')
    except Exception as e:
        print("Failed to add is_locked", e)

    try:
        conn.execute('ALTER TABLE users ADD COLUMN locked_until DATETIME')
    except Exception as e:
        print("Failed to add locked_until", e)

    conn.commit()
    conn.close()
    print("Database altered successfully")

if __name__ == '__main__':
    alter_db()
