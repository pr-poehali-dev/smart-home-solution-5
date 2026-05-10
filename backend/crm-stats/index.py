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
    """Расширенная CRM-статистика: KPI, комиссии, воронка, аналитика по регионам и источникам."""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token", "Content-Type": "application/json"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**headers, "Access-Control-Allow-Methods": "GET, OPTIONS"}, "body": ""}

    if not check_auth(event):
        return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Нет доступа"})}

    conn = get_conn()
    cur = conn.cursor()

    # Основные счётчики
    cur.execute("SELECT COUNT(*) FROM orders WHERE kanban_status = 'new'")
    new_orders = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM orders WHERE kanban_status IN ('contacted','sent_calc','waiting','production','delivery')")
    in_progress = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM orders WHERE kanban_status = 'done'")
    done_orders = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM orders WHERE kanban_status = 'rejected'")
    rejected = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM orders")
    total_orders = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM products WHERE status != 'archived'")
    total_products = cur.fetchone()[0]

    # Финансы
    cur.execute("SELECT COALESCE(SUM(deal_amount),0) FROM orders WHERE kanban_status = 'done'")
    total_revenue = cur.fetchone()[0]

    cur.execute("SELECT COALESCE(SUM(commission_amount),0) FROM orders WHERE kanban_status = 'done'")
    total_commission = cur.fetchone()[0]

    cur.execute("SELECT COALESCE(SUM(commission_amount),0) FROM orders WHERE kanban_status = 'done' AND commission_paid = true")
    paid_commission = cur.fetchone()[0]

    cur.execute("SELECT COALESCE(SUM(commission_amount),0) FROM orders WHERE kanban_status = 'done' AND commission_paid = false")
    pending_commission = cur.fetchone()[0]

    cur.execute("SELECT COALESCE(SUM(deal_amount),0) FROM orders WHERE kanban_status IN ('contacted','sent_calc','waiting','production','delivery')")
    expected_revenue = cur.fetchone()[0]

    expected_commission = int(expected_revenue * 0.05)

    avg_deal = int(total_revenue / done_orders) if done_orders > 0 else 0
    conversion = round(done_orders / total_orders * 100, 1) if total_orders > 0 else 0

    # Динамика по дням (30 дней)
    cur.execute("""
        SELECT TO_CHAR(created_at,'YYYY-MM-DD') d, COUNT(*) cnt,
               COALESCE(SUM(deal_amount),0) rev,
               COALESCE(SUM(commission_amount),0) comm
        FROM orders WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY d ORDER BY d
    """)
    by_day = [{"date": r[0], "orders": r[1], "revenue": r[2], "commission": r[3]} for r in cur.fetchall()]

    # По месяцам
    cur.execute("""
        SELECT TO_CHAR(created_at,'YYYY-MM') m, COUNT(*) cnt,
               COALESCE(SUM(deal_amount),0) rev,
               COALESCE(SUM(commission_amount),0) comm
        FROM orders GROUP BY m ORDER BY m DESC LIMIT 12
    """)
    by_month = [{"month": r[0], "orders": r[1], "revenue": r[2], "commission": r[3]} for r in cur.fetchall()]

    # По kanban статусам (воронка)
    cur.execute("SELECT kanban_status, COUNT(*) FROM orders GROUP BY kanban_status")
    funnel = {r[0]: r[1] for r in cur.fetchall()}

    # По источникам
    cur.execute("SELECT COALESCE(source,'website') s, COUNT(*) c FROM orders GROUP BY s ORDER BY c DESC")
    by_source = [{"source": r[0], "count": r[1]} for r in cur.fetchall()]

    # По регионам
    cur.execute("SELECT COALESCE(region,'Не указан') r, COUNT(*) c, COALESCE(SUM(deal_amount),0) rev FROM orders GROUP BY r ORDER BY c DESC LIMIT 10")
    by_region = [{"region": r[0], "count": r[1], "revenue": r[2]} for r in cur.fetchall()]

    # По типу товара
    cur.execute("""
        SELECT COALESCE(product_name,'Другое') p, COUNT(*) c, COALESCE(SUM(deal_amount),0) rev
        FROM orders WHERE kanban_status = 'done'
        GROUP BY p ORDER BY c DESC LIMIT 5
    """)
    by_product = [{"name": r[0], "count": r[1], "revenue": r[2]} for r in cur.fetchall()]

    # Последние заявки
    cur.execute("""
        SELECT id, name, phone, product_name, deal_amount, commission_amount,
               kanban_status, source, region, created_at
        FROM orders ORDER BY created_at DESC LIMIT 10
    """)
    cols = ["id","name","phone","product_name","deal_amount","commission_amount","kanban_status","source","region","created_at"]
    recent = []
    for row in cur.fetchall():
        o = dict(zip(cols, row))
        o["created_at"] = o["created_at"].isoformat() if o["created_at"] else None
        recent.append(o)

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({
            "new_orders": new_orders,
            "in_progress": in_progress,
            "done_orders": done_orders,
            "rejected": rejected,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_revenue": total_revenue,
            "total_commission": total_commission,
            "paid_commission": paid_commission,
            "pending_commission": pending_commission,
            "expected_commission": expected_commission,
            "avg_deal": avg_deal,
            "conversion": conversion,
            "by_day": by_day,
            "by_month": by_month,
            "funnel": funnel,
            "by_source": by_source,
            "by_region": by_region,
            "by_product": by_product,
            "recent": recent,
        }, ensure_ascii=False)
    }
