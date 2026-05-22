export declare const Role: {
    readonly USER: "USER";
    readonly STUDENT: "STUDENT";
    readonly ADMIN: "ADMIN";
    readonly TEACHER: "TEACHER";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const ContentType: {
    readonly HEADING: "HEADING";
    readonly PARAGRAPH: "PARAGRAPH";
    readonly VIDEO: "VIDEO";
    readonly IMAGE: "IMAGE";
    readonly FILE: "FILE";
    readonly LIST: "LIST";
    readonly CODE: "CODE";
    readonly QUIZ: "QUIZ";
};
export type ContentType = (typeof ContentType)[keyof typeof ContentType];
