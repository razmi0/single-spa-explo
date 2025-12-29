import type { LayoutKey, Mode } from "./types";
export default class LayoutManager {
    private mode;
    private FILES;
    constructor(mode?: Mode);
    get(key: LayoutKey): string;
}
