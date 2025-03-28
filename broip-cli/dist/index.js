#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const MainMenu_1 = __importDefault(require("./components/MainMenu"));
const UserContext_1 = require("./utils/UserContext");
(0, ink_1.render)(react_1.default.createElement(UserContext_1.UserProvider, null,
    react_1.default.createElement(MainMenu_1.default, null)));
