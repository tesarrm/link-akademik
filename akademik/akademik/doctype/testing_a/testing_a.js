// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

// frappe.ui.form.on('Testing A', {
//     refresh: function(frm) {
//         frappe.realtime.on('testing_a_update', function(data) {
//             console.log('Data from server:', data);
//         });
//         console.log("h")
//         // Menambahkan event listener untuk menangkap pesan
//         frappe.realtime.on('msgprint', function(message) {
//             console.log("halo")
//             // Mengecek jika pesan berisi data yang kita kirim
//             if (message.title === "Document Data") {
//                 // Menampilkan data di console
//                 console.log("Document Data:", message.message);
//                 console.log("Halo");
//             }
//         });
//     }
// });

// frappe.ui.form.on('Testing A', {
//     refresh: function(frm) {
//         // Subscribing to the real-time event
//         frappe.realtime.on('testing_event', (data) => {
//             console.log("Real-time message from server:", data);
//         });
//     }
// });