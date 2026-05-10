import json
import os
import psycopg2
from datetime import datetime

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
    """CRUD для товаров (модульных строений). GET — список, POST — создать, PUT — обновить, DELETE — архивировать."""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token", "Content-Type": "application/json"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**headers, "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS"}, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        featured_only = params.get("featured") == "true"
        if featured_only:
            cur.execute("SELECT id, name, type, description, price, dimensions, square_meters, year_built, status, image_url, is_featured, created_at FROM products WHERE status != 'archived' AND is_featured = true ORDER BY created_at DESC")
        else:
            cur.execute("SELECT id, name, type, description, price, dimensions, square_meters, year_built, status, image_url, is_featured, created_at FROM products WHERE status != 'archived' ORDER BY created_at DESC")
        rows = cur.fetchall()
        cols = ["id","name","type","description","price","dimensions","square_meters","year_built","status","image_url","is_featured","created_at"]
        products = []
        for row in rows:
            p = dict(zip(cols, row))
            p["square_meters"] = float(p["square_meters"]) if p["square_meters"] else None
            p["created_at"] = p["created_at"].isoformat() if p["created_at"] else None
            products.append(p)
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps(products, ensure_ascii=False)}

    if method == "POST":
        if not check_auth(event):
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}
        body = json.loads(event.get("body") or "{}")
        cur.execute(
            "INSERT INTO products (name, type, description, price, dimensions, square_meters, year_built, status, image_url, is_featured) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (body.get("name"), body.get("type"), body.get("description"), body.get("price"), body.get("dimensions"), body.get("square_meters"), body.get("year_built", 2024), body.get("status", "available"), body.get("image_url"), body.get("is_featured", False))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 201, "headers": headers, "body": json.dumps({"id": new_id, "ok": True})}

    if method == "PUT":
        if not check_auth(event):
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}
        body = json.loads(event.get("body") or "{}")
        product_id = body.get("id")
        cur.execute(
            "UPDATE products SET name=%s, type=%s, description=%s, price=%s, dimensions=%s, square_meters=%s, status=%s, image_url=%s, is_featured=%s, updated_at=NOW() WHERE id=%s",
            (body.get("name"), body.get("type"), body.get("description"), body.get("price"), body.get("dimensions"), body.get("square_meters"), body.get("status", "available"), body.get("image_url"), body.get("is_featured", False), product_id)
        )
        conn.commit()
        cur.close(); conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    cur.close(); conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
