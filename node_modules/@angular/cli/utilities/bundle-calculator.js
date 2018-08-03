"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateSizes(budget, compilation) {
    const calculatorMap = {
        all: AllCalculator,
        allScript: AllScriptCalculator,
        any: AnyCalculator,
        anyScript: AnyScriptCalculator,
        bundle: BundleCalculator,
        initial: InitialCalculator,
    };
    const ctor = calculatorMap[budget.type];
    const calculator = new ctor(budget, compilation);
    return calculator.calculate();
}
exports.calculateSizes = calculateSizes;
class Calculator {
    constructor(budget, compilation) {
        this.budget = budget;
        this.compilation = compilation;
    }
}
exports.Calculator = Calculator;
/**
 * A named bundle.
 */
class BundleCalculator extends Calculator {
    calculate() {
        const size = this.compilation.chunks
            .filter(chunk => chunk.name === this.budget.name)
            .reduce((files, chunk) => [...files, ...chunk.files], [])
            .map((file) => this.compilation.assets[file].size())
            .reduce((total, size) => total + size, 0);
        return [{ size, label: this.budget.name }];
    }
}
/**
 * The sum of all initial chunks (marked as initial by webpack).
 */
class InitialCalculator extends Calculator {
    calculate() {
        const initialChunks = this.compilation.chunks.filter(chunk => chunk.isInitial);
        const size = initialChunks
            .reduce((files, chunk) => [...files, ...chunk.files], [])
            .map((file) => this.compilation.assets[file].size())
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'initial' }];
    }
}
/**
 * The sum of all the scripts portions.
 */
class AllScriptCalculator extends Calculator {
    calculate() {
        const size = Object.keys(this.compilation.assets)
            .filter(key => /\.js$/.test(key))
            .map(key => this.compilation.assets[key])
            .map(asset => asset.size())
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'total scripts' }];
    }
}
/**
 * All scripts and assets added together.
 */
class AllCalculator extends Calculator {
    calculate() {
        const size = Object.keys(this.compilation.assets)
            .map(key => this.compilation.assets[key].size())
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'total' }];
    }
}
/**
 * Any script, individually.
 */
class AnyScriptCalculator extends Calculator {
    calculate() {
        return Object.keys(this.compilation.assets)
            .filter(key => /\.js$/.test(key))
            .map(key => {
            const asset = this.compilation.assets[key];
            return {
                size: asset.size(),
                label: key
            };
        });
    }
}
/**
 * Any script or asset (images, css, etc).
 */
class AnyCalculator extends Calculator {
    calculate() {
        return Object.keys(this.compilation.assets)
            .map(key => {
            const asset = this.compilation.assets[key];
            return {
                size: asset.size(),
                label: key
            };
        });
    }
}
/**
 * Calculate the bytes given a string value.
 */
function calculateBytes(val, baseline, factor) {
    if (/^\d+$/.test(val)) {
        return parseFloat(val);
    }
    if (/^(\d+)%$/.test(val)) {
        return calculatePercentBytes(val, baseline, factor);
    }
    const multiplier = getMultiplier(val);
    const numberVal = parseFloat(val.replace(/((k|m|M|)b?)$/, ''));
    const baselineVal = baseline ? parseFloat(baseline.replace(/((k|m|M|)b?)$/, '')) : 0;
    const baselineMultiplier = baseline ? getMultiplier(baseline) : 1;
    const factorMultiplier = factor ? (factor === 'pos' ? 1 : -1) : 1;
    return numberVal * multiplier + baselineVal * baselineMultiplier * factorMultiplier;
}
exports.calculateBytes = calculateBytes;
function getMultiplier(val) {
    if (/^(\d+)b?$/.test(val)) {
        return 1;
    }
    else if (/^(\d+)kb$/.test(val)) {
        return 1000;
    }
    else if (/^(\d+)(m|M)b$/.test(val)) {
        return 1000 * 1000;
    }
}
function calculatePercentBytes(val, baseline, factor) {
    const baselineBytes = calculateBytes(baseline);
    const percentage = parseFloat(val.replace(/%/g, ''));
    return baselineBytes + baselineBytes * percentage / 100 * (factor === 'pos' ? 1 : -1);
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/utilities/bundle-calculator.js.map