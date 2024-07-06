"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
function asyncHandler(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
}
