# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import csv
import os

class ImportData(Document):
	def on_update(self):
			if self.tanah:
					self.import_data(self.tanah, "Data Tanah")
			if self.bangunan:
					self.import_data(self.bangunan, "Data Bangunan")
			if self.ruang:
					self.import_data(self.ruang, "Data Ruang")
			if self.alat:
					self.import_data(self.alat, "Data Alat")
			if self.buku:
					self.import_data(self.buku, "Data Buku")
			if self.guru:
					self.import_data(self.guru, "GTK")
			if self.peserta_didik:
					self.import_data(self.peserta_didik, "Peserta Didik")
			if self.rombel:
					self.import_data(self.rombel, "Rombel")
			if self.ekstrakurikuler:
					self.import_data(self.ekstrakurikuler, "Ekskul")
			if self.praktik:
					self.import_data(self.praktik, "Praktik")
			if self.mapel_pilihan:
					self.import_data(self.mapel_pilihan, "Mapel")

	def import_data(self, file_path, doctype):
			file_url = frappe.utils.get_site_path("public", file_path)
			
			if not os.path.exists(file_url):
					frappe.throw(f"File {file_url} does not exist.")
			
			with open(file_url, mode='r') as file:
					csv_reader = csv.DictReader(file)
					for row in csv_reader:
							self.create_doc(row, doctype)

	def create_doc(self, data, doctype):
			# Validasi data
			missing_fields = [field for field in data if not data[field]]
			if missing_fields:
					frappe.throw(f"Missing fields in data: {', '.join(missing_fields)}")
			
			# Membuat dokumen baru dari data sesuai dengan Doctype
			doc = frappe.get_doc({
					"doctype": doctype,
					**data
			})
			doc.insert()
			frappe.db.commit()