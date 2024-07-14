frappe.listview_settings['Peserta Didik'] = {
    hide_name_column: true,
    hide_name_filter: true,
    // refresh(frm){
    // },

	onload: function(listview) {
        listview.settings.formatters = {
            'email': function(value, doc) {
                return `
                    <div class="list-row-col ellipsis hidden-xs ">
                        <span class="ellipsis" title="Email: ${value}">
                            <a class="filterable ellipsis" href="mailto:${value}">
                                ${value}
                            </a>
                        </span>
                    </div>
                `;
            },
            'nomor_hp': function(value, doc) {
                return `
                    <div class="list-row-col ellipsis hidden-xs ">
                        <span class="ellipsis" title="Nomor HP: ${value}">
                            <a class="filterable ellipsis" href="https://wa.me/${value}" target="_blank">
                                ${value}
                            </a>
                        </span>
                    </div>
                `;
            },
            'jenis_kelamin': function(value, doc) {
                return `
                    <div class="list-row-col ellipsis hidden-xs" style="text-align: start;">
                        <span class="ellipsis" title="Jenis kelamin: ${value}">
                            <span class="filterable ellipsis">
                                <span class="ellipsis"> ${value} </span>
                            </span>
                        </span>
                    </div>
                `;
            }
        };
        //ini punya tesar


		// custom create akun pd
		// CUSTOM kode for button generate account
        listview.page.add_inner_button("Generate Account", function() {
            // Mendapatkan data pengguna yang dipilih
            const selected_users = listview.get_checked_items().map(item => ({
                username: item.nis,// untuk username diset dari nis
                email: item.email,
                jenis_kelamin: item.jenis_kelamin
            }));

            if (selected_users.length === 0) {
                frappe.msgprint(__('Pilih setidaknya satu pengguna untuk membuat akun.'));
                return;
            }
			console.log(selected_users);
            frappe.call({
                method: 'akademik.akademik.doctype.peserta_didik.peserta_didik.generateAccount',
                args: {
                    selected_users: selected_users
                },
                callback: function(response) {
                    if (response.message) {
                        console.log(response);
                    }
                },
            }).then(() => {
				frappe.show_alert({ message: "Akun berhasil dibuat!", indicator: "green" });
                // listview.refresh();
            }).catch((error) => {
                frappe.show_alert({ message: "Akun gagal dibuat!", indicator: "red" });
            });
        });
    },

	// default kode
    button: [
    {
            name: 'btn-print-invoice',
            show(doc) {
                return '<i class="fa fa-calendar"></i>'
            },
            get_label() {
                return '<i class="fa fa-calendar"></i>';
            },
            get_description(doc) { return __('Data Periodik') },
            action(doc) {
                frappe.db.get_doc('Peserta Didik', doc.name)
                    .then((r) => {
                        let d = new frappe.ui.Dialog({
                            title: `Penugasan`,
                            fields: [
                                {
                                    "fieldname": "tinggi_badan_cm",
                                    "label": "Tinggi badan (cm)",
                                    "fieldtype": "Float",
                                },
                                {
                                    "fieldname": "berat_badan_cm",
                                    "label": "Berat badan (cm)",
                                    "fieldtype": "Int",
                                },
                                {
                                    "fieldname": "lingkar_kepala_cm",
                                    "label": "Lingkar kepala (cm)",
                                    "fieldtype": "Int",
                                },
                                {
                                    "fieldname": "column_break_cmiy",
                                    "label": "",
                                    "fieldtype": "Column Break",
                                },
                                {
                                    "fieldname": "jarak_rumah_ke_sekolah",
                                    "label": "Jarak rumah ke sekolah",
                                    "fieldtype": "Select",
                                    "options": "Kurang dari 1 km\nLebih dari 1 km",
                                },
                                {
                                    "fieldname": "sebutkan_dalam_meter",
                                    "label": "Sebutkan (dalam meter)",
                                    "fieldtype": "Int",
                                },
                                {
                                    "fieldname": "waktu_tempuh_ke_sekolah",
                                    "label": "Waktu tempuh ke sekolah (dalam menit)",
                                    "fieldtype": "Int",
                                }
                            ],
                            size: 'large',
                            primary_action_label: 'Submit',
                            primary_action(values) {
                                frappe.call({
                                    method: "frappe.client.set_value",
                                    args: {
                                        doctype: "Peserta Didik",
                                        name: doc.name,
                                        fieldname: {
                                            tinggi_badan_cm: values.tinggi_badan_cm,
                                            berat_badan_cm: values.berat_badan_cm,
                                            lingkar_kepala_cm: values.lingkar_kepala_cm,
                                            jarak_rumah_ke_sekolah: values.jarak_rumah_ke_sekolah,
                                            sebutkan_dalam_meter: values.sebutkan_dalam_meter,
                                            waktu_tempuh_ke_sekolah: values.waktu_tempuh_ke_sekolah
                                        }
                                    },
                                    callback: function(response) {
                                        if (response && !response.exc) {
                                            frappe.show_alert({ message: "Data berhasil disimpan!", indicator: "green" });
                                            d.hide();
                                        }
                                    }
                                });
                            }
                        });

                        d.set_value('tinggi_badan_cm', r.tinggi_badan_cm);
                        d.set_value('berat_badan_cm', r.berat_badan_cm);
                        d.set_value('lingkar_kepala_cm', r.lingkar_kepala_cm);
                        d.set_value('jarak_rumah_ke_sekolah', r.jarak_rumah_ke_sekolah);
                        d.set_value('sebutkan_dalam_meter', r.sebutkan_dalam_meter);
                        d.set_value('waktu_tempuh_ke_sekolah', r.waktu_tempuh_ke_sekolah);
                        d.show();
                    });
            }
        },
        {
            // provide unique name for the button to make setup_action_handler work
            name: 'btn-make-payment',

            show(doc) {
                return '<i class="fa fa-user-plus"></i>';
            },
            get_label() {
                return '<i class="fa fa-user-plus"></i>';
            },
            get_description(doc) { return __('Registrasi') },
            action(doc) {
                frappe.db.get_doc('Peserta Didik', doc.name)
                    .then((r) => {
                        let d = new frappe.ui.Dialog({
                            title: `Penugasan`,
                            fields: [
                                {
                                    "fieldname": "pendaftaran_masuk_section",
                                    "label": "Pendaftaran Masuk",
                                    "fieldtype": "Section Break",
                                },
                                {
                                    "fieldname": "jenis_pendaftaran",
                                    "label": "Jenis pendaftaran",
                                    "fieldtype": "Select",
                                    "options": "Siswa baru\nPindahan\nKembali bersekolah",
                                },
                                {
                                    "fieldname": "no_induk_pdnis",
                                    "label": "No induk PD/NIS",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "tgl_masuk_sekolah",
                                    "label": "Tgl masuk sekolah",
                                    "fieldtype": "Date",
                                },
                                {
                                    "fieldname": "sekolah_asal",
                                    "label": "Sekolah asal",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "column_break_bqyl",
                                    "fieldtype": "Column Break",
                                },
                                {
                                    "fieldname": "apakah_pernah_paud_formal_tk",
                                    "label": "Apakah pernah PAUD formal (TK)",
                                    "fieldtype": "Select",
                                    "options": "Ya\nTidak",
                                },
                                {
                                    "fieldname": "apakah_pernah_paud_no_formal_kbtpasps",
                                    "label": "Apakah pernah PAUD no formal (KB/TPA/SPS)",
                                    "fieldtype": "Select",
                                    "options": "Ya\nTidak",
                                },
                                {
                                    "fieldname": "hobi",
                                    "label": "Hobi",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "cita_cita",
                                    "label": "Cita cita",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "pendaftaran_ujian_nasional_sekolah_dasar_section",
                                    "label": "Pendaftaran Ujian Nasional Sekolah Menengah",
                                    "fieldtype": "Section Break",
                                },
                                {
                                    "fieldname": "no_un",
                                    "label": "No peserta UN SMP/MTs",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "column_break_oaol",
                                    "label": "",
                                    "fieldtype": "Column Break",
                                },
                                {
                                    "fieldname": "no_ijazah",
                                    "label": "No seri ijazah UN SMP/MTs",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "column_break_njap",
                                    "label": "",
                                    "fieldtype": "Column Break",
                                },
                                {
                                    "fieldname": "no_skhun",
                                    "label": "No SKHUN UN SMP/MTs",
                                    "fieldtype": "Data",
                                },
                                {
                                    "fieldname": "diisi_saat_keluar_section",
                                    "label": "Diisi saat Keluar",
                                    "fieldtype": "Section Break",
                                    "linked_document_type": null
                                },
                                {
                                    "fieldname": "keluar_karena",
                                    "label": "Keluar karena",
                                    "fieldtype": "Select",
                                    "options": "\nMutasi\nDikerluarkan\nMengundurkan diri\nPutus sekolah\nWafat\nHilang",
                                },
                                {
                                    "fieldname": "tgl_keluar_sekolah",
                                    "label": "Tgl keluar sekolah",
                                    "fieldtype": "Date",
                                },
                                                {
                                    "fieldname": "keluar",
                                    "label": "Keluar",
                                    "fieldtype": "Check",
                                    "linked_document_type": null
                                },
                                {
                                    "fieldname": "column_break_tptj",
                                    "fieldtype": "Column Break",
                                },
                                                {
                                    "fieldname": "alasan",
                                    "label": "Alasan",
                                    "fieldtype": "Small Text",
                                },
                            ],
                            size: 'large',
                            primary_action_label: 'Submit',
                            primary_action(values) {
                                frappe.call({
                                    method: "frappe.client.set_value",
                                    args: {
                                        doctype: "Peserta Didik",
                                        name: doc.name,
                                        fieldname: {
                                            jenis_pendaftaran: values.jenis_pendaftaran,
                                            no_induk_pdnis: values.no_induk_pdnis,
                                            tgl_masuk_sekolah: values.tgl_masuk_sekolah,
                                            sekolah_asal: values.sekolah_asal,
                                            apakah_pernah_paud_formal_tk: values.apakah_pernah_paud_formal_tk,
                                            apakah_pernah_paud_no_formal_kbtpasps: values.apakah_pernah_paud_no_formal_kbtpasps,
                                            hobi: values.hobi,
                                            cita_cita: values.cita_cita,
                                            no_un: values.no_un,
                                            no_ijazah: values.no_ijazah,
                                            no_skhun: values.no_skhun,
                                            keluar_karena: values.keluar_karena,
                                            tgl_keluar_sekolah: values.tgl_keluar_sekolah,
                                            keluar: values.keluar,
                                            alasan: values.alasan
                                        }
                                    },
                                    callback: function(response) {
                                        if (response && !response.exc) {
                                            frappe.show_alert({ message: "Data berhasil disimpan!", indicator: "green" });
                                            d.hide();
                                        }
                                    }
                                });
                            }
                        });

                        d.set_value('jenis_pendaftaran', r.jenis_pendaftaran);
                        d.set_value('no_induk_pdnis', r.no_induk_pdnis);
                        d.set_value('tgl_masuk_sekolah', r.tgl_masuk_sekolah);
                        d.set_value('sekolah_asal', r.sekolah_asal);
                        d.set_value('apakah_pernah_paud_formal_tk', r.apakah_pernah_paud_formal_tk);
                        d.set_value('apakah_pernah_paud_no_formal_kbtpasps', r.apakah_pernah_paud_no_formal_kbtpasps);
                        d.set_value('hobi', r.hobi);
                        d.set_value('cita_cita', r.cita_cita);
                        d.set_value('no_un', r.no_un);
                        d.set_value('no_ijazah', r.no_ijazah);
                        d.set_value('no_skhun', r.no_skhun);
                        d.set_value('keluar_karena', r.keluar_karena);
                        d.set_value('tgl_keluar_sekolah', r.tgl_keluar_sekolah);
                        d.set_value('keluar', r.keluar);
                        d.set_value('alasan', r.alasan);
                        d.show();
                    })

            }
        },
    ]

};



