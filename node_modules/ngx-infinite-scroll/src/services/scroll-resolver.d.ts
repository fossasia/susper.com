import { IPositionStats, IScrollerConfig } from '../models';
export declare class ScrollResolver {
    lastScrollPosition: number;
    shouldScroll(container: IPositionStats, config: IScrollerConfig, scrollingDown: boolean): boolean;
    isScrollingDown(container: IPositionStats): boolean;
    getScrollStats(container: IPositionStats, config: IScrollerConfig): {
        isScrollingDown: boolean;
        shouldScroll: boolean;
    };
}
