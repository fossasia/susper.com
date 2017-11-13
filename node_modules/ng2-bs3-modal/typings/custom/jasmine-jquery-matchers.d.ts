
declare module jasmine {
    interface Matchers {
        toHaveText(expected: string): boolean;
    }
}