# Copyright (c) 2015, Frappe Technologies and contributors
# For license information, please see license.txt


import json

import frappe
from frappe import _
from frappe.email.doctype.email_group.email_group import add_subscribers
from frappe.model.mapper import get_mapped_doc
from frappe.utils import cstr, flt, getdate
from frappe.utils.dateutils import get_dates_from_timegrain


def get_course(program):
	"""Return list of courses for a particular program
	:param program: Program
	"""
	courses = frappe.db.sql(
		"""select course, course_name from `tabProgram Course` where parent=%s""",
		(program),
		as_dict=1,
	)
	return courses


@frappe.whitelist()
def enroll_peserta_didik(source_name):
	"""Creates a peserta_didik Record and returns a Program Enrollment.

	:param source_name: peserta_didik Applicant.
	"""
	frappe.publish_realtime(
		"enroll_peserta_didik_progress", {"progress": [1, 4]}, user=frappe.session.user
	)
	peserta_didik = get_mapped_doc(
		"peserta_didik Applicant",
		source_name,
		{
			"peserta_didik Applicant": {
				"doctype": "peserta_didik",
				"field_map": {
					"name": "peserta_didik_applicant",
				},
			}
		},
		ignore_permissions=True,
	)
	peserta_didik.save()

	peserta_didik_applicant = frappe.db.get_value(
		"peserta_didik Applicant",
		source_name,
		["peserta_didik_category", "program", "tahun_ajaran"],
		as_dict=True,
	)
	program_enrollment = frappe.new_doc("Program Enrollment")
	program_enrollment.peserta_didik = peserta_didik.name
	program_enrollment.peserta_didik_category = peserta_didik_applicant.peserta_didik_category
	program_enrollment.nama_peserta_didik = peserta_didik.nama_peserta_didik
	program_enrollment.program = peserta_didik_applicant.program
	program_enrollment.tahun_ajaran = peserta_didik_applicant.tahun_ajaran
	program_enrollment.save()

	frappe.publish_realtime(
		"enroll_peserta_didik_progress", {"progress": [2, 4]}, user=frappe.session.user
	)
	return program_enrollment


@frappe.whitelist()
def check_attendance_records_exist(rombel=None, grup_peserta_didik=None, tanggal=None):
	"""Check if Attendance Records are made against the specified Course Schedule or Grup Peserta Didik for given tanggal.

	:param rombel: Course Schedule.
	:param grup_peserta_didik: Grup Peserta Didik.
	:param tanggal: Date.
	"""
	if rombel:
		return frappe.get_list(
			"Kehadiran Peserta Didik", filters={"rombel": rombel}
		)
	else:
		return frappe.get_list(
			"Kehadiran Peserta Didik", filters={"grup_peserta_didik": grup_peserta_didik, "tanggal": tanggal}
		)


@frappe.whitelist()
def mark_attendance(
	peserta_didik_hadir, peserta_didik_tidak_hadir, rombel=None, grup_peserta_didik=None, tanggal=None
):
	"""Creates Multiple Attendance Records.

	:param peserta_didik_hadir: peserta_didiks hadir JSON.
	:param peserta_didik_tidak_hadir: peserta_didiks tidak_hadir JSON.
	:param rombel: Course Schedule.
	:param grup_peserta_didik: Grup Peserta Didik.
	:param tanggal: Date.
	"""
	if grup_peserta_didik:
		tahun_ajaran = frappe.db.get_value("Grup Peserta Didik", grup_peserta_didik, "tahun_ajaran")
		if tahun_ajaran:
			year_start_date, year_end_date = frappe.db.get_value(
				"Tahun Ajaran", tahun_ajaran, ["year_start_date", "year_end_date"]
			)
			if getdate(tanggal) < getdate(year_start_date) or getdate(tanggal) > getdate(
				year_end_date
			):
				frappe.throw(
					_("Attendance cannot be marked outside of Tahun Ajaran {0}").format(tahun_ajaran)
				)

	hadir = json.loads(peserta_didik_hadir)
	tidak_hadir = json.loads(peserta_didik_tidak_hadir)

	for d in hadir:
		make_attendance_records(
			d["peserta_didik"], d["nama_peserta_didik"], "hadir", rombel, grup_peserta_didik, tanggal
		)

	for d in tidak_hadir:
		make_attendance_records(
			d["peserta_didik"], d["nama_peserta_didik"], "tidak_hadir", rombel, grup_peserta_didik, tanggal
		)

	frappe.db.commit()
	frappe.msgprint(_("Attendance has been marked successfully."))


