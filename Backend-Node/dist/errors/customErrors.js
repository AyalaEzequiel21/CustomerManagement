"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ResourceAlreadyRegisteredError = exports.ResourceNotFoundError = exports.BadRequestError = exports.AuthenticationError = void 0;
// ERROR - INCORRECT CREDENTIALS
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
// ERROR - BAD REQUEST
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
// ERROR - RESOURCE NOT FOUND
class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResourceNotFoundError';
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
//  ERROR - RESOURCE HAS ALREADY BEEN REGISTERED
class ResourceAlreadyRegisteredError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResourceAlreadyRegisteredError';
    }
}
exports.ResourceAlreadyRegisteredError = ResourceAlreadyRegisteredError;
//  ERROR - INTERNAL SERVER 
class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
    }
}
exports.InternalServerError = InternalServerError;
