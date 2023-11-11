"use strict";
//////////////////////////////
// ERRORS MESSAGES 
//////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conflict = exports.InternalServer = exports.CheckCredentials = exports.BadRequest = exports.NotAuthorized = exports.OrderNotFound = exports.SaleNotFound = exports.ReportNotFound = exports.PaymentNotFound = exports.ProductNotFound = exports.ProductAlreadyRegistered = exports.PhoneAlreadyRegistered = exports.ClientAlreadyRegistered = exports.ClientNotFound = exports.UserAlreadyRegistered = exports.UserNotFound = void 0;
// USER ////////////////
exports.UserNotFound = "User not found";
exports.UserAlreadyRegistered = "The email has already been registered";
// CLIENT ////////////////
exports.ClientNotFound = "Client not found";
exports.ClientAlreadyRegistered = "The client fullname has already been registered";
exports.PhoneAlreadyRegistered = "The client phone has already been registered";
// PRODUCT ///////////////
exports.ProductAlreadyRegistered = "The product name has already been registered";
exports.ProductNotFound = "Product not found";
// PAYMENT ///////////////
exports.PaymentNotFound = "Payment not found";
// REPORT //////////////
exports.ReportNotFound = "Report not found";
// SALE ///////////////
exports.SaleNotFound = "Sale not found";
// ORDER ///////////////
exports.OrderNotFound = "Order List not found";
// GENERAL ///////////////
exports.NotAuthorized = "User not authorized";
exports.BadRequest = "Some data is incorrect or missing";
exports.CheckCredentials = "Please check your credentials";
exports.InternalServer = "Internal Server Error";
exports.Conflict = "Ha ocurrido un problema inesperado";
