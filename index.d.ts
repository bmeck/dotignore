export declare interface IgnoreMatcher {
  constructor(str: string): void;
  delimiter: string;
  shouldIgnore(filename: string): boolean;
}
export declare function createMatcher(ignoreFileStr: string): IgnoreMatcher;
