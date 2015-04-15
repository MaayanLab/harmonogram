

items = [{'price': 99, 'barcode': '2342355'}, {'price': 88, 'barcode': '2345566'}]

min_price = min(item['price'] for item in items)
max_price = max(item['price'] for item in items)

print(min_price)
print(max_price)