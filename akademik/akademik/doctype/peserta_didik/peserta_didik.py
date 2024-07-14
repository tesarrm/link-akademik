# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
import random
import string
from frappe.model.document import Document


class PesertaDidik(Document):
	pass

# - cari file .py di dalam /doctype
# - bikin function terserah
# - bench restart setiap ada perubahan

@frappe.whitelist()
def getPesertaDidik():
    return {
		'total_rows' : len(frappe.get_all('PesertaDidik', fields=['*'])),
		'data' : frappe.get_all('PesertaDidik', fields=['*']),
        # 'data': data,
        # 'total_rows': total_rows
    }
	# return data


@frappe.whitelist()
def getPesertaDidiks(page=1, page_size=10):
    # Hitung offset
    start = (int(page) - 1) * int(page_size)

    # Ambil data dengan pagination
    data = frappe.get_all('PesertaDidik', fields=['*'], start=start, page_length=page_size)

    # Hitung total baris data
    total_rows = frappe.db.count('PesertaDidik')

    # Kembalikan hasil dalam format yang diinginkan
    return {
        'data': data,
        'total_rows': total_rows,
        'current_page': int(page),
        'page_size': int(page_size),
        'total_pages': (total_rows + int(page_size) - 1) // int(page_size)  # Pembulatan ke atas
    }



@frappe.whitelist()
def generateAccount(selected_users):
    try:
        frappe.logger().info(f"Selected users: {selected_users}")
        selected_users = frappe.parse_json(selected_users)

        def generate_random_code(length=8):
            characters = string.ascii_letters + string.digits + string.punctuation
            random_code = ''.join(random.choice(characters) for _ in range(length))
            return random_code

        for user in selected_users:
            email = user.get("email")
            if not frappe.db.exists("User", email):

                # Generate random password
                random_password = generate_random_code()

                frappe.logger().info(f"User berhasil dibuat dengan email: {email} dan password: {random_password}")

                # Insert to doctype user
                user_doc = frappe.get_doc({
                    "doctype": "User",
                    "email": email,
                    "first_name": user.get("username"),
                    "gender": user.get("jenis_kelamin"),
                    "roles": [
                        {
                            "role": "Peserta Didik"
                        }
                    ],
                    "send_welcome_email": 0,
                })
                user_doc.insert(ignore_permissions=True)
                frappe.utils.password.update_password(email, random_password)

                # Insert to doctype manajemen pengguna
                manajemen_pengguna_doc = frappe.get_doc({
                    "doctype": "Manajemen Pengguna",
                    "email_pengguna": email,
                    "username": user.get("username"),
                    "jenis_pengguna": "Peserta Didik",
                    "hak_akses": [
                        {
                            "role": "Peserta Didik"
                        }
                    ]
                })
                manajemen_pengguna_doc.insert(ignore_permissions=True)

        return {"status": "success", "message": "Akun berhasil dibuat!" + random_password}

    except Exception as e:
        frappe.log_error(f"Error creating user accounts: {str(e)}")
        raise frappe.ValidationError(f"Failed to create user accounts: {str(e)}")


# testing get data doctype user
@frappe.whitelist()
def alldata():
	pengguna_list = frappe.get_all('User', fields=['*'])
	# Loop melalui setiap dokumen untuk mendapatkan detail dari field roles
	for pengguna in pengguna_list:
		pengguna_doc = frappe.get_doc('User', pengguna.name)
		pengguna['roles'] = pengguna_doc.roles

	return pengguna_list
