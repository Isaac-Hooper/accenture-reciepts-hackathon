import json
from datetime import datetime


def load_receipt(filepath: str) -> dict:
    with open(filepath) as f:
        return json.load(f)["receipt"]


def print_summary(receipt: dict):
    r = receipt["restaurant"]
    t = receipt["transaction"]
    totals = receipt["totals"]

    print(f"\n{'='*40}")
    print(f"  {r['name']}")
    print(f"  {r['address']}, {r['city']}, {r['state']} {r['zip']}")
    print(f"  {r['phone']}")
    print(f"{'='*40}")
    print(f"  Date    : {t['date']}  {t['time']}")
    print(f"  Server  : {t['server']}  |  Table: {t['table']}")
    print(f"  Guests  : {t['guests']}  |  Order: #{t['order_number']}")
    print(f"{'-'*40}")
    print(f"  {'Item':<18} {'Qty':>4}  {'Unit':>7}  {'Total':>7}")
    print(f"{'-'*40}")
    for item in receipt["items"]:
        print(f"  {item['name']:<18} {item['quantity']:>4}  ${item['unit_price']:>6.2f}  ${item['total_price']:>6.2f}")
    print(f"{'-'*40}")
    print(f"  {'Subtotal':>30}  ${totals['subtotal']:>6.2f}")
    print(f"  {'Tax':>30}  ${totals['tax']:>6.2f}")
    print(f"  {'TOTAL':>30}  ${totals['total']:>6.2f}")
    print(f"{'='*40}\n")


def get_items_df(receipt: dict):
    """Return items as a list of dicts (ready for pandas DataFrame)."""
    return receipt["items"]


def tax_rate(receipt: dict) -> float:
    return round(receipt["totals"]["tax"] / receipt["totals"]["subtotal"] * 100, 2)


def average_item_price(receipt: dict) -> float:
    items = receipt["items"]
    total_qty = sum(i["quantity"] for i in items)
    return round(receipt["totals"]["subtotal"] / total_qty, 2)


def most_expensive_item(receipt: dict) -> dict:
    return max(receipt["items"], key=lambda i: i["unit_price"])


def receipt_to_flat_dict(receipt: dict) -> dict:
    """Flatten receipt into a single dict — useful for CSV export or DB insert."""
    r = receipt["restaurant"]
    t = receipt["transaction"]
    totals = receipt["totals"]
    return {
        "restaurant_name": r["name"],
        "address": f"{r['address']}, {r['city']}, {r['state']} {r['zip']}",
        "phone": r["phone"],
        "date": t["date"],
        "time": t["time"],
        "order_number": t["order_number"],
        "server": t["server"],
        "table": t["table"],
        "guests": t["guests"],
        "subtotal": totals["subtotal"],
        "tax": totals["tax"],
        "total": totals["total"],
        "item_count": len(receipt["items"]),
    }


if __name__ == "__main__":
    receipt = load_receipt("green_field_receipt.json")

    print_summary(receipt)
    print(f"Tax rate        : {tax_rate(receipt)}%")
    print(f"Avg price/item  : ${average_item_price(receipt)}")
    most_exp = most_expensive_item(receipt)
    print(f"Most expensive  : {most_exp['name']} (${most_exp['unit_price']:.2f})")
    print(f"\nFlat dict (for DB/CSV):")
    for k, v in receipt_to_flat_dict(receipt).items():
        print(f"  {k}: {v}")