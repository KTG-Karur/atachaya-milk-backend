'use strict';

module.exports = {

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
  emp.employee_code "employeeCode", emp.bank_name "bankName", emp.ifsc_code "ifscCode",
  emp.branch_name "branchName", emp.center_id "centerId",c.center_name "centerName",
  emp.is_active "isActive",
  emp.created_on "createdOn", emp.user_name "userName", emp.password
  FROM employee emp
  left join center c on c.center_id = emp.center_id @param1`,

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

  getPaymentEntryCheck: `SELECT payment_entry_id "paymentEntryId",supplier_id "supplierId", advance_amt "advanceAmt" FROM payment_entry @param1`,

  getPaymentHistroyCheck: `SELECT SUM(ph.advance_amount) as advanceAmount, pe.payment_entry_id "paymentEntryId" FROM payment_history ph
  left join payment_entry pe on pe.supplier_id = ph.supplier_id @param1`,

  getProduct: `SELECT product_id "productId", product_name "productName", amount, is_active "isActive",
  created_on "createdOn"
  FROM product @param1`,

  getPurchase: `SELECT p.purchase_id "purchaseId", p.product_id "productId", p2.product_name "productName",
  p.qty, p.amount, p.transport_charge "transportCharge",p.supplier_id "supplierId",s.supplier_name "supplierName", 
  p.is_active "isActive", p.created_on "createdOn"
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

  getColor: `SELECT color_id "colorId", color_name "colorName", is_active "isActive", created_on "createdOn"
  FROM color @param1`,

  getPurchaseDetails: `SELECT p.purchase_id "purchaseId", p.product_id "productId", p.qty, p.amount,
  p.transport_charge "transportCharge",p.paid_amount "paidAmount",
  p.is_active "isActive", p.created_on "createdOn", p.updated_on "updatedOn",
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
