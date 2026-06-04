import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserWorkshopModel = runtime.Types.Result.DefaultSelection<Prisma.$UserWorkshopPayload>;
export type AggregateUserWorkshop = {
    _count: UserWorkshopCountAggregateOutputType | null;
    _min: UserWorkshopMinAggregateOutputType | null;
    _max: UserWorkshopMaxAggregateOutputType | null;
};
export type UserWorkshopMinAggregateOutputType = {
    userId: string | null;
    workshopId: string | null;
    registered_at: Date | null;
    attended: boolean | null;
};
export type UserWorkshopMaxAggregateOutputType = {
    userId: string | null;
    workshopId: string | null;
    registered_at: Date | null;
    attended: boolean | null;
};
export type UserWorkshopCountAggregateOutputType = {
    userId: number;
    workshopId: number;
    registered_at: number;
    attended: number;
    _all: number;
};
export type UserWorkshopMinAggregateInputType = {
    userId?: true;
    workshopId?: true;
    registered_at?: true;
    attended?: true;
};
export type UserWorkshopMaxAggregateInputType = {
    userId?: true;
    workshopId?: true;
    registered_at?: true;
    attended?: true;
};
export type UserWorkshopCountAggregateInputType = {
    userId?: true;
    workshopId?: true;
    registered_at?: true;
    attended?: true;
    _all?: true;
};
export type UserWorkshopAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkshopWhereInput;
    orderBy?: Prisma.UserWorkshopOrderByWithRelationInput | Prisma.UserWorkshopOrderByWithRelationInput[];
    cursor?: Prisma.UserWorkshopWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserWorkshopCountAggregateInputType;
    _min?: UserWorkshopMinAggregateInputType;
    _max?: UserWorkshopMaxAggregateInputType;
};
export type GetUserWorkshopAggregateType<T extends UserWorkshopAggregateArgs> = {
    [P in keyof T & keyof AggregateUserWorkshop]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserWorkshop[P]> : Prisma.GetScalarType<T[P], AggregateUserWorkshop[P]>;
};
export type UserWorkshopGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkshopWhereInput;
    orderBy?: Prisma.UserWorkshopOrderByWithAggregationInput | Prisma.UserWorkshopOrderByWithAggregationInput[];
    by: Prisma.UserWorkshopScalarFieldEnum[] | Prisma.UserWorkshopScalarFieldEnum;
    having?: Prisma.UserWorkshopScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserWorkshopCountAggregateInputType | true;
    _min?: UserWorkshopMinAggregateInputType;
    _max?: UserWorkshopMaxAggregateInputType;
};
export type UserWorkshopGroupByOutputType = {
    userId: string;
    workshopId: string;
    registered_at: Date;
    attended: boolean;
    _count: UserWorkshopCountAggregateOutputType | null;
    _min: UserWorkshopMinAggregateOutputType | null;
    _max: UserWorkshopMaxAggregateOutputType | null;
};
type GetUserWorkshopGroupByPayload<T extends UserWorkshopGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserWorkshopGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserWorkshopGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserWorkshopGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserWorkshopGroupByOutputType[P]>;
}>>;
export type UserWorkshopWhereInput = {
    AND?: Prisma.UserWorkshopWhereInput | Prisma.UserWorkshopWhereInput[];
    OR?: Prisma.UserWorkshopWhereInput[];
    NOT?: Prisma.UserWorkshopWhereInput | Prisma.UserWorkshopWhereInput[];
    userId?: Prisma.StringFilter<"UserWorkshop"> | string;
    workshopId?: Prisma.StringFilter<"UserWorkshop"> | string;
    registered_at?: Prisma.DateTimeFilter<"UserWorkshop"> | Date | string;
    attended?: Prisma.BoolFilter<"UserWorkshop"> | boolean;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    workshop?: Prisma.XOR<Prisma.WorkshopScalarRelationFilter, Prisma.WorkshopWhereInput>;
};
export type UserWorkshopOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    workshopId?: Prisma.SortOrder;
    registered_at?: Prisma.SortOrder;
    attended?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    workshop?: Prisma.WorkshopOrderByWithRelationInput;
};
export type UserWorkshopWhereUniqueInput = Prisma.AtLeast<{
    userId_workshopId?: Prisma.UserWorkshopUserIdWorkshopIdCompoundUniqueInput;
    AND?: Prisma.UserWorkshopWhereInput | Prisma.UserWorkshopWhereInput[];
    OR?: Prisma.UserWorkshopWhereInput[];
    NOT?: Prisma.UserWorkshopWhereInput | Prisma.UserWorkshopWhereInput[];
    userId?: Prisma.StringFilter<"UserWorkshop"> | string;
    workshopId?: Prisma.StringFilter<"UserWorkshop"> | string;
    registered_at?: Prisma.DateTimeFilter<"UserWorkshop"> | Date | string;
    attended?: Prisma.BoolFilter<"UserWorkshop"> | boolean;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    workshop?: Prisma.XOR<Prisma.WorkshopScalarRelationFilter, Prisma.WorkshopWhereInput>;
}, "userId_workshopId">;
export type UserWorkshopOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    workshopId?: Prisma.SortOrder;
    registered_at?: Prisma.SortOrder;
    attended?: Prisma.SortOrder;
    _count?: Prisma.UserWorkshopCountOrderByAggregateInput;
    _max?: Prisma.UserWorkshopMaxOrderByAggregateInput;
    _min?: Prisma.UserWorkshopMinOrderByAggregateInput;
};
export type UserWorkshopScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserWorkshopScalarWhereWithAggregatesInput | Prisma.UserWorkshopScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserWorkshopScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserWorkshopScalarWhereWithAggregatesInput | Prisma.UserWorkshopScalarWhereWithAggregatesInput[];
    userId?: Prisma.StringWithAggregatesFilter<"UserWorkshop"> | string;
    workshopId?: Prisma.StringWithAggregatesFilter<"UserWorkshop"> | string;
    registered_at?: Prisma.DateTimeWithAggregatesFilter<"UserWorkshop"> | Date | string;
    attended?: Prisma.BoolWithAggregatesFilter<"UserWorkshop"> | boolean;
};
export type UserWorkshopCreateInput = {
    registered_at?: Date | string;
    attended?: boolean;
    user: Prisma.UserCreateNestedOneWithoutWorkshopsInput;
    workshop: Prisma.WorkshopCreateNestedOneWithoutParticipantsInput;
};
export type UserWorkshopUncheckedCreateInput = {
    userId: string;
    workshopId: string;
    registered_at?: Date | string;
    attended?: boolean;
};
export type UserWorkshopUpdateInput = {
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    user?: Prisma.UserUpdateOneRequiredWithoutWorkshopsNestedInput;
    workshop?: Prisma.WorkshopUpdateOneRequiredWithoutParticipantsNestedInput;
};
export type UserWorkshopUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workshopId?: Prisma.StringFieldUpdateOperationsInput | string;
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopCreateManyInput = {
    userId: string;
    workshopId: string;
    registered_at?: Date | string;
    attended?: boolean;
};
export type UserWorkshopUpdateManyMutationInput = {
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workshopId?: Prisma.StringFieldUpdateOperationsInput | string;
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopListRelationFilter = {
    every?: Prisma.UserWorkshopWhereInput;
    some?: Prisma.UserWorkshopWhereInput;
    none?: Prisma.UserWorkshopWhereInput;
};
export type UserWorkshopOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserWorkshopUserIdWorkshopIdCompoundUniqueInput = {
    userId: string;
    workshopId: string;
};
export type UserWorkshopCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    workshopId?: Prisma.SortOrder;
    registered_at?: Prisma.SortOrder;
    attended?: Prisma.SortOrder;
};
export type UserWorkshopMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    workshopId?: Prisma.SortOrder;
    registered_at?: Prisma.SortOrder;
    attended?: Prisma.SortOrder;
};
export type UserWorkshopMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    workshopId?: Prisma.SortOrder;
    registered_at?: Prisma.SortOrder;
    attended?: Prisma.SortOrder;
};
export type UserWorkshopCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutUserInput, Prisma.UserWorkshopUncheckedCreateWithoutUserInput> | Prisma.UserWorkshopCreateWithoutUserInput[] | Prisma.UserWorkshopUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutUserInput | Prisma.UserWorkshopCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserWorkshopCreateManyUserInputEnvelope;
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
};
export type UserWorkshopUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutUserInput, Prisma.UserWorkshopUncheckedCreateWithoutUserInput> | Prisma.UserWorkshopCreateWithoutUserInput[] | Prisma.UserWorkshopUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutUserInput | Prisma.UserWorkshopCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserWorkshopCreateManyUserInputEnvelope;
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
};
export type UserWorkshopUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutUserInput, Prisma.UserWorkshopUncheckedCreateWithoutUserInput> | Prisma.UserWorkshopCreateWithoutUserInput[] | Prisma.UserWorkshopUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutUserInput | Prisma.UserWorkshopCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserWorkshopUpsertWithWhereUniqueWithoutUserInput | Prisma.UserWorkshopUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserWorkshopCreateManyUserInputEnvelope;
    set?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    disconnect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    delete?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    update?: Prisma.UserWorkshopUpdateWithWhereUniqueWithoutUserInput | Prisma.UserWorkshopUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserWorkshopUpdateManyWithWhereWithoutUserInput | Prisma.UserWorkshopUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserWorkshopScalarWhereInput | Prisma.UserWorkshopScalarWhereInput[];
};
export type UserWorkshopUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutUserInput, Prisma.UserWorkshopUncheckedCreateWithoutUserInput> | Prisma.UserWorkshopCreateWithoutUserInput[] | Prisma.UserWorkshopUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutUserInput | Prisma.UserWorkshopCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserWorkshopUpsertWithWhereUniqueWithoutUserInput | Prisma.UserWorkshopUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserWorkshopCreateManyUserInputEnvelope;
    set?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    disconnect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    delete?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    update?: Prisma.UserWorkshopUpdateWithWhereUniqueWithoutUserInput | Prisma.UserWorkshopUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserWorkshopUpdateManyWithWhereWithoutUserInput | Prisma.UserWorkshopUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserWorkshopScalarWhereInput | Prisma.UserWorkshopScalarWhereInput[];
};
export type UserWorkshopCreateNestedManyWithoutWorkshopInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput> | Prisma.UserWorkshopCreateWithoutWorkshopInput[] | Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput | Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput[];
    createMany?: Prisma.UserWorkshopCreateManyWorkshopInputEnvelope;
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
};
export type UserWorkshopUncheckedCreateNestedManyWithoutWorkshopInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput> | Prisma.UserWorkshopCreateWithoutWorkshopInput[] | Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput | Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput[];
    createMany?: Prisma.UserWorkshopCreateManyWorkshopInputEnvelope;
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
};
export type UserWorkshopUpdateManyWithoutWorkshopNestedInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput> | Prisma.UserWorkshopCreateWithoutWorkshopInput[] | Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput | Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput[];
    upsert?: Prisma.UserWorkshopUpsertWithWhereUniqueWithoutWorkshopInput | Prisma.UserWorkshopUpsertWithWhereUniqueWithoutWorkshopInput[];
    createMany?: Prisma.UserWorkshopCreateManyWorkshopInputEnvelope;
    set?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    disconnect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    delete?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    update?: Prisma.UserWorkshopUpdateWithWhereUniqueWithoutWorkshopInput | Prisma.UserWorkshopUpdateWithWhereUniqueWithoutWorkshopInput[];
    updateMany?: Prisma.UserWorkshopUpdateManyWithWhereWithoutWorkshopInput | Prisma.UserWorkshopUpdateManyWithWhereWithoutWorkshopInput[];
    deleteMany?: Prisma.UserWorkshopScalarWhereInput | Prisma.UserWorkshopScalarWhereInput[];
};
export type UserWorkshopUncheckedUpdateManyWithoutWorkshopNestedInput = {
    create?: Prisma.XOR<Prisma.UserWorkshopCreateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput> | Prisma.UserWorkshopCreateWithoutWorkshopInput[] | Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput[];
    connectOrCreate?: Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput | Prisma.UserWorkshopCreateOrConnectWithoutWorkshopInput[];
    upsert?: Prisma.UserWorkshopUpsertWithWhereUniqueWithoutWorkshopInput | Prisma.UserWorkshopUpsertWithWhereUniqueWithoutWorkshopInput[];
    createMany?: Prisma.UserWorkshopCreateManyWorkshopInputEnvelope;
    set?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    disconnect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    delete?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    connect?: Prisma.UserWorkshopWhereUniqueInput | Prisma.UserWorkshopWhereUniqueInput[];
    update?: Prisma.UserWorkshopUpdateWithWhereUniqueWithoutWorkshopInput | Prisma.UserWorkshopUpdateWithWhereUniqueWithoutWorkshopInput[];
    updateMany?: Prisma.UserWorkshopUpdateManyWithWhereWithoutWorkshopInput | Prisma.UserWorkshopUpdateManyWithWhereWithoutWorkshopInput[];
    deleteMany?: Prisma.UserWorkshopScalarWhereInput | Prisma.UserWorkshopScalarWhereInput[];
};
export type UserWorkshopCreateWithoutUserInput = {
    registered_at?: Date | string;
    attended?: boolean;
    workshop: Prisma.WorkshopCreateNestedOneWithoutParticipantsInput;
};
export type UserWorkshopUncheckedCreateWithoutUserInput = {
    workshopId: string;
    registered_at?: Date | string;
    attended?: boolean;
};
export type UserWorkshopCreateOrConnectWithoutUserInput = {
    where: Prisma.UserWorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserWorkshopCreateWithoutUserInput, Prisma.UserWorkshopUncheckedCreateWithoutUserInput>;
};
export type UserWorkshopCreateManyUserInputEnvelope = {
    data: Prisma.UserWorkshopCreateManyUserInput | Prisma.UserWorkshopCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserWorkshopUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserWorkshopWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserWorkshopUpdateWithoutUserInput, Prisma.UserWorkshopUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserWorkshopCreateWithoutUserInput, Prisma.UserWorkshopUncheckedCreateWithoutUserInput>;
};
export type UserWorkshopUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserWorkshopWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserWorkshopUpdateWithoutUserInput, Prisma.UserWorkshopUncheckedUpdateWithoutUserInput>;
};
export type UserWorkshopUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserWorkshopScalarWhereInput;
    data: Prisma.XOR<Prisma.UserWorkshopUpdateManyMutationInput, Prisma.UserWorkshopUncheckedUpdateManyWithoutUserInput>;
};
export type UserWorkshopScalarWhereInput = {
    AND?: Prisma.UserWorkshopScalarWhereInput | Prisma.UserWorkshopScalarWhereInput[];
    OR?: Prisma.UserWorkshopScalarWhereInput[];
    NOT?: Prisma.UserWorkshopScalarWhereInput | Prisma.UserWorkshopScalarWhereInput[];
    userId?: Prisma.StringFilter<"UserWorkshop"> | string;
    workshopId?: Prisma.StringFilter<"UserWorkshop"> | string;
    registered_at?: Prisma.DateTimeFilter<"UserWorkshop"> | Date | string;
    attended?: Prisma.BoolFilter<"UserWorkshop"> | boolean;
};
export type UserWorkshopCreateWithoutWorkshopInput = {
    registered_at?: Date | string;
    attended?: boolean;
    user: Prisma.UserCreateNestedOneWithoutWorkshopsInput;
};
export type UserWorkshopUncheckedCreateWithoutWorkshopInput = {
    userId: string;
    registered_at?: Date | string;
    attended?: boolean;
};
export type UserWorkshopCreateOrConnectWithoutWorkshopInput = {
    where: Prisma.UserWorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserWorkshopCreateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput>;
};
export type UserWorkshopCreateManyWorkshopInputEnvelope = {
    data: Prisma.UserWorkshopCreateManyWorkshopInput | Prisma.UserWorkshopCreateManyWorkshopInput[];
    skipDuplicates?: boolean;
};
export type UserWorkshopUpsertWithWhereUniqueWithoutWorkshopInput = {
    where: Prisma.UserWorkshopWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserWorkshopUpdateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedUpdateWithoutWorkshopInput>;
    create: Prisma.XOR<Prisma.UserWorkshopCreateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedCreateWithoutWorkshopInput>;
};
export type UserWorkshopUpdateWithWhereUniqueWithoutWorkshopInput = {
    where: Prisma.UserWorkshopWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserWorkshopUpdateWithoutWorkshopInput, Prisma.UserWorkshopUncheckedUpdateWithoutWorkshopInput>;
};
export type UserWorkshopUpdateManyWithWhereWithoutWorkshopInput = {
    where: Prisma.UserWorkshopScalarWhereInput;
    data: Prisma.XOR<Prisma.UserWorkshopUpdateManyMutationInput, Prisma.UserWorkshopUncheckedUpdateManyWithoutWorkshopInput>;
};
export type UserWorkshopCreateManyUserInput = {
    workshopId: string;
    registered_at?: Date | string;
    attended?: boolean;
};
export type UserWorkshopUpdateWithoutUserInput = {
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    workshop?: Prisma.WorkshopUpdateOneRequiredWithoutParticipantsNestedInput;
};
export type UserWorkshopUncheckedUpdateWithoutUserInput = {
    workshopId?: Prisma.StringFieldUpdateOperationsInput | string;
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopUncheckedUpdateManyWithoutUserInput = {
    workshopId?: Prisma.StringFieldUpdateOperationsInput | string;
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopCreateManyWorkshopInput = {
    userId: string;
    registered_at?: Date | string;
    attended?: boolean;
};
export type UserWorkshopUpdateWithoutWorkshopInput = {
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    user?: Prisma.UserUpdateOneRequiredWithoutWorkshopsNestedInput;
};
export type UserWorkshopUncheckedUpdateWithoutWorkshopInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopUncheckedUpdateManyWithoutWorkshopInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    registered_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserWorkshopSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    workshopId?: boolean;
    registered_at?: boolean;
    attended?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workshop?: boolean | Prisma.WorkshopDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userWorkshop"]>;
export type UserWorkshopSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    workshopId?: boolean;
    registered_at?: boolean;
    attended?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workshop?: boolean | Prisma.WorkshopDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userWorkshop"]>;
export type UserWorkshopSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    workshopId?: boolean;
    registered_at?: boolean;
    attended?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workshop?: boolean | Prisma.WorkshopDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userWorkshop"]>;
export type UserWorkshopSelectScalar = {
    userId?: boolean;
    workshopId?: boolean;
    registered_at?: boolean;
    attended?: boolean;
};
export type UserWorkshopOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "workshopId" | "registered_at" | "attended", ExtArgs["result"]["userWorkshop"]>;
export type UserWorkshopInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workshop?: boolean | Prisma.WorkshopDefaultArgs<ExtArgs>;
};
export type UserWorkshopIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workshop?: boolean | Prisma.WorkshopDefaultArgs<ExtArgs>;
};
export type UserWorkshopIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workshop?: boolean | Prisma.WorkshopDefaultArgs<ExtArgs>;
};
export type $UserWorkshopPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserWorkshop";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        workshop: Prisma.$WorkshopPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        workshopId: string;
        registered_at: Date;
        attended: boolean;
    }, ExtArgs["result"]["userWorkshop"]>;
    composites: {};
};
export type UserWorkshopGetPayload<S extends boolean | null | undefined | UserWorkshopDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload, S>;
export type UserWorkshopCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserWorkshopFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserWorkshopCountAggregateInputType | true;
};
export interface UserWorkshopDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserWorkshop'];
        meta: {
            name: 'UserWorkshop';
        };
    };
    findUnique<T extends UserWorkshopFindUniqueArgs>(args: Prisma.SelectSubset<T, UserWorkshopFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserWorkshopFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserWorkshopFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserWorkshopFindFirstArgs>(args?: Prisma.SelectSubset<T, UserWorkshopFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserWorkshopFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserWorkshopFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserWorkshopFindManyArgs>(args?: Prisma.SelectSubset<T, UserWorkshopFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserWorkshopCreateArgs>(args: Prisma.SelectSubset<T, UserWorkshopCreateArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserWorkshopCreateManyArgs>(args?: Prisma.SelectSubset<T, UserWorkshopCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserWorkshopCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserWorkshopCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserWorkshopDeleteArgs>(args: Prisma.SelectSubset<T, UserWorkshopDeleteArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserWorkshopUpdateArgs>(args: Prisma.SelectSubset<T, UserWorkshopUpdateArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserWorkshopDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserWorkshopDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserWorkshopUpdateManyArgs>(args: Prisma.SelectSubset<T, UserWorkshopUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserWorkshopUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserWorkshopUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserWorkshopUpsertArgs>(args: Prisma.SelectSubset<T, UserWorkshopUpsertArgs<ExtArgs>>): Prisma.Prisma__UserWorkshopClient<runtime.Types.Result.GetResult<Prisma.$UserWorkshopPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserWorkshopCountArgs>(args?: Prisma.Subset<T, UserWorkshopCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserWorkshopCountAggregateOutputType> : number>;
    aggregate<T extends UserWorkshopAggregateArgs>(args: Prisma.Subset<T, UserWorkshopAggregateArgs>): Prisma.PrismaPromise<GetUserWorkshopAggregateType<T>>;
    groupBy<T extends UserWorkshopGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserWorkshopGroupByArgs['orderBy'];
    } : {
        orderBy?: UserWorkshopGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserWorkshopGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserWorkshopGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserWorkshopFieldRefs;
}
export interface Prisma__UserWorkshopClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    workshop<T extends Prisma.WorkshopDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkshopDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkshopClient<runtime.Types.Result.GetResult<Prisma.$WorkshopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserWorkshopFieldRefs {
    readonly userId: Prisma.FieldRef<"UserWorkshop", 'String'>;
    readonly workshopId: Prisma.FieldRef<"UserWorkshop", 'String'>;
    readonly registered_at: Prisma.FieldRef<"UserWorkshop", 'DateTime'>;
    readonly attended: Prisma.FieldRef<"UserWorkshop", 'Boolean'>;
}
export type UserWorkshopFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    where: Prisma.UserWorkshopWhereUniqueInput;
};
export type UserWorkshopFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    where: Prisma.UserWorkshopWhereUniqueInput;
};
export type UserWorkshopFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserWorkshopFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserWorkshopFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserWorkshopCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserWorkshopCreateInput, Prisma.UserWorkshopUncheckedCreateInput>;
};
export type UserWorkshopCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserWorkshopCreateManyInput | Prisma.UserWorkshopCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserWorkshopCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    data: Prisma.UserWorkshopCreateManyInput | Prisma.UserWorkshopCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserWorkshopIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserWorkshopUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserWorkshopUpdateInput, Prisma.UserWorkshopUncheckedUpdateInput>;
    where: Prisma.UserWorkshopWhereUniqueInput;
};
export type UserWorkshopUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserWorkshopUpdateManyMutationInput, Prisma.UserWorkshopUncheckedUpdateManyInput>;
    where?: Prisma.UserWorkshopWhereInput;
    limit?: number;
};
export type UserWorkshopUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserWorkshopUpdateManyMutationInput, Prisma.UserWorkshopUncheckedUpdateManyInput>;
    where?: Prisma.UserWorkshopWhereInput;
    limit?: number;
    include?: Prisma.UserWorkshopIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserWorkshopUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    where: Prisma.UserWorkshopWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserWorkshopCreateInput, Prisma.UserWorkshopUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserWorkshopUpdateInput, Prisma.UserWorkshopUncheckedUpdateInput>;
};
export type UserWorkshopDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
    where: Prisma.UserWorkshopWhereUniqueInput;
};
export type UserWorkshopDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkshopWhereInput;
    limit?: number;
};
export type UserWorkshopDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkshopSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkshopOmit<ExtArgs> | null;
    include?: Prisma.UserWorkshopInclude<ExtArgs> | null;
};
export {};
