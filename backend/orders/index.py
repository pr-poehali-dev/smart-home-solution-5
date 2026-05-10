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
    """CRM: заявки. POST — создать (публично), GET — список (админ), PUT — обновить (админ)."""
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
        deal = body.get("deal_amount") or body.get("budget_max")
        comm = int(float(deal) * 0.05) if deal else None
        cur.execute(
            """INSERT INTO orders (name, phone, email, product_id, product_name, message, delivery_address,
               budget_min, budget_max, status, kanban_status, source, region, deal_amount, commission_amount,
               commission_rate, manager, messenger, notes)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,'new',%s,%s,%s,%s,%s,5.00,%s,%s,%s) RETURNING id""",
            (body.get("name"), body.get("phone"), body.get("email"),
             body.get("product_id"), body.get("product_name"),
             body.get("message"), body.get("delivery_address"),
             body.get("budget_min"), body.get("budget_max"),
             body.get("kanban_status","new"),
             body.get("source","website"), body.get("region"),
             deal, comm,
             body.get("manager"), body.get("messenger"), body.get("notes"))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 201, "headers": headers, "body": json.dumps({"id": new_id, "ok": True})}

    if method == "GET":
        if not check_auth(event):
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}
        cur.execute("""SELECT id, name, phone, email, product_name, message, delivery_address,
                       budget_min, budget_max, status, kanban_status, source, region,
                       deal_amount, commission_amount, commission_rate, commission_paid,
                       manager, messenger, notes, created_at, updated_at
                       FROM orders ORDER BY created_at DESC""")
        cols = ["id","name","phone","email","product_name","message","delivery_address",
                "budget_min","budget_max","status","kanban_status","source","region",
                "deal_amount","commission_amount","commission_rate","commission_paid",
                "manager","messenger","notes","created_at","updated_at"]
        orders = []
        for row in cur.fetchall():
            o = dict(zip(cols, row))
            o["created_at"] = o["created_at"].isoformat() if o["created_at"] else None
            o["updated_at"] = o["updated_at"].isoformat() if o["updated_at"] else None
            o["commission_rate"] = float(o["commission_rate"]) if o["commission_rate"] else 5.0
            orders.append(o)
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps(orders, ensure_ascii=False)}

    if method == "PUT":
        if not check_auth(event):
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}
        body = json.loads(event.get("body") or "{}")
        oid = body.get("id")
        deal = body.get("deal_amount")
        rate = float(body.get("commission_rate", 5.0))
        comm = int(deal * rate / 100) if deal else body.get("commission_amount")
        cur.execute("""UPDATE orders SET
            status=%s, kanban_status=%s, deal_amount=%s, commission_amount=%s,
            commission_rate=%s, commission_paid=%s, manager=%s, source=%s,
            region=%s, notes=%s, messenger=%s, product_name=%s, updated_at=NOW()
            WHERE id=%s""",
            (body.get("status","new"), body.get("kanban_status","new"),
             deal, comm, rate,
             body.get("commission_paid", False),
             body.get("manager"), body.get("source"),
             body.get("region"), body.get("notes"),
             body.get("messenger"), body.get("product_name"), oid))
        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    cur.close(); conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