def make_attendance_records(
	peserta_didik, nama_peserta_didik, status, rombel=None, grup_peserta_didik=None, tanggal=None
):
	"""Creates/Update Attendance Record.

	:param peserta_didik: peserta_didik.
	:param nama_peserta_didik: peserta_didik Name.
	:param rombel: Course Schedule.
	:param status: Status (hadir/tidak_hadir/Leave).
	"""
	kehadiran_peserta_didik = frappe.get_doc(
		{
			"doctype": "Kehadiran Peserta Didik",
			"peserta_didik": peserta_didik,
			"rombel": rombel,
			"grup_peserta_didik": grup_peserta_didik,
			"tanggal": tanggal,
		}
	)
	if not kehadiran_peserta_didik:
		kehadiran_peserta_didik = frappe.new_doc("Kehadiran Peserta Didik")
		kehadiran_peserta_didik.peserta_didik = peserta_didik
		kehadiran_peserta_didik.nama_peserta_didik = nama_peserta_didik
		kehadiran_peserta_didik.rombel = rombel
		kehadiran_peserta_didik.grup_peserta_didik = grup_peserta_didik
		kehadiran_peserta_didik.tanggal = tanggal
		kehadiran_peserta_didik.status = status
		kehadiran_peserta_didik.save()
		kehadiran_peserta_didik.submit()


@frappe.whitelist()
def get_peserta_didik_guardians(peserta_didik):
	"""Returns List of Guardians of a peserta_didik.

	:param peserta_didik: peserta_didik.
	"""
	guardians = frappe.get_all(
		"peserta_didik Guardian", fields=["guardian"], filters={"parent": peserta_didik}
	)
	return guardians


@frappe.whitelist()
def get_peserta_didik_group_peserta_didiks(grup_peserta_didik, include_inactive=0):
	"""Returns List of peserta_didik, nama_peserta_didik in Grup Peserta Didik.

	:param grup_peserta_didik: Grup Peserta Didik.
	"""
	if include_inactive:
		peserta_didiks = frappe.get_all(
			"Grup Peserta Didik peserta_didik",
			fields=["peserta_didik", "nama_peserta_didik"],
			filters={"parent": grup_peserta_didik},
			order_by="group_roll_number",
		)
	else:
		peserta_didiks = frappe.get_all(
			"Grup Peserta Didik peserta_didik",
			fields=["peserta_didik", "nama_peserta_didik"],
			filters={"parent": grup_peserta_didik, "active": 1},
			order_by="group_roll_number",
		)
	return peserta_didiks




@frappe.whitelist()
def get_fee_structure(program, academic_term=None):
	"""Returns Fee Structure.

	:param program: Program.
	:param academic_term: Academic Term.
	"""
	fee_structure = frappe.db.get_values(
		"Fee Structure",
		{"program": program, "academic_term": academic_term},
		"name",
		as_dict=True,
	)
	return fee_structure[0].name if fee_structure else None


@frappe.whitelist()
def get_fee_components(fee_structure):
	"""Returns Fee Components.

	:param fee_structure: Fee Structure.
	"""
	if fee_structure:
		fs = frappe.get_all(
			"Fee Component",
			fields=["fees_category", "description", "amount"],
			filters={"parent": fee_structure},
			order_by="idx",
		)
		return fs


@frappe.whitelist()
def get_fee_schedule(program, peserta_didik_category=None):
	"""Returns Fee Schedule.

	:param program: Program.
	:param peserta_didik_category: peserta_didik Category
	"""
	fs = frappe.get_all(
		"Program Fee",
		fields=["academic_term", "fee_schedule", "due_date", "amount"],
		filters={"parent": program, "peserta_didik_category": peserta_didik_category},
		order_by="idx",
	)
	return fs