// frappe/frappe/public/js/frappe/list/list_view.js
frappe.views.ListView = class extends frappe.views.ListView {

    get_meta_html(doc) {
        let html = "";

        let settings_button = null;

        // check if the button property is an array or object
        if(Array.isArray(this.settings.button)) {
            // we have more than one button

            settings_button = '';
            for(const button of this.settings.button) {

                // make sure you have a unique name for each button,
                // otherwise it won't work
                // TODO make sure each name is unique, now it only checks if name exists
                if(!button.name) {
                    frappe.throw("Button needs a unique 'name' when using multiple buttons.");
                }

                if(button && button.show(doc)) {

                    settings_button += `
                        <span class="list-actions">
                            <button class="btn btn-action btn-default btn-xs"
                                data-name="${doc.name}" data-idx="${doc._idx}" data-action="${button.name}"
                                title="${button.get_description(doc)}">
                                ${button.get_label(doc)}
                            </button>
                        </span>
                    `;
                }

            }

        } else {
            // business as usual
            if (this.settings.button && this.settings.button.show(doc)) {
                settings_button = `
                    <span class="list-actions">
                        <button class="btn btn-action btn-default btn-xs"
                            data-name="${doc.name}" data-idx="${doc._idx}"
                            title="${this.settings.button.get_description(doc)}">
                            ${this.settings.button.get_label(doc)}
                        </button>
                    </span>
                `;

            }
        }


        const modified = comment_when(doc.modified, true);

        let assigned_to = `<div class="list-assignments">
            <span class="avatar avatar-small">
            <span class="avatar-empty"></span>
        </div>`;

        let assigned_users = JSON.parse(doc._assign || "[]");
        if (assigned_users.length) {
            assigned_to = `<div class="list-assignments">
                    ${frappe.avatar_group(assigned_users, 3, { filterable: true })[0].outerHTML}
                </div>`;
        }

        const comment_count = `<span class="comment-count d-flex align-items-center">
            ${frappe.utils.icon("es-line-chat-alt")}
            ${doc._comment_count > 99 ? "99+" : doc._comment_count || 0}
        </span>`;

        // html += `
        //     <div class="level-item list-row-activity hidden-xs">
        //         <div class="hidden-md hidden-xs">
        //             ${settings_button || assigned_to}
        //         </div>
        //         ${modified}
        //         ${comment_count}
        //     </div>
        //     <div class="level-item visible-xs text-right">
        //         ${this.get_indicator_dot(doc)}
        //     </div>
        // `;

		html += `
			<div class="level-item list-row-activity hidden-xs">
				<div class="hidden-md hidden-xs">
					${settings_button || assigned_to}
				</div>
				<span class="modified">${modified}</span>
				${comment_count || ""}
				${comment_count ? '<span class="mx-2">·</span>' : ""}
				<span class="list-row-like hidden-xs style="margin-bottom: 1px;">
					${this.get_like_html(doc)}
				</span>
			</div>
			<div class="level-item visible-xs text-right">
				${this.get_indicator_html(doc)}
			</div>
		`;

        return html;
    }

    setup_action_handler() {
        this.$result.on("click", ".btn-action", (e) => {
            const $button = $(e.currentTarget);
            const doc = this.data[$button.attr("data-idx")];

            // get the name of button
            const btnName = $button.attr('data-action');

            // again, check if array
            if(Array.isArray(this.settings.button)) {

                // find the button action
                const button = this.settings.button.find(b => b.name == btnName);
                button.action(doc);

            } else {
                this.settings.button.action(doc);
            }
            e.stopPropagation();
            return false;
        });
    }
}

