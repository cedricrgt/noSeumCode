import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ChapterModel = runtime.Types.Result.DefaultSelection<Prisma.$ChapterPayload>;
export type AggregateChapter = {
    _count: ChapterCountAggregateOutputType | null;
    _avg: ChapterAvgAggregateOutputType | null;
    _sum: ChapterSumAggregateOutputType | null;
    _min: ChapterMinAggregateOutputType | null;
    _max: ChapterMaxAggregateOutputType | null;
};
export type ChapterAvgAggregateOutputType = {
    order_index: number | null;
};
export type ChapterSumAggregateOutputType = {
    order_index: number | null;
};
export type ChapterMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    order_index: number | null;
    is_published: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    courseId: string | null;
    parentId: string | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
};
export type ChapterMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    order_index: number | null;
    is_published: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    courseId: string | null;
    parentId: string | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
};
export type ChapterCountAggregateOutputType = {
    id: number;
    title: number;
    order_index: number;
    is_published: number;
    created_at: number;
    updated_at: number;
    is_deleted: number;
    deleted_at: number;
    courseId: number;
    parentId: number;
    createdById: number;
    updatedById: number;
    deletedById: number;
    _all: number;
};
export type ChapterAvgAggregateInputType = {
    order_index?: true;
};
export type ChapterSumAggregateInputType = {
    order_index?: true;
};
export type ChapterMinAggregateInputType = {
    id?: true;
    title?: true;
    order_index?: true;
    is_published?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    courseId?: true;
    parentId?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
};
export type ChapterMaxAggregateInputType = {
    id?: true;
    title?: true;
    order_index?: true;
    is_published?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    courseId?: true;
    parentId?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
};
export type ChapterCountAggregateInputType = {
    id?: true;
    title?: true;
    order_index?: true;
    is_published?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    courseId?: true;
    parentId?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
    _all?: true;
};
export type ChapterAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChapterWhereInput;
    orderBy?: Prisma.ChapterOrderByWithRelationInput | Prisma.ChapterOrderByWithRelationInput[];
    cursor?: Prisma.ChapterWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChapterCountAggregateInputType;
    _avg?: ChapterAvgAggregateInputType;
    _sum?: ChapterSumAggregateInputType;
    _min?: ChapterMinAggregateInputType;
    _max?: ChapterMaxAggregateInputType;
};
export type GetChapterAggregateType<T extends ChapterAggregateArgs> = {
    [P in keyof T & keyof AggregateChapter]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChapter[P]> : Prisma.GetScalarType<T[P], AggregateChapter[P]>;
};
export type ChapterGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChapterWhereInput;
    orderBy?: Prisma.ChapterOrderByWithAggregationInput | Prisma.ChapterOrderByWithAggregationInput[];
    by: Prisma.ChapterScalarFieldEnum[] | Prisma.ChapterScalarFieldEnum;
    having?: Prisma.ChapterScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChapterCountAggregateInputType | true;
    _avg?: ChapterAvgAggregateInputType;
    _sum?: ChapterSumAggregateInputType;
    _min?: ChapterMinAggregateInputType;
    _max?: ChapterMaxAggregateInputType;
};
export type ChapterGroupByOutputType = {
    id: string;
    title: string;
    order_index: number;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    deleted_at: Date | null;
    courseId: string;
    parentId: string | null;
    createdById: string;
    updatedById: string | null;
    deletedById: string | null;
    _count: ChapterCountAggregateOutputType | null;
    _avg: ChapterAvgAggregateOutputType | null;
    _sum: ChapterSumAggregateOutputType | null;
    _min: ChapterMinAggregateOutputType | null;
    _max: ChapterMaxAggregateOutputType | null;
};
type GetChapterGroupByPayload<T extends ChapterGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChapterGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChapterGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChapterGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChapterGroupByOutputType[P]>;
}>>;
export type ChapterWhereInput = {
    AND?: Prisma.ChapterWhereInput | Prisma.ChapterWhereInput[];
    OR?: Prisma.ChapterWhereInput[];
    NOT?: Prisma.ChapterWhereInput | Prisma.ChapterWhereInput[];
    id?: Prisma.StringFilter<"Chapter"> | string;
    title?: Prisma.StringFilter<"Chapter"> | string;
    order_index?: Prisma.FloatFilter<"Chapter"> | number;
    is_published?: Prisma.BoolFilter<"Chapter"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Chapter"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Chapter"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Chapter"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Chapter"> | Date | string | null;
    courseId?: Prisma.StringFilter<"Chapter"> | string;
    parentId?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    createdById?: Prisma.StringFilter<"Chapter"> | string;
    updatedById?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    parent?: Prisma.XOR<Prisma.ChapterNullableScalarRelationFilter, Prisma.ChapterWhereInput> | null;
    children?: Prisma.ChapterListRelationFilter;
    created_by?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    deleted_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    contents?: Prisma.ContentListRelationFilter;
};
export type ChapterOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    course?: Prisma.CourseOrderByWithRelationInput;
    parent?: Prisma.ChapterOrderByWithRelationInput;
    children?: Prisma.ChapterOrderByRelationAggregateInput;
    created_by?: Prisma.UserOrderByWithRelationInput;
    updated_by?: Prisma.UserOrderByWithRelationInput;
    deleted_by?: Prisma.UserOrderByWithRelationInput;
    contents?: Prisma.ContentOrderByRelationAggregateInput;
};
export type ChapterWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ChapterWhereInput | Prisma.ChapterWhereInput[];
    OR?: Prisma.ChapterWhereInput[];
    NOT?: Prisma.ChapterWhereInput | Prisma.ChapterWhereInput[];
    title?: Prisma.StringFilter<"Chapter"> | string;
    order_index?: Prisma.FloatFilter<"Chapter"> | number;
    is_published?: Prisma.BoolFilter<"Chapter"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Chapter"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Chapter"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Chapter"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Chapter"> | Date | string | null;
    courseId?: Prisma.StringFilter<"Chapter"> | string;
    parentId?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    createdById?: Prisma.StringFilter<"Chapter"> | string;
    updatedById?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    parent?: Prisma.XOR<Prisma.ChapterNullableScalarRelationFilter, Prisma.ChapterWhereInput> | null;
    children?: Prisma.ChapterListRelationFilter;
    created_by?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    deleted_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    contents?: Prisma.ContentListRelationFilter;
}, "id">;
export type ChapterOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ChapterCountOrderByAggregateInput;
    _avg?: Prisma.ChapterAvgOrderByAggregateInput;
    _max?: Prisma.ChapterMaxOrderByAggregateInput;
    _min?: Prisma.ChapterMinOrderByAggregateInput;
    _sum?: Prisma.ChapterSumOrderByAggregateInput;
};
export type ChapterScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChapterScalarWhereWithAggregatesInput | Prisma.ChapterScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChapterScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChapterScalarWhereWithAggregatesInput | Prisma.ChapterScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Chapter"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Chapter"> | string;
    order_index?: Prisma.FloatWithAggregatesFilter<"Chapter"> | number;
    is_published?: Prisma.BoolWithAggregatesFilter<"Chapter"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Chapter"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Chapter"> | Date | string;
    is_deleted?: Prisma.BoolWithAggregatesFilter<"Chapter"> | boolean;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Chapter"> | Date | string | null;
    courseId?: Prisma.StringWithAggregatesFilter<"Chapter"> | string;
    parentId?: Prisma.StringNullableWithAggregatesFilter<"Chapter"> | string | null;
    createdById?: Prisma.StringWithAggregatesFilter<"Chapter"> | string;
    updatedById?: Prisma.StringNullableWithAggregatesFilter<"Chapter"> | string | null;
    deletedById?: Prisma.StringNullableWithAggregatesFilter<"Chapter"> | string | null;
};
export type ChapterCreateInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterCreateManyInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type ChapterUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChapterUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ChapterListRelationFilter = {
    every?: Prisma.ChapterWhereInput;
    some?: Prisma.ChapterWhereInput;
    none?: Prisma.ChapterWhereInput;
};
export type ChapterOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChapterNullableScalarRelationFilter = {
    is?: Prisma.ChapterWhereInput | null;
    isNot?: Prisma.ChapterWhereInput | null;
};
export type ChapterCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type ChapterAvgOrderByAggregateInput = {
    order_index?: Prisma.SortOrder;
};
export type ChapterMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type ChapterMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type ChapterSumOrderByAggregateInput = {
    order_index?: Prisma.SortOrder;
};
export type ChapterScalarRelationFilter = {
    is?: Prisma.ChapterWhereInput;
    isNot?: Prisma.ChapterWhereInput;
};
export type ChapterCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCreated_byInput, Prisma.ChapterUncheckedCreateWithoutCreated_byInput> | Prisma.ChapterCreateWithoutCreated_byInput[] | Prisma.ChapterUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCreated_byInput | Prisma.ChapterCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.ChapterCreateManyCreated_byInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutUpdated_byInput, Prisma.ChapterUncheckedCreateWithoutUpdated_byInput> | Prisma.ChapterCreateWithoutUpdated_byInput[] | Prisma.ChapterUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutUpdated_byInput | Prisma.ChapterCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.ChapterCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterCreateNestedManyWithoutDeleted_byInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutDeleted_byInput, Prisma.ChapterUncheckedCreateWithoutDeleted_byInput> | Prisma.ChapterCreateWithoutDeleted_byInput[] | Prisma.ChapterUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutDeleted_byInput | Prisma.ChapterCreateOrConnectWithoutDeleted_byInput[];
    createMany?: Prisma.ChapterCreateManyDeleted_byInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUncheckedCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCreated_byInput, Prisma.ChapterUncheckedCreateWithoutCreated_byInput> | Prisma.ChapterCreateWithoutCreated_byInput[] | Prisma.ChapterUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCreated_byInput | Prisma.ChapterCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.ChapterCreateManyCreated_byInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUncheckedCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutUpdated_byInput, Prisma.ChapterUncheckedCreateWithoutUpdated_byInput> | Prisma.ChapterCreateWithoutUpdated_byInput[] | Prisma.ChapterUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutUpdated_byInput | Prisma.ChapterCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.ChapterCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUncheckedCreateNestedManyWithoutDeleted_byInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutDeleted_byInput, Prisma.ChapterUncheckedCreateWithoutDeleted_byInput> | Prisma.ChapterCreateWithoutDeleted_byInput[] | Prisma.ChapterUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutDeleted_byInput | Prisma.ChapterCreateOrConnectWithoutDeleted_byInput[];
    createMany?: Prisma.ChapterCreateManyDeleted_byInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCreated_byInput, Prisma.ChapterUncheckedCreateWithoutCreated_byInput> | Prisma.ChapterCreateWithoutCreated_byInput[] | Prisma.ChapterUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCreated_byInput | Prisma.ChapterCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.ChapterUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.ChapterCreateManyCreated_byInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.ChapterUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutCreated_byInput | Prisma.ChapterUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutUpdated_byInput, Prisma.ChapterUncheckedCreateWithoutUpdated_byInput> | Prisma.ChapterCreateWithoutUpdated_byInput[] | Prisma.ChapterUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutUpdated_byInput | Prisma.ChapterCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.ChapterUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.ChapterCreateManyUpdated_byInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.ChapterUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutUpdated_byInput | Prisma.ChapterUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUpdateManyWithoutDeleted_byNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutDeleted_byInput, Prisma.ChapterUncheckedCreateWithoutDeleted_byInput> | Prisma.ChapterCreateWithoutDeleted_byInput[] | Prisma.ChapterUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutDeleted_byInput | Prisma.ChapterCreateOrConnectWithoutDeleted_byInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutDeleted_byInput | Prisma.ChapterUpsertWithWhereUniqueWithoutDeleted_byInput[];
    createMany?: Prisma.ChapterCreateManyDeleted_byInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutDeleted_byInput | Prisma.ChapterUpdateWithWhereUniqueWithoutDeleted_byInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutDeleted_byInput | Prisma.ChapterUpdateManyWithWhereWithoutDeleted_byInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUncheckedUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCreated_byInput, Prisma.ChapterUncheckedCreateWithoutCreated_byInput> | Prisma.ChapterCreateWithoutCreated_byInput[] | Prisma.ChapterUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCreated_byInput | Prisma.ChapterCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.ChapterUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.ChapterCreateManyCreated_byInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.ChapterUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutCreated_byInput | Prisma.ChapterUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUncheckedUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutUpdated_byInput, Prisma.ChapterUncheckedCreateWithoutUpdated_byInput> | Prisma.ChapterCreateWithoutUpdated_byInput[] | Prisma.ChapterUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutUpdated_byInput | Prisma.ChapterCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.ChapterUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.ChapterCreateManyUpdated_byInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.ChapterUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutUpdated_byInput | Prisma.ChapterUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUncheckedUpdateManyWithoutDeleted_byNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutDeleted_byInput, Prisma.ChapterUncheckedCreateWithoutDeleted_byInput> | Prisma.ChapterCreateWithoutDeleted_byInput[] | Prisma.ChapterUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutDeleted_byInput | Prisma.ChapterCreateOrConnectWithoutDeleted_byInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutDeleted_byInput | Prisma.ChapterUpsertWithWhereUniqueWithoutDeleted_byInput[];
    createMany?: Prisma.ChapterCreateManyDeleted_byInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutDeleted_byInput | Prisma.ChapterUpdateWithWhereUniqueWithoutDeleted_byInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutDeleted_byInput | Prisma.ChapterUpdateManyWithWhereWithoutDeleted_byInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCourseInput, Prisma.ChapterUncheckedCreateWithoutCourseInput> | Prisma.ChapterCreateWithoutCourseInput[] | Prisma.ChapterUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCourseInput | Prisma.ChapterCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.ChapterCreateManyCourseInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCourseInput, Prisma.ChapterUncheckedCreateWithoutCourseInput> | Prisma.ChapterCreateWithoutCourseInput[] | Prisma.ChapterUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCourseInput | Prisma.ChapterCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.ChapterCreateManyCourseInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCourseInput, Prisma.ChapterUncheckedCreateWithoutCourseInput> | Prisma.ChapterCreateWithoutCourseInput[] | Prisma.ChapterUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCourseInput | Prisma.ChapterCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutCourseInput | Prisma.ChapterUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.ChapterCreateManyCourseInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutCourseInput | Prisma.ChapterUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutCourseInput | Prisma.ChapterUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutCourseInput, Prisma.ChapterUncheckedCreateWithoutCourseInput> | Prisma.ChapterCreateWithoutCourseInput[] | Prisma.ChapterUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutCourseInput | Prisma.ChapterCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutCourseInput | Prisma.ChapterUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.ChapterCreateManyCourseInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutCourseInput | Prisma.ChapterUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutCourseInput | Prisma.ChapterUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterCreateNestedOneWithoutChildrenInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutChildrenInput, Prisma.ChapterUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutChildrenInput;
    connect?: Prisma.ChapterWhereUniqueInput;
};
export type ChapterCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutParentInput, Prisma.ChapterUncheckedCreateWithoutParentInput> | Prisma.ChapterCreateWithoutParentInput[] | Prisma.ChapterUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutParentInput | Prisma.ChapterCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.ChapterCreateManyParentInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type ChapterUncheckedCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutParentInput, Prisma.ChapterUncheckedCreateWithoutParentInput> | Prisma.ChapterCreateWithoutParentInput[] | Prisma.ChapterUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutParentInput | Prisma.ChapterCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.ChapterCreateManyParentInputEnvelope;
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ChapterUpdateOneWithoutChildrenNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutChildrenInput, Prisma.ChapterUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutChildrenInput;
    upsert?: Prisma.ChapterUpsertWithoutChildrenInput;
    disconnect?: Prisma.ChapterWhereInput | boolean;
    delete?: Prisma.ChapterWhereInput | boolean;
    connect?: Prisma.ChapterWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ChapterUpdateToOneWithWhereWithoutChildrenInput, Prisma.ChapterUpdateWithoutChildrenInput>, Prisma.ChapterUncheckedUpdateWithoutChildrenInput>;
};
export type ChapterUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutParentInput, Prisma.ChapterUncheckedCreateWithoutParentInput> | Prisma.ChapterCreateWithoutParentInput[] | Prisma.ChapterUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutParentInput | Prisma.ChapterCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutParentInput | Prisma.ChapterUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.ChapterCreateManyParentInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutParentInput | Prisma.ChapterUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutParentInput | Prisma.ChapterUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterUncheckedUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutParentInput, Prisma.ChapterUncheckedCreateWithoutParentInput> | Prisma.ChapterCreateWithoutParentInput[] | Prisma.ChapterUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutParentInput | Prisma.ChapterCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.ChapterUpsertWithWhereUniqueWithoutParentInput | Prisma.ChapterUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.ChapterCreateManyParentInputEnvelope;
    set?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    disconnect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    delete?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    connect?: Prisma.ChapterWhereUniqueInput | Prisma.ChapterWhereUniqueInput[];
    update?: Prisma.ChapterUpdateWithWhereUniqueWithoutParentInput | Prisma.ChapterUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.ChapterUpdateManyWithWhereWithoutParentInput | Prisma.ChapterUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
};
export type ChapterCreateNestedOneWithoutContentsInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutContentsInput, Prisma.ChapterUncheckedCreateWithoutContentsInput>;
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutContentsInput;
    connect?: Prisma.ChapterWhereUniqueInput;
};
export type ChapterUpdateOneRequiredWithoutContentsNestedInput = {
    create?: Prisma.XOR<Prisma.ChapterCreateWithoutContentsInput, Prisma.ChapterUncheckedCreateWithoutContentsInput>;
    connectOrCreate?: Prisma.ChapterCreateOrConnectWithoutContentsInput;
    upsert?: Prisma.ChapterUpsertWithoutContentsInput;
    connect?: Prisma.ChapterWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ChapterUpdateToOneWithWhereWithoutContentsInput, Prisma.ChapterUpdateWithoutContentsInput>, Prisma.ChapterUncheckedUpdateWithoutContentsInput>;
};
export type ChapterCreateWithoutCreated_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateWithoutCreated_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterCreateOrConnectWithoutCreated_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutCreated_byInput, Prisma.ChapterUncheckedCreateWithoutCreated_byInput>;
};
export type ChapterCreateManyCreated_byInputEnvelope = {
    data: Prisma.ChapterCreateManyCreated_byInput | Prisma.ChapterCreateManyCreated_byInput[];
    skipDuplicates?: boolean;
};
export type ChapterCreateWithoutUpdated_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateWithoutUpdated_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    deletedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterCreateOrConnectWithoutUpdated_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutUpdated_byInput, Prisma.ChapterUncheckedCreateWithoutUpdated_byInput>;
};
export type ChapterCreateManyUpdated_byInputEnvelope = {
    data: Prisma.ChapterCreateManyUpdated_byInput | Prisma.ChapterCreateManyUpdated_byInput[];
    skipDuplicates?: boolean;
};
export type ChapterCreateWithoutDeleted_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateWithoutDeleted_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterCreateOrConnectWithoutDeleted_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutDeleted_byInput, Prisma.ChapterUncheckedCreateWithoutDeleted_byInput>;
};
export type ChapterCreateManyDeleted_byInputEnvelope = {
    data: Prisma.ChapterCreateManyDeleted_byInput | Prisma.ChapterCreateManyDeleted_byInput[];
    skipDuplicates?: boolean;
};
export type ChapterUpsertWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutCreated_byInput, Prisma.ChapterUncheckedUpdateWithoutCreated_byInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutCreated_byInput, Prisma.ChapterUncheckedCreateWithoutCreated_byInput>;
};
export type ChapterUpdateWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutCreated_byInput, Prisma.ChapterUncheckedUpdateWithoutCreated_byInput>;
};
export type ChapterUpdateManyWithWhereWithoutCreated_byInput = {
    where: Prisma.ChapterScalarWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyWithoutCreated_byInput>;
};
export type ChapterScalarWhereInput = {
    AND?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
    OR?: Prisma.ChapterScalarWhereInput[];
    NOT?: Prisma.ChapterScalarWhereInput | Prisma.ChapterScalarWhereInput[];
    id?: Prisma.StringFilter<"Chapter"> | string;
    title?: Prisma.StringFilter<"Chapter"> | string;
    order_index?: Prisma.FloatFilter<"Chapter"> | number;
    is_published?: Prisma.BoolFilter<"Chapter"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Chapter"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Chapter"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Chapter"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Chapter"> | Date | string | null;
    courseId?: Prisma.StringFilter<"Chapter"> | string;
    parentId?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    createdById?: Prisma.StringFilter<"Chapter"> | string;
    updatedById?: Prisma.StringNullableFilter<"Chapter"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Chapter"> | string | null;
};
export type ChapterUpsertWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutUpdated_byInput, Prisma.ChapterUncheckedUpdateWithoutUpdated_byInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutUpdated_byInput, Prisma.ChapterUncheckedCreateWithoutUpdated_byInput>;
};
export type ChapterUpdateWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutUpdated_byInput, Prisma.ChapterUncheckedUpdateWithoutUpdated_byInput>;
};
export type ChapterUpdateManyWithWhereWithoutUpdated_byInput = {
    where: Prisma.ChapterScalarWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyWithoutUpdated_byInput>;
};
export type ChapterUpsertWithWhereUniqueWithoutDeleted_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutDeleted_byInput, Prisma.ChapterUncheckedUpdateWithoutDeleted_byInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutDeleted_byInput, Prisma.ChapterUncheckedCreateWithoutDeleted_byInput>;
};
export type ChapterUpdateWithWhereUniqueWithoutDeleted_byInput = {
    where: Prisma.ChapterWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutDeleted_byInput, Prisma.ChapterUncheckedUpdateWithoutDeleted_byInput>;
};
export type ChapterUpdateManyWithWhereWithoutDeleted_byInput = {
    where: Prisma.ChapterScalarWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyWithoutDeleted_byInput>;
};
export type ChapterCreateWithoutCourseInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateWithoutCourseInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterCreateOrConnectWithoutCourseInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutCourseInput, Prisma.ChapterUncheckedCreateWithoutCourseInput>;
};
export type ChapterCreateManyCourseInputEnvelope = {
    data: Prisma.ChapterCreateManyCourseInput | Prisma.ChapterCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type ChapterUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.ChapterWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutCourseInput, Prisma.ChapterUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutCourseInput, Prisma.ChapterUncheckedCreateWithoutCourseInput>;
};
export type ChapterUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.ChapterWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutCourseInput, Prisma.ChapterUncheckedUpdateWithoutCourseInput>;
};
export type ChapterUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.ChapterScalarWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyWithoutCourseInput>;
};
export type ChapterCreateWithoutChildrenInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateWithoutChildrenInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterCreateOrConnectWithoutChildrenInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutChildrenInput, Prisma.ChapterUncheckedCreateWithoutChildrenInput>;
};
export type ChapterCreateWithoutParentInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
    contents?: Prisma.ContentCreateNestedManyWithoutChapterInput;
};
export type ChapterUncheckedCreateWithoutParentInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
    contents?: Prisma.ContentUncheckedCreateNestedManyWithoutChapterInput;
};
export type ChapterCreateOrConnectWithoutParentInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutParentInput, Prisma.ChapterUncheckedCreateWithoutParentInput>;
};
export type ChapterCreateManyParentInputEnvelope = {
    data: Prisma.ChapterCreateManyParentInput | Prisma.ChapterCreateManyParentInput[];
    skipDuplicates?: boolean;
};
export type ChapterUpsertWithoutChildrenInput = {
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutChildrenInput, Prisma.ChapterUncheckedUpdateWithoutChildrenInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutChildrenInput, Prisma.ChapterUncheckedCreateWithoutChildrenInput>;
    where?: Prisma.ChapterWhereInput;
};
export type ChapterUpdateToOneWithWhereWithoutChildrenInput = {
    where?: Prisma.ChapterWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutChildrenInput, Prisma.ChapterUncheckedUpdateWithoutChildrenInput>;
};
export type ChapterUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterUpsertWithWhereUniqueWithoutParentInput = {
    where: Prisma.ChapterWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutParentInput, Prisma.ChapterUncheckedUpdateWithoutParentInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutParentInput, Prisma.ChapterUncheckedCreateWithoutParentInput>;
};
export type ChapterUpdateWithWhereUniqueWithoutParentInput = {
    where: Prisma.ChapterWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutParentInput, Prisma.ChapterUncheckedUpdateWithoutParentInput>;
};
export type ChapterUpdateManyWithWhereWithoutParentInput = {
    where: Prisma.ChapterScalarWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyWithoutParentInput>;
};
export type ChapterCreateWithoutContentsInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutChaptersInput;
    parent?: Prisma.ChapterCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ChapterCreateNestedManyWithoutParentInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedChaptersInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedChaptersInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedChaptersInput;
};
export type ChapterUncheckedCreateWithoutContentsInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
    children?: Prisma.ChapterUncheckedCreateNestedManyWithoutParentInput;
};
export type ChapterCreateOrConnectWithoutContentsInput = {
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutContentsInput, Prisma.ChapterUncheckedCreateWithoutContentsInput>;
};
export type ChapterUpsertWithoutContentsInput = {
    update: Prisma.XOR<Prisma.ChapterUpdateWithoutContentsInput, Prisma.ChapterUncheckedUpdateWithoutContentsInput>;
    create: Prisma.XOR<Prisma.ChapterCreateWithoutContentsInput, Prisma.ChapterUncheckedCreateWithoutContentsInput>;
    where?: Prisma.ChapterWhereInput;
};
export type ChapterUpdateToOneWithWhereWithoutContentsInput = {
    where?: Prisma.ChapterWhereInput;
    data: Prisma.XOR<Prisma.ChapterUpdateWithoutContentsInput, Prisma.ChapterUncheckedUpdateWithoutContentsInput>;
};
export type ChapterUpdateWithoutContentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
};
export type ChapterUncheckedUpdateWithoutContentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
};
export type ChapterCreateManyCreated_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type ChapterCreateManyUpdated_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    deletedById?: string | null;
};
export type ChapterCreateManyDeleted_byInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
};
export type ChapterUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateManyWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ChapterUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateManyWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ChapterUpdateWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateManyWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ChapterCreateManyCourseInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    parentId?: string | null;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type ChapterUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    parent?: Prisma.ChapterUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateManyWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ChapterCreateManyParentInput = {
    id?: string;
    title: string;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    courseId: string;
    createdById: string;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type ChapterUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput;
    children?: Prisma.ChapterUpdateManyWithoutParentNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedChaptersNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedChaptersNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedChaptersNestedInput;
    contents?: Prisma.ContentUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    children?: Prisma.ChapterUncheckedUpdateManyWithoutParentNestedInput;
    contents?: Prisma.ContentUncheckedUpdateManyWithoutChapterNestedInput;
};
export type ChapterUncheckedUpdateManyWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ChapterCountOutputType = {
    children: number;
    contents: number;
};
export type ChapterCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    children?: boolean | ChapterCountOutputTypeCountChildrenArgs;
    contents?: boolean | ChapterCountOutputTypeCountContentsArgs;
};
export type ChapterCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterCountOutputTypeSelect<ExtArgs> | null;
};
export type ChapterCountOutputTypeCountChildrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChapterWhereInput;
};
export type ChapterCountOutputTypeCountContentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContentWhereInput;
};
export type ChapterSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    courseId?: boolean;
    parentId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Chapter$parentArgs<ExtArgs>;
    children?: boolean | Prisma.Chapter$childrenArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Chapter$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Chapter$deleted_byArgs<ExtArgs>;
    contents?: boolean | Prisma.Chapter$contentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ChapterCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["chapter"]>;