@frappe.whitelist()
def collect_fees(fees, amt):
	paid_amount = flt(amt) + flt(frappe.db.get_value("Fees", fees, "paid_amount"))
	total_amount = flt(frappe.db.get_value("Fees", fees, "total_amount"))
	frappe.db.set_value("Fees", fees, "paid_amount", paid_amount)
	frappe.db.set_value("Fees", fees, "outstanding_amount", (total_amount - paid_amount))
	return paid_amount


@frappe.whitelist()
def get_rombel_events(start, end, filters=None):
	"""Returns events for Course Schedule Calendar view rendering.

	:param start: Start tanggal-time.
	:param end: End tanggal-time.
	:param filters: Filters (JSON).
	"""
	from frappe.desk.calendar import get_event_conditions

	conditions = get_event_conditions("Course Schedule", filters)

	data = frappe.db.sql(
		"""select name, course, color,
			timestamp(schedule_date, from_time) as from_time,
			timestamp(schedule_date, to_time) as to_time,
			room, grup_peserta_didik, 0 as 'allDay'
		from `tabCourse Schedule`
		where ( schedule_date between %(start)s and %(end)s )
		{conditions}""".format(
			conditions=conditions
		),
		{"start": start, "end": end},
		as_dict=True,
		update={"allDay": 0},
	)

	return data


@frappe.whitelist()
def get_assessment_criteria(course):
	"""Returns Assessmemt Criteria and their Weightage from Course Master.

	:param Course: Course
	"""
	return frappe.get_all(
		"Course Assessment Criteria",
		fields=["assessment_criteria", "weightage"],
		filters={"parent": course},
		order_by="idx",
	)


@frappe.whitelist()
def get_assessment_peserta_didiks(assessment_plan, grup_peserta_didik):
	peserta_didik_list = get_peserta_didik_group_peserta_didiks(grup_peserta_didik)
	for i, peserta_didik in enumerate(peserta_didik_list):
		result = get_result(peserta_didik.peserta_didik, assessment_plan)
		if result:
			peserta_didik_result = {}
			for d in result.details:
				peserta_didik_result.update({d.assessment_criteria: [cstr(d.score), d.grade]})
			peserta_didik_result.update(
				{"total_score": [cstr(result.total_score), result.grade], "comment": result.comment}
			)
			peserta_didik.update(
				{
					"assessment_details": peserta_didik_result,
					"docstatus": result.docstatus,
					"name": result.name,
				}
			)
		else:
			peserta_didik.update({"assessment_details": None})
	return peserta_didik_list


@frappe.whitelist()
def get_assessment_details(assessment_plan):
	"""Returns Assessment Criteria  and Maximum Score from Assessment Plan Master.

	:param Assessment Plan: Assessment Plan
	"""
	return frappe.get_all(
		"Assessment Plan Criteria",
		fields=["assessment_criteria", "maximum_score", "docstatus"],
		filters={"parent": assessment_plan},
		order_by="idx",
	)


@frappe.whitelist()
def get_result(peserta_didik, assessment_plan):
	"""Returns Submitted Result of given peserta_didik for specified Assessment Plan

	:param peserta_didik: peserta_didik
	:param Assessment Plan: Assessment Plan
	"""
	results = frappe.get_all(
		"Assessment Result",
		filters={
			"peserta_didik": peserta_didik,
			"assessment_plan": assessment_plan,
			"docstatus": ("!=", 2),
		},
	)
	if results:
		return frappe.get_doc("Assessment Result", results[0])
	else:
		return None


@frappe.whitelist()
def get_grade(grading_scale, percentage):
	"""Returns Grade based on the Grading Scale and Score.

	:param Grading Scale: Grading Scale
	:param Percentage: Score Percentage Percentage
	"""
	grading_scale_intervals = {}
	if not hasattr(frappe.local, "grading_scale"):
		grading_scale = frappe.get_all(
			"Grading Scale Interval",
			fields=["grade_code", "threshold"],
			filters={"parent": grading_scale},
		)
		frappe.local.grading_scale = grading_scale
	for d in frappe.local.grading_scale:
		grading_scale_intervals.update({d.threshold: d.grade_code})
	intervals = sorted(grading_scale_intervals.keys(), key=float, reverse=True)
	for interval in intervals:
		if flt(percentage) >= interval:
			grade = grading_scale_intervals.get(interval)
			break
		else:
			grade = ""
	return grade


@frappe.whitelist()
def mark_assessment_result(assessment_plan, scores):
	peserta_didik_score = json.loads(scores)
	assessment_details = []
	for criteria in peserta_didik_score.get("assessment_details"):
		assessment_details.append(
			{
				"assessment_criteria": criteria,
				"score": flt(peserta_didik_score["assessment_details"][criteria]),
			}
		)
	assessment_result = get_assessment_result_doc(
		peserta_didik_score["peserta_didik"], assessment_plan
	)
	assessment_result.update(
		{
			"peserta_didik": peserta_didik_score.get("peserta_didik"),
			"assessment_plan": assessment_plan,
			"comment": peserta_didik_score.get("comment"),
			"total_score": peserta_didik_score.get("total_score"),
			"details": assessment_details,
		}
	)
	assessment_result.save()
	details = {}
	for d in assessment_result.details:
		details.update({d.assessment_criteria: d.grade})
	assessment_result_dict = {
		"name": assessment_result.name,
		"peserta_didik": assessment_result.peserta_didik,
		"total_score": assessment_result.total_score,
		"grade": assessment_result.grade,
		"details": details,
	}
	return assessment_result_dict


@frappe.whitelist()
def submit_assessment_results(assessment_plan, grup_peserta_didik):
	total_result = 0
	peserta_didik_list = get_peserta_didik_group_peserta_didiks(grup_peserta_didik)
	for i, peserta_didik in enumerate(peserta_didik_list):
		doc = get_result(peserta_didik.peserta_didik, assessment_plan)
		if doc and doc.docstatus == 0:
			total_result += 1
			doc.submit()
	return total_result


def get_assessment_result_doc(peserta_didik, assessment_plan):
	assessment_result = frappe.get_all(
		"Assessment Result",
		filters={
			"peserta_didik": peserta_didik,
			"assessment_plan": assessment_plan,
			"docstatus": ("!=", 2),
		},
	)
	if assessment_result:
		doc = frappe.get_doc("Assessment Result", assessment_result[0])
		if doc.docstatus == 0:
			return doc
		elif doc.docstatus == 1:
			frappe.msgprint(_("Result already Submitted"))
			return None
	else:
		return frappe.new_doc("Assessment Result")


@frappe.whitelist()
def update_email_group(doctype, name):
	if not frappe.db.exists("Email Group", name):
		email_group = frappe.new_doc("Email Group")
		email_group.title = name
		email_group.save()
	email_list = []
	peserta_didiks = []
	if doctype == "Grup Peserta Didik":
		peserta_didiks = get_peserta_didik_group_peserta_didiks(name)
	for stud in peserta_didiks:
		for guard in get_peserta_didik_guardians(stud.peserta_didik):
			email = frappe.db.get_value("Guardian", guard.guardian, "email_address")
			if email:
				email_list.append(email)
	add_subscribers(name, email_list)


@frappe.whitelist()
def get_current_enrollment(peserta_didik, tahun_ajaran=None):
	current_tahun_ajaran = tahun_ajaran or frappe.defaults.get_defaults().tahun_ajaran
	if not current_tahun_ajaran:
		frappe.throw(_("Please set default Tahun Ajaran in Education Settings"))
	program_enrollment_list = frappe.db.sql(
		"""
		select
			name as program_enrollment, nama_peserta_didik, program, peserta_didik_batch_name as peserta_didik_batch,
			peserta_didik_category, academic_term, tahun_ajaran
		from
			`tabProgram Enrollment`
		where
			peserta_didik = %s and tahun_ajaran = %s
		order by creation""",
		(peserta_didik, current_tahun_ajaran),
		as_dict=1,
	)

	if program_enrollment_list:
		return program_enrollment_list[0]
	else:
		return None


@frappe.whitelist()
def get_instructors(grup_peserta_didik):
	return frappe.get_all(
		"Grup Peserta Didik Instructor", {"parent": grup_peserta_didik}, pluck="instructor"
	)


