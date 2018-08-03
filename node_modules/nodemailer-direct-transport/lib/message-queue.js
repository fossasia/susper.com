'use strict';

// expose to the world
module.exports = function () {
    return new MessageQueue();
};

/**
 * Creates a queue object
 *
 * @constructor
 */
function MessageQueue() {
    this._instantQueue = [];
    this._sortedQueue = [];
    this._shiftTimer = null;
    this._callbackQueue = [];
}

/**
 * Sets a callback to be run when something comes available from the queue
 *
 * @param {Function} callback Callback function to run with queue element as an argument
 */
MessageQueue.prototype.get = function (callback) {
    if (this._instantQueue.length) {
        return callback(this._instantQueue.pop());
    } else {
        this._callbackQueue.unshift(callback);
    }
};

/**
 * Adds an element to the queue. If delay (ms) is set, the data will not be available before
 * specified delay has passed. Otherwise the data will be available for processing immediatelly.
 *
 * @param {Mixed} data Value to be queued
 * @param {Number} [delay] If set, delay the availability of the data by {delay} milliseconds
 */
MessageQueue.prototype.insert = function (data, delay) {
    var container, added = -1;
    if (typeof delay !== 'number') {
        this._instantQueue.unshift(data);
        this._processInsert();
        return true;
    } else {
        container = {
            data: data,
            available: Date.now() + delay
        };
        for (var i = 0, len = this._sortedQueue.length; i < len; i++) {
            if (this._sortedQueue[i].available >= container.available) {
                this._sortedQueue.splice(i, 0, container);
                added = i;
                break;
            }
        }
        if (added < 0) {
            this._sortedQueue.push(container);
            added = 0;
        }

        if (added === 0) {
            this._updateShiftTimer();
        }
    }
};

/**
 * Clears previous timer and creates a new one (if needed) to process the element
 * in the queue that needs to be processed first.
 */
MessageQueue.prototype._updateShiftTimer = function () {
    var nextShift, now = Date.now();
    clearTimeout(this._shiftTimer);

    if (!this._sortedQueue.length) {
        return;
    }

    nextShift = this._sortedQueue[0].available;

    if (nextShift <= now) {
        this._shiftSorted();
    } else {
        setTimeout(this._shiftSorted.bind(this),
            // add +15ms to ensure that data is already available when the timer is fired
            this._sortedQueue[0].available - Date.now() + 15);
    }
};

/**
 * Moves an element from the delayed queue to the immediate queue if an elmenet
 * becomes avilable
 */
MessageQueue.prototype._shiftSorted = function () {
    var container;
    if (!this._sortedQueue.length) {
        return;
    }

    if (this._sortedQueue[0].available <= Date.now()) {
        container = this._sortedQueue.shift();
        this.insert(container.data);
    }

    this._updateShiftTimer();
};

/**
 * If data from a queue is available and a callback is set, run the callback
 * with available data
 */
MessageQueue.prototype._processInsert = function () {
    if (this._instantQueue.length && this._callbackQueue.length) {
        this._callbackQueue.pop()(this._instantQueue.pop());
    }
};
