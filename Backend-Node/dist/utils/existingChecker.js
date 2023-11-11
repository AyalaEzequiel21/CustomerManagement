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
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsEntity = exports.isEmptyList = void 0;
// function to validate if a list is not empty
const isEmptyList = (value) => {
    if (Array.isArray(value) || typeof value === 'string') {
        return value.length === 0;
    }
    if (value instanceof Map || value instanceof Set) {
        return value.size === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return value == null;
};
exports.isEmptyList = isEmptyList;
const existsEntity = (model, prop, value) => __awaiter(void 0, void 0, void 0, function* () {
    let response = false;
    const query = {};
    query[prop] = value;
    const entity = yield model.exists(query);
    if (entity) {
        response = true;
    }
    return response;
});
exports.existsEntity = existsEntity;