@frappe.whitelist()
def get_user_info():
	if frappe.session.user == "Guest":
		frappe.throw("Authentication failed", exc=frappe.AuthenticationError)

	current_user = frappe.db.get_list(
		"User",
		fields=["name", "email", "enabled", "user_image", "full_name", "user_type"],
		filters={"name": frappe.session.user},
	)[0]
	current_user["session_user"] = True
	return current_user


@frappe.whitelist()
def get_peserta_didik_info():
	email = frappe.session.user
	if email == "Administrator":
		return
	peserta_didik_info = frappe.db.get_list(
		"peserta_didik",
		fields=["*"],
		filters={"user": email},
	)[0]

	current_program = get_current_enrollment(peserta_didik_info.name)
	if current_program:
		peserta_didik_groups = get_peserta_didik_groups(peserta_didik_info.name, current_program.program)
		peserta_didik_info["peserta_didik_groups"] = peserta_didik_groups
		peserta_didik_info["current_program"] = current_program
	return peserta_didik_info


@frappe.whitelist()
def get_peserta_didik_programs(peserta_didik):
	# peserta_didik = 'EDU-STU-2023-00043'
	programs = frappe.db.get_list(
		"Program Enrollment",
		fields=["program", "name"],
		filters={"docstatus": 1, "peserta_didik": peserta_didik},
	)
	return programs


def get_peserta_didik_groups(peserta_didik, program_name):
	# peserta_didik = 'EDU-STU-2023-00043'

	grup_peserta_didik = frappe.qb.DocType("Grup Peserta Didik")
	peserta_didik_group_peserta_didiks = frappe.qb.DocType("Grup Peserta Didik peserta_didik")

	peserta_didik_group_query = (
		frappe.qb.from_(grup_peserta_didik)
		.inner_join(peserta_didik_group_peserta_didiks)
		.on(grup_peserta_didik.name == peserta_didik_group_peserta_didiks.parent)
		.select((peserta_didik_group_peserta_didiks.parent).as_("label"))
		.where(peserta_didik_group_peserta_didiks.peserta_didik == peserta_didik)
		.where(grup_peserta_didik.program == program_name)
		.run(as_dict=1)
	)

	return peserta_didik_group_query


@frappe.whitelist()
def get_course_list_based_on_program(program_name):
	program = frappe.get_doc("Program", program_name)

	course_list = []

	for course in program.courses:
		course_list.append(course.course)
	return course_list


@frappe.whitelist()
def get_rombel_for_peserta_didik(program_name, peserta_didik_groups):
	peserta_didik_groups = [sg.get("label") for sg in peserta_didik_groups]

	schedule = frappe.db.get_list(
		"Course Schedule",
		fields=[
			"schedule_date",
			"room",
			"class_schedule_color",
			"course",
			"from_time",
			"to_time",
			"instructor",
			"title",
			"name",
		],
		filters={"program": program_name, "grup_peserta_didik": ["in", peserta_didik_groups]},
		order_by="schedule_date asc",
	)
	return schedule


@frappe.whitelist()
def apply_leave(leave_data, program_name):
	attendance_based_on_rombel = frappe.db.get_single_value(
		"Education Settings", "attendance_based_on_rombel"
	)
	if attendance_based_on_rombel:
		apply_leave_based_on_rombel(leave_data, program_name)
	else:
		apply_leave_based_on_peserta_didik_group(leave_data, program_name)


def apply_leave_based_on_rombel(leave_data, program_name):
	rombel_in_leave_period = frappe.db.get_list(
		"Course Schedule",
		fields=["name", "schedule_date"],
		filters={
			"program": program_name,
			"schedule_date": [
				"between",
				[leave_data.get("from_date"), leave_data.get("to_date")],
			],
		},
		order_by="schedule_date asc",
	)
	if not rombel_in_leave_period:
		frappe.throw(_("No classes found in the leave period"))
	for rombel in rombel_in_leave_period:
		# check if attendance record does not exist for the peserta_didik on the course schedule
		if not frappe.db.exists(
			"Kehadiran Peserta Didik",
			{"rombel": rombel.get("name"), "docstatus": 1},
		):
			make_attendance_records(
				leave_data.get("peserta_didik"),
				leave_data.get("nama_peserta_didik"),
				"Leave",
				rombel.get("name"),
				None,
				rombel.get("schedule_date"),
			)


