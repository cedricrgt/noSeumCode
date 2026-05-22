import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WorkshopModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkshopPayload>;
export type AggregateWorkshop = {
    _count: WorkshopCountAggregateOutputType | null;
    _avg: WorkshopAvgAggregateOutputType | null;
    _sum: WorkshopSumAggregateOutputType | null;
    _min: WorkshopMinAggregateOutputType | null;
    _max: WorkshopMaxAggregateOutputType | null;
};
export type WorkshopAvgAggregateOutputType = {
    max_participants: number | null;
};
export type WorkshopSumAggregateOutputType = {
    max_participants: number | null;
};
export type WorkshopMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    theme: string | null;
    description: string | null;
    start_date: Date | null;
    end_date: Date | null;
    max_participants: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
};
export type WorkshopMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    theme: string | null;
    description: string | null;
    start_date: Date | null;
    end_date: Date | null;
    max_participants: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean | null;
    deleted_at: Date | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
};
export type WorkshopCountAggregateOutputType = {
    id: number;
    name: number;
    theme: number;
    description: number;
    start_date: number;
    end_date: number;
    max_participants: number;
    created_at: number;
    updated_at: number;
    is_deleted: number;
    deleted_at: number;
    createdById: number;
    updatedById: number;
    deletedById: number;
    _all: number;
};
export type WorkshopAvgAggregateInputType = {
    max_participants?: true;
};
export type WorkshopSumAggregateInputType = {
    max_participants?: true;
};
export type WorkshopMinAggregateInputType = {
    id?: true;
    name?: true;
    theme?: true;
    description?: true;
    start_date?: true;
    end_date?: true;
    max_participants?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
};
export type WorkshopMaxAggregateInputType = {
    id?: true;
    name?: true;
    theme?: true;
    description?: true;
    start_date?: true;
    end_date?: true;
    max_participants?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
};
export type WorkshopCountAggregateInputType = {
    id?: true;
    name?: true;
    theme?: true;
    description?: true;
    start_date?: true;
    end_date?: true;
    max_participants?: true;
    created_at?: true;
    updated_at?: true;
    is_deleted?: true;
    deleted_at?: true;
    createdById?: true;
    updatedById?: true;
    deletedById?: true;
    _all?: true;
};
export type WorkshopAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkshopWhereInput;
    orderBy?: Prisma.WorkshopOrderByWithRelationInput | Prisma.WorkshopOrderByWithRelationInput[];
    cursor?: Prisma.WorkshopWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkshopCountAggregateInputType;
    _avg?: WorkshopAvgAggregateInputType;
    _sum?: WorkshopSumAggregateInputType;
    _min?: WorkshopMinAggregateInputType;
    _max?: WorkshopMaxAggregateInputType;
};
export type GetWorkshopAggregateType<T extends WorkshopAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkshop]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkshop[P]> : Prisma.GetScalarType<T[P], AggregateWorkshop[P]>;
};
export type WorkshopGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkshopWhereInput;
    orderBy?: Prisma.WorkshopOrderByWithAggregationInput | Prisma.WorkshopOrderByWithAggregationInput[];
    by: Prisma.WorkshopScalarFieldEnum[] | Prisma.WorkshopScalarFieldEnum;
    having?: Prisma.WorkshopScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkshopCountAggregateInputType | true;
    _avg?: WorkshopAvgAggregateInputType;
    _sum?: WorkshopSumAggregateInputType;
    _min?: WorkshopMinAggregateInputType;
    _max?: WorkshopMaxAggregateInputType;
};
export type WorkshopGroupByOutputType = {
    id: string;
    name: string;
    theme: string | null;
    description: string | null;
    start_date: Date;
    end_date: Date | null;
    max_participants: number | null;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    deleted_at: Date | null;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
    _count: WorkshopCountAggregateOutputType | null;
    _avg: WorkshopAvgAggregateOutputType | null;
    _sum: WorkshopSumAggregateOutputType | null;
    _min: WorkshopMinAggregateOutputType | null;
    _max: WorkshopMaxAggregateOutputType | null;
};
type GetWorkshopGroupByPayload<T extends WorkshopGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkshopGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkshopGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkshopGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkshopGroupByOutputType[P]>;
}>>;
export type WorkshopWhereInput = {
    AND?: Prisma.WorkshopWhereInput | Prisma.WorkshopWhereInput[];
    OR?: Prisma.WorkshopWhereInput[];
    NOT?: Prisma.WorkshopWhereInput | Prisma.WorkshopWhereInput[];
    id?: Prisma.StringFilter<"Workshop"> | string;
    name?: Prisma.StringFilter<"Workshop"> | string;
    theme?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    description?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    start_date?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    end_date?: Prisma.DateTimeNullableFilter<"Workshop"> | Date | string | null;
    max_participants?: Prisma.IntNullableFilter<"Workshop"> | number | null;
    created_at?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Workshop"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Workshop"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    updatedById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    created_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    deleted_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    participants?: Prisma.UserWorkshopListRelationFilter;
};
export type WorkshopOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    theme?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_participants?: Prisma.SortOrderInput | Prisma.SortOrder;
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
    participants?: Prisma.UserWorkshopOrderByRelationAggregateInput;
};
export type WorkshopWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.WorkshopWhereInput | Prisma.WorkshopWhereInput[];
    OR?: Prisma.WorkshopWhereInput[];
    NOT?: Prisma.WorkshopWhereInput | Prisma.WorkshopWhereInput[];
    theme?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    description?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    start_date?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    end_date?: Prisma.DateTimeNullableFilter<"Workshop"> | Date | string | null;
    max_participants?: Prisma.IntNullableFilter<"Workshop"> | number | null;
    created_at?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Workshop"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Workshop"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    updatedById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    created_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    updated_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    deleted_by?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    participants?: Prisma.UserWorkshopListRelationFilter;
}, "id" | "name">;
export type WorkshopOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    theme?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_participants?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    deletedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.WorkshopCountOrderByAggregateInput;
    _avg?: Prisma.WorkshopAvgOrderByAggregateInput;
    _max?: Prisma.WorkshopMaxOrderByAggregateInput;
    _min?: Prisma.WorkshopMinOrderByAggregateInput;
    _sum?: Prisma.WorkshopSumOrderByAggregateInput;
};
export type WorkshopScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkshopScalarWhereWithAggregatesInput | Prisma.WorkshopScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkshopScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkshopScalarWhereWithAggregatesInput | Prisma.WorkshopScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Workshop"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Workshop"> | string;
    theme?: Prisma.StringNullableWithAggregatesFilter<"Workshop"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"Workshop"> | string | null;
    start_date?: Prisma.DateTimeWithAggregatesFilter<"Workshop"> | Date | string;
    end_date?: Prisma.DateTimeNullableWithAggregatesFilter<"Workshop"> | Date | string | null;
    max_participants?: Prisma.IntNullableWithAggregatesFilter<"Workshop"> | number | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Workshop"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Workshop"> | Date | string;
    is_deleted?: Prisma.BoolWithAggregatesFilter<"Workshop"> | boolean;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Workshop"> | Date | string | null;
    createdById?: Prisma.StringNullableWithAggregatesFilter<"Workshop"> | string | null;
    updatedById?: Prisma.StringNullableWithAggregatesFilter<"Workshop"> | string | null;
    deletedById?: Prisma.StringNullableWithAggregatesFilter<"Workshop"> | string | null;
};
export type WorkshopCreateInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedWorkshopsInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedWorkshopsInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedWorkshopsInput;
    participants?: Prisma.UserWorkshopCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopUncheckedCreateInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    participants?: Prisma.UserWorkshopUncheckedCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedWorkshopsNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedWorkshopsNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedWorkshopsNestedInput;
    participants?: Prisma.UserWorkshopUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.UserWorkshopUncheckedUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopCreateManyInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type WorkshopUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WorkshopUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type WorkshopListRelationFilter = {
    every?: Prisma.WorkshopWhereInput;
    some?: Prisma.WorkshopWhereInput;
    none?: Prisma.WorkshopWhereInput;
};
export type WorkshopOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkshopCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    theme?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    max_participants?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type WorkshopAvgOrderByAggregateInput = {
    max_participants?: Prisma.SortOrder;
};
export type WorkshopMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    theme?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    max_participants?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type WorkshopMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    theme?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    max_participants?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    is_deleted?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    updatedById?: Prisma.SortOrder;
    deletedById?: Prisma.SortOrder;
};
export type WorkshopSumOrderByAggregateInput = {
    max_participants?: Prisma.SortOrder;
};
export type WorkshopScalarRelationFilter = {
    is?: Prisma.WorkshopWhereInput;
    isNot?: Prisma.WorkshopWhereInput;
};
export type WorkshopCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutCreated_byInput, Prisma.WorkshopUncheckedCreateWithoutCreated_byInput> | Prisma.WorkshopCreateWithoutCreated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutCreated_byInput | Prisma.WorkshopCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.WorkshopCreateManyCreated_byInputEnvelope;
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
};
export type WorkshopCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutUpdated_byInput, Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput> | Prisma.WorkshopCreateWithoutUpdated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput | Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.WorkshopCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
};
export type WorkshopCreateNestedManyWithoutDeleted_byInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutDeleted_byInput, Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput> | Prisma.WorkshopCreateWithoutDeleted_byInput[] | Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput | Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput[];
    createMany?: Prisma.WorkshopCreateManyDeleted_byInputEnvelope;
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
};
export type WorkshopUncheckedCreateNestedManyWithoutCreated_byInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutCreated_byInput, Prisma.WorkshopUncheckedCreateWithoutCreated_byInput> | Prisma.WorkshopCreateWithoutCreated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutCreated_byInput | Prisma.WorkshopCreateOrConnectWithoutCreated_byInput[];
    createMany?: Prisma.WorkshopCreateManyCreated_byInputEnvelope;
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
};
export type WorkshopUncheckedCreateNestedManyWithoutUpdated_byInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutUpdated_byInput, Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput> | Prisma.WorkshopCreateWithoutUpdated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput | Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput[];
    createMany?: Prisma.WorkshopCreateManyUpdated_byInputEnvelope;
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
};
export type WorkshopUncheckedCreateNestedManyWithoutDeleted_byInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutDeleted_byInput, Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput> | Prisma.WorkshopCreateWithoutDeleted_byInput[] | Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput | Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput[];
    createMany?: Prisma.WorkshopCreateManyDeleted_byInputEnvelope;
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
};
export type WorkshopUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutCreated_byInput, Prisma.WorkshopUncheckedCreateWithoutCreated_byInput> | Prisma.WorkshopCreateWithoutCreated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutCreated_byInput | Prisma.WorkshopCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.WorkshopUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.WorkshopUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.WorkshopCreateManyCreated_byInputEnvelope;
    set?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    disconnect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    delete?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    update?: Prisma.WorkshopUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.WorkshopUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.WorkshopUpdateManyWithWhereWithoutCreated_byInput | Prisma.WorkshopUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
};
export type WorkshopUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutUpdated_byInput, Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput> | Prisma.WorkshopCreateWithoutUpdated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput | Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.WorkshopUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.WorkshopUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.WorkshopCreateManyUpdated_byInputEnvelope;
    set?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    disconnect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    delete?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    update?: Prisma.WorkshopUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.WorkshopUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.WorkshopUpdateManyWithWhereWithoutUpdated_byInput | Prisma.WorkshopUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
};
export type WorkshopUpdateManyWithoutDeleted_byNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutDeleted_byInput, Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput> | Prisma.WorkshopCreateWithoutDeleted_byInput[] | Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput | Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput[];
    upsert?: Prisma.WorkshopUpsertWithWhereUniqueWithoutDeleted_byInput | Prisma.WorkshopUpsertWithWhereUniqueWithoutDeleted_byInput[];
    createMany?: Prisma.WorkshopCreateManyDeleted_byInputEnvelope;
    set?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    disconnect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    delete?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    update?: Prisma.WorkshopUpdateWithWhereUniqueWithoutDeleted_byInput | Prisma.WorkshopUpdateWithWhereUniqueWithoutDeleted_byInput[];
    updateMany?: Prisma.WorkshopUpdateManyWithWhereWithoutDeleted_byInput | Prisma.WorkshopUpdateManyWithWhereWithoutDeleted_byInput[];
    deleteMany?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
};
export type WorkshopUncheckedUpdateManyWithoutCreated_byNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutCreated_byInput, Prisma.WorkshopUncheckedCreateWithoutCreated_byInput> | Prisma.WorkshopCreateWithoutCreated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutCreated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutCreated_byInput | Prisma.WorkshopCreateOrConnectWithoutCreated_byInput[];
    upsert?: Prisma.WorkshopUpsertWithWhereUniqueWithoutCreated_byInput | Prisma.WorkshopUpsertWithWhereUniqueWithoutCreated_byInput[];
    createMany?: Prisma.WorkshopCreateManyCreated_byInputEnvelope;
    set?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    disconnect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    delete?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    update?: Prisma.WorkshopUpdateWithWhereUniqueWithoutCreated_byInput | Prisma.WorkshopUpdateWithWhereUniqueWithoutCreated_byInput[];
    updateMany?: Prisma.WorkshopUpdateManyWithWhereWithoutCreated_byInput | Prisma.WorkshopUpdateManyWithWhereWithoutCreated_byInput[];
    deleteMany?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
};
export type WorkshopUncheckedUpdateManyWithoutUpdated_byNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutUpdated_byInput, Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput> | Prisma.WorkshopCreateWithoutUpdated_byInput[] | Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput | Prisma.WorkshopCreateOrConnectWithoutUpdated_byInput[];
    upsert?: Prisma.WorkshopUpsertWithWhereUniqueWithoutUpdated_byInput | Prisma.WorkshopUpsertWithWhereUniqueWithoutUpdated_byInput[];
    createMany?: Prisma.WorkshopCreateManyUpdated_byInputEnvelope;
    set?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    disconnect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    delete?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    update?: Prisma.WorkshopUpdateWithWhereUniqueWithoutUpdated_byInput | Prisma.WorkshopUpdateWithWhereUniqueWithoutUpdated_byInput[];
    updateMany?: Prisma.WorkshopUpdateManyWithWhereWithoutUpdated_byInput | Prisma.WorkshopUpdateManyWithWhereWithoutUpdated_byInput[];
    deleteMany?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
};
export type WorkshopUncheckedUpdateManyWithoutDeleted_byNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutDeleted_byInput, Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput> | Prisma.WorkshopCreateWithoutDeleted_byInput[] | Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput[];
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput | Prisma.WorkshopCreateOrConnectWithoutDeleted_byInput[];
    upsert?: Prisma.WorkshopUpsertWithWhereUniqueWithoutDeleted_byInput | Prisma.WorkshopUpsertWithWhereUniqueWithoutDeleted_byInput[];
    createMany?: Prisma.WorkshopCreateManyDeleted_byInputEnvelope;
    set?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    disconnect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    delete?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    connect?: Prisma.WorkshopWhereUniqueInput | Prisma.WorkshopWhereUniqueInput[];
    update?: Prisma.WorkshopUpdateWithWhereUniqueWithoutDeleted_byInput | Prisma.WorkshopUpdateWithWhereUniqueWithoutDeleted_byInput[];
    updateMany?: Prisma.WorkshopUpdateManyWithWhereWithoutDeleted_byInput | Prisma.WorkshopUpdateManyWithWhereWithoutDeleted_byInput[];
    deleteMany?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type WorkshopCreateNestedOneWithoutParticipantsInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutParticipantsInput, Prisma.WorkshopUncheckedCreateWithoutParticipantsInput>;
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutParticipantsInput;
    connect?: Prisma.WorkshopWhereUniqueInput;
};
export type WorkshopUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkshopCreateWithoutParticipantsInput, Prisma.WorkshopUncheckedCreateWithoutParticipantsInput>;
    connectOrCreate?: Prisma.WorkshopCreateOrConnectWithoutParticipantsInput;
    upsert?: Prisma.WorkshopUpsertWithoutParticipantsInput;
    connect?: Prisma.WorkshopWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkshopUpdateToOneWithWhereWithoutParticipantsInput, Prisma.WorkshopUpdateWithoutParticipantsInput>, Prisma.WorkshopUncheckedUpdateWithoutParticipantsInput>;
};
export type WorkshopCreateWithoutCreated_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedWorkshopsInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedWorkshopsInput;
    participants?: Prisma.UserWorkshopCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopUncheckedCreateWithoutCreated_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    updatedById?: string | null;
    deletedById?: string | null;
    participants?: Prisma.UserWorkshopUncheckedCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopCreateOrConnectWithoutCreated_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutCreated_byInput, Prisma.WorkshopUncheckedCreateWithoutCreated_byInput>;
};
export type WorkshopCreateManyCreated_byInputEnvelope = {
    data: Prisma.WorkshopCreateManyCreated_byInput | Prisma.WorkshopCreateManyCreated_byInput[];
    skipDuplicates?: boolean;
};
export type WorkshopCreateWithoutUpdated_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedWorkshopsInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedWorkshopsInput;
    participants?: Prisma.UserWorkshopCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopUncheckedCreateWithoutUpdated_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    deletedById?: string | null;
    participants?: Prisma.UserWorkshopUncheckedCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopCreateOrConnectWithoutUpdated_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutUpdated_byInput, Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput>;
};
export type WorkshopCreateManyUpdated_byInputEnvelope = {
    data: Prisma.WorkshopCreateManyUpdated_byInput | Prisma.WorkshopCreateManyUpdated_byInput[];
    skipDuplicates?: boolean;
};
export type WorkshopCreateWithoutDeleted_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedWorkshopsInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedWorkshopsInput;
    participants?: Prisma.UserWorkshopCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopUncheckedCreateWithoutDeleted_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    participants?: Prisma.UserWorkshopUncheckedCreateNestedManyWithoutWorkshopInput;
};
export type WorkshopCreateOrConnectWithoutDeleted_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutDeleted_byInput, Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput>;
};
export type WorkshopCreateManyDeleted_byInputEnvelope = {
    data: Prisma.WorkshopCreateManyDeleted_byInput | Prisma.WorkshopCreateManyDeleted_byInput[];
    skipDuplicates?: boolean;
};
export type WorkshopUpsertWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkshopUpdateWithoutCreated_byInput, Prisma.WorkshopUncheckedUpdateWithoutCreated_byInput>;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutCreated_byInput, Prisma.WorkshopUncheckedCreateWithoutCreated_byInput>;
};
export type WorkshopUpdateWithWhereUniqueWithoutCreated_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateWithoutCreated_byInput, Prisma.WorkshopUncheckedUpdateWithoutCreated_byInput>;
};
export type WorkshopUpdateManyWithWhereWithoutCreated_byInput = {
    where: Prisma.WorkshopScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateManyMutationInput, Prisma.WorkshopUncheckedUpdateManyWithoutCreated_byInput>;
};
export type WorkshopScalarWhereInput = {
    AND?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
    OR?: Prisma.WorkshopScalarWhereInput[];
    NOT?: Prisma.WorkshopScalarWhereInput | Prisma.WorkshopScalarWhereInput[];
    id?: Prisma.StringFilter<"Workshop"> | string;
    name?: Prisma.StringFilter<"Workshop"> | string;
    theme?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    description?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    start_date?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    end_date?: Prisma.DateTimeNullableFilter<"Workshop"> | Date | string | null;
    max_participants?: Prisma.IntNullableFilter<"Workshop"> | number | null;
    created_at?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Workshop"> | Date | string;
    is_deleted?: Prisma.BoolFilter<"Workshop"> | boolean;
    deleted_at?: Prisma.DateTimeNullableFilter<"Workshop"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    updatedById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
    deletedById?: Prisma.StringNullableFilter<"Workshop"> | string | null;
};
export type WorkshopUpsertWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkshopUpdateWithoutUpdated_byInput, Prisma.WorkshopUncheckedUpdateWithoutUpdated_byInput>;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutUpdated_byInput, Prisma.WorkshopUncheckedCreateWithoutUpdated_byInput>;
};
export type WorkshopUpdateWithWhereUniqueWithoutUpdated_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateWithoutUpdated_byInput, Prisma.WorkshopUncheckedUpdateWithoutUpdated_byInput>;
};
export type WorkshopUpdateManyWithWhereWithoutUpdated_byInput = {
    where: Prisma.WorkshopScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateManyMutationInput, Prisma.WorkshopUncheckedUpdateManyWithoutUpdated_byInput>;
};
export type WorkshopUpsertWithWhereUniqueWithoutDeleted_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkshopUpdateWithoutDeleted_byInput, Prisma.WorkshopUncheckedUpdateWithoutDeleted_byInput>;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutDeleted_byInput, Prisma.WorkshopUncheckedCreateWithoutDeleted_byInput>;
};
export type WorkshopUpdateWithWhereUniqueWithoutDeleted_byInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateWithoutDeleted_byInput, Prisma.WorkshopUncheckedUpdateWithoutDeleted_byInput>;
};
export type WorkshopUpdateManyWithWhereWithoutDeleted_byInput = {
    where: Prisma.WorkshopScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateManyMutationInput, Prisma.WorkshopUncheckedUpdateManyWithoutDeleted_byInput>;
};
export type WorkshopCreateWithoutParticipantsInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    created_by?: Prisma.UserCreateNestedOneWithoutCreatedWorkshopsInput;
    updated_by?: Prisma.UserCreateNestedOneWithoutUpdatedWorkshopsInput;
    deleted_by?: Prisma.UserCreateNestedOneWithoutDeletedWorkshopsInput;
};
export type WorkshopUncheckedCreateWithoutParticipantsInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type WorkshopCreateOrConnectWithoutParticipantsInput = {
    where: Prisma.WorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutParticipantsInput, Prisma.WorkshopUncheckedCreateWithoutParticipantsInput>;
};
export type WorkshopUpsertWithoutParticipantsInput = {
    update: Prisma.XOR<Prisma.WorkshopUpdateWithoutParticipantsInput, Prisma.WorkshopUncheckedUpdateWithoutParticipantsInput>;
    create: Prisma.XOR<Prisma.WorkshopCreateWithoutParticipantsInput, Prisma.WorkshopUncheckedCreateWithoutParticipantsInput>;
    where?: Prisma.WorkshopWhereInput;
};
export type WorkshopUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: Prisma.WorkshopWhereInput;
    data: Prisma.XOR<Prisma.WorkshopUpdateWithoutParticipantsInput, Prisma.WorkshopUncheckedUpdateWithoutParticipantsInput>;
};
export type WorkshopUpdateWithoutParticipantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedWorkshopsNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedWorkshopsNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedWorkshopsNestedInput;
};
export type WorkshopUncheckedUpdateWithoutParticipantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type WorkshopCreateManyCreated_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    updatedById?: string | null;
    deletedById?: string | null;
};
export type WorkshopCreateManyUpdated_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    deletedById?: string | null;
};
export type WorkshopCreateManyDeleted_byInput = {
    id?: string;
    name: string;
    theme?: string | null;
    description?: string | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    max_participants?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
    deleted_at?: Date | string | null;
    createdById?: string | null;
    updatedById?: string | null;
};
export type WorkshopUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedWorkshopsNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedWorkshopsNestedInput;
    participants?: Prisma.UserWorkshopUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.UserWorkshopUncheckedUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateManyWithoutCreated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type WorkshopUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedWorkshopsNestedInput;
    deleted_by?: Prisma.UserUpdateOneWithoutDeletedWorkshopsNestedInput;
    participants?: Prisma.UserWorkshopUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.UserWorkshopUncheckedUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateManyWithoutUpdated_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deletedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type WorkshopUpdateWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.UserUpdateOneWithoutCreatedWorkshopsNestedInput;
    updated_by?: Prisma.UserUpdateOneWithoutUpdatedWorkshopsNestedInput;
    participants?: Prisma.UserWorkshopUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.UserWorkshopUncheckedUpdateManyWithoutWorkshopNestedInput;
};
export type WorkshopUncheckedUpdateManyWithoutDeleted_byInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    theme?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    max_participants?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type WorkshopCountOutputType = {
    participants: number;
};
export type WorkshopCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    participants?: boolean | WorkshopCountOutputTypeCountParticipantsArgs;
};
export type WorkshopCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopCountOutputTypeSelect<ExtArgs> | null;
};
export type WorkshopCountOutputTypeCountParticipantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkshopWhereInput;
};
export type WorkshopSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    theme?: boolean;
    description?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    max_participants?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    created_by?: boolean | Prisma.Workshop$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Workshop$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Workshop$deleted_byArgs<ExtArgs>;
    participants?: boolean | Prisma.Workshop$participantsArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkshopCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workshop"]>;
