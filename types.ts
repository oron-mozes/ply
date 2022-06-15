export enum ACTION {
    INSTALL = "INSTALL",
    BUILD = "BUILD",
    TEST = "TEST",
    ADD = "ADD",
    GENERIC = "GENERIC",
}

export enum PACKAGE_MANAGER {
    YARN,
    NPM,
    NONE,
}

export type UserData = {
    id: string;
}

export type ProjectData = {
    name: string,
    averageDuration: number | null,
    personalDuration: number | null,
}