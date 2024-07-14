# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ToolKehadiranPesertaDidik(Document):
	pass

# @frappe.whitelist()
# def get_student_attendance_records(
# 	pilih_berdasarkan, tanggal=None, grup_peserta_didik=None, rombel=None
# ):
# 	peserta_didik_list = []
# 	kehadiran_peserta_didik_list = []

# 	if pilih_berdasarkan == "Rombel":
# 		grup_peserta_didik = frappe.db.get_value(
# 			"Rombel", rombel, "grup_peserta_didik"
# 		)
# 		if grup_peserta_didik:
# 			peserta_didik_list = frappe.get_all(
# 				"Peserta didik Grup Peserta Didik",
# 				fields=["peserta_didik", "nama_peserta_didik", "nomor_role_grup"],
# 				filters={"parent": grup_peserta_didik, "active": 1},
# 				order_by="nomor_role_grup",
# 			)

# 	if not peserta_didik_list:
# 		peserta_didik_list= frappe.get_all(
# 			"Peserta didik Grup Peserta Didik",
# 			fields=["peserta_didik", "nama_peserta_didik", "nomor_role_grup"],
# 			filters={"parent": grup_peserta_didik, "active": 1},
# 			order_by="nomor_role_grup",
# 		)

# 	KehadiranPesertaDidik = frappe.qb.DocType("Kehadiran Peserta Didik")

# 	if rombel:
# 		kehadiran_peserta_didik_list = (
# 			frappe.qb.from_(KehadiranPesertaDidik)
# 			.select(KehadiranPesertaDidik.peserta_didik_, KehadiranPesertaDidik.status)
# 			.where((KehadiranPesertaDidik.rombel == rombel))
# 		).run(as_dict=True)
# 	else:
# 		kehadiran_peserta_didik_list = (
# 			frappe.qb.from_(KehadiranPesertaDidik)
# 			.select(KehadiranPesertaDidik.peserta_didik_, KehadiranPesertaDidik.status)
# 			.where(
# 				(KehadiranPesertaDidik.grup_peserta_didik == grup_peserta_didik)
# 				& (KehadiranPesertaDidik.tanggal == tanggal)
# 				& (
# 					(KehadiranPesertaDidik.rombel == "")
# 					| (KehadiranPesertaDidik.rombel.isnull())
# 				)
# 			)
# 		).run(as_dict=True)

# 	for attendance in kehadiran_peserta_didik_list:
# 		for student in peserta_didik_list:
# 			if student.peserta_didik == attendance.peserta_didik:
# 				student.status = attendance.status

# 	return peserta_didik_list

