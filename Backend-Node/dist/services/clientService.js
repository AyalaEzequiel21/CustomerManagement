"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClientById = exports.getClientsByCategory = exports.getClientsByName = exports.getClientsInactives = exports.updateClient = exports.createClient = exports.getAllClients = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ECategory_1 = require("../enums/ECategory");
const customErrors_1 = require("../errors/customErrors");
const errorMessages_1 = require("../errors/errorMessages");
const errorsPitcher_1 = require("../errors/errorsPitcher");
const client_1 = __importDefault(require("../models/client"));
const existingChecker_1 = require("../utils/existingChecker");
/////////////////////////
// CLIENT SERVICE
///////////////////////
const getAllClients = (inDelivery) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield client_1.default.find({ is_active: true }); // GET ALL ACTIVE CLIENTS
        if ((0, existingChecker_1.isEmptyList)(clients)) { // IF THE CLIENTS IS EMPTY RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        if (inDelivery) { // IF INDELIVERY IS TRUE RETURN ONLY THE CLIENTS WITH IN_DELIVERY : TRUE 
            return clients.filter(client => client.in_delivery);
        }
        return clients; // ELSE RETURN ALL ACTIVES CLIENTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getAllClients = getAllClients;
const createClient = (newClient) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, phone, category, in_delivery } = newClient;
    try {
        if (yield (0, existingChecker_1.existsEntity)(client_1.default, "fullname", fullname)) { // IF FULLNAME HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
            throw new customErrors_1.ResourceAlreadyRegisteredError(errorMessages_1.ClientAlreadyRegistered);
        }
        if (yield (0, existingChecker_1.existsEntity)(client_1.default, "phone", phone)) {
            throw new customErrors_1.ResourceAlreadyRegisteredError(errorMessages_1.PhoneAlreadyRegistered); // IF PHONE HAS ALREADY BEEN REGISTERED RUN AN EXCEPTION
        }
        const client = yield client_1.default.create({
            fullname: fullname,
            phone: phone,
            category: category,
            in_delivery: in_delivery
        });
        if (!client) { // IF CANNOT SAVE THE CLIENT RUN AN EXCEPTION
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        return client; // ELSE RETURN THE CLIENT
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.createClient = createClient;
const updateClient = (client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientSaved = yield client_1.default.findById(client._id); // GET THE CLIENT SAVED
        if (!clientSaved) { // IF NOT EXISTS THE CLIENT RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        clientSaved.fullname = client.fullname; // ELSE UPDATE THE CLIENT
        clientSaved.phone = client.phone;
        if (client.balance !== undefined)
            clientSaved.balance = client.balance;
        if (client.payments !== undefined)
            clientSaved.payments = client.payments.map(payment => new mongoose_1.default.Types.ObjectId(payment));
        if (client.sales !== undefined)
            clientSaved.sales = client.sales.map(sale => new mongoose_1.default.Types.ObjectId(sale));
        clientSaved.category = client.category;
        clientSaved.in_delivery = client.in_delivery;
        clientSaved.is_active = client.is_active;
        const clientUpdated = yield clientSaved.save(); // SAVE THE UPDATE AND RETURN 
        if (!clientUpdated) {
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        return clientUpdated;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.updateClient = updateClient;
const getClientsInactives = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientsInactive = yield client_1.default.find({ is_active: false }); // GET ALL CLIENTS WITH IS_ACTIVE: FALSE      
        if ((0, existingChecker_1.isEmptyList)(clientsInactive)) { // IF THE RESPONSE HAVE NOT CLIENTS RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        return clientsInactive; // RETURN ALL INACTIVES CLIENT 
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getClientsInactives = getClientsInactives;
const getClientsByName = (clientName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientsFound = yield client_1.default.find({ fullname: { $regex: clientName, $options: 'i' }, is_active: true }); // GET ALL CLIENTS WITH FULLANME CONTAINS CLIENTNAME
        if ((0, existingChecker_1.isEmptyList)(clientsFound)) { // IF CLIENTSFOUND IS EMPTY RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        return clientsFound; // RETURN THE CLIENTS FOUND
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getClientsByName = getClientsByName;
const getClientsByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    if (Object.values(ECategory_1.ECategory).some((enumCategory) => enumCategory === category)) { // CHECK IF CATEGORY IS VALID
        try {
            const clientsFound = yield client_1.default.find({ category: category, is_active: true }); // GET ALL CLIENTS WITH THE SAME CATEGORY AND ACTIVE
            if ((0, existingChecker_1.isEmptyList)(clientsFound)) { // IF CLIENTSFOUND IS EMPTY RUN AN EXCEPTION
                throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
            }
            return clientsFound; // RETURNS THE CLIENTS FOUND
        }
        catch (error) {
            (0, errorsPitcher_1.errorsPitcher)(error);
        }
    }
    throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
});
exports.getClientsByCategory = getClientsByCategory;
const deleteClientById = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientSaved = yield client_1.default.findById(clientId).exec(); // GET THE CLIENT BY THE ID
        if (!clientSaved || !clientSaved.is_active) { // IF NOT EXISTS THE CLIENT RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ClientNotFound);
        }
        clientSaved.is_active = false; // ELSE CHENGE THE STATUS TO INACTIVE
        clientSaved.save(); // SAVE THE CLIENT INACTIVE
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.deleteClientById = deleteClientById;
