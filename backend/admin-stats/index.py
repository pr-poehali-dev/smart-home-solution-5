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
    """Статистика для админ-панели: счётчики заявок, товаров, динамика по дням."""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token", "Content-Type": "application/json"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**headers, "Access-Control-Allow-Methods": "GET, OPTIONS"}, "body": ""}

    if not check_auth(event):
        return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM orders")
    total_orders = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'new'")
    new_orders = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'done'")
    done_orders = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM products WHERE status != 'archived'")
    total_products = cur.fetchone()[0]

    cur.execute("""
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as day, COUNT(*) as cnt
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day
    """)
    orders_by_day = [{"date": row[0], "orders": row[1]} for row in cur.fetchall()]

    cur.execute("""
        SELECT status, COUNT(*) as cnt
        FROM orders
        GROUP BY status
    """)
    orders_by_status = [{"status": row[0], "count": row[1]} for row in cur.fetchall()]

    cur.execute("""
        SELECT type, COUNT(*) as cnt
        FROM products
        WHERE status != 'archived'
        GROUP BY type
        ORDER BY cnt DESC
    """)
    products_by_type = [{"type": row[0], "count": row[1]} for row in cur.fetchall()]

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({
            "total_orders": total_orders,
            "new_orders": new_orders,
            "done_orders": done_orders,
            "total_products": total_products,
            "orders_by_day": orders_by_day,
            "orders_by_status": orders_by_status,
            "products_by_type": products_by_type
        }, ensure_ascii=False)
    }
