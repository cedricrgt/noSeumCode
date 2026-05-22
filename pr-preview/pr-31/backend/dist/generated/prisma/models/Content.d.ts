import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ContentModel = runtime.Types.Result.DefaultSelection<Prisma.$ContentPayload>;
export type AggregateContent = {
    _count: ContentCountAggregateOutputType | null;
    _avg: ContentAvgAggregateOutputType | null;
    _sum: ContentSumAggregateOutputType | null;
    _min: ContentMinAggregateOutputType | null;
    _max: ContentMaxAggregateOutputType | null;
};
export type ContentAvgAggregateOutputType = {
    order_index: number | null;
};
export type ContentSumAggregateOutputType = {
    order_index: number | null;
};
export type ContentMinAggregateOutputType = {
    id: string | null;
    content_type: $Enums.ContentType | null;
    title: string | null;
    body: string | null;
    media_url: string | null;
    order_index: number | null;
    is_published: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    chapterId: string | null;
    createdById: string | null;
    updatedById: string | null;
};
export type ContentMaxAggregateOutputType = {
    id: string | null;
    content_type: $Enums.ContentType | null;
    title: string | null;
    body: string | null;
    media_url: string | null;
    order_index: number | null;
    is_published: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    chapterId: string | null;
    createdById: string | null;
    updatedById: string | null;
};
export type ContentCountAggregateOutputType = {
    id: number;
    content_type: number;
    title: number;
    body: number;
    media_url: number;
    order_index: number;
    is_published: number;
    created_at: number;
    updated_at: number;
    is_deleted: number;
    deleted_at: number;
    chapterId: number;
    createdById: number;
    updatedById: number;
    _all: number;
};
export type ContentAvgAggregateInputType = {
    order_index?: true;
};
export type ContentSumAggregateInputType = {
    order_index?: true;
};
export type ContentMinAggregateInputType = {
    id?: true;
    content_type?: true;
    title?: true;
    body?: true;
    media_url?: true;
    order_index?: true;
    is_published?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    chapterId?: true;
    createdById?: true;
    updatedById?: true;
};
export type ContentMaxAggregateInputType = {
    id?: true;
    content_type?: true;
    title?: true;
    body?: true;
    media_url?: true;
    order_index?: true;
    is_published?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    chapterId?: true;
    createdById?: true;
    updatedById?: true;
};
export type ContentCountAggregateInputType = {
    id?: true;
    content_type?: true;
    title?: true;
    body?: true;
    media_url?: true;
    order_index?: true;
    is_published?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    chapterId?: true;
    createdById?: true;
    updatedById?: true;
    _all?: true;
};
export type ContentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContentWhereInput;
    orderBy?: Prisma.ContentOrderByWithRelationInput | Prisma.ContentOrderByWithRelationInput[];
    cursor?: Prisma.ContentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ContentCountAggregateInputType;
    _avg?: ContentAvgAggregateInputType;
    _sum?: ContentSumAggregateInputType;
    _min?: ContentMinAggregateInputType;
    _max?: ContentMaxAggregateInputType;
};
export type GetContentAggregateType<T extends ContentAggregateArgs> = {
    [P in keyof T & keyof AggregateContent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateContent[P]> : Prisma.GetScalarType<T[P], AggregateContent[P]>;
};
export type ContentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContentWhereInput;
    orderBy?: Prisma.ContentOrderByWithAggregationInput | Prisma.ContentOrderByWithAggregationInput[];
    by: Prisma.ContentScalarFieldEnum[] | Prisma.ContentScalarFieldEnum;
    having?: Prisma.ContentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ContentCountAggregateInputType | true;
    _avg?: ContentAvgAggregateInputType;
    _sum?: ContentSumAggregateInputType;
    _min?: ContentMinAggregateInputType;
    _max?: ContentMaxAggregateInputType;
};
export type ContentGroupByOutputType = {
    id: string;
    content_type: $Enums.ContentType;
    title: string | null;
    body: string | null;
    media_url: string | null;
    order_index: number;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    deleted_at: Date | null;
    chapterId: string;
    createdById: string;
    updatedById: string | null;
    _count: ContentCountAggregateOutputType | null;
    _avg: ContentAvgAggregateOutputType | null;
    _sum: ContentSumAggregateOutputType | null;
    _min: ContentMinAggregateOutputType | null;
    _max: ContentMaxAggregateOutputType | null;
};
type GetContentGroupByPayload<T extends ContentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ContentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ContentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ContentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ContentGroupByOutputType[P]>;
}>>;
export type ContentWhereInput = {
    AND?: Prisma.ContentWhereInput | Prisma.ContentWhereInput[];
    OR?: Prisma.ContentWhereInput[];
    NOT?: Prisma.ContentWhereInput | Prisma.ContentWhereInput[];
    id?: Prisma.StringFilter<"Content"> | string;
    content_type?: Prisma.EnumContentTypeFilter<"Content"> | $Enums.ContentType;
    title?: Prisma.StringNullableFilter<"Content"> | string | null;
    body?: Prisma.StringNullableFilter<"Content"> | string | null;
    media_url?: Prisma.StringNullableFilter<"Content"> | string | null;
    order_index?: Prisma.FloatFilter<"Content"> | number;
    is_published?: Prisma.BoolFilter<"Content"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Content"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Content"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Content"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Content"> | Date | string | null;
    chapterId?: Prisma.StringFilter<"Content"> | string;
    createdById?: Prisma.StringFilter<"Content"> | string;
    updatedById?: Prisma.StringNullableFilter<"Content"> | string | null;
    chapter?: Prisma.XOR<Prisma.ChapterScalarRelationFilter, Prisma.ChapterWhereInput>;
    created_by?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type ContentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    content_type?: Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    body?: Prisma.SortOrderInput | Prisma.SortOrder;
    media_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    chapterId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    chapter?: Prisma.ChapterOrderByWithRelationInput;
    created_by?: Prisma.UserOrderByWithRelationInput;
    updated_by?: Prisma.UserOrderByWithRelationInput;
};
export type ContentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ContentWhereInput | Prisma.ContentWhereInput[];
    OR?: Prisma.ContentWhereInput[];
    NOT?: Prisma.ContentWhereInput | Prisma.ContentWhereInput[];
    content_type?: Prisma.EnumContentTypeFilter<"Content"> | $Enums.ContentType;
    title?: Prisma.StringNullableFilter<"Content"> | string | null;
    body?: Prisma.StringNullableFilter<"Content"> | string | null;
    media_url?: Prisma.StringNullableFilter<"Content"> | string | null;
    order_index?: Prisma.FloatFilter<"Content"> | number;
    is_published?: Prisma.BoolFilter<"Content"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Content"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Content"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Content"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Content"> | Date | string | null;
    chapterId?: Prisma.StringFilter<"Content"> | string;
    createdById?: Prisma.StringFilter<"Content"> | string;
    updatedById?: Prisma.StringNullableFilter<"Content"> | string | null;
    chapter?: Prisma.XOR<Prisma.ChapterScalarRelationFilter, Prisma.ChapterWhereInput>;
    created_by?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type ContentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    content_type?: Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    body?: Prisma.SortOrderInput | Prisma.SortOrder;
    media_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    chapterId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ContentCountOrderByAggregateInput;
    _avg?: Prisma.ContentAvgOrderByAggregateInput;
    _max?: Prisma.ContentMaxOrderByAggregateInput;
    _min?: Prisma.ContentMinOrderByAggregateInput;
    _sum?: Prisma.ContentSumOrderByAggregateInput;
};
export type ContentScalarWhereWithAggregatesInput = {
    AND?: Prisma.ContentScalarWhereWithAggregatesInput | Prisma.ContentScalarWhereWithAggregatesInput[];
    OR?: Prisma.ContentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ContentScalarWhereWithAggregatesInput | Prisma.ContentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Content"> | string;
    content_type?: Prisma.EnumContentTypeWithAggregatesFilter<"Content"> | $Enums.ContentType;
    title?: Prisma.StringNullableWithAggregatesFilter<"Content"> | string | null;
    body?: Prisma.StringNullableWithAggregatesFilter<"Content"> | string | null;
    media_url?: Prisma.StringNullableWithAggregatesFilter<"Content"> | string | null;
    order_index?: Prisma.FloatWithAggregatesFilter<"Content"> | number;
    is_published?: Prisma.BoolWithAggregatesFilter<"Content"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Content"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Content"> | Date | string;
    is_deleted?: Prisma.BoolWithAggregatesFilter<"Content"> | boolean;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Content"> | Date | string | null;
    chapterId?: Prisma.StringWithAggregatesFilter<"Content"> | string;
    createdById?: Prisma.StringWithAggregatesFilter<"Content"> | string;
    updatedById?: Prisma.StringNullableWithAggregatesFilter<"Content"> | string | null;
};
export type ContentCreateInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapter: Prisma.ChapterCreateNestedOneWithoutContentsInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedContentsInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedContentsInput;
};
export type ContentUncheckedCreateInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapterId: string;
    createdById: string;
    updatedById?: string | null;
};
export type ContentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapter?: Prisma.ChapterUpdateOneRequiredWithoutContentsNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedContentsNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedContentsNestedInput;
};
export type ContentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapterId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ContentCreateManyInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapterId: string;
    createdById: string;
    updatedById?: string | null;
};
export type ContentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ContentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapterId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ContentListRelationFilter = {
    every?: Prisma.ContentWhereInput;
    some?: Prisma.ContentWhereInput;
    none?: Prisma.ContentWhereInput;
};
export type ContentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ContentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content_type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    media_url?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    chapterId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
};
export type ContentAvgOrderByAggregateInput = {
    order_index?: Prisma.SortOrder;
};
export type ContentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content_type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    media_url?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    chapterId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
};
export type ContentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    content_type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    media_url?: Prisma.SortOrder;
    order_index?: Prisma.SortOrder;
    is_published?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    chapterId?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
};
export type ContentSumOrderByAggregateInput = {
    order_index?: Prisma.SortOrder;
};
export type ContentCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutCreated_byInput, Prisma.ContentUncheckedCreateWithoutCreated_byInput> | Prisma.ContentCreateWithoutCreated_byInput[] | Prisma.ContentUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutCreated_byInput | Prisma.ContentCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.ContentCreateManyCreated_byInputEnvelope;
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
};
export type ContentCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutUpdated_byInput, Prisma.ContentUncheckedCreateWithoutUpdated_byInput> | Prisma.ContentCreateWithoutUpdated_byInput[] | Prisma.ContentUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutUpdated_byInput | Prisma.ContentCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.ContentCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
};
export type ContentUncheckedCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutCreated_byInput, Prisma.ContentUncheckedCreateWithoutCreated_byInput> | Prisma.ContentCreateWithoutCreated_byInput[] | Prisma.ContentUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutCreated_byInput | Prisma.ContentCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.ContentCreateManyCreated_byInputEnvelope;
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
};
export type ContentUncheckedCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutUpdated_byInput, Prisma.ContentUncheckedCreateWithoutUpdated_byInput> | Prisma.ContentCreateWithoutUpdated_byInput[] | Prisma.ContentUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutUpdated_byInput | Prisma.ContentCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.ContentCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
};
export type ContentUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutCreated_byInput, Prisma.ContentUncheckedCreateWithoutCreated_byInput> | Prisma.ContentCreateWithoutCreated_byInput[] | Prisma.ContentUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutCreated_byInput | Prisma.ContentCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.ContentUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.ContentUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.ContentCreateManyCreated_byInputEnvelope;
    set?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    disconnect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    delete?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    update?: Prisma.ContentUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.ContentUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.ContentUpdateManyWithWhereWithoutCreated_byInput | Prisma.ContentUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
};
export type ContentUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutUpdated_byInput, Prisma.ContentUncheckedCreateWithoutUpdated_byInput> | Prisma.ContentCreateWithoutUpdated_byInput[] | Prisma.ContentUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutUpdated_byInput | Prisma.ContentCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.ContentUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.ContentUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.ContentCreateManyUpdated_byInputEnvelope;
    set?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    disconnect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    delete?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    update?: Prisma.ContentUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.ContentUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.ContentUpdateManyWithWhereWithoutUpdated_byInput | Prisma.ContentUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
};
export type ContentUncheckedUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutCreated_byInput, Prisma.ContentUncheckedCreateWithoutCreated_byInput> | Prisma.ContentCreateWithoutCreated_byInput[] | Prisma.ContentUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutCreated_byInput | Prisma.ContentCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.ContentUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.ContentUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.ContentCreateManyCreated_byInputEnvelope;
    set?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    disconnect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    delete?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    update?: Prisma.ContentUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.ContentUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.ContentUpdateManyWithWhereWithoutCreated_byInput | Prisma.ContentUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
};
export type ContentUncheckedUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutUpdated_byInput, Prisma.ContentUncheckedCreateWithoutUpdated_byInput> | Prisma.ContentCreateWithoutUpdated_byInput[] | Prisma.ContentUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutUpdated_byInput | Prisma.ContentCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.ContentUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.ContentUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.ContentCreateManyUpdated_byInputEnvelope;
    set?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    disconnect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    delete?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    update?: Prisma.ContentUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.ContentUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.ContentUpdateManyWithWhereWithoutUpdated_byInput | Prisma.ContentUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
};
export type ContentCreateNestedManyWithoutChapterInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutChapterInput, Prisma.ContentUncheckedCreateWithoutChapterInput> | Prisma.ContentCreateWithoutChapterInput[] | Prisma.ContentUncheckedCreateWithoutChapterInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutChapterInput | Prisma.ContentCreateOrConnectWithoutChapterInput[];
    createMany?: Prisma.ContentCreateManyChapterInputEnvelope;
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
};
export type ContentUncheckedCreateNestedManyWithoutChapterInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutChapterInput, Prisma.ContentUncheckedCreateWithoutChapterInput> | Prisma.ContentCreateWithoutChapterInput[] | Prisma.ContentUncheckedCreateWithoutChapterInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutChapterInput | Prisma.ContentCreateOrConnectWithoutChapterInput[];
    createMany?: Prisma.ContentCreateManyChapterInputEnvelope;
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
};
export type ContentUpdateManyWithoutChapterNestedInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutChapterInput, Prisma.ContentUncheckedCreateWithoutChapterInput> | Prisma.ContentCreateWithoutChapterInput[] | Prisma.ContentUncheckedCreateWithoutChapterInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutChapterInput | Prisma.ContentCreateOrConnectWithoutChapterInput[];
    upsert?: Prisma.ContentUpsertWithWhereUniqueWithoutChapterInput | Prisma.ContentUpsertWithWhereUniqueWithoutChapterInput[];
    createMany?: Prisma.ContentCreateManyChapterInputEnvelope;
    set?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    disconnect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    delete?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    update?: Prisma.ContentUpdateWithWhereUniqueWithoutChapterInput | Prisma.ContentUpdateWithWhereUniqueWithoutChapterInput[];
    updateMany?: Prisma.ContentUpdateManyWithWhereWithoutChapterInput | Prisma.ContentUpdateManyWithWhereWithoutChapterInput[];
    deleteMany?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
};
export type ContentUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: Prisma.XOR<Prisma.ContentCreateWithoutChapterInput, Prisma.ContentUncheckedCreateWithoutChapterInput> | Prisma.ContentCreateWithoutChapterInput[] | Prisma.ContentUncheckedCreateWithoutChapterInput[];
    connectOrCreate?: Prisma.ContentCreateOrConnectWithoutChapterInput | Prisma.ContentCreateOrConnectWithoutChapterInput[];
    upsert?: Prisma.ContentUpsertWithWhereUniqueWithoutChapterInput | Prisma.ContentUpsertWithWhereUniqueWithoutChapterInput[];
    createMany?: Prisma.ContentCreateManyChapterInputEnvelope;
    set?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    disconnect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    delete?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    connect?: Prisma.ContentWhereUniqueInput | Prisma.ContentWhereUniqueInput[];
    update?: Prisma.ContentUpdateWithWhereUniqueWithoutChapterInput | Prisma.ContentUpdateWithWhereUniqueWithoutChapterInput[];
    updateMany?: Prisma.ContentUpdateManyWithWhereWithoutChapterInput | Prisma.ContentUpdateManyWithWhereWithoutChapterInput[];
    deleteMany?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
};
export type EnumContentTypeFieldUpdateOperationsInput = {
    set?: $Enums.ContentType;
};
export type ContentCreateWithoutCreated_byInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapter: Prisma.ChapterCreateNestedOneWithoutContentsInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedContentsInput;
};
export type ContentUncheckedCreateWithoutCreated_byInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapterId: string;
    updatedById?: string | null;
};
export type ContentCreateOrConnectWithoutCreated_byInput = {
    where: Prisma.ContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContentCreateWithoutCreated_byInput, Prisma.ContentUncheckedCreateWithoutCreated_byInput>;
};
export type ContentCreateManyCreated_byInputEnvelope = {
    data: Prisma.ContentCreateManyCreated_byInput | Prisma.ContentCreateManyCreated_byInput[];
    skipDuplicates?: boolean;
};
export type ContentCreateWithoutUpdated_byInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapter: Prisma.ChapterCreateNestedOneWithoutContentsInput;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedContentsInput;
};
export type ContentUncheckedCreateWithoutUpdated_byInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapterId: string;
    createdById: string;
};
export type ContentCreateOrConnectWithoutUpdated_byInput = {
    where: Prisma.ContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContentCreateWithoutUpdated_byInput, Prisma.ContentUncheckedCreateWithoutUpdated_byInput>;
};
export type ContentCreateManyUpdated_byInputEnvelope = {
    data: Prisma.ContentCreateManyUpdated_byInput | Prisma.ContentCreateManyUpdated_byInput[];
    skipDuplicates?: boolean;
};
export type ContentUpsertWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.ContentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ContentUpdateWithoutCreated_byInput, Prisma.ContentUncheckedUpdateWithoutCreated_byInput>;
    create: Prisma.XOR<Prisma.ContentCreateWithoutCreated_byInput, Prisma.ContentUncheckedCreateWithoutCreated_byInput>;
};
export type ContentUpdateWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.ContentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ContentUpdateWithoutCreated_byInput, Prisma.ContentUncheckedUpdateWithoutCreated_byInput>;
};
export type ContentUpdateManyWithWhereWithoutCreated_byInput = {
    where: Prisma.ContentScalarWhereInput;
    data: Prisma.XOR<Prisma.ContentUpdateManyMutationInput, Prisma.ContentUncheckedUpdateManyWithoutCreated_byInput>;
};
export type ContentScalarWhereInput = {
    AND?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
    OR?: Prisma.ContentScalarWhereInput[];
    NOT?: Prisma.ContentScalarWhereInput | Prisma.ContentScalarWhereInput[];
    id?: Prisma.StringFilter<"Content"> | string;
    content_type?: Prisma.EnumContentTypeFilter<"Content"> | $Enums.ContentType;
    title?: Prisma.StringNullableFilter<"Content"> | string | null;
    body?: Prisma.StringNullableFilter<"Content"> | string | null;
    media_url?: Prisma.StringNullableFilter<"Content"> | string | null;
    order_index?: Prisma.FloatFilter<"Content"> | number;
    is_published?: Prisma.BoolFilter<"Content"> | boolean;
    created_at?: Prisma.DateTimeFilter<"Content"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Content"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Content"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Content"> | Date | string | null;
    chapterId?: Prisma.StringFilter<"Content"> | string;
    createdById?: Prisma.StringFilter<"Content"> | string;
    updatedById?: Prisma.StringNullableFilter<"Content"> | string | null;
};
export type ContentUpsertWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.ContentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ContentUpdateWithoutUpdated_byInput, Prisma.ContentUncheckedUpdateWithoutUpdated_byInput>;
    create: Prisma.XOR<Prisma.ContentCreateWithoutUpdated_byInput, Prisma.ContentUncheckedCreateWithoutUpdated_byInput>;
};
export type ContentUpdateWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.ContentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ContentUpdateWithoutUpdated_byInput, Prisma.ContentUncheckedUpdateWithoutUpdated_byInput>;
};
export type ContentUpdateManyWithWhereWithoutUpdated_byInput = {
    where: Prisma.ContentScalarWhereInput;
    data: Prisma.XOR<Prisma.ContentUpdateManyMutationInput, Prisma.ContentUncheckedUpdateManyWithoutUpdated_byInput>;
};
export type ContentCreateWithoutChapterInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by: Prisma.UserCreateNestedOneWithoutCreatedContentsInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedContentsInput;
};
export type ContentUncheckedCreateWithoutChapterInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById: string;
    updatedById?: string | null;
};
export type ContentCreateOrConnectWithoutChapterInput = {
    where: Prisma.ContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContentCreateWithoutChapterInput, Prisma.ContentUncheckedCreateWithoutChapterInput>;
};
export type ContentCreateManyChapterInputEnvelope = {
    data: Prisma.ContentCreateManyChapterInput | Prisma.ContentCreateManyChapterInput[];
    skipDuplicates?: boolean;
};
export type ContentUpsertWithWhereUniqueWithoutChapterInput = {
    where: Prisma.ContentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ContentUpdateWithoutChapterInput, Prisma.ContentUncheckedUpdateWithoutChapterInput>;
    create: Prisma.XOR<Prisma.ContentCreateWithoutChapterInput, Prisma.ContentUncheckedCreateWithoutChapterInput>;
};
export type ContentUpdateWithWhereUniqueWithoutChapterInput = {
    where: Prisma.ContentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ContentUpdateWithoutChapterInput, Prisma.ContentUncheckedUpdateWithoutChapterInput>;
};
export type ContentUpdateManyWithWhereWithoutChapterInput = {
    where: Prisma.ContentScalarWhereInput;
    data: Prisma.XOR<Prisma.ContentUpdateManyMutationInput, Prisma.ContentUncheckedUpdateManyWithoutChapterInput>;
};
export type ContentCreateManyCreated_byInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapterId: string;
    updatedById?: string | null;
};
export type ContentCreateManyUpdated_byInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    chapterId: string;
    createdById: string;
};
export type ContentUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapter?: Prisma.ChapterUpdateOneRequiredWithoutContentsNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedContentsNestedInput;
};
export type ContentUncheckedUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapterId?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ContentUncheckedUpdateManyWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapterId?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ContentUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapter?: Prisma.ChapterUpdateOneRequiredWithoutContentsNestedInput;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedContentsNestedInput;
};
export type ContentUncheckedUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapterId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContentUncheckedUpdateManyWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    chapterId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContentCreateManyChapterInput = {
    id?: string;
    content_type: $Enums.ContentType;
    title?: string | null;
    body?: string | null;
    media_url?: string | null;
    order_index?: number;
    is_published?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById: string;
    updatedById?: string | null;
};
export type ContentUpdateWithoutChapterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneRequiredWithoutCreatedContentsNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedContentsNestedInput;
};
export type ContentUncheckedUpdateWithoutChapterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ContentUncheckedUpdateManyWithoutChapterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content_type?: Prisma.EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_index?: Prisma.FloatFieldUpdateOperationsInput | number;
    is_published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ContentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content_type?: boolean;
    title?: boolean;
    body?: boolean;
    media_url?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    chapterId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    chapter?: boolean | Prisma.ChapterDefaultArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Content$updated_byArgs<ExtArgs>;
}, ExtArgs["result"]["content"]>;
export type ContentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content_type?: boolean;
    title?: boolean;
    body?: boolean;
    media_url?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    chapterId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    chapter?: boolean | Prisma.ChapterDefaultArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Content$updated_byArgs<ExtArgs>;
}, ExtArgs["result"]["content"]>;
export type ContentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    content_type?: boolean;
    title?: boolean;
    body?: boolean;
    media_url?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    chapterId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    chapter?: boolean | Prisma.ChapterDefaultArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Content$updated_byArgs<ExtArgs>;
}, ExtArgs["result"]["content"]>;
export type ContentSelectScalar = {
    id?: boolean;
    content_type?: boolean;
    title?: boolean;
    body?: boolean;
    media_url?: boolean;
    order_index?: boolean;
    is_published?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    chapterId?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
};
export type ContentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "content_type" | "title" | "body" | "media_url" | "order_index" | "is_published" | "created_at" | "updated_at" | "is_deleted" | "deleted_at" | "chapterId" | "createdById" | "updatedById", ExtArgs["result"]["content"]>;
export type ContentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    chapter?: boolean | Prisma.ChapterDefaultArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Content$updated_byArgs<ExtArgs>;
};
export type ContentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    chapter?: boolean | Prisma.ChapterDefaultArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Content$updated_byArgs<ExtArgs>;
};
export type ContentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    chapter?: boolean | Prisma.ChapterDefaultArgs<ExtArgs>;
    created_by?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Content$updated_byArgs<ExtArgs>;
};
export type $ContentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Content";
    objects: {
        chapter: Prisma.$ChapterPayload<ExtArgs>;
        created_by: Prisma.$UserPayload<ExtArgs>;
        updated_by: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        content_type: $Enums.ContentType;
        title: string | null;
        body: string | null;
        media_url: string | null;
        order_index: number;
        is_published: boolean;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
        deleted_at: Date | null;
        chapterId: string;
        createdById: string;
        updatedById: string | null;
    }, ExtArgs["result"]["content"]>;
    composites: {};
};
export type ContentGetPayload<S extends boolean | null | undefined | ContentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ContentPayload, S>;
export type ContentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ContentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ContentCountAggregateInputType | true;
};
export interface ContentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Content'];
        meta: {
            name: 'Content';
        };
    };
    findUnique<T extends ContentFindUniqueArgs>(args: Prisma.SelectSubset<T, ContentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ContentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ContentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ContentFindFirstArgs>(args?: Prisma.SelectSubset<T, ContentFindFirstArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ContentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ContentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ContentFindManyArgs>(args?: Prisma.SelectSubset<T, ContentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ContentCreateArgs>(args: Prisma.SelectSubset<T, ContentCreateArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ContentCreateManyArgs>(args?: Prisma.SelectSubset<T, ContentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ContentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ContentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ContentDeleteArgs>(args: Prisma.SelectSubset<T, ContentDeleteArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ContentUpdateArgs>(args: Prisma.SelectSubset<T, ContentUpdateArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ContentDeleteManyArgs>(args?: Prisma.SelectSubset<T, ContentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ContentUpdateManyArgs>(args: Prisma.SelectSubset<T, ContentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ContentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ContentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ContentUpsertArgs>(args: Prisma.SelectSubset<T, ContentUpsertArgs<ExtArgs>>): Prisma.Prisma__ContentClient<runtime.Types.Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ContentCountArgs>(args?: Prisma.Subset<T, ContentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ContentCountAggregateOutputType> : number>;
    aggregate<T extends ContentAggregateArgs>(args: Prisma.Subset<T, ContentAggregateArgs>): Prisma.PrismaPromise<GetContentAggregateType<T>>;
    groupBy<T extends ContentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ContentGroupByArgs['orderBy'];
    } : {
        orderBy?: ContentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ContentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ContentFieldRefs;
}
export interface Prisma__ContentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    chapter<T extends Prisma.ChapterDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChapterDefaultArgs<ExtArgs>>): Prisma.Prisma__ChapterClient<runtime.Types.Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    created_by<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    updated_by<T extends Prisma.Content$updated_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Content$updated_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ContentFieldRefs {
    readonly id: Prisma.FieldRef<"Content", 'String'>;
    readonly content_type: Prisma.FieldRef<"Content", 'ContentType'>;
    readonly title: Prisma.FieldRef<"Content", 'String'>;
    readonly body: Prisma.FieldRef<"Content", 'String'>;
    readonly media_url: Prisma.FieldRef<"Content", 'String'>;
    readonly order_index: Prisma.FieldRef<"Content", 'Float'>;
    readonly is_published: Prisma.FieldRef<"Content", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"Content", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Content", 'DateTime'>;
    readonly is_deleted: Prisma.FieldRef<"Content", 'Boolean'>;
    readonly deleted_at: Prisma.FieldRef<"Content", 'DateTime'>;
    readonly chapterId: Prisma.FieldRef<"Content", 'String'>;
    readonly createdById: Prisma.FieldRef<"Content", 'String'>;
    readonly updatedById: Prisma.FieldRef<"Content", 'String'>;
}
export type ContentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    where: Prisma.ContentWhereUniqueInput;
};
export type ContentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    where: Prisma.ContentWhereUniqueInput;
};
export type ContentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ContentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ContentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ContentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ContentCreateInput, Prisma.ContentUncheckedCreateInput>;
};
export type ContentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ContentCreateManyInput | Prisma.ContentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ContentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    data: Prisma.ContentCreateManyInput | Prisma.ContentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ContentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ContentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ContentUpdateInput, Prisma.ContentUncheckedUpdateInput>;
    where: Prisma.ContentWhereUniqueInput;
};
export type ContentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ContentUpdateManyMutationInput, Prisma.ContentUncheckedUpdateManyInput>;
    where?: Prisma.ContentWhereInput;
    limit?: number;
};
export type ContentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ContentUpdateManyMutationInput, Prisma.ContentUncheckedUpdateManyInput>;
    where?: Prisma.ContentWhereInput;
    limit?: number;
    include?: Prisma.ContentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ContentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    where: Prisma.ContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContentCreateInput, Prisma.ContentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ContentUpdateInput, Prisma.ContentUncheckedUpdateInput>;
};
export type ContentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
    where: Prisma.ContentWhereUniqueInput;
};
export type ContentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContentWhereInput;
    limit?: number;
};
export type Content$updated_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type ContentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContentSelect<ExtArgs> | null;
    omit?: Prisma.ContentOmit<ExtArgs> | null;
    include?: Prisma.ContentInclude<ExtArgs> | null;
};
export {};
