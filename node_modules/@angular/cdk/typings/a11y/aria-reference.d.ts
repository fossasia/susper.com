/**
 * Adds the given ID to the specified ARIA attribute on an element.
 * Used for attributes such as aria-labelledby, aria-owns, etc.
 */
export declare function addAriaReferencedId(el: Element, attr: string, id: string): void;
/**
 * Removes the given ID from the specified ARIA attribute on an element.
 * Used for attributes such as aria-labelledby, aria-owns, etc.
 */
export declare function removeAriaReferencedId(el: Element, attr: string, id: string): void;
/**
 * Gets the list of IDs referenced by the given ARIA attribute on an element.
 * Used for attributes such as aria-labelledby, aria-owns, etc.
 */
export declare function getAriaReferenceIds(el: Element, attr: string): string[];
