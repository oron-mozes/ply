export declare enum ACTION {
    INSTALL = "INSTALL",
    BUILD = "BUILD",
    TEST = "TEST",
    ADD = "ADD",
    GENERIC = "GENERIC"
}
export declare enum PACKAGE_MANAGER {
    YARN = 0,
    NPM = 1,
    NONE = 2
}
export declare type UserData = {
    id: string;
};
export declare type ProjectData = {
    name: string;
    averageDuration: number | null;
    personalDuration: number | null;
};
