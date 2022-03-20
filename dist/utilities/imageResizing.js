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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
function default_1(data, fileName, width, height) {
    fs_1.default.readFile(path_1.default.join(__dirname, '..', '..', 'thump', `${fileName}.png`), (err, data) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            throw err;
        const metadata = yield (0, sharp_1.default)(data).metadata();
        if (metadata.width === width && metadata.height === height)
            return;
        (0, sharp_1.default)(data)
            .resize(width, height)
            .toFile(path_1.default.join(__dirname, '..', '..', 'thump', `${fileName}.png`), (err) => {
            if (err)
                throw err;
        });
    }));
}
exports.default = default_1;
