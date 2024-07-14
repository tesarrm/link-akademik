frappe.ui.form.on("Pembayaran", {
  refresh: function(frm) {
      frm.add_custom_button(__('Select All Rombel'), function() {
          frappe.call({
              method: "akademik.akademik.doctype.pembayaran.get_all_rombels",
              callback: function(r) {
                  if(r.message) {
                      console.log("Received rombels: ", r.message);
                      let all_rombels = r.message.map(function(rombel) {
                          return { "rombel": rombel.name };
                      });
                      console.log("Setting value for rombel: ", all_rombels);
                      frm.set_value('rombel', all_rombels);
                  }
              },
              error: function(error) {
                  console.error("Error fetching rombels: ", error);
                  frappe.msgprint(__('Failed to fetch Rombels. Please check the server logs for more details.'));
              }
          });
      });
  }
});
