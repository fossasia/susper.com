"use strict";
function packageChunkSort(packages) {
    return function sort(left, right) {
        var leftIndex = packages.indexOf(left.names[0]);
        var rightindex = packages.indexOf(right.names[0]);
        if (leftIndex < 0 || rightindex < 0) {
            // Unknown packages are loaded last
            return 1;
        }
        if (leftIndex > rightindex) {
            return 1;
        }
        return -1;
    };
}
exports.packageChunkSort = packageChunkSort;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/utilities/package-chunk-sort.js.map