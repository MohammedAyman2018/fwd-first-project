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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const sharp_1 = __importDefault(require("sharp"));
const request = (0, supertest_1.default)(index_1.default);
describe('Test query validation', () => {
    it('Should give status 400 if no fileName query', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?width=300&height=200');
        expect(response.status).toBe(400);
        expect(response.body).toBe('please provide fileName query');
    }));
    it('Should give status 400 if no width query', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?fileName=fjord&height=200');
        expect(response.status).toBe(400);
        expect(response.body).toBe('please provide width query');
    }));
    it('Should give status 400 if no height query', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?fileName=fjord&width=200');
        expect(response.status).toBe(400);
        expect(response.body).toBe('please provide height query');
    }));
    it('Should give status 400 if width query is not a number ', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?fileName=fjord&width=2fd0&height=200');
        expect(response.status).toBe(400);
        expect(response.body).toBe('please provide valid width query');
    }));
    it('Should give status 400 if height query is not a number.', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?fileName=fjord&width=200&height=2fd0');
        expect(response.status).toBe(400);
        expect(response.body).toBe('please provide valid height query');
    }));
});
describe('Test the logic', () => {
    it('Should return 500 status with message image not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?fileName=anything&width=300&height=200');
        expect(response.status).toBe(500);
        expect(response.body).toBe("Can't find this image.");
    }));
    it('Api Should return a buffer image of 300 width and 600 height', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?fileName=fjord.jpg&width=300&height=600');
        expect(response.body).toBeInstanceOf(Buffer);
        expect(response.type).toBe('image/png');
        const metadata = yield (0, sharp_1.default)(response.body).metadata();
        expect(metadata.width).toBe(300);
        expect(metadata.height).toBe(600);
        expect(response.status).toBe(200);
    }));
});
