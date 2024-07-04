import frappe
import csv

@frappe.whitelist()
def coba():
    return frappe.get_doc("Profil Sekolah")

@frappe.whitelist()
def export(doctype, file_path):
    data = frappe.get_doc(doctype)
    with open(file_path, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())
        writer.writeheader()
        for row in data:
            writer.writerow(row)

# Contoh penggunaan
# export_single_doctype_data('YourSingleDoctype', '/path/to/export_file.csv')