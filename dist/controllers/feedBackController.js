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
exports.getFeedbacks = exports.postFeedback = void 0;
const feedBack_1 = require("../models/feedBack");
const postFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackData = {
        roomId: req.body.roomId,
        rating: req.body.rating,
        comment: req.body.comment,
    };
    try {
        const newFeedback = yield (0, feedBack_1.createFeedback)(feedbackData);
        res.status(201).json(newFeedback);
    }
    catch (error) {
        res.status(500).json({ error: 'There was an error processing your request' });
    }
});
exports.postFeedback = postFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedbacks = yield (0, feedBack_1.getAllFeedbacks)();
        res.status(200).json(feedbacks);
    }
    catch (error) {
        res.status(500).json({ error: 'There was an error processing your request' });
    }
});
exports.getFeedbacks = getFeedbacks;
