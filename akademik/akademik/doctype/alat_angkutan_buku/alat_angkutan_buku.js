// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

/**
 * input data bangan -> filter ruang
 * input ruang -> get data alat
 * save data alat di child table alat
 * tambah data alat harus di save klik tombol
 */

frappe.ui.form.on("Alat Angkutan Buku", {
	refresh(frm) {
        

	},
    get_students: function (frm) {
        // Memeriksa apakah pengelompokan didasarkan pada 'Batch' atau 'Course'
        if (frm.doc.group_based_on == 'Batch' || frm.doc.group_based_on == 'Course') {
            var student_list = [];  // Daftar untuk menyimpan ID siswa yang sudah ada
            var max_roll_no = 0;    // Variabel untuk menyimpan nomor urut terbesar

            // Mengiterasi setiap siswa dalam dokumen dan menambahkan ID siswa ke student_list
            $.each(frm.doc.students, function (_i, d) {
                student_list.push(d.student);
                // Memperbarui max_roll_no jika nomor urut siswa saat ini lebih besar
                if (d.group_roll_number > max_roll_no) {
                    max_roll_no = d.group_roll_number;
                }
            });

            // Memeriksa apakah tahun akademik sudah diisi
            // if (frm.doc.academic_year) {
                // Memanggil metode server untuk mendapatkan daftar siswa
                frappe.call({
                    method: 'education.education.doctype.student_group.student_group.get_students',  // Metode yang dipanggil di server
                    args: {
                        'academic_year': frm.doc.academic_year,      // Tahun akademik
                        'academic_term': frm.doc.academic_term,      // Term akademik
                        'group_based_on': frm.doc.group_based_on,    // Basis pengelompokan (Batch atau Course)
                        'program': frm.doc.program,                  // Program akademik
                        'batch': frm.doc.batch,                      // Batch akademik
                        'student_category': frm.doc.student_category,// Kategori siswa
                        'course': frm.doc.course                     // Kursus akademik
                    },
                    callback: function (r) {
                        // Jika server mengembalikan data siswa
                        if (r.message) {
                            $.each(r.message, function (i, d) {
                                // Menambahkan siswa baru ke daftar jika belum ada dalam student_list
                                if (!in_list(student_list, d.student)) {
                                    var s = frm.add_child('students');  // Menambah baris baru di tabel 'students'
                                    s.student = d.student;              // Mengisi ID siswa
                                    s.student_name = d.student_name;    // Mengisi nama siswa
                                    if (d.active === 0) {               // Jika siswa tidak aktif, tandai sebagai tidak aktif
                                        s.active = 0;
                                    }
                                    s.group_roll_number = ++max_roll_no;  // Memberikan nomor urut yang baru
                                }
                            });
                            refresh_field('students');  // Memperbarui tampilan field 'students'
                            frm.save();                 // Menyimpan perubahan pada form
                        } else {
                            // Menampilkan pesan jika grup siswa sudah diperbarui
                            frappe.msgprint(__('Student Group is already updated.'));
                        }
                    }
                });
            // }
        } else {
            // Menampilkan pesan jika pengelompokan berdasarkan aktivitas
            frappe.msgprint(__('Select students manually for the Activity based Group'));
        }
    }
});
