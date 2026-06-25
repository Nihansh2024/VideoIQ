#!/usr/bin/env python3
"""End-to-end test of the VideoIQ payment activation flow."""
import json
import time
import requests
import sqlite3
from datetime import datetime, timezone

def now_ms():
    return int(time.time() * 1000)

BASE = "http://localhost:3000"
DB = "/home/z/my-project/db/custom.db"

def log(step, msg, level="info"):
    prefix = {"info": "PASS", "fail": "FAIL", "warn": "WARN", "head": ">>"}[level]
    print(f"{prefix} [{step}] {msg}")

def clear_test_user(email):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("DELETE FROM Subscription WHERE userEmail = ?", (email,))
    cur.execute("DELETE FROM PaymentOrder WHERE userEmail = ?", (email,))
    cur.execute("DELETE FROM UsageLog WHERE email = ?", (email,))
    cur.execute("DELETE FROM User WHERE email = ?", (email,))
    conn.commit()
    conn.close()

def get_user(email):
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM User WHERE email = ?", (email,))
    row = cur.fetchone()
    cur.execute("SELECT * FROM Subscription WHERE userEmail = ? ORDER BY createdAt DESC", (email,))
    subs = [dict(r) for r in cur.fetchall()]
    cur.execute("SELECT * FROM PaymentOrder WHERE userEmail = ? ORDER BY createdAt DESC", (email,))
    orders = [dict(r) for r in cur.fetchall()]
    cur.execute("SELECT COUNT(*) FROM UsageLog WHERE email = ?", (email,))
    usage = cur.fetchone()[0]
    conn.close()
    return dict(row) if row else None, subs, orders, usage

results = {"pass": 0, "fail": 0}
def check(name, cond, detail=""):
    if cond:
        results["pass"] += 1
        log(name, detail or "ok")
    else:
        results["fail"] += 1
        log(name, detail or "failed", "fail")

