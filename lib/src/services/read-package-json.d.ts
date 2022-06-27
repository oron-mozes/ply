declare type packageJson = {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
};
export declare const getPackageJson: () => packageJson;
export {};
