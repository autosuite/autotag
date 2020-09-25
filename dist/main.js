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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var github = __importStar(require("@actions/github"));
var inc_1 = __importDefault(require("semver/functions/inc"));
var lte_1 = __importDefault(require("semver/functions/lte"));
var autolib = __importStar(require("@teaminkling/autolib"));
/**
 * Use the GitHub API to create a milestone.
 *
 * Note that we are assuming creating a milestone when it already exists is not a problem.
 *
 * @param milestone The milestone name to create.
 * @param owner The owner of the repo (account name).
 * @param repo The repo name.
 */
function createMilestone(milestone, owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core.info("Milestone we want to create will be: " + milestone + ".");
                    token = core.getInput("github-token");
                    return [4 /*yield*/, new github.GitHub(token).issues.createMilestone({
                            "owner": owner, "repo": repo, "title": milestone,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runAction() {
    return __awaiter(this, void 0, void 0, function () {
        var ownerRepo, owner, repo, latestStableVersion, nextPatchVersion, nextMinorVersion, nextMajorVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ownerRepo = core.getInput('github-repository');
                    owner = ownerRepo.split("/")[0];
                    repo = ownerRepo.split("/")[1];
                    if (!owner || !repo) {
                        core.setFailed("github-repository was not set as a correct input! We got: " + ownerRepo);
                    }
                    return [4 /*yield*/, autolib.findLatestVersionFromGitTags(true)];
                case 1:
                    latestStableVersion = _a.sent();
                    core.info("Latest stable version found is: [" + latestStableVersion + "].");
                    if (!!lte_1.default(latestStableVersion, "0.0.1")) return [3 /*break*/, 4];
                    /* Ensure the current latest tagged version is correctly milestoned. */
                    return [4 /*yield*/, createMilestone(latestStableVersion, owner, repo)];
                case 2:
                    /* Ensure the current latest tagged version is correctly milestoned. */
                    _a.sent();
                    nextPatchVersion = inc_1.default(latestStableVersion, "patch");
                    return [4 /*yield*/, createMilestone(nextPatchVersion, owner, repo)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    nextMinorVersion = inc_1.default(latestStableVersion, "minor");
                    return [4 /*yield*/, createMilestone(nextMinorVersion, owner, repo)];
                case 5:
                    _a.sent();
                    nextMajorVersion = inc_1.default(latestStableVersion, "major");
                    return [4 /*yield*/, createMilestone(nextMajorVersion, owner, repo)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var actionRunner = runAction();
/* Handle action promise. */
actionRunner.then(function () { });
