import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly User: "User";
    readonly Course: "Course";
    readonly Workshop: "Workshop";
    readonly Chapter: "Chapter";
    readonly Content: "Content";
    readonly Enrollment: "Enrollment";
    readonly UserWorkshop: "UserWorkshop";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly userName: "userName";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly email: "email";
    readonly password_hash: "password_hash";
    readonly role: "role";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly is_deleted: "is_deleted";
    readonly deleted_at: "deleted_at";
    readonly is_blocked: "is_blocked";
    readonly blocked_at: "blocked_at";
    readonly updatedById: "updatedById";
    readonly deletedById: "deletedById";
    readonly blockedById: "blockedById";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CourseScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly is_deleted: "is_deleted";
    readonly deleted_at: "deleted_at";
    readonly createdById: "createdById";
    readonly updatedById: "updatedById";
    readonly deletedById: "deletedById";
};
export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum];
export declare const WorkshopScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly theme: "theme";
    readonly description: "description";
    readonly start_date: "start_date";
    readonly end_date: "end_date";
    readonly max_participants: "max_participants";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly is_deleted: "is_deleted";
    readonly deleted_at: "deleted_at";
    readonly createdById: "createdById";
    readonly updatedById: "updatedById";
    readonly deletedById: "deletedById";
};
export type WorkshopScalarFieldEnum = (typeof WorkshopScalarFieldEnum)[keyof typeof WorkshopScalarFieldEnum];
export declare const ChapterScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly order_index: "order_index";
    readonly is_published: "is_published";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly is_deleted: "is_deleted";
    readonly deleted_at: "deleted_at";
    readonly courseId: "courseId";
    readonly parentId: "parentId";
    readonly createdById: "createdById";
    readonly updatedById: "updatedById";
    readonly deletedById: "deletedById";
};
export type ChapterScalarFieldEnum = (typeof ChapterScalarFieldEnum)[keyof typeof ChapterScalarFieldEnum];
export declare const ContentScalarFieldEnum: {
    readonly id: "id";
    readonly content_type: "content_type";
    readonly title: "title";
    readonly body: "body";
    readonly media_url: "media_url";
    readonly order_index: "order_index";
    readonly is_published: "is_published";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly is_deleted: "is_deleted";
    readonly deleted_at: "deleted_at";
    readonly chapterId: "chapterId";
    readonly createdById: "createdById";
    readonly updatedById: "updatedById";
};
export type ContentScalarFieldEnum = (typeof ContentScalarFieldEnum)[keyof typeof ContentScalarFieldEnum];
export declare const EnrollmentScalarFieldEnum: {
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly enrolled_at: "enrolled_at";
    readonly has_paid: "has_paid";
    readonly progress: "progress";
    readonly completed_at: "completed_at";
};
export type EnrollmentScalarFieldEnum = (typeof EnrollmentScalarFieldEnum)[keyof typeof EnrollmentScalarFieldEnum];
export declare const UserWorkshopScalarFieldEnum: {
    readonly userId: "userId";
    readonly workshopId: "workshopId";
    readonly registered_at: "registered_at";
    readonly attended: "attended";
};
export type UserWorkshopScalarFieldEnum = (typeof UserWorkshopScalarFieldEnum)[keyof typeof UserWorkshopScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
