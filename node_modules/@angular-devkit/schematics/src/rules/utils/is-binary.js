"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isBinary(buffer) {
    const chunkLength = 24;
    const chunkBegin = 0;
    const chunkEnd = Math.min(buffer.length, chunkBegin + chunkLength);
    const contentChunkUTF8 = buffer.toString('utf-8', chunkBegin, chunkEnd);
    // Detect encoding
    for (let i = 0; i < contentChunkUTF8.length; ++i) {
        const charCode = contentChunkUTF8.charCodeAt(i);
        if (charCode === 65533 || charCode <= 8) {
            // 8 and below are control characters (e.g. backspace, null, eof, etc.).
            // 65533 is the unknown character.
            return true;
        }
    }
    // Return
    return false;
}
exports.isBinary = isBinary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtYmluYXJ5LmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy91dGlscy9pcy1iaW5hcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrQkFBeUIsTUFBYztJQUNyQyxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDdkIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBRXJCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUM7SUFDbkUsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFeEUsa0JBQWtCO0lBQ2xCLEdBQUcsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFHLENBQUM7UUFDbkQsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFFLFFBQVEsS0FBSyxLQUFLLElBQUksUUFBUSxJQUFJLENBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUMsd0VBQXdFO1lBQ3hFLGtDQUFrQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFFRCxTQUFTO0lBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFuQkQsNEJBbUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNCaW5hcnkoYnVmZmVyOiBCdWZmZXIpOiBib29sZWFuIHtcbiAgY29uc3QgY2h1bmtMZW5ndGggPSAyNDtcbiAgY29uc3QgY2h1bmtCZWdpbiA9IDA7XG5cbiAgY29uc3QgY2h1bmtFbmQgPSBNYXRoLm1pbihidWZmZXIubGVuZ3RoLCBjaHVua0JlZ2luICsgY2h1bmtMZW5ndGgpO1xuICBjb25zdCBjb250ZW50Q2h1bmtVVEY4ID0gYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcsIGNodW5rQmVnaW4sIGNodW5rRW5kKTtcblxuICAvLyBEZXRlY3QgZW5jb2RpbmdcbiAgZm9yICggbGV0IGkgPSAwOyBpIDwgY29udGVudENodW5rVVRGOC5sZW5ndGg7ICsraSApIHtcbiAgICBjb25zdCBjaGFyQ29kZSA9IGNvbnRlbnRDaHVua1VURjguY2hhckNvZGVBdChpKTtcbiAgICBpZiAoIGNoYXJDb2RlID09PSA2NTUzMyB8fCBjaGFyQ29kZSA8PSA4ICkge1xuICAgICAgLy8gOCBhbmQgYmVsb3cgYXJlIGNvbnRyb2wgY2hhcmFjdGVycyAoZS5nLiBiYWNrc3BhY2UsIG51bGwsIGVvZiwgZXRjLikuXG4gICAgICAvLyA2NTUzMyBpcyB0aGUgdW5rbm93biBjaGFyYWN0ZXIuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5cbiAgcmV0dXJuIGZhbHNlO1xufVxuIl19