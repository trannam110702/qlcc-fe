export const formatCurrency = function (amount) {
  amount = String(amount).replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, "$1,");
  return amount;
};
