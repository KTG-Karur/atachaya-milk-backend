'use strict';

module.exports = {

  getUser: `SELECT u.user_id "userId", u.user_name "userName", u.password, u.token, u.employee_id "employeeId",e.employee_name "employeeName",
  r.role_id "roleId",r.role_name "roleName"
  FROM users u
  left join employee e on u.employee_id = e.employee_id
  left join role r on r.role_id = e.role_id @param1`,

  getRole: `SELECT role_id "roleId", role_name "roleName", is_active "isActive", created_on "createdOn"
  FROM role @param1 ORDER BY role_id ASC`,

  getRolePermission: `SELECT rp.role_permission_id AS "rolePermissionId",rp.role_id "roleId",r.role_name "roleName",
  rp.access_ids "accessPermissionIds"
  FROM role_permission rp
  LEFT JOIN role r ON r.role_id = rp.role_id @param1
  group by rp.role_permission_id,r.role_id `,

  getPages: `SELECT p.page_id AS "pageId", p.page_name AS "pageName", p.title, p.icons, p.path, p.is_active AS "isActive", p.parent_id "parentId",
  p.created_on AS "createdOn", p.access_ids AS "accessIds", CONCAT('[', GROUP_CONCAT(JSON_OBJECT('accessId', a.access_id, 'accessName', a.access_name)), ']') AS access
  FROM pages p
  LEFT JOIN access a ON FIND_IN_SET(a.access_id, p.access_ids) > 0 @param1
  GROUP BY p.page_id`,

  getCenter: `SELECT center_id "centerId", center_name "centerName", center_code "centerCode", feed_commission "feedCommission",
  commission_amt "commissionAmt", is_active "isActive", created_on "createdOn"
  FROM center @param1`,

  getCenterCode: `SELECT count FROM center @param1`,

  getCustomer: `SELECT c.customer_id "customerId", c.customer_name "customerName", c.contact_no "contactNo",
  c.customer_code "customerCode", c.bank_name "bankName", c.ifsc, c.branch_name "branchName",c.account_no "accountNo",
  c.center_id "centerId",c2.center_name "centerName",
  c.is_active "isActive", c.created_on "createdOn", c.updated_on "updatedOn"
  FROM customer c
  left join center c2 on c2.center_id =c.center_id @param1 ORDER BY c.customer_id ASC`,

  getCustomerCode: `SELECT count FROM customer @param1`,

  getEmployee: `SELECT emp.employee_id "employeeId", emp.employee_name "employeeName", emp.contact_no "contactNo",
  emp.employee_code "employeeCode", emp.bank_name "bankName", emp.ifsc_code "ifscCode",emp.account_no "accountNo",
  emp.branch_name "branchName", emp.center_id "centerId",c.center_name "centerName",
  emp.is_active "isActive",emp.role_id "roleId",r.role_name "roleName",
  emp.created_on "createdOn"
  FROM employee emp
  left join center c on c.center_id = emp.center_id
  left join role r on r.role_id = emp.role_id
   @param1`,

  getEmployeeCode: `SELECT count FROM employee @param1`,

  getPaymentMode: `SELECT payment_mode_id "paymentModeId", mode_name "modeName", is_active "isActive",
  created_on "createdOn" FROM payment_mode @param1`,

  getExpensive: `SELECT e.expensive_id "expensiveId", e.name, e.description,
  e.tax, e.amount, e.billing_date "billingDate",
  e.purchased_by "purchasedById",e2.employee_name "purchasedBy", e.mode_payment_id "modePaymentId", pm.mode_name "modeName", e.is_active "isActive", e.created_on "createdOn"
  FROM expensive e
  left join employee e2 on e2.employee_id = e.purchased_by 
  left join payment_mode pm on pm.payment_mode_id = e.mode_payment_id @param1`,

  getFeedEntry: `SELECT fe.feed_entry_id "feedEntryId", fe.feed_entry_date "feedEntryDate", fe.amount,
  fe.center_id "centerId",c.center_name "centerName",
  fe.is_active "isActive", fe.created_on "createdOn", fe.updated_on "updatedOn"
  FROM feed_entry fe
  left join center c on c.center_id = fe.center_id  @param1`,

  getPaymentHistory: `SELECT payment_history_id "paymentHistoryId", paid_amount "paidAmount", balance_amount "balanceAmount",
  advance_amount "advanceAmount", payment_date "paymentDate", reason, is_active "isActive", created_on "createdOn"
  FROM payment_history @param1`,

  getPaymentEntry: `SELECT pe.payment_entry_id "paymentEntryId", pe.supplier_id "supplierId",s.supplier_name "supplierName", 
  pe.pending_amt "pendingAmt",pe.paid_amt "paidAmt", pe.advance_amt "advanceAmt", pe.last_pay_date "lastPayDate",
  pe.is_advance "isAdvance", pe.is_active "isActive", pe.created_on "createdOn"
  FROM payment_entry pe
  left join supplier s on s.supplier_id = pe.supplier_id @param1`,

  getNewPaymentEntry: `SELECT pe.payment_entry_id "paymentEntryId", pe.supplier_id "supplierId",s.supplier_name "supplierName", 
  pe.pending_amt "pendingAmt",pe.paid_amt "paidAmt", pe.advance_amt "advanceAmt", pe.last_pay_date "lastPayDate",
  pe.is_active "isActive", pe.created_on "createdOn"
  FROM payment_entry pe
  left join supplier s on s.supplier_id = pe.supplier_id @param1`,

  getPaymentEntryCheck: `SELECT payment_entry_id "paymentEntryId",supplier_id "supplierId", advance_amt "advanceAmt" FROM payment_entry @param1`,

  getPaymentHistroyCheck: `SELECT SUM(ph.advance_amount) as advanceAmount, pe.payment_entry_id "paymentEntryId" FROM payment_history ph
  left join payment_entry pe on pe.supplier_id = ph.supplier_id @param1`,

  getProduct: `SELECT product_id "productId", product_name "productName", amount, is_active "isActive",
  created_on "createdOn"
  FROM product @param1`,

  getPurchase: `SELECT p.purchase_id "purchaseId", p.product_id "productId", p2.product_name "productName",p.purchase_date "purchaseDate",
  p.qty, p.amount, p.transport_charge "transportCharge",p.supplier_id "supplierId",s.supplier_name "supplierName", 
  p.is_active "isActive", p.created_on "createdOn",p.payment_history_id "paymentHistoryId"
  FROM purchase p
  left join product p2 on p2.product_id = p.product_id 
  left join supplier s on s.supplier_id = p.supplier_id @param1`,

  getShift: `SELECT shift_id "shiftId", shift_name "shiftName", short_name "shortName",
  is_active "isActive", created_on "createdOn"
  FROM shift @param1`,

  getSupplier: `SELECT supplier_id "supplierId", supplier_name "supplierName", contact_no "contactNo",
  supplier_code "supplierCode", branch_name "branchName", account_no "accountNo", ifsc_code "ifscCode",
  is_active "isActive", created_on "createdOn", bank_name "bankName"
  FROM supplier @param1`,

  getSupplierCode: `SELECT count FROM supplier @param1`,

  getAdvance: `SELECT ph.payment_history_id "paymentHistoryId", ph.advance_amount "advanceAmount",
  ph.payment_date "paymentDate", ph.reason, ph.supplier_id "supplierId",s.supplier_name "supplierName", ph.is_active "isActive", ph.created_on "createdOn"
  FROM payment_history ph
  left join supplier s on s.supplier_id = ph.supplier_id @param1`,

  getEntry: `SELECT e.entry_id "entryId", e.center_id "centerId",c.center_name "centerName", 
  e.from_date "fromDate", e.to_date "toDate",
  e.is_active "isActive", e.created_on "createdOn", e.updated_on "updatedOn"
  FROM entry e
  left join center c on c.center_id =e.center_id  @param1`,

  getEntryDetails: `SELECT ed.entry_details_id "entryDetailsId", ed.entry_date "entryDate", ed.shift_id "shiftId",s.shift_name "shiftName", 
  ed.customer_id "customerId", ed.qty, ed.fat, ed.snf, ed.rate, ed.amount,ed.entry_id "entryId",
  e.center_id "centerId",c.center_name "centerName",ed.is_active "isActive", ed.created_on "createdOn", ed.updated_on "updatedon"
  FROM entry_details ed
  left join shift s on s.shift_id = ed.shift_id 
  inner join entry e on e.entry_id = ed.entry_id 
  left join center c on c.center_id = e.center_id @param1`,

  getStockHub: `SELECT stock_hub_id "stockHubId", total_qty "totalQty", is_active "isActive" ,
  created_on "createdOn"
  FROM stock_hub @param1`,

  getHubCheck: `SELECT stock_hub_id "stockHubId", total_qty "totalQty"
  FROM stock_hub @param1`,

  getStockTransferHistory: `SELECT sth.stock_transfer_history_id "stockTransferHistoryId", sth.transfer_date "transferDate",
  sth.stock_qty "stockQty", sth.stock_details_id "stockDetailsId",sd.total_stock "centerTotalStock",
  sd.sale_stock "saleStock", sd.center_id "centerId", c.center_name "centerName",
  sth.is_active "isActive", sth.created_on "createdOn"
  FROM stock_transfer_history sth
  left join stock_details sd on sd.stock_details_id = sth.stock_details_id 
  left join center c on c.center_id = sd.center_id @param1`,

  getStockDetails: `SELECT sd.stock_details_id "stockDetailsId", sd.transfer_date "transferDate", sd.center_id "centerId",
  c.center_name "centerName", sd.total_stock "totalStock", sd.sale_stock "saleStock", sd.is_active "isActive", sd.created_on "createdOn",
  sd.updated_on "updatedOn", sd.stock_hub_id "stockHubId",sh.total_qty "hubTotalStock", sd.per_qty_amount "perQtyAmount"
  FROM stock_details sd
  left join center c on c.center_id = sd.center_id 
  left join stock_hub sh on sh.stock_hub_id = sd.stock_hub_id @param1`,

  getStockHub: `SELECT stock_hub_id "stockHubId", total_qty "totalQty", is_active "isActive" ,
  created_on "createdOn"
  FROM stock_hub @param1`,

  getCheckCenterStock: `SELECT stock_details_id "stockDetailsId", center_id "centerId"
  FROM stock_details @param1`,

  getCommissionSettings: `SELECT cs.commission_settings_id "commissionSettingsId", cs.commission_type_id "commissionTypeId",
  cs.amount, cs.is_active "isActive", cs.created_on "createdOn", cs.updated_on "updatedOn", ct.commission_type_name "commissionTypeName"
  FROM commission_settings cs
  left join commission_type ct on ct.commission_type_id = cs.commission_type_id @param1`,

  getCommissionType: `SELECT commission_type_id "commissionTypeId", commission_type_name "commissionTypeName",
  is_active "isActive", created_on "createdOn", updated_on "updatedOn"
  FROM commission_type @param1`,

  getSalary: `SELECT s.salary_id "salaryId", s.milk_commission "milkCommission",
  s.total_lit "totalLit", s.feed_commission "feedCommission", s.total_feed "totalFeed",
  s.salary_amount "salaryAmount", s.entry_date "entryDate", s.center_id "center",c.center_name "centerName",
  s.is_active "isActive", s.created_on "createdOn", s.updated_on "updatedOn"
  FROM salary s
  left join center c on c.center_id = s.center_id @param1`,

  getSalaryEntryDetails: `SELECT  sum(qty) as "totalLit", sum(amount) as "totalAmount"
  FROM entry_details @param1`,

  getTransportSettings: `SELECT transport_settings_id "transportSettingsId", per_km_price "perKmPrice",
  is_active "isActive", created_on "createdOn", updated_on "updatedOn"
  FROM transport_settings @param1`,

  getTransportDriver: `SELECT transport_driver_id "transportDriverId", driver_name "driverName", contact_no "contactNo",
  vechile_no "vechileNo", branch_name "branchName", ifsc, address, account_no "accountNo",
  bank_name "bankName", is_active "isActive", created_on "createdOn", updated_on "updatedOn"
  FROM transport_driver @param1`,

  getTransportEntry: `SELECT transport_entry_id "transportEntryId", driver_id "driverId", km, amount, deduction,
  deduction_reason "deductionReason", additional_amt "additionalAmt", additional_amt_reason "additionalAmtReason",
  penalty, penalty_reason "penaltyReason", total_amt "totalAmt", shift_id "shiftId",
  transport_issuse "transportIssuse", issuse_reason "issuseReason", alter_person_name "alterPersonName",
  alter_contact_no "alterContactNo"
  FROM transport_entry @param1`,

  getTankerSupplier: `SELECT tanker_supplier_id "tankerSupplierId", company_name "companyName",
  contact_person_name "contactPersonName", contact_no "contactNo", registration_no "registrationNo",
  gst_no "gstNo", bank_name "bankName", branch_name "branchName", ifsc, account_no "accountNo",
  is_active "isActive", created_on "createdOn", updated_on "updatedOn"
  FROM tanker_supplier @param1`,

  getTankerEntry: `SELECT te.tanker_entry_id "tankerEntryId", te.entry_date "entryDate", te.quantity, te.amount,
  te.tanker_supplier_id "tankerSupplierId",ts.company_name "companyName",ts.contact_person_name "contactPersonName",
  te.driver_name "driverName", te.driver_contact_no "driverContactNo", te.vehicle_no "vehicleNo",
  te.is_active "isActive", te.created_on "createdOn", te.updated_on "updatedOn"
  FROM tanker_entry te
  left join tanker_supplier ts on ts.tanker_supplier_id = te.tanker_supplier_id @param1`,

  getCustomerAdvance: `SELECT cd.customer_advance_id "customerAdvanceId", cd.total_amount "totalAmount",
  cd.paid_amount "paidAmount", cd.balance_amount "balanceAmount", 
  cd.customer_id "customerId",c2.customer_name "customerName",
  cd.center_id "centerId",c.center_name "centerName",
  cd.is_active "isActive", cd.created_on "createdOn", cd.updated_on "updatedOn"
  FROM customer_advance cd
  left join center c on c.center_id = cd.center_id 
  left join customer c2 on c2.customer_id = cd.customer_id @param1`,

  getCustomerAdvanceHistory: `SELECT cah.customer_advance_history_id "customerAdvanceHistoryId", cah.paid_amount "paidAmount",
  cah.balance_amount "balanceAmount", cah.advance_amount "advanceAmount", cah.payment_date "paymentDate", 
  cah.reason, cah.center_id "centerId",c.center_name "centerName",cah.customer_id "customerId",c2.customer_name "customerName",
  cah.is_active "isActive",cah.created_on "createdOn", cah.updated_on "updatedOn"
  FROM customer_advance_history cah
  left join center c on c.center_id = cah.center_id 
  left join customer c2 on c2.customer_id = cah.customer_id @param1`,

  getCustomerSalary: `SELECT cs.customer_salary_id "customerSalaryId", cs.center_id "centerId", cen.center_name "centerName",
  cs.customer_id "customerId",c.customer_name "customerName",
  cs.from_date "fromDate", cs.to_date "toDate", cs.total_liter "totalLiter", cs.amount, cs.advance,
  cs.feed_amount "feedAmount", cs.bonus, cs.pending_amount "pendingAmount", cs.total_amount "totalAmount",
  cs.is_paid "isPaid", cs.is_active "isActive", cs.created_on "createdOn", cs.updated_on "updatedOn"
  FROM customer_salary cs
  left join center cen on cen.center_id = cs.center_id 
  left join customer c on c.customer_id = cs.customer_id @param1`,

  getColor: `SELECT color_id "colorId", color_name "colorName", is_active "isActive", created_on "createdOn"
  FROM color @param1`,

  getPurchaseDetails: `SELECT p.purchase_id "purchaseId", p.product_id "productId", p.qty, p.amount,
  p.transport_charge "transportCharge",p.paid_amount "paidAmount",p.purchase_date "purchaseDate",
  p.is_active "isActive", p.created_on "createdOn", p.updated_on "updatedOn",p.payment_history_id "paymentHistoryId",
  p.supplier_id "supplierId",pe.pending_amt "pendingAmt",pe.advance_amt "advanceAmt"
  FROM purchase p
  left join payment_entry pe on pe.supplier_id = p.supplier_id @param1`,

  getDashboard: `SELECT
  COUNT(CASE WHEN appointment_date = CURRENT_DATE THEN 1 END) AS currentAppointmentCount,
  COUNT(CASE WHEN YEAR(created_on) = YEAR(CURRENT_DATE) THEN 1 END) AS estimateCount,
  COUNT(case when quotation_status_id  = '1' and MONTH(created_on) = MONTH(CURRENT_DATE) THEN 1 END) as "requestedCount",
  COUNT(case when quotation_status_id  = '3' and MONTH(created_on) = MONTH(CURRENT_DATE) THEN 1 END) as "CancelCount",
  COUNT(case when quotation_status_id = '2' and MONTH(created_on) = MONTH(CURRENT_DATE) THEN 1 END) as "convertedCount"
  FROM quotation`,

  getDashboardDetails: `SELECT q.quotation_id "quotationId", q.customer_id "customerId",c.customer_name "customerName",
  q.total_amount "totalAmount"
  FROM quotation q 
  left join customer c on c.customer_id = q.customer_id 
  ORDER BY q.total_amount DESC
  LIMIT 5`,

};