export type WorkshopSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    theme?: boolean;
    description?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    max_participants?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    created_by?: boolean | Prisma.Workshop$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Workshop$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Workshop$deleted_byArgs<ExtArgs>;
}, ExtArgs["result"]["workshop"]>;
export type WorkshopSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    theme?: boolean;
    description?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    max_participants?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
    created_by?: boolean | Prisma.Workshop$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Workshop$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Workshop$deleted_byArgs<ExtArgs>;
}, ExtArgs["result"]["workshop"]>;
export type WorkshopSelectScalar = {
    id?: boolean;
    name?: boolean;
    theme?: boolean;
    description?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    max_participants?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_deleted?: boolean;
    deleted_at?: boolean;
    createdById?: boolean;
    updatedById?: boolean;
    deletedById?: boolean;
};
export type WorkshopOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "theme" | "description" | "start_date" | "end_date" | "max_participants" | "created_at" | "updated_at" | "is_deleted" | "deleted_at" | "createdById" | "updatedById" | "deletedById", ExtArgs["result"]["workshop"]>;
export type WorkshopInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    created_by?: boolean | Prisma.Workshop$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Workshop$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Workshop$deleted_byArgs<ExtArgs>;
    participants?: boolean | Prisma.Workshop$participantsArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkshopCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WorkshopIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    created_by?: boolean | Prisma.Workshop$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Workshop$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Workshop$deleted_byArgs<ExtArgs>;
};
export type WorkshopIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    created_by?: boolean | Prisma.Workshop$created_byArgs<ExtArgs>;
    updated_by?: boolean | Prisma.Workshop$updated_byArgs<ExtArgs>;
    deleted_by?: boolean | Prisma.Workshop$deleted_byArgs<ExtArgs>;
};
export type $WorkshopPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Workshop";
    objects: {
        created_by: Prisma.$UserPayload<ExtArgs> | null;
        updated_by: Prisma.$UserPayload<ExtArgs> | null;
        deleted_by: Prisma.$UserPayload<ExtArgs> | null;
        participants: Prisma.$UserWorkshopPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        theme: string | null;
        description: string | null;
        start_date: Date;
        end_date: Date | null;
        max_participants: number | null;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
        deleted_at: Date | null;
        createdById: string | null;
        updatedById: string | null;
        deletedById: string | null;
    }, ExtArgs["result"]["workshop"]>;
    composites: {};
};
export type WorkshopGetPayload<S extends boolean | null | undefined | WorkshopDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkshopPayload, S>;
export type WorkshopCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkshopFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkshopCountAggregateInputType | true;
};
export interface WorkshopDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Workshop'];
        meta: {
            name: 'Workshop';
        };
    };
    findUnique<T extends WorkshopFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkshopFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkshopFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkshopFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkshopFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkshopFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkshopFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkshopFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkshopFindManyArgs>(args?: Prisma.SelectSubset<T, WorkshopFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkshopCreateArgs>(args: Prisma.SelectSubset<T, WorkshopCreateArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkshopCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkshopCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkshopCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkshopCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkshopDeleteArgs>(args: Prisma.SelectSubset<T, WorkshopDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkshopUpdateArgs>(args: Prisma.SelectSubset<T, WorkshopUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkshopDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkshopDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkshopUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkshopUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkshopUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkshopUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkshopUpsertArgs>(args: Prisma.SelectSubset<T, WorkshopUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkshopCountArgs>(args?: Prisma.Subset<T, WorkshopCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkshopCountAggregateOutputType> : number>;
    aggregate<T extends WorkshopAggregateArgs>(args: Prisma.Subset<T, WorkshopAggregateArgs>): Prisma.PrismaPromise<GetWorkshopAggregateType<T>>;
    groupBy<T extends WorkshopGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkshopGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkshopGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkshopGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkshopGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkshopFieldRefs;
}
export interface Prisma__WorkshopClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    created_by<T extends Prisma.Workshop$created_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workshop$created_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    updated_by<T extends Prisma.Workshop$updated_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workshop$updated_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    deleted_by<T extends Prisma.Workshop$deleted_byArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workshop$deleted_byArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    participants<T extends Prisma.Workshop$participantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workshop$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkshopFieldRefs {
    readonly id: Prisma.FieldRef<"Workshop", 'String'>;
    readonly name: Prisma.FieldRef<"Workshop", 'String'>;
    readonly theme: Prisma.FieldRef<"Workshop", 'String'>;
    readonly description: Prisma.FieldRef<"Workshop", 'String'>;
    readonly start_date: Prisma.FieldRef<"Workshop", 'DateTime'>;
    readonly end_date: Prisma.FieldRef<"Workshop", 'DateTime'>;
    readonly max_participants: Prisma.FieldRef<"Workshop", 'Int'>;
    readonly created_at: Prisma.FieldRef<"Workshop", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Workshop", 'DateTime'>;
    readonly is_deleted: Prisma.FieldRef<"Workshop", 'Boolean'>;
    readonly deleted_at: Prisma.FieldRef<"Workshop", 'DateTime'>;
    readonly createdById: Prisma.FieldRef<"Workshop", 'String'>;
    readonly updatedById: Prisma.FieldRef<"Workshop", 'String'>;
    readonly deletedById: Prisma.FieldRef<"Workshop", 'String'>;
}
export type WorkshopFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where: Prisma.WorkshopWhereUniqueInput;
};
export type WorkshopFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where: Prisma.WorkshopWhereUniqueInput;
};
export type WorkshopFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where?: Prisma.WorkshopWhereInput;
    orderBy?: Prisma.WorkshopOrderByWithRelationInput | Prisma.WorkshopOrderByWithRelationInput[];
    cursor?: Prisma.WorkshopWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkshopScalarFieldEnum | Prisma.WorkshopScalarFieldEnum[];
};
export type WorkshopFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where?: Prisma.WorkshopWhereInput;
    orderBy?: Prisma.WorkshopOrderByWithRelationInput | Prisma.WorkshopOrderByWithRelationInput[];
    cursor?: Prisma.WorkshopWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkshopScalarFieldEnum | Prisma.WorkshopScalarFieldEnum[];
};
export type WorkshopFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where?: Prisma.WorkshopWhereInput;
    orderBy?: Prisma.WorkshopOrderByWithRelationInput | Prisma.WorkshopOrderByWithRelationInput[];
    cursor?: Prisma.WorkshopWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkshopScalarFieldEnum | Prisma.WorkshopScalarFieldEnum[];
};
export type WorkshopCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkshopCreateInput, Prisma.WorkshopUncheckedCreateInput>;
};
export type WorkshopCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkshopCreateManyInput | Prisma.WorkshopCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkshopCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    data: Prisma.WorkshopCreateManyInput | Prisma.WorkshopCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WorkshopIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkshopUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkshopUpdateInput, Prisma.WorkshopUncheckedUpdateInput>;
    where: Prisma.WorkshopWhereUniqueInput;
};
export type WorkshopUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkshopUpdateManyMutationInput, Prisma.WorkshopUncheckedUpdateManyInput>;
    where?: Prisma.WorkshopWhereInput;
    limit?: number;
};
export type WorkshopUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkshopUpdateManyMutationInput, Prisma.WorkshopUncheckedUpdateManyInput>;
    where?: Prisma.WorkshopWhereInput;
    limit?: number;
    include?: Prisma.WorkshopIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkshopUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where: Prisma.WorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkshopCreateInput, Prisma.WorkshopUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkshopUpdateInput, Prisma.WorkshopUncheckedUpdateInput>;
};
export type WorkshopDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
    where: Prisma.WorkshopWhereUniqueInput;
};
export type WorkshopDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkshopWhereInput;
    limit?: number;
};
export type Workshop$created_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Workshop$updated_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Workshop$deleted_byArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Workshop$participantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    where?: Prisma.UserWorkshopWhereInput;
    orderBy?: Prisma.UserWorkshopOrderByWithRelationInput | Prisma.UserWorkshopOrderByWithRelationInput[];
    cursor?: Prisma.UserWorkshopWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserWorkshopScalarFieldEnum | Prisma.UserWorkshopScalarFieldEnum[];
};
export type WorkshopDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkshopSelect<ExtArgs> | null;
    omit?: Prisma.WorkshopOmit<ExtArgs> | null;
    include?: Prisma.WorkshopInclude<ExtArgs> | null;
};
export {};
