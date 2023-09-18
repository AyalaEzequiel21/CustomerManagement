// ERROR - INCORRECT CREDENTIALS
export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

// ERROR - BAD REQUEST
export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}

// ERROR - RESOURCE NOT FOUND
export class ResourceNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ResourceNotFoundError';
    }
}

//  ERROR - RESOURCE HAS ALREADY BEEN REGISTERED
export class ResourceAlreadyRegisteredError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ResourceAlreadyRegisteredError';
    }
}

//  ERROR - INTERNAL SERVER 
export class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InternalServerError';
    }
}