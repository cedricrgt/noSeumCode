import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourseModel = runtime.Types.Result.DefaultSelection<Prisma.$CoursePayload>;
export type AggregateCourse = {
    _count: CourseCountAggregateOutputType | null;
    _min: CourseMinAggregateOutputType | null;
    _max: CourseMaxAggregateOutputType | null;
};
export type CourseMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
};
export type CourseMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
};
export type CourseCountAggregateOutputType = {
    id: number;
    name: number;
    created_at: number;
    updated_at: number;
    is_deleted: number;
    deleted_at: number;
    createdById: number;
    updatedById: number;
    deletedById: number;
    _all: number;
};
export type CourseMinAggregateInputType = {
    id?: true;
    name?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
};
export type CourseMaxAggregateInputType = {
    id?: true;
    name?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
};
export type CourseCountAggregateInputType = {
    id?: true;
    name?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
    _all?: true;
};
export type CourseAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput | Prisma.CourseOrderByWithRelationInput[];
    cursor?: Prisma.CourseWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourseCountAggregateInputType;
    _min?: CourseMinAggregateInputType;
    _max?: CourseMaxAggregateInputType;
};
export type GetCourseAggregateType<T extends CourseAggregateArgs> = {
    [P in keyof T & keyof AggregateCourse]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourse[P]> : Prisma.GetScalarType<T[P], AggregateCourse[P]>;
};
export type CourseGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithAggregationInput | Prisma.CourseOrderByWithAggregationInput[];
    by: Prisma.CourseScalarFieldEnum[] | Prisma.CourseScalarFieldEnum;
    having?: Prisma.CourseScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourseCountAggregateInputType | true;
    _min?: CourseMinAggregateInputType;
    _max?: CourseMaxAggregateInputType;
};
export type CourseGroupByOutputType = {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    deleted_at: Date | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
    _count: CourseCountAggregateOutputType | null;
    _min: CourseMinAggregateOutputType | null;
    _max: CourseMaxAggregateOutputType | null;
};
type GetCourseGroupByPayload<T extends CourseGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourseGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourseGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourseGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourseGroupByOutputType[P]>;
}>>;
export type CourseWhereInput = {
    AND?: Prisma.CourseWhereInput | Prisma.CourseWhereInput[];
    OR?: Prisma.CourseWhereInput[];
    NOT?: Prisma.CourseWhereInput | Prisma.CourseWhereInput[];
    id?: Prisma.StringFilter<"Course"> | string;
    name?: Prisma.StringFilter<"Course"> | string;
    created_at?: Prisma.DateTimeFilter<"Course"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Course"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Course"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Course"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"Course"> | string | null;
    updatedById?: Prisma.StringNullableFilter<"Course"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Course"> | string | null;
    created_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    deleted_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    chapters?: Prisma.ChapterListRelationFilter;
    enrollments?: Prisma.EnrollmentListRelationFilter;
};
export type CourseOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_by?: Prisma.UserOrderByWithRelationInput;
    updated_by?: Prisma.UserOrderByWithRelationInput;
    deleted_by?: Prisma.UserOrderByWithRelationInput;
    chapters?: Prisma.ChapterOrderByRelationAggregateInput;
    enrollments?: Prisma.EnrollmentOrderByRelationAggregateInput;
};
export type CourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.CourseWhereInput | Prisma.CourseWhereInput[];
    OR?: Prisma.CourseWhereInput[];
    NOT?: Prisma.CourseWhereInput | Prisma.CourseWhereInput[];
    created_at?: Prisma.DateTimeFilter<"Course"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Course"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Course"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Course"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"Course"> | string | null;
    updatedById?: Prisma.StringNullableFilter<"Course"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Course"> | string | null;
    created_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    deleted_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    chapters?: Prisma.ChapterListRelationFilter;
    enrollments?: Prisma.EnrollmentListRelationFilter;
}, "id" | "name">;
export type CourseOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.CourseCountOrderByAggregateInput;
    _max?: Prisma.CourseMaxOrderByAggregateInput;
    _min?: Prisma.CourseMinOrderByAggregateInput;
};
export type CourseScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourseScalarWhereWithAggregatesInput | Prisma.CourseScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourseScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourseScalarWhereWithAggregatesInput | Prisma.CourseScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Course"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Course"> | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Course"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Course"> | Date | string;
    is_deleted?: Prisma.BoolWithAggregatesFilter<"Course"> | boolean;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Course"> | Date | string | null;
    createdById?: Prisma.StringNullableWithAggregatesFilter<"Course"> | string | null;
    updatedById?: Prisma.StringNullableWithAggregatesFilter<"Course"> | string | null;
    deletedById?: Prisma.StringNullableWithAggregatesFilter<"Course"> | string | null;
};
export type CourseCreateInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedCoursesInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedCoursesInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedCoursesInput;
    chapters?: Prisma.ChapterCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentCreateNestedManyWithoutCourseInput;
};
export type CourseUncheckedCreateInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    chapters?: Prisma.ChapterUncheckedCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentUncheckedCreateNestedManyWithoutCourseInput;
};
export type CourseUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedCoursesNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedCoursesNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedCoursesNestedInput;
    chapters?: Prisma.ChapterUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chapters?: Prisma.ChapterUncheckedUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUncheckedUpdateManyWithoutCourseNestedInput;
};
export type CourseCreateManyInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type CourseUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CourseUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CourseListRelationFilter = {
    every?: Prisma.CourseWhereInput;
    some?: Prisma.CourseWhereInput;
    none?: Prisma.CourseWhereInput;
};
export type CourseOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourseCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type CourseMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type CourseMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type CourseScalarRelationFilter = {
    is?: Prisma.CourseWhereInput;
    isNot?: Prisma.CourseWhereInput;
};
export type CourseCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutCreated_byInput, Prisma.CourseUncheckedCreateWithoutCreated_byInput> | Prisma.CourseCreateWithoutCreated_byInput[] | Prisma.CourseUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutCreated_byInput | Prisma.CourseCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.CourseCreateManyCreated_byInputEnvelope;
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
};
export type CourseCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutUpdated_byInput, Prisma.CourseUncheckedCreateWithoutUpdated_byInput> | Prisma.CourseCreateWithoutUpdated_byInput[] | Prisma.CourseUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutUpdated_byInput | Prisma.CourseCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.CourseCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
};
export type CourseCreateNestedManyWithoutDeleted_byInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutDeleted_byInput, Prisma.CourseUncheckedCreateWithoutDeleted_byInput> | Prisma.CourseCreateWithoutDeleted_byInput[] | Prisma.CourseUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutDeleted_byInput | Prisma.CourseCreateOrConnectWithoutDeleted_byInput[];
    createMany?: Prisma.CourseCreateManyDeleted_byInputEnvelope;
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
};
export type CourseUncheckedCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutCreated_byInput, Prisma.CourseUncheckedCreateWithoutCreated_byInput> | Prisma.CourseCreateWithoutCreated_byInput[] | Prisma.CourseUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutCreated_byInput | Prisma.CourseCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.CourseCreateManyCreated_byInputEnvelope;
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
};
export type CourseUncheckedCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutUpdated_byInput, Prisma.CourseUncheckedCreateWithoutUpdated_byInput> | Prisma.CourseCreateWithoutUpdated_byInput[] | Prisma.CourseUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutUpdated_byInput | Prisma.CourseCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.CourseCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
};
export type CourseUncheckedCreateNestedManyWithoutDeleted_byInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutDeleted_byInput, Prisma.CourseUncheckedCreateWithoutDeleted_byInput> | Prisma.CourseCreateWithoutDeleted_byInput[] | Prisma.CourseUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutDeleted_byInput | Prisma.CourseCreateOrConnectWithoutDeleted_byInput[];
    createMany?: Prisma.CourseCreateManyDeleted_byInputEnvelope;
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
};
export type CourseUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutCreated_byInput, Prisma.CourseUncheckedCreateWithoutCreated_byInput> | Prisma.CourseCreateWithoutCreated_byInput[] | Prisma.CourseUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutCreated_byInput | Prisma.CourseCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.CourseUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.CourseUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.CourseCreateManyCreated_byInputEnvelope;
    set?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    disconnect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    delete?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    update?: Prisma.CourseUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.CourseUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.CourseUpdateManyWithWhereWithoutCreated_byInput | Prisma.CourseUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
};
export type CourseUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutUpdated_byInput, Prisma.CourseUncheckedCreateWithoutUpdated_byInput> | Prisma.CourseCreateWithoutUpdated_byInput[] | Prisma.CourseUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutUpdated_byInput | Prisma.CourseCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.CourseUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.CourseUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.CourseCreateManyUpdated_byInputEnvelope;
    set?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    disconnect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    delete?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    update?: Prisma.CourseUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.CourseUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.CourseUpdateManyWithWhereWithoutUpdated_byInput | Prisma.CourseUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
};
export type CourseUpdateManyWithoutDeleted_byNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutDeleted_byInput, Prisma.CourseUncheckedCreateWithoutDeleted_byInput> | Prisma.CourseCreateWithoutDeleted_byInput[] | Prisma.CourseUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutDeleted_byInput | Prisma.CourseCreateOrConnectWithoutDeleted_byInput[];
    upsert?: Prisma.CourseUpsertWithWhereUniqueWithoutDeleted_byInput | Prisma.CourseUpsertWithWhereUniqueWithoutDeleted_byInput[];
    createMany?: Prisma.CourseCreateManyDeleted_byInputEnvelope;
    set?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    disconnect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    delete?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    update?: Prisma.CourseUpdateWithWhereUniqueWithoutDeleted_byInput | Prisma.CourseUpdateWithWhereUniqueWithoutDeleted_byInput[];
    updateMany?: Prisma.CourseUpdateManyWithWhereWithoutDeleted_byInput | Prisma.CourseUpdateManyWithWhereWithoutDeleted_byInput[];
    deleteMany?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
};
export type CourseUncheckedUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutCreated_byInput, Prisma.CourseUncheckedCreateWithoutCreated_byInput> | Prisma.CourseCreateWithoutCreated_byInput[] | Prisma.CourseUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutCreated_byInput | Prisma.CourseCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.CourseUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.CourseUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.CourseCreateManyCreated_byInputEnvelope;
    set?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    disconnect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    delete?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    update?: Prisma.CourseUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.CourseUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.CourseUpdateManyWithWhereWithoutCreated_byInput | Prisma.CourseUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
};
export type CourseUncheckedUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutUpdated_byInput, Prisma.CourseUncheckedCreateWithoutUpdated_byInput> | Prisma.CourseCreateWithoutUpdated_byInput[] | Prisma.CourseUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutUpdated_byInput | Prisma.CourseCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.CourseUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.CourseUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.CourseCreateManyUpdated_byInputEnvelope;
    set?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    disconnect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    delete?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    update?: Prisma.CourseUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.CourseUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.CourseUpdateManyWithWhereWithoutUpdated_byInput | Prisma.CourseUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
};
export type CourseUncheckedUpdateManyWithoutDeleted_byNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutDeleted_byInput, Prisma.CourseUncheckedCreateWithoutDeleted_byInput> | Prisma.CourseCreateWithoutDeleted_byInput[] | Prisma.CourseUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutDeleted_byInput | Prisma.CourseCreateOrConnectWithoutDeleted_byInput[];
    upsert?: Prisma.CourseUpsertWithWhereUniqueWithoutDeleted_byInput | Prisma.CourseUpsertWithWhereUniqueWithoutDeleted_byInput[];
    createMany?: Prisma.CourseCreateManyDeleted_byInputEnvelope;
    set?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    disconnect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    delete?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    connect?: Prisma.CourseWhereUniqueInput | Prisma.CourseWhereUniqueInput[];
    update?: Prisma.CourseUpdateWithWhereUniqueWithoutDeleted_byInput | Prisma.CourseUpdateWithWhereUniqueWithoutDeleted_byInput[];
    updateMany?: Prisma.CourseUpdateManyWithWhereWithoutDeleted_byInput | Prisma.CourseUpdateManyWithWhereWithoutDeleted_byInput[];
    deleteMany?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
};
export type CourseCreateNestedOneWithoutChaptersInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutChaptersInput, Prisma.CourseUncheckedCreateWithoutChaptersInput>;
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutChaptersInput;
    connect?: Prisma.CourseWhereUniqueInput;
};
export type CourseUpdateOneRequiredWithoutChaptersNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutChaptersInput, Prisma.CourseUncheckedCreateWithoutChaptersInput>;
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutChaptersInput;
    upsert?: Prisma.CourseUpsertWithoutChaptersInput;
    connect?: Prisma.CourseWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseUpdateToOneWithWhereWithoutChaptersInput, Prisma.CourseUpdateWithoutChaptersInput>, Prisma.CourseUncheckedUpdateWithoutChaptersInput>;
};
export type CourseCreateNestedOneWithoutEnrollmentsInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutEnrollmentsInput, Prisma.CourseUncheckedCreateWithoutEnrollmentsInput>;
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutEnrollmentsInput;
    connect?: Prisma.CourseWhereUniqueInput;
};
export type CourseUpdateOneRequiredWithoutEnrollmentsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseCreateWithoutEnrollmentsInput, Prisma.CourseUncheckedCreateWithoutEnrollmentsInput>;
    connectOrCreate?: Prisma.CourseCreateOrConnectWithoutEnrollmentsInput;
    upsert?: Prisma.CourseUpsertWithoutEnrollmentsInput;
    connect?: Prisma.CourseWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseUpdateToOneWithWhereWithoutEnrollmentsInput, Prisma.CourseUpdateWithoutEnrollmentsInput>, Prisma.CourseUncheckedUpdateWithoutEnrollmentsInput>;
};
export type CourseCreateWithoutCreated_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedCoursesInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedCoursesInput;
    chapters?: Prisma.ChapterCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentCreateNestedManyWithoutCourseInput;
};
export type CourseUncheckedCreateWithoutCreated_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    chapters?: Prisma.ChapterUncheckedCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentUncheckedCreateNestedManyWithoutCourseInput;
};
export type CourseCreateOrConnectWithoutCreated_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseCreateWithoutCreated_byInput, Prisma.CourseUncheckedCreateWithoutCreated_byInput>;
};
export type CourseCreateManyCreated_byInputEnvelope = {
    data: Prisma.CourseCreateManyCreated_byInput | Prisma.CourseCreateManyCreated_byInput[];
    skipDuplicates?: boolean;
};
export type CourseCreateWithoutUpdated_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedCoursesInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedCoursesInput;
    chapters?: Prisma.ChapterCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentCreateNestedManyWithoutCourseInput;
};
export type CourseUncheckedCreateWithoutUpdated_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    deletedById?: string | null;
    chapters?: Prisma.ChapterUncheckedCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentUncheckedCreateNestedManyWithoutCourseInput;
};
export type CourseCreateOrConnectWithoutUpdated_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseCreateWithoutUpdated_byInput, Prisma.CourseUncheckedCreateWithoutUpdated_byInput>;
};
export type CourseCreateManyUpdated_byInputEnvelope = {
    data: Prisma.CourseCreateManyUpdated_byInput | Prisma.CourseCreateManyUpdated_byInput[];
    skipDuplicates?: boolean;
};
export type CourseCreateWithoutDeleted_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedCoursesInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedCoursesInput;
    chapters?: Prisma.ChapterCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentCreateNestedManyWithoutCourseInput;
};
export type CourseUncheckedCreateWithoutDeleted_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    chapters?: Prisma.ChapterUncheckedCreateNestedManyWithoutCourseInput;
    enrollments?: Prisma.EnrollmentUncheckedCreateNestedManyWithoutCourseInput;
};
export type CourseCreateOrConnectWithoutDeleted_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseCreateWithoutDeleted_byInput, Prisma.CourseUncheckedCreateWithoutDeleted_byInput>;
};
export type CourseCreateManyDeleted_byInputEnvelope = {
    data: Prisma.CourseCreateManyDeleted_byInput | Prisma.CourseCreateManyDeleted_byInput[];
    skipDuplicates?: boolean;
};
export type CourseUpsertWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseUpdateWithoutCreated_byInput, Prisma.CourseUncheckedUpdateWithoutCreated_byInput>;
    create: Prisma.XOR<Prisma.CourseCreateWithoutCreated_byInput, Prisma.CourseUncheckedCreateWithoutCreated_byInput>;
};
export type CourseUpdateWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseUpdateWithoutCreated_byInput, Prisma.CourseUncheckedUpdateWithoutCreated_byInput>;
};
export type CourseUpdateManyWithWhereWithoutCreated_byInput = {
    where: Prisma.CourseScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseUpdateManyMutationInput, Prisma.CourseUncheckedUpdateManyWithoutCreated_byInput>;
};
export type CourseScalarWhereInput = {
    AND?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
    OR?: Prisma.CourseScalarWhereInput[];
    NOT?: Prisma.CourseScalarWhereInput | Prisma.CourseScalarWhereInput[];
    id?: Prisma.StringFilter<"Course"> | string;
    name?: Prisma.StringFilter<"Course"> | string;
    created_at?: Prisma.DateTimeFilter<"Course"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Course"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Course"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Course"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"Course"> | string | null;
    updatedById?: Prisma.StringNullableFilter<"Course"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Course"> | string | null;
};
export type CourseUpsertWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseUpdateWithoutUpdated_byInput, Prisma.CourseUncheckedUpdateWithoutUpdated_byInput>;
    create: Prisma.XOR<Prisma.CourseCreateWithoutUpdated_byInput, Prisma.CourseUncheckedCreateWithoutUpdated_byInput>;
};
export type CourseUpdateWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseUpdateWithoutUpdated_byInput, Prisma.CourseUncheckedUpdateWithoutUpdated_byInput>;
};
export type CourseUpdateManyWithWhereWithoutUpdated_byInput = {
    where: Prisma.CourseScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseUpdateManyMutationInput, Prisma.CourseUncheckedUpdateManyWithoutUpdated_byInput>;
};
export type CourseUpsertWithWhereUniqueWithoutDeleted_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseUpdateWithoutDeleted_byInput, Prisma.CourseUncheckedUpdateWithoutDeleted_byInput>;
    create: Prisma.XOR<Prisma.CourseCreateWithoutDeleted_byInput, Prisma.CourseUncheckedCreateWithoutDeleted_byInput>;
};
export type CourseUpdateWithWhereUniqueWithoutDeleted_byInput = {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseUpdateWithoutDeleted_byInput, Prisma.CourseUncheckedUpdateWithoutDeleted_byInput>;
};
export type CourseUpdateManyWithWhereWithoutDeleted_byInput = {
    where: Prisma.CourseScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseUpdateManyMutationInput, Prisma.CourseUncheckedUpdateManyWithoutDeleted_byInput>;
};
export type CourseCreateWithoutChaptersInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedCoursesInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedCoursesInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedCoursesInput;
    enrollments?: Prisma.EnrollmentCreateNestedManyWithoutCourseInput;
};
export type CourseUncheckedCreateWithoutChaptersInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    enrollments?: Prisma.EnrollmentUncheckedCreateNestedManyWithoutCourseInput;
};
export type CourseCreateOrConnectWithoutChaptersInput = {
    where: Prisma.CourseWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseCreateWithoutChaptersInput, Prisma.CourseUncheckedCreateWithoutChaptersInput>;
};
export type CourseUpsertWithoutChaptersInput = {
    update: Prisma.XOR<Prisma.CourseUpdateWithoutChaptersInput, Prisma.CourseUncheckedUpdateWithoutChaptersInput>;
    create: Prisma.XOR<Prisma.CourseCreateWithoutChaptersInput, Prisma.CourseUncheckedCreateWithoutChaptersInput>;
    where?: Prisma.CourseWhereInput;
};
export type CourseUpdateToOneWithWhereWithoutChaptersInput = {
    where?: Prisma.CourseWhereInput;
    data: Prisma.XOR<Prisma.CourseUpdateWithoutChaptersInput, Prisma.CourseUncheckedUpdateWithoutChaptersInput>;
};
export type CourseUpdateWithoutChaptersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedCoursesNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedCoursesNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedCoursesNestedInput;
    enrollments?: Prisma.EnrollmentUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateWithoutChaptersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    enrollments?: Prisma.EnrollmentUncheckedUpdateManyWithoutCourseNestedInput;
};
export type CourseCreateWithoutEnrollmentsInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedCoursesInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedCoursesInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedCoursesInput;
    chapters?: Prisma.ChapterCreateNestedManyWithoutCourseInput;
};
export type CourseUncheckedCreateWithoutEnrollmentsInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    chapters?: Prisma.ChapterUncheckedCreateNestedManyWithoutCourseInput;
};
export type CourseCreateOrConnectWithoutEnrollmentsInput = {
    where: Prisma.CourseWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseCreateWithoutEnrollmentsInput, Prisma.CourseUncheckedCreateWithoutEnrollmentsInput>;
};
export type CourseUpsertWithoutEnrollmentsInput = {
    update: Prisma.XOR<Prisma.CourseUpdateWithoutEnrollmentsInput, Prisma.CourseUncheckedUpdateWithoutEnrollmentsInput>;
    create: Prisma.XOR<Prisma.CourseCreateWithoutEnrollmentsInput, Prisma.CourseUncheckedCreateWithoutEnrollmentsInput>;
    where?: Prisma.CourseWhereInput;
};
export type CourseUpdateToOneWithWhereWithoutEnrollmentsInput = {
    where?: Prisma.CourseWhereInput;
    data: Prisma.XOR<Prisma.CourseUpdateWithoutEnrollmentsInput, Prisma.CourseUncheckedUpdateWithoutEnrollmentsInput>;
};
export type CourseUpdateWithoutEnrollmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedCoursesNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedCoursesNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedCoursesNestedInput;
    chapters?: Prisma.ChapterUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateWithoutEnrollmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chapters?: Prisma.ChapterUncheckedUpdateManyWithoutCourseNestedInput;
};
export type CourseCreateManyCreated_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type CourseCreateManyUpdated_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    deletedById?: string | null;
};
export type CourseCreateManyDeleted_byInput = {
    id?: string;
    name: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
};
export type CourseUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedCoursesNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedCoursesNestedInput;
    chapters?: Prisma.ChapterUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chapters?: Prisma.ChapterUncheckedUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUncheckedUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateManyWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CourseUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedCoursesNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedCoursesNestedInput;
    chapters?: Prisma.ChapterUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chapters?: Prisma.ChapterUncheckedUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUncheckedUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateManyWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CourseUpdateWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedCoursesNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedCoursesNestedInput;
    chapters?: Prisma.ChapterUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chapters?: Prisma.ChapterUncheckedUpdateManyWithoutCourseNestedInput;
    enrollments?: Prisma.EnrollmentUncheckedUpdateManyWithoutCourseNestedInput;
};
export type CourseUncheckedUpdateManyWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type CourseCountOutputType = {
    chapters: number;
    enrollments: number;
};
export type CourseCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    chapters?: boolean | CourseCountOutputTypeCountChaptersArgs;
    enrollments?: boolean | CourseCountOutputTypeCountEnrollmentsArgs;
};
export type CourseCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseCountOutputTypeSelect<ExtArgs> | null;
};
export type CourseCountOutputTypeCountChaptersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChapterWhereInput;
};
export type CourseCountOutputTypeCountEnrollmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnrollmentWhereInput;
};
export type CourseSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    created_by?: boolean | Prisma.Course$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Course$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Course$deleted_byArgs<ExtArgs>;
    chapters?: boolean | Prisma.Course$chaptersArgs<ExtArgs>;
    enrollments?: boolean | Prisma.Course$enrollmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourseCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["course"]>;