export type ChapterSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    courseId?: boolean;
    parentId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Chapter$parentArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Chapter$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Chapter$deleted_byArgs<ExtArgs>;
}, ExtArgs["result"]["chapter"]>;
export type ChapterSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    courseId?: boolean;
    parentId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Chapter$parentArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Chapter$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Chapter$deleted_byArgs<ExtArgs>;
}, ExtArgs["result"]["chapter"]>;
export type ChapterSelectScalar = {
    id?: boolean;
    title?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    courseId?: boolean;
    parentId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
};
export type ChapterOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "order_index" | "is_published" | "created_at" | "updated_at" | "is_deleted" | "deleted_at" | "courseId" | "parentId" | "createdById" | "updatedById" | "deletedById", ExtArgs["result"]["chapter"]>;
export type ChapterInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Chapter$parentArgs<ExtArgs>;
    children?: boolean | Prisma.Chapter$childrenArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Chapter$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Chapter$deleted_byArgs<ExtArgs>;
    contents?: boolean | Prisma.Chapter$contentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ChapterCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ChapterIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Chapter$parentArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Chapter$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Chapter$deleted_byArgs<ExtArgs>;
};
export type ChapterIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Chapter$parentArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Chapter$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Chapter$deleted_byArgs<ExtArgs>;
};
export type $ChapterPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Chapter";
    objects: {
        course: Prisma.$CoursePayload<ExtArgs>;
        parent: Prisma.$ChapterPayload<ExtArgs> | null;
        children: Prisma.$ChapterPayload<ExtArgs>[];
        created_by: Prisma.$UserPayload<ExtArgs>;
        updated_by: Prisma.$UserPayload<ExtArgs> | null;
        deleted_by: Prisma.$UserPayload<ExtArgs> | null;
        contents: Prisma.$ContentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        order_index: number;
        is_published: boolean;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
        deleted_at: Date | null;
        courseId: string;
        parentId: string | null;
        createdById: string;
        updatedById: string | null;
        deletedById: string | null;
    }, ExtArgs["result"]["chapter"]>;
    composites: {};
};
export type ChapterGetPayload<S extends boolean | null | undefined | ChapterDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChapterPayload, S>;
export type ChapterCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChapterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChapterCountAggregateInputType | true;
};
export interface ChapterDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Chapter'];
        meta: {
            name: 'Chapter';
        };
    };
    findUnique<T extends ChapterFindUniqueArgs>(args: Prisma.SelectSubset<T, ChapterFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChapterFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChapterFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChapterFindFirstArgs>(args?: Prisma.SelectSubset<T, ChapterFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChapterFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChapterFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChapterFindManyArgs>(args?: Prisma.SelectSubset<T, ChapterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChapterCreateArgs>(args: Prisma.SelectSubset<T, ChapterCreateArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChapterCreateManyArgs>(args?: Prisma.SelectSubset<T, ChapterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChapterCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChapterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChapterDeleteArgs>(args: Prisma.SelectSubset<T, ChapterDeleteArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChapterUpdateArgs>(args: Prisma.SelectSubset<T, ChapterUpdateArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChapterDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChapterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChapterUpdateManyArgs>(args: Prisma.SelectSubset<T, ChapterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChapterUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChapterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChapterUpsertArgs>(args: Prisma.SelectSubset<T, ChapterUpsertArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChapterCountArgs>(args?: Prisma.Subset<T, ChapterCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChapterCountAggregateOutputType> : number>;
    aggregate<T extends ChapterAggregateArgs>(args: Prisma.Subset<T, ChapterAggregateArgs>): Prisma.PrismaPromise<GetChapterAggregateType<T>>;
    groupBy<T extends ChapterGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChapterGroupByArgs['orderBy'];
    } : {
        orderBy?: ChapterGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChapterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChapterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChapterFieldRefs;
}
export interface Prisma__ChapterClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    course<T extends Prisma.CourseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parent<T extends Prisma.Chapter$parentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Chapter$parentArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    children<T extends Prisma.Chapter$childrenArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Chapter$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    created_by<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    updated_by<T extends Prisma.Chapter$updated_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Chapter$updated_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    deleted_by<T extends Prisma.Chapter$deleted_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Chapter$deleted_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    contents<T extends Prisma.Chapter$contentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Chapter$contentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChapterFieldRefs {
    readonly id: Prisma.FieldRef<"Chapter", 'String'>;
    readonly title: Prisma.FieldRef<"Chapter", 'String'>;
    readonly order_index: Prisma.FieldRef<"Chapter", 'Float'>;
    readonly is_published: Prisma.FieldRef<"Chapter", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Chapter", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Chapter", 'DateTime'>;
    readonly is_deleted: Prisma.FieldRef<"Chapter", 'Boolean'>;
    readonly deleted_at: Prisma.FieldRef<"Chapter", 'DateTime'>;
    readonly courseId: Prisma.FieldRef<"Chapter", 'String'>;
    readonly parentId: Prisma.FieldRef<"Chapter", 'String'>;
    readonly createdById: Prisma.FieldRef<"Chapter", 'String'>;
    readonly updatedById: Prisma.FieldRef<"Chapter", 'String'>;
    readonly deletedById: Prisma.FieldRef<"Chapter", 'String'>;
}
export type ChapterFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    where: Prisma.ChapterWhereUniqueInput;
};
export type ChapterFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    where: Prisma.ChapterWhereUniqueInput;
};
export type ChapterFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChapterFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChapterFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChapterCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChapterCreateInput, Prisma.ChapterUncheckedCreateInput>;
};
export type ChapterCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChapterCreateManyInput | Prisma.ChapterCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChapterCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    data: Prisma.ChapterCreateManyInput | Prisma.ChapterCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChapterIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChapterUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChapterUpdateInput, Prisma.ChapterUncheckedUpdateInput>;
    where: Prisma.ChapterWhereUniqueInput;
};
export type ChapterUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyInput>;
    where?: Prisma.ChapterWhereInput;
    limit?: number;
};
export type ChapterUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChapterUpdateManyMutationInput, Prisma.ChapterUncheckedUpdateManyInput>;
    where?: Prisma.ChapterWhereInput;
    limit?: number;
    include?: Prisma.ChapterIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChapterUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    where: Prisma.ChapterWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChapterCreateInput, Prisma.ChapterUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChapterUpdateInput, Prisma.ChapterUncheckedUpdateInput>;
};
export type ChapterDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    where: Prisma.ChapterWhereUniqueInput;
};
export type ChapterDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChapterWhereInput;
    limit?: number;
};
export type Chapter$parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
    where?: Prisma.ChapterWhereInput;
};
export type Chapter$childrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Chapter$updated_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Chapter$deleted_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Chapter$contentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    where?: Prisma.ContentWhereInput;
    orderBy?: Prisma.ContentOrderByWithRelationInput | Prisma.ContentOrderByWithRelationInput[];
    cursor?: Prisma.ContentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ContentScalarFieldEnum | Prisma.ContentScalarFieldEnum[];
};
export type ChapterDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChapterSelect<ExtArgs> | null;
    omit?: Prisma.ChapterOmit<ExtArgs> | null;
    include?: Prisma.ChapterInclude<ExtArgs> | null;
};
export {};