def apply_leave_based_on_peserta_didik_group(leave_data, program_name):
	peserta_didik_groups = get_peserta_didik_groups(leave_data.get("peserta_didik"), program_name)
	leave_dates = get_dates_from_timegrain(
		leave_data.get("from_date"), leave_data.get("to_date")
	)
	for grup_peserta_didik in peserta_didik_groups:
		for leave_date in leave_dates:
			make_attendance_records(
				leave_data.get("peserta_didik"),
				leave_data.get("nama_peserta_didik"),
				"Leave",
				None,
				grup_peserta_didik.get("label"),
				leave_date,
			)


@frappe.whitelist()
def get_peserta_didik_invoices(peserta_didik):
	peserta_didik_sales_invoices = []

	sales_invoice_list = frappe.db.get_list(
		"Sales Invoice",
		filters={
			"peserta_didik": peserta_didik,
			"status": ["in", ["Paid", "Unpaid", "Overdue"]],
			"docstatus": 1,
		},
		fields=[
			"name",
			"status",
			"peserta_didik",
			"due_date",
			"fee_schedule",
			"grand_total",
			"currency",
		],
		order_by="status desc",
	)

	for si in sales_invoice_list:
		peserta_didik_program_invoice_status = {}
		peserta_didik_program_invoice_status["status"] = si.status
		peserta_didik_program_invoice_status["program"] = get_program_from_fee_schedule(
			si.fee_schedule
		)
		symbol = get_currency_symbol(si.get("currency", "INR"))
		peserta_didik_program_invoice_status["amount"] = symbol + " " + str(si.grand_total)
		# TODO: get currency
		peserta_didik_program_invoice_status["invoice"] = si.name
		if si.status == "Paid":
			peserta_didik_program_invoice_status[
				"payment_date"
			] = get_posting_date_from_payment_entry_against_sales_invoice(si.name)
			peserta_didik_program_invoice_status["due_date"] = "-"
		else:
			peserta_didik_program_invoice_status["due_date"] = si.due_date
			peserta_didik_program_invoice_status["payment_date"] = "-"

		peserta_didik_sales_invoices.append(peserta_didik_program_invoice_status)

	print_format = get_fees_print_format() or "Standard"

	return {"invoices": peserta_didik_sales_invoices, "print_format": print_format}


def get_currency_symbol(currency):
	return frappe.db.get_value("Currency", currency, "symbol")


def get_posting_date_from_payment_entry_against_sales_invoice(sales_invoice):
	payment_entry = frappe.qb.DocType("Payment Entry")
	payment_entry_reference = frappe.qb.DocType("Payment Entry Reference")

	q = (
		frappe.qb.from_(payment_entry)
		.inner_join(payment_entry_reference)
		.on(payment_entry.name == payment_entry_reference.parent)
		.select(payment_entry.posting_date)
		.where(payment_entry_reference.reference_name == sales_invoice)
	).run(as_dict=1)

	if len(q) > 0:
		payment_date = q[0].get("posting_date")
		return payment_date


def get_fees_print_format():
	return frappe.db.get_value(
		"Property Setter",
		dict(property="default_print_format", doc_type="Sales Invoice"),
		"value",
	)


def get_program_from_fee_schedule(fee_schedule):

	program = frappe.db.get_value(
		"Fee Schedule", filters={"name": fee_schedule}, fieldname=["program"]
	)
	return program


@frappe.whitelist()
def get_school_abbr_logo():
	abbr = frappe.db.get_single_value(
		"Education Settings", "school_college_name_abbreviation"
	)
	logo = frappe.db.get_single_value("Education Settings", "school_college_logo")
	return {"name": abbr, "logo": logo}


@frappe.whitelist()
def get_kehadiran_peserta_didik(peserta_didik, grup_peserta_didik):
	print(peserta_didik, grup_peserta_didik, "peserta_didik,grup_peserta_didik")
	return frappe.db.get_list(
		"Kehadiran Peserta Didik",
		filters={"peserta_didik": peserta_didik, "grup_peserta_didik": grup_peserta_didik, "docstatus": 1},
		fields=["tanggal", "status", "name"],
	)
