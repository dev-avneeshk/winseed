declare module "dotted-map" {
  interface DottedMapOptions {
    height: number;
    grid?: "diagonal" | "vertical" | "horizontal";
  }

  interface GetSVGOptions {
    radius?: number;
    color?: string;
    shape?: string;
    backgroundColor?: string;
  }

  export default class DottedMap {
    constructor(options: DottedMapOptions);
    getSVG(options?: GetSVGOptions): string;
  }
}