export type CourseSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    created_by?: boolean | Prisma.Course$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Course$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Course$deleted_byArgs<ExtArgs>;
}, ExtArgs["result"]["course"]>;
export type CourseSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    created_by?: boolean | Prisma.Course$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Course$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Course$deleted_byArgs<ExtArgs>;
}, ExtArgs["result"]["course"]>;
export type CourseSelectScalar = {
    id?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
};
export type CourseOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "created_at" | "updated_at" | "is_deleted" | "deleted_at" | "createdById" | "updatedById" | "deletedById", ExtArgs["result"]["course"]>;
export type CourseInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    created_by?: boolean | Prisma.Course$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Course$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Course$deleted_byArgs<ExtArgs>;
    chapters?: boolean | Prisma.Course$chaptersArgs<ExtArgs>;
    enrollments?: boolean | Prisma.Course$enrollmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourseCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CourseIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    created_by?: boolean | Prisma.Course$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Course$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Course$deleted_byArgs<ExtArgs>;
};
export type CourseIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    created_by?: boolean | Prisma.Course$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Course$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Course$deleted_byArgs<ExtArgs>;
};
export type $CoursePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Course";
    objects: {
        created_by: Prisma.$UserPayload<ExtArgs> | null;
        updated_by: Prisma.$UserPayload<ExtArgs> | null;
        deleted_by: Prisma.$UserPayload<ExtArgs> | null;
        chapters: Prisma.$ChapterPayload<ExtArgs>[];
        enrollments: Prisma.$EnrollmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
        deleted_at: Date | null;
        createdById: string | null;
        updatedById: string | null;
        deletedById: string | null;
    }, ExtArgs["result"]["course"]>;
    composites: {};
};
export type CourseGetPayload<S extends boolean | null | undefined | CourseDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CoursePayload, S>;
export type CourseCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourseCountAggregateInputType | true;
};
export interface CourseDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Course'];
        meta: {
            name: 'Course';
        };
    };
    findUnique<T extends CourseFindUniqueArgs>(args: Prisma.SelectSubset<T, CourseFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourseFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourseFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourseFindFirstArgs>(args?: Prisma.SelectSubset<T, CourseFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourseFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourseFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourseFindManyArgs>(args?: Prisma.SelectSubset<T, CourseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourseCreateArgs>(args: Prisma.SelectSubset<T, CourseCreateArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourseCreateManyArgs>(args?: Prisma.SelectSubset<T, CourseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourseCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourseDeleteArgs>(args: Prisma.SelectSubset<T, CourseDeleteArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourseUpdateArgs>(args: Prisma.SelectSubset<T, CourseUpdateArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourseDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourseUpdateManyArgs>(args: Prisma.SelectSubset<T, CourseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourseUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourseUpsertArgs>(args: Prisma.SelectSubset<T, CourseUpsertArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourseCountArgs>(args?: Prisma.Subset<T, CourseCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourseCountAggregateOutputType> : number>;
    aggregate<T extends CourseAggregateArgs>(args: Prisma.Subset<T, CourseAggregateArgs>): Prisma.PrismaPromise<GetCourseAggregateType<T>>;
    groupBy<T extends CourseGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourseGroupByArgs['orderBy'];
    } : {
        orderBy?: CourseGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourseFieldRefs;
}
export interface Prisma__CourseClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    created_by<T extends Prisma.Course$created_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Course$created_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    updated_by<T extends Prisma.Course$updated_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Course$updated_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    deleted_by<T extends Prisma.Course$deleted_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Course$deleted_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    chapters<T extends Prisma.Course$chaptersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Course$chaptersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    enrollments<T extends Prisma.Course$enrollmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Course$enrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourseFieldRefs {
    readonly id: Prisma.FieldRef<"Course", 'String'>;
    readonly name: Prisma.FieldRef<"Course", 'String'>;
    readonly created_at: Prisma.FieldRef<"Course", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Course", 'DateTime'>;
    readonly is_deleted: Prisma.FieldRef<"Course", 'Boolean'>;
    readonly deleted_at: Prisma.FieldRef<"Course", 'DateTime'>;
    readonly createdById: Prisma.FieldRef<"Course", 'String'>;
    readonly updatedById: Prisma.FieldRef<"Course", 'String'>;
    readonly deletedById: Prisma.FieldRef<"Course", 'String'>;
}
export type CourseFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where: Prisma.CourseWhereUniqueInput;
};
export type CourseFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where: Prisma.CourseWhereUniqueInput;
};
export type CourseFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput | Prisma.CourseOrderByWithRelationInput[];
    cursor?: Prisma.CourseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseScalarFieldEnum | Prisma.CourseScalarFieldEnum[];
};
export type CourseFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput | Prisma.CourseOrderByWithRelationInput[];
    cursor?: Prisma.CourseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseScalarFieldEnum | Prisma.CourseScalarFieldEnum[];
};
export type CourseFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput | Prisma.CourseOrderByWithRelationInput[];
    cursor?: Prisma.CourseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseScalarFieldEnum | Prisma.CourseScalarFieldEnum[];
};
export type CourseCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseCreateInput, Prisma.CourseUncheckedCreateInput>;
};
export type CourseCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourseCreateManyInput | Prisma.CourseCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourseCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    data: Prisma.CourseCreateManyInput | Prisma.CourseCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourseIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourseUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseUpdateInput, Prisma.CourseUncheckedUpdateInput>;
    where: Prisma.CourseWhereUniqueInput;
};
export type CourseUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourseUpdateManyMutationInput, Prisma.CourseUncheckedUpdateManyInput>;
    where?: Prisma.CourseWhereInput;
    limit?: number;
};
export type CourseUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseUpdateManyMutationInput, Prisma.CourseUncheckedUpdateManyInput>;
    where?: Prisma.CourseWhereInput;
    limit?: number;
    include?: Prisma.CourseIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourseUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where: Prisma.CourseWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseCreateInput, Prisma.CourseUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourseUpdateInput, Prisma.CourseUncheckedUpdateInput>;
};
export type CourseDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where: Prisma.CourseWhereUniqueInput;
};
export type CourseDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseWhereInput;
    limit?: number;
};
export type Course$created_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Course$updated_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Course$deleted_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Course$chaptersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    where?: Prisma.ChapterWhereInput;
    orderBy?: Prisma.ChapterOrderByWithRelationInput | Prisma.ChapterOrderByWithRelationInput[];
    cursor?: Prisma.ChapterWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChapterScalarFieldEnum | Prisma.ChapterScalarFieldEnum[];
};
export type Course$enrollmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    where?: Prisma.EnrollmentWhereInput;
    orderBy?: Prisma.EnrollmentOrderByWithRelationInput | Prisma.EnrollmentOrderByWithRelationInput[];
    cursor?: Prisma.EnrollmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EnrollmentScalarFieldEnum | Prisma.EnrollmentScalarFieldEnum[];
};
export type CourseDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
};
export {};
