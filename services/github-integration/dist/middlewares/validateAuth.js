"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthCode = void 0;
const express_validator_1 = require("express-validator");
exports.validateAuthCode = [
    (0, express_validator_1.check)('code')
        .exists().withMessage('Authorization code is required')
        .isString().withMessage('Authorization code must be a string')
        .notEmpty().withMessage('Authorization code cannot be empty'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Validation failed',
                details: errors.array().map((err) => {
                    const e = err;
                    return {
                        field: e.param,
                        message: e.msg
                    };
                })
            });
            return;
        }
        next();
    }
];