# T1: create-order with LONG email (was the original bug)
print("\n>> T1: create-order with long email")
long_email = "very.long.username@some.long.subdomain.example.com"
r = requests.post(f"{BASE}/api/payment/create-order", json={"email": long_email, "name": "Test", "plan": "pro"}, timeout=20)
print(f"   HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
check("T1", r.status_code == 200 and "orderId" in j, f"status={r.status_code}, orderId={j.get('orderId','(none)')[:30]}")
if j.get("receipt"):
    check("T1-receipt-len", len(j["receipt"]) <= 40, f"len={len(j['receipt'])}, value={j['receipt']}")
clear_test_user(long_email)

# T2: create-order with short email
print("\n>> T2: create-order with short email")
short_email = "t@x.co"
r = requests.post(f"{BASE}/api/payment/create-order", json={"email": short_email, "name": "Short", "plan": "pro"}, timeout=20)
print(f"   HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
check("T2", r.status_code == 200 and "orderId" in j, f"status={r.status_code}")
clear_test_user(short_email)

# T3: DEMO-mode verify → activate Pro
print("\n>> T3: demo-mode verify activation")
test_email = "verifytest@example.com"
clear_test_user(test_email)
r = requests.post(f"{BASE}/api/payment/create-order", json={"email": test_email, "name": "Verify Test", "plan": "pro"}, timeout=20)
order_data = r.json()
demo_order_id = order_data.get("orderId")
print(f"   create-order: orderId={demo_order_id}, demoMode={order_data.get('demoMode')}")

verify_payload = {
    "razorpay_order_id": demo_order_id,
    "razorpay_payment_id": f"pay_demo_{int(time.time()*1000)}",
    "razorpay_signature": "demo_signature",
    "email": test_email,
    "name": "Verify Test",
    "plan": "pro",
    "method": "upi",
    "demoMode": True,
}
r = requests.post(f"{BASE}/api/payment/verify", json=verify_payload, timeout=20)
print(f"   verify HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
print(f"   Response: {json.dumps(j, indent=2)[:600]}")
check("T3-http-200", r.status_code == 200, f"status={r.status_code}")
check("T3-success-true", j.get("success") is True, f"success={j.get('success')}")
check("T3-welcome-msg", "Welcome to VideoIQ Pro" in (j.get("message") or ""), f"message={j.get('message')!r}")
check("T3-plan-pro", j.get("subscription", {}).get("plan") == "pro", f"sub.plan={j.get('subscription', {}).get('plan')}")
check("T3-status-active", j.get("subscription", {}).get("status") == "active", f"sub.status={j.get('subscription', {}).get('status')}")
check("T3-unlimited", j.get("user", {}).get("analysesLimit") == "unlimited", f"limit={j.get('user', {}).get('analysesLimit')}")
check("T3-used-reset", j.get("user", {}).get("analysesUsed") == 0, f"used={j.get('user', {}).get('analysesUsed')}")

user, subs, orders, usage = get_user(test_email)
print(f"   DB user.plan={user['plan'] if user else None}, analysesUsed={user['analysesUsed'] if user else None}, analysesLimit={user['analysesLimit'] if user else None}")
print(f"   DB subs={len(subs)}, orders={len(orders)}, usage={usage}")
check("T3-db-user-pro", user and user["plan"] == "pro", f"plan={user['plan'] if user else None}")
check("T3-db-user-unlimited", user and user["analysesLimit"] == -1, f"limit={user['analysesLimit'] if user else None}")
check("T3-db-user-used-0", user and user["analysesUsed"] == 0, f"used={user['analysesUsed'] if user else None}")
check("T3-db-sub-active", len(subs) == 1 and subs[0]["status"] == "active", f"subs={len(subs)}")
check("T3-db-order-paid", orders and orders[0]["status"] == "paid", f"order.status={orders[0]['status'] if orders else None}")

if subs and subs[0]["endDate"]:
    start = datetime.fromtimestamp(subs[0]["startDate"] / 1000 if isinstance(subs[0]["startDate"], (int, float)) else time.mktime(datetime.fromisoformat(str(subs[0]["startDate"]).replace("Z","+00:00").split(".")[0]).timetuple()), tz=timezone.utc)
    end = datetime.fromtimestamp(subs[0]["endDate"] / 1000 if isinstance(subs[0]["endDate"], (int, float)) else time.mktime(datetime.fromisoformat(str(subs[0]["endDate"]).replace("Z","+00:00").split(".")[0]).timetuple()), tz=timezone.utc)
    delta_days = (end - start).days
    check("T3-db-30day-expiry", delta_days == 30, f"delta_days={delta_days}")

# T4: subscription API reflects Pro
print("\n>> T4: subscription API after activation")
r = requests.get(f"{BASE}/api/subscription?email={test_email}", timeout=20)
print(f"   HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
print(f"   Response: {json.dumps(j, indent=2)[:500]}")
check("T4-plan-pro", j.get("plan") == "pro", f"plan={j.get('plan')}")
check("T4-sub-active", j.get("subscription") and j["subscription"]["status"] == "active", f"sub.status={(j.get('subscription') or {}).get('status')}")
check("T4-unlimited", j.get("analysesLimit") == "unlimited", f"limit={j.get('analysesLimit')}")

# T5: Idempotent verify (same order_id) — must NOT duplicate subscription
print("\n>> T5: idempotent verify (same order_id)")
r = requests.post(f"{BASE}/api/payment/verify", json=verify_payload, timeout=20)
print(f"   HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
check("T5-still-200", r.status_code == 200, f"status={r.status_code}")
check("T5-still-success", j.get("success") is True, f"success={j.get('success')}")
_, subs_after, _, _ = get_user(test_email)
check("T5-no-duplicate", len(subs_after) == 1, f"subs_count={len(subs_after)}")

# T6: live-mode signature mismatch
print("\n>> T6: live-mode signature mismatch")
r = requests.post(f"{BASE}/api/payment/verify", json={
    "razorpay_order_id": "order_T4ApskUTRzEIPB",
    "razorpay_payment_id": "pay_fakeXYZ123",
    "razorpay_signature": "0000000000000000000000000000000000000000000000000000000000000000",
    "email": "sigsig@example.com",
    "name": "Sig Test",
    "plan": "pro",
    "method": "card",
}, timeout=20)
print(f"   HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
print(f"   Response: {j}")
check("T6-400", r.status_code == 400, f"status={r.status_code}")
check("T6-exact-error", "signature" in (j.get("error") or "").lower(), f"error={j.get('error')!r}")
clear_test_user("sigsig@example.com")

# T7: missing email
print("\n>> T7: missing email -> 400")
r = requests.post(f"{BASE}/api/payment/verify", json={"razorpay_order_id": "order_x", "razorpay_payment_id": "pay_x", "razorpay_signature": "sig_x"}, timeout=20)
print(f"   HTTP {r.status_code}")
check("T7-400", r.status_code == 400, f"status={r.status_code}")

# T8: missing payment_id
print("\n>> T8: missing payment_id -> 400")
r = requests.post(f"{BASE}/api/payment/verify", json={"razorpay_order_id": "order_x", "email": "x@y.z"}, timeout=20)
print(f"   HTTP {r.status_code}")
check("T8-400", r.status_code == 400, f"status={r.status_code}")

# T9: Free user weekly limit
print("\n>> T9: Free user weekly limit on /api/analyze")
free_email = "freeuser@example.com"
clear_test_user(free_email)
conn = sqlite3.connect(DB); cur = conn.cursor()
cur.execute("INSERT INTO User (id, email, plan, analysesUsed, analysesLimit, createdAt, updatedAt) VALUES (?, ?, 'free', 0, 1, ?, ?)",
            (f"free_{int(time.time())}", free_email, now_ms(), now_ms()))
conn.commit(); conn.close()

sample_video = {
    "videoData": {
        "videoId": "dQw4w9WgXcQ", "title": "Test", "channelName": "Test",
        "uploadDate": "2024-01-15", "uploadTime": "6:00 PM", "uploadDay": "Tuesday",
        "viewCount": 1000000, "likeCount": 50000, "commentCount": 5000,
        "duration": "3:33", "category": "Music", "tags": ["test"],
        "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        "videoUrl": "https://youtu.be/dQw4w9WgXcQ",
    },
    "email": free_email,
}
r = requests.post(f"{BASE}/api/analyze", json=sample_video, timeout=60)
print(f"   1st analyze HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
check("T9-first-ok", r.status_code == 200, f"status={r.status_code}, err={j.get('error')}")
check("T9-first-notpro", j.get("isPro") is False, f"isPro={j.get('isPro')}")
check("T9-first-watermark", j.get("watermark") is True, f"watermark={j.get('watermark')}")
check("T9-first-no-suggestions", j.get("contentSuggestions") is None, f"suggestions={j.get('contentSuggestions')!r}")

r = requests.post(f"{BASE}/api/analyze", json=sample_video, timeout=60)
print(f"   2nd analyze HTTP {r.status_code}")
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
print(f"   Response: {j}")
check("T9-second-403", r.status_code == 403, f"status={r.status_code}")
check("T9-second-limit-msg", "Free weekly limit reached" in (j.get("error") or ""), f"error={j.get('error')!r}")
check("T9-second-code", j.get("code") == "FREE_WEEKLY_LIMIT_REACHED", f"code={j.get('code')}")

# T10: Pro user unlimited
print("\n>> T10: Pro user unlimited analyze")
pro_email = "prouser@example.com"
clear_test_user(pro_email)
conn = sqlite3.connect(DB); cur = conn.cursor()
cur.execute("INSERT INTO User (id, email, name, plan, analysesUsed, analysesLimit, createdAt, updatedAt) VALUES (?, ?, 'Pro', 'pro', 0, -1, ?, ?)",
            (f"pro_{int(time.time())}", pro_email, now_ms(), now_ms()))
conn.commit(); conn.close()

pro_video = {**sample_video, "email": pro_email}
ok_count = 0
for i in range(3):
    r = requests.post(f"{BASE}/api/analyze", json=pro_video, timeout=60)
    j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
    if r.status_code == 200:
        ok_count += 1
    print(f"   analyze #{i+1}: HTTP {r.status_code}, isPro={j.get('isPro')}, watermark={j.get('watermark')}")
check("T10-3-ok", ok_count == 3, f"ok_count={ok_count}")

r = requests.post(f"{BASE}/api/analyze", json=pro_video, timeout=60)
j = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
check("T10-ispro", j.get("isPro") is True, f"isPro={j.get('isPro')}")
check("T10-no-watermark", j.get("watermark") is False, f"watermark={j.get('watermark')}")
check("T10-has-suggestions", j.get("contentSuggestions") is not None, f"suggestions={j.get('contentSuggestions')!r}")

# Cleanup
for e in [pro_email, free_email, long_email, short_email, test_email, "sigsig@example.com"]:
    clear_test_user(e)

print("\n" + "=" * 60)
print(f"RESULTS: {results['pass']} passed, {results['fail']} failed")
print("=" * 60)
exit(0 if results["fail"] == 0 else 1)
