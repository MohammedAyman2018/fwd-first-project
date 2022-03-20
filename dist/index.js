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
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const imageResizing_1 = __importDefault(require("./utilities/imageResizing"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/api/images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, width, height } = req.query;
    // Validate all queries are provided.
    if (!fileName)
        return res.status(400).json('please provide fileName query');
    if (!width)
        return res.status(400).json('please provide width query');
    if (isNaN(Number(width)))
        return res.status(400).json('please provide valid width query');
    if (!height)
        return res.status(400).json('please provide height query');
    if (isNaN(Number(height)))
        return res.status(400).json('please provide valid height query');
    // Get the required image.
    const imagesPath = path_1.default.join(__dirname, '..', 'images');
    const exactImagePath = path_1.default.join(imagesPath, fileName);
    try {
        fs_1.default.readFile(exactImagePath, (err, data) => {
            if (err)
                return res.status(500).json("Can't find this image.");
            (0, imageResizing_1.default)(data, String(fileName), Number(width), Number(height));
            return res.sendFile(path_1.default.join(__dirname, '..', 'thump', `${fileName}.png`));
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
}));
app.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
exports.default = app;
