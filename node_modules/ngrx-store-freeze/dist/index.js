"use strict";
var deepFreeze = require("deep-freeze-strict");
/**
 * Middleware that prevents state from being mutated anywhere in the app.
 */
function storeFreeze(reducer) {
    return function (state, action) {
        if (state === void 0) { state = {}; }
        deepFreeze(state);
        // guard against trying to freeze null or undefined types
        if (action.payload) {
            deepFreeze(action.payload);
        }
        var nextState;
        try {
            nextState = reducer(state, action);
        }
        catch (error) {
            console.error('State mutation is prohibited inside of reducers.');
            throw error;
        }
        deepFreeze(nextState);
        return nextState;
    };
}
exports.storeFreeze = storeFreeze;
