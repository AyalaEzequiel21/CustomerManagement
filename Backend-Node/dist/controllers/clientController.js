"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.getAllClientsWithCategory = exports.getAllClientsWithName = exports.getAllInactiveClients = exports.getAllClients = exports.updateClient = exports.registerClient = void 0;
const clientService = __importStar(require("../services/clientService"));
/////////////////////////
// CLIENT CONTROLLER
///////////////////////
const registerClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientFromRequest = req.body; // GET THE CLIENT TO CREATE FROM REQUEST
    try {
        const newClient = yield clientService.createClient(clientFromRequest); // CREATE THE NEW CLIENT WITH AUTHSERVICE 
        res.status(201).json({ ok: true, data: newClient }); // RETURN STATUS 200 AND THE NEW CLIENT IN THE DATA
    }
    catch (error) {
        next(error);
    }
});
exports.registerClient = registerClient;
const updateClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = req.body; // GET THE CLIENT TO UPDATE FROM REQUEST
    try {
        const clientUpdated = yield clientService.updateClient(client); // UPDATE THE CLIENT WITH AUTHSERVICE
        res.status(200).json({ ok: true, data: clientUpdated }); // RETURN STATUS 200 AND THE CLIENT UPDATED
    }
    catch (error) {
        next(error);
    }
});
exports.updateClient = updateClient;
const getAllClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inDelivery = req.filterDelivery; // CHECK IF THE FILTER IN_DELIVERY IS ACTIVE
    try {
        const clients = yield clientService.getAllClients(inDelivery); // GET ALL CLIENTS AND VALIDATE WHO REQUESTS IT
        res.status(200).json({ ok: true, data: clients }); // RETURN STATUS 200 AND THE DATA
    }
    catch (error) {
        next(error);
    }
});
exports.getAllClients = getAllClients;
const getAllInactiveClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inactiveClients = yield clientService.getClientsInactives(); // GET ALL INACTIVE CLIENTS AND RETUN STATSU 200 AND THE CLIENTS
        res.status(200).json({ ok: true, data: inactiveClients }); // RETURN STATUS 200 AND THE CLIENTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllInactiveClients = getAllInactiveClients;
const getAllClientsWithName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name; // GET THE NAME FROM THE PARAMS
    try {
        const clients = yield clientService.getClientsByName(name); // GET ALL CLIENTS THAT IN HIS NAME CONTAINS "NAME"
        res.status(200).json({ ok: true, data: clients }); // RETURN STATUS 200 AND THE CLIENTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllClientsWithName = getAllClientsWithName;
const getAllClientsWithCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.category; // GET THE CATEGORY FROM THE PARAMS
    try {
        const clients = yield clientService.getClientsByCategory(category); // GET ALL CLIENTS WITH THE SAME CATEGORY
        res.status(200).json({ ok: true, data: clients }); // RETURN STATUS 200 AND THE CLIENTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllClientsWithCategory = getAllClientsWithCategory;
const deleteClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.clientId; // GET THE CLIENT ID FROM THE PARAMS
    try {
        yield clientService.deleteClientById(clientId); // DELETE THE CLIENT WITH CLIENTSERVICE
        res.status(204).json({ ok: true });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteClient = deleteClient;
