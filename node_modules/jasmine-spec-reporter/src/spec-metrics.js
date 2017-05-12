var SpecMetrics = function () {
  this.startTime = null;
  this.specStartTime = null;
  this.duration = null;
  this.successfulSpecs = 0;
  this.failedSpecs = 0;
  this.pendingSpecs = 0;
  this.executedSpecs = 0;
  this.skippedSpecs = 0;
  this.totalSpecs = 0;
  this.totalSpecsDefined = 0;
};

SpecMetrics.prototype = {
  start: function (info) {
    this.startTime = (new Date()).getTime();
    this.totalSpecsDefined = info && info.totalSpecsDefined ? info.totalSpecsDefined : 0;
  },

  stop: function () {
    this.duration = this.formatDuration((new Date()).getTime() - this.startTime);
    this.totalSpecs = this.failedSpecs + this.successfulSpecs + this.pendingSpecs;
    this.executedSpecs = this.failedSpecs + this.successfulSpecs;
    this.totalSpecsDefined = this.totalSpecsDefined ? this.totalSpecsDefined : this.totalSpecs;
    this.skippedSpecs = this.totalSpecsDefined - this.totalSpecs;
  },

  startSpec: function () {
    this.specStartTime = (new Date()).getTime();
  },

  stopSpec: function (spec) {
    spec.duration = this.formatDuration((new Date()).getTime() - this.specStartTime);
  },

  formatDuration: function (durationInMs) {
    var duration = '', durationInSecs, durationInMins, durationInHrs;
    durationInSecs = durationInMs / 1000;
    if (durationInSecs < 1) {
      return durationInSecs + ' sec' + pluralize(durationInSecs);
    }
    durationInSecs = Math.round(durationInSecs);
    if (durationInSecs < 60) {
      return durationInSecs + ' sec' + pluralize(durationInSecs);
    }
    durationInMins = Math.floor(durationInSecs / 60);
    durationInSecs = durationInSecs % 60;
    if (durationInSecs) {
      duration = ' ' + durationInSecs + ' sec' + pluralize(durationInSecs);
    }
    if (durationInMins < 60) {
      return durationInMins + ' min' + pluralize(durationInMins) + duration;
    }
    durationInHrs = Math.floor(durationInMins / 60);
    durationInMins = durationInMins % 60;
    if (durationInMins) {
      duration = ' ' + durationInMins + ' min' + pluralize(durationInMins) + duration;
    }
    return durationInHrs + ' hour' + pluralize(durationInHrs) + duration;
  }
};

function pluralize(count){
  return count > 1 ? 's' : '';
}

module.exports = SpecMetrics;
