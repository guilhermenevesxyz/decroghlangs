var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var get_username = function () {
    return document.getElementById("form_ghusername").value;
};
var get_repositories = function (username) { return __awaiter(_this, void 0, void 0, function () {
    var repositories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://api.github.com/users/" + username + "/repos")];
            case 1:
                repositories = _a.sent();
                return [4 /*yield*/, repositories.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var get_languages = function (repository) { return __awaiter(_this, void 0, void 0, function () {
    var languages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(repository.languages_url)];
            case 1:
                languages = _a.sent();
                return [4 /*yield*/, languages.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var get_languages_bytes = function () { return __awaiter(_this, void 0, void 0, function () {
    var repositories, languages_bytes, total_bytes_of_code, _i, repositories_1, repository, languages, _a, _b, _c, name_1, written_bytes;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, get_repositories(get_username())];
            case 1:
                repositories = _d.sent();
                languages_bytes = new Map();
                total_bytes_of_code = 0;
                _i = 0, repositories_1 = repositories;
                _d.label = 2;
            case 2:
                if (!(_i < repositories_1.length)) return [3 /*break*/, 5];
                repository = repositories_1[_i];
                return [4 /*yield*/, get_languages(repository)];
            case 3:
                languages = _d.sent();
                for (_a = 0, _b = Object.entries(languages); _a < _b.length; _a++) {
                    _c = _b[_a], name_1 = _c[0], written_bytes = _c[1];
                    total_bytes_of_code += written_bytes;
                    if (languages_bytes.has(name_1)) {
                        languages_bytes.set(name_1, languages_bytes.get(name_1) + written_bytes);
                        continue;
                    }
                    languages_bytes.set(name_1, written_bytes);
                }
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, [languages_bytes, total_bytes_of_code]];
        }
    });
}); };
var get_languages_percentage = function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, languages_bytes, total_bytes_of_code, languages_percentage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, get_languages_bytes()];
            case 1:
                _a = _b.sent(), languages_bytes = _a[0], total_bytes_of_code = _a[1];
                languages_percentage = new Map();
                languages_bytes.forEach(function (written_bytes, language) {
                    /*
                        cross-multiplication
            
                        total_bytes_of_code ------------------- 100%
                        written_bytes ------------------------- x%
                        
                        x = 100 * written_bytes / total_bytes_of_code
                    */
                    var current_language_percentage = 100 * written_bytes / total_bytes_of_code;
                    current_language_percentage = Math.round(current_language_percentage);
                    languages_percentage.set(language, current_language_percentage);
                });
                return [2 /*return*/, languages_percentage];
        }
    });
}); };
var update_chart = function () { return __awaiter(_this, void 0, void 0, function () {
    var chart, languages_percentage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chart = document.getElementById("toplangschart");
                chart.innerHTML = "Loading results...";
                return [4 /*yield*/, get_languages_percentage()];
            case 1:
                languages_percentage = _a.sent();
                chart.innerHTML = "";
                languages_percentage.forEach(function (percentage, language) {
                    chart.innerHTML += "[";
                    for (var i = 0; i < 10; ++i) {
                        chart.innerHTML += Math.round(percentage / 10) >= i ? "#" : "-";
                    }
                    chart.innerHTML += "] " + percentage + "% " + language + "<br>";
                });
                return [2 /*return*/, false];
        }
    });
}); };
window.onload = function () {
    document.getElementById("form_container").onsubmit = function (event) {
        event.preventDefault();
        update_chart();
    };
};
