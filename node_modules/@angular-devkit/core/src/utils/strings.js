"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const STRING_DASHERIZE_REGEXP = (/[ _]/g);
const STRING_DECAMELIZE_REGEXP = (/([a-z\d])([A-Z])/g);
const STRING_CAMELIZE_REGEXP = (/(-|_|\.|\s)+(.)?/g);
const STRING_UNDERSCORE_REGEXP_1 = (/([a-z\d])([A-Z]+)/g);
const STRING_UNDERSCORE_REGEXP_2 = (/-|\s+/g);
/**
 * Converts a camelized string into all lower case separated by underscores.
 *
 ```javascript
 decamelize('innerHTML');         // 'inner_html'
 decamelize('action_name');       // 'action_name'
 decamelize('css-class-name');    // 'css-class-name'
 decamelize('my favorite items'); // 'my favorite items'
 ```

 @method decamelize
 @param {String} str The string to decamelize.
 @return {String} the decamelized string.
 */
function decamelize(str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}
exports.decamelize = decamelize;
/**
 Replaces underscores, spaces, or camelCase with dashes.

 ```javascript
 dasherize('innerHTML');         // 'inner-html'
 dasherize('action_name');       // 'action-name'
 dasherize('css-class-name');    // 'css-class-name'
 dasherize('my favorite items'); // 'my-favorite-items'
 ```

 @method dasherize
 @param {String} str The string to dasherize.
 @return {String} the dasherized string.
 */
function dasherize(str) {
    return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}
exports.dasherize = dasherize;
/**
 Returns the lowerCamelCase form of a string.

 ```javascript
 camelize('innerHTML');          // 'innerHTML'
 camelize('action_name');        // 'actionName'
 camelize('css-class-name');     // 'cssClassName'
 camelize('my favorite items');  // 'myFavoriteItems'
 camelize('My Favorite Items');  // 'myFavoriteItems'
 ```

 @method camelize
 @param {String} str The string to camelize.
 @return {String} the camelized string.
 */
function camelize(str) {
    return str
        .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr) => {
        return chr ? chr.toUpperCase() : '';
    })
        .replace(/^([A-Z])/, (match) => match.toLowerCase());
}
exports.camelize = camelize;
/**
 Returns the UpperCamelCase form of a string.

 ```javascript
 'innerHTML'.classify();          // 'InnerHTML'
 'action_name'.classify();        // 'ActionName'
 'css-class-name'.classify();     // 'CssClassName'
 'my favorite items'.classify();  // 'MyFavoriteItems'
 ```

 @method classify
 @param {String} str the string to classify
 @return {String} the classified string
 */
function classify(str) {
    return str.split('.').map(part => capitalize(camelize(part))).join('.');
}
exports.classify = classify;
/**
 More general than decamelize. Returns the lower\_case\_and\_underscored
 form of a string.

 ```javascript
 'innerHTML'.underscore();          // 'inner_html'
 'action_name'.underscore();        // 'action_name'
 'css-class-name'.underscore();     // 'css_class_name'
 'my favorite items'.underscore();  // 'my_favorite_items'
 ```

 @method underscore
 @param {String} str The string to underscore.
 @return {String} the underscored string.
 */
function underscore(str) {
    return str
        .replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2')
        .replace(STRING_UNDERSCORE_REGEXP_2, '_')
        .toLowerCase();
}
exports.underscore = underscore;
/**
 Returns the Capitalized form of a string

 ```javascript
 'innerHTML'.capitalize()         // 'InnerHTML'
 'action_name'.capitalize()       // 'Action_name'
 'css-class-name'.capitalize()    // 'Css-class-name'
 'my favorite items'.capitalize() // 'My favorite items'
 ```

 @method capitalize
 @param {String} str The string to capitalize.
 @return {String} The capitalized string.
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
exports.capitalize = capitalize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy91dGlscy9zdHJpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3ZELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFELE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUU5Qzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLEdBQVc7SUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDdEUsQ0FBQztBQUZELGdDQUVDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILG1CQUEwQixHQUFXO0lBQ25DLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFGRCw4QkFFQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsa0JBQXlCLEdBQVc7SUFDbEMsTUFBTSxDQUFDLEdBQUc7U0FDUCxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxNQUFjLEVBQUUsVUFBa0IsRUFBRSxHQUFXLEVBQUUsRUFBRTtRQUNuRixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUM7U0FDRCxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBTkQsNEJBTUM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsa0JBQXlCLEdBQVc7SUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFGRCw0QkFFQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsb0JBQTJCLEdBQVc7SUFDcEMsTUFBTSxDQUFDLEdBQUc7U0FDUCxPQUFPLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDO1NBQzVDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxHQUFHLENBQUM7U0FDeEMsV0FBVyxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUxELGdDQUtDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILG9CQUEyQixHQUFXO0lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUZELGdDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuY29uc3QgU1RSSU5HX0RBU0hFUklaRV9SRUdFWFAgPSAoL1sgX10vZyk7XG5jb25zdCBTVFJJTkdfREVDQU1FTElaRV9SRUdFWFAgPSAoLyhbYS16XFxkXSkoW0EtWl0pL2cpO1xuY29uc3QgU1RSSU5HX0NBTUVMSVpFX1JFR0VYUCA9ICgvKC18X3xcXC58XFxzKSsoLik/L2cpO1xuY29uc3QgU1RSSU5HX1VOREVSU0NPUkVfUkVHRVhQXzEgPSAoLyhbYS16XFxkXSkoW0EtWl0rKS9nKTtcbmNvbnN0IFNUUklOR19VTkRFUlNDT1JFX1JFR0VYUF8yID0gKC8tfFxccysvZyk7XG5cbi8qKlxuICogQ29udmVydHMgYSBjYW1lbGl6ZWQgc3RyaW5nIGludG8gYWxsIGxvd2VyIGNhc2Ugc2VwYXJhdGVkIGJ5IHVuZGVyc2NvcmVzLlxuICpcbiBgYGBqYXZhc2NyaXB0XG4gZGVjYW1lbGl6ZSgnaW5uZXJIVE1MJyk7ICAgICAgICAgLy8gJ2lubmVyX2h0bWwnXG4gZGVjYW1lbGl6ZSgnYWN0aW9uX25hbWUnKTsgICAgICAgLy8gJ2FjdGlvbl9uYW1lJ1xuIGRlY2FtZWxpemUoJ2Nzcy1jbGFzcy1uYW1lJyk7ICAgIC8vICdjc3MtY2xhc3MtbmFtZSdcbiBkZWNhbWVsaXplKCdteSBmYXZvcml0ZSBpdGVtcycpOyAvLyAnbXkgZmF2b3JpdGUgaXRlbXMnXG4gYGBgXG5cbiBAbWV0aG9kIGRlY2FtZWxpemVcbiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gZGVjYW1lbGl6ZS5cbiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBkZWNhbWVsaXplZCBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNhbWVsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFNUUklOR19ERUNBTUVMSVpFX1JFR0VYUCwgJyQxXyQyJykudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gUmVwbGFjZXMgdW5kZXJzY29yZXMsIHNwYWNlcywgb3IgY2FtZWxDYXNlIHdpdGggZGFzaGVzLlxuXG4gYGBgamF2YXNjcmlwdFxuIGRhc2hlcml6ZSgnaW5uZXJIVE1MJyk7ICAgICAgICAgLy8gJ2lubmVyLWh0bWwnXG4gZGFzaGVyaXplKCdhY3Rpb25fbmFtZScpOyAgICAgICAvLyAnYWN0aW9uLW5hbWUnXG4gZGFzaGVyaXplKCdjc3MtY2xhc3MtbmFtZScpOyAgICAvLyAnY3NzLWNsYXNzLW5hbWUnXG4gZGFzaGVyaXplKCdteSBmYXZvcml0ZSBpdGVtcycpOyAvLyAnbXktZmF2b3JpdGUtaXRlbXMnXG4gYGBgXG5cbiBAbWV0aG9kIGRhc2hlcml6ZVxuIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBkYXNoZXJpemUuXG4gQHJldHVybiB7U3RyaW5nfSB0aGUgZGFzaGVyaXplZCBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXNoZXJpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gZGVjYW1lbGl6ZShzdHIpLnJlcGxhY2UoU1RSSU5HX0RBU0hFUklaRV9SRUdFWFAsICctJyk7XG59XG5cbi8qKlxuIFJldHVybnMgdGhlIGxvd2VyQ2FtZWxDYXNlIGZvcm0gb2YgYSBzdHJpbmcuXG5cbiBgYGBqYXZhc2NyaXB0XG4gY2FtZWxpemUoJ2lubmVySFRNTCcpOyAgICAgICAgICAvLyAnaW5uZXJIVE1MJ1xuIGNhbWVsaXplKCdhY3Rpb25fbmFtZScpOyAgICAgICAgLy8gJ2FjdGlvbk5hbWUnXG4gY2FtZWxpemUoJ2Nzcy1jbGFzcy1uYW1lJyk7ICAgICAvLyAnY3NzQ2xhc3NOYW1lJ1xuIGNhbWVsaXplKCdteSBmYXZvcml0ZSBpdGVtcycpOyAgLy8gJ215RmF2b3JpdGVJdGVtcydcbiBjYW1lbGl6ZSgnTXkgRmF2b3JpdGUgSXRlbXMnKTsgIC8vICdteUZhdm9yaXRlSXRlbXMnXG4gYGBgXG5cbiBAbWV0aG9kIGNhbWVsaXplXG4gQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIGNhbWVsaXplLlxuIEByZXR1cm4ge1N0cmluZ30gdGhlIGNhbWVsaXplZCBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW1lbGl6ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZShTVFJJTkdfQ0FNRUxJWkVfUkVHRVhQLCAoX21hdGNoOiBzdHJpbmcsIF9zZXBhcmF0b3I6IHN0cmluZywgY2hyOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBjaHIgPyBjaHIudG9VcHBlckNhc2UoKSA6ICcnO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL14oW0EtWl0pLywgKG1hdGNoOiBzdHJpbmcpID0+IG1hdGNoLnRvTG93ZXJDYXNlKCkpO1xufVxuXG4vKipcbiBSZXR1cm5zIHRoZSBVcHBlckNhbWVsQ2FzZSBmb3JtIG9mIGEgc3RyaW5nLlxuXG4gYGBgamF2YXNjcmlwdFxuICdpbm5lckhUTUwnLmNsYXNzaWZ5KCk7ICAgICAgICAgIC8vICdJbm5lckhUTUwnXG4gJ2FjdGlvbl9uYW1lJy5jbGFzc2lmeSgpOyAgICAgICAgLy8gJ0FjdGlvbk5hbWUnXG4gJ2Nzcy1jbGFzcy1uYW1lJy5jbGFzc2lmeSgpOyAgICAgLy8gJ0Nzc0NsYXNzTmFtZSdcbiAnbXkgZmF2b3JpdGUgaXRlbXMnLmNsYXNzaWZ5KCk7ICAvLyAnTXlGYXZvcml0ZUl0ZW1zJ1xuIGBgYFxuXG4gQG1ldGhvZCBjbGFzc2lmeVxuIEBwYXJhbSB7U3RyaW5nfSBzdHIgdGhlIHN0cmluZyB0byBjbGFzc2lmeVxuIEByZXR1cm4ge1N0cmluZ30gdGhlIGNsYXNzaWZpZWQgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIuc3BsaXQoJy4nKS5tYXAocGFydCA9PiBjYXBpdGFsaXplKGNhbWVsaXplKHBhcnQpKSkuam9pbignLicpO1xufVxuXG4vKipcbiBNb3JlIGdlbmVyYWwgdGhhbiBkZWNhbWVsaXplLiBSZXR1cm5zIHRoZSBsb3dlclxcX2Nhc2VcXF9hbmRcXF91bmRlcnNjb3JlZFxuIGZvcm0gb2YgYSBzdHJpbmcuXG5cbiBgYGBqYXZhc2NyaXB0XG4gJ2lubmVySFRNTCcudW5kZXJzY29yZSgpOyAgICAgICAgICAvLyAnaW5uZXJfaHRtbCdcbiAnYWN0aW9uX25hbWUnLnVuZGVyc2NvcmUoKTsgICAgICAgIC8vICdhY3Rpb25fbmFtZSdcbiAnY3NzLWNsYXNzLW5hbWUnLnVuZGVyc2NvcmUoKTsgICAgIC8vICdjc3NfY2xhc3NfbmFtZSdcbiAnbXkgZmF2b3JpdGUgaXRlbXMnLnVuZGVyc2NvcmUoKTsgIC8vICdteV9mYXZvcml0ZV9pdGVtcydcbiBgYGBcblxuIEBtZXRob2QgdW5kZXJzY29yZVxuIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB1bmRlcnNjb3JlLlxuIEByZXR1cm4ge1N0cmluZ30gdGhlIHVuZGVyc2NvcmVkIHN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZGVyc2NvcmUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyXG4gICAgLnJlcGxhY2UoU1RSSU5HX1VOREVSU0NPUkVfUkVHRVhQXzEsICckMV8kMicpXG4gICAgLnJlcGxhY2UoU1RSSU5HX1VOREVSU0NPUkVfUkVHRVhQXzIsICdfJylcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gUmV0dXJucyB0aGUgQ2FwaXRhbGl6ZWQgZm9ybSBvZiBhIHN0cmluZ1xuXG4gYGBgamF2YXNjcmlwdFxuICdpbm5lckhUTUwnLmNhcGl0YWxpemUoKSAgICAgICAgIC8vICdJbm5lckhUTUwnXG4gJ2FjdGlvbl9uYW1lJy5jYXBpdGFsaXplKCkgICAgICAgLy8gJ0FjdGlvbl9uYW1lJ1xuICdjc3MtY2xhc3MtbmFtZScuY2FwaXRhbGl6ZSgpICAgIC8vICdDc3MtY2xhc3MtbmFtZSdcbiAnbXkgZmF2b3JpdGUgaXRlbXMnLmNhcGl0YWxpemUoKSAvLyAnTXkgZmF2b3JpdGUgaXRlbXMnXG4gYGBgXG5cbiBAbWV0aG9kIGNhcGl0YWxpemVcbiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gY2FwaXRhbGl6ZS5cbiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjYXBpdGFsaXplZCBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHIoMSk7XG59XG4iXX0=