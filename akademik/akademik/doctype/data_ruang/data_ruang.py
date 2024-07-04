# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DataRuang(Document):
    def before_insert(self):
        # Logika sebelum dokumen disimpan pertama kali
        frappe.msgprint("Before Insert Triggered")

    def after_insert(self):
        frappe.msgprint("After Insert Triggered")

        # Logika setelah dokumen disimpan pertama kali

    def validate(self):
        # Logika validasi sebelum dokumen disimpan
        frappe.msgprint("Validation Triggered")

    def before_save(self):
        frappe.msgprint("Before Save Triggered")
        frappe.msgprint(self.nama_ruang)

        # Logika sebelum dokumen disimpan

    def on_update(self):
        frappe.msgprint("On Update Triggered")
        # Logika setelah dokumen diupdate
        insert_alat_angkutan_buku(self)

def insert_alat_angkutan_buku(self):
    if not frappe.db.exists(
        "Alat Angkutan Buku", {
            "bangunan": self.bangunan,
            "raung": self.name
        }
    ):
        doc = frappe.get_doc({
            "doctype": "Angkutan Buku",
            "bangunan": self.bangunan,
            "ruang": self.name,
        })
        doc.insert()
    else: 
        doc = frappe.get_doc(
            "Angkutan Buku", {"name": self.name}
        )
        doc.bangunan = self.bangunan
        doc.ruang = self.name
        doc.save(ignore_permissions = True)


# On first time insert will triged
# Before Insert Triggered
# Validation Triggered
# Before Save Triggered
# After Insert Triggered
# On Update Triggered