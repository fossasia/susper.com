/**
 *  A replacement for @Injectable to be used in the compiler, so that
  * we don't try to evaluate the metadata in the compiler during AoT.
  * This decorator is enough to make the compiler work with the ReflectiveInjector though.
 * @return {?}
 */
export function CompilerInjectable() {
    return function (x) { return x; };
}
//# sourceMappingURL=injectable.js.map