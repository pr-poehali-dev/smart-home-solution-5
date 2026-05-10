import json
import os
import secrets
import psycopg2
from datetime import datetime, timedelta

ADMIN_PASSWORD = "123000"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    """Авторизация в админ-панели. POST / — вход по паролю, GET / — проверка токена."""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token", "Content-Type": "application/json"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**headers, "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"}, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        password = body.get("password", "")
        if password != ADMIN_PASSWORD:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный пароль"})}

        token = secrets.token_hex(32)
        expires_at = datetime.now() + timedelta(hours=24)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("INSERT INTO admin_sessions (token, expires_at) VALUES (%s, %s)", (token, expires_at))
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"token": token, "expires_at": expires_at.isoformat()})}

    if method == "GET":
        token = event.get("headers", {}).get("X-Admin-Token") or event.get("headers", {}).get("x-admin-token")
        if not token:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Токен не передан"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id FROM admin_sessions WHERE token = %s AND expires_at > NOW()", (token,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Токен недействителен"})}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
