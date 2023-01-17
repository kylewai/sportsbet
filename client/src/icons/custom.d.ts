//Added this to stop error when trying to import svg as module in Typescript
declare module "*.svg" {
    export const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    const src: string;
    export default src;
}

declare module "*.png" {
    const value: any;
    export = value;
 }