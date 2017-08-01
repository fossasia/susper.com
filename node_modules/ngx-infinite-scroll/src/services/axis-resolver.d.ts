export declare class AxisResolver {
    private vertical;
    constructor(vertical?: boolean);
    clientHeightKey(): "clientHeight" | "clientWidth";
    offsetHeightKey(): "offsetHeight" | "offsetWidth";
    scrollHeightKey(): "scrollHeight" | "scrollWidth";
    pageYOffsetKey(): "pageYOffset" | "pageXOffset";
    offsetTopKey(): "offsetTop" | "offsetLeft";
    scrollTopKey(): "scrollTop" | "scrollLeft";
    topKey(): "top" | "left";
}
