import json
import os
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def check_auth(event):
    token = event.get("headers", {}).get("X-Admin-Token") or event.get("headers", {}).get("x-admin-token")
    if not token:
        return False
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id FROM admin_sessions WHERE token = %s AND expires_at > NOW()", (token,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row is not None

def handler(event: dict, context) -> dict:
    """Заявки от клиентов. POST / — создать заявку (публично), GET / — список заявок (только админ), PUT / — сменить статус (только админ)."""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token", "Content-Type": "application/json"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**headers, "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS"}, "body": ""}

    method = event.get("httpMethod", "GET")
    conn = get_conn()
    cur = conn.cursor()

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        if not body.get("name") or not body.get("phone"):
            cur.close(); conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Имя и телефон обязательны"})}
        cur.execute(
            "INSERT INTO orders (name, phone, email, product_id, product_name, message, delivery_address, budget_min, budget_max) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (body.get("name"), body.get("phone"), body.get("email"), body.get("product_id"), body.get("product_name"), body.get("message"), body.get("delivery_address"), body.get("budget_min"), body.get("budget_max"))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 201, "headers": headers, "body": json.dumps({"id": new_id, "ok": True})}

    if method == "GET":
        if not check_auth(event):
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}
        cur.execute("SELECT id, name, phone, email, product_name, message, delivery_address, budget_min, budget_max, status, created_at FROM orders ORDER BY created_at DESC")
        rows = cur.fetchall()
        cols = ["id","name","phone","email","product_name","message","delivery_address","budget_min","budget_max","status","created_at"]
        orders = []
        for row in rows:
            o = dict(zip(cols, row))
            o["created_at"] = o["created_at"].isoformat() if o["created_at"] else None
            orders.append(o)
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps(orders, ensure_ascii=False)}

    if method == "PUT":
        if not check_auth(event):
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}
        body = json.loads(event.get("body") or "{}")
        cur.execute("UPDATE orders SET status=%s, updated_at=NOW() WHERE id=%s", (body.get("status"), body.get("id")))
        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    cur.close(); conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
