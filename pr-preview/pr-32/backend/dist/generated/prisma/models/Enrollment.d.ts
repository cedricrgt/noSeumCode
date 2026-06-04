import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EnrollmentModel = runtime.Types.Result.DefaultSelection<Prisma.$EnrollmentPayload>;
export type AggregateEnrollment = {
    _count: EnrollmentCountAggregateOutputType | null;
    _avg: EnrollmentAvgAggregateOutputType | null;
    _sum: EnrollmentSumAggregateOutputType | null;
    _min: EnrollmentMinAggregateOutputType | null;
    _max: EnrollmentMaxAggregateOutputType | null;
};
export type EnrollmentAvgAggregateOutputType = {
    progress: number | null;
};
export type EnrollmentSumAggregateOutputType = {
    progress: number | null;
};
export type EnrollmentMinAggregateOutputType = {
    userId: string | null;
    courseId: string | null;
    enrolled_at: Date | null;
    has_paid: boolean | null;
    progress: number | null;
    completed_at: Date | null;
};
export type EnrollmentMaxAggregateOutputType = {
    userId: string | null;
    courseId: string | null;
    enrolled_at: Date | null;
    has_paid: boolean | null;
    progress: number | null;
    completed_at: Date | null;
};
export type EnrollmentCountAggregateOutputType = {
    userId: number;
    courseId: number;
    enrolled_at: number;
    has_paid: number;
    progress: number;
    completed_at: number;
    _all: number;
};
export type EnrollmentAvgAggregateInputType = {
    progress?: true;
};
export type EnrollmentSumAggregateInputType = {
    progress?: true;
};
export type EnrollmentMinAggregateInputType = {
    userId?: true;
    courseId?: true;
    enrolled_at?: true;
    has_paid?: true;
    progress?: true;
    completed_at?: true;
};
export type EnrollmentMaxAggregateInputType = {
    userId?: true;
    courseId?: true;
    enrolled_at?: true;
    has_paid?: true;
    progress?: true;
    completed_at?: true;
};
export type EnrollmentCountAggregateInputType = {
    userId?: true;
    courseId?: true;
    enrolled_at?: true;
    has_paid?: true;
    progress?: true;
    completed_at?: true;
    _all?: true;
};
export type EnrollmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnrollmentWhereInput;
    orderBy?: Prisma.EnrollmentOrderByWithRelationInput | Prisma.EnrollmentOrderByWithRelationInput[];
    cursor?: Prisma.EnrollmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EnrollmentCountAggregateInputType;
    _avg?: EnrollmentAvgAggregateInputType;
    _sum?: EnrollmentSumAggregateInputType;
    _min?: EnrollmentMinAggregateInputType;
    _max?: EnrollmentMaxAggregateInputType;
};
export type GetEnrollmentAggregateType<T extends EnrollmentAggregateArgs> = {
    [P in keyof T & keyof AggregateEnrollment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEnrollment[P]> : Prisma.GetScalarType<T[P], AggregateEnrollment[P]>;
};
export type EnrollmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnrollmentWhereInput;
    orderBy?: Prisma.EnrollmentOrderByWithAggregationInput | Prisma.EnrollmentOrderByWithAggregationInput[];
    by: Prisma.EnrollmentScalarFieldEnum[] | Prisma.EnrollmentScalarFieldEnum;
    having?: Prisma.EnrollmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EnrollmentCountAggregateInputType | true;
    _avg?: EnrollmentAvgAggregateInputType;
    _sum?: EnrollmentSumAggregateInputType;
    _min?: EnrollmentMinAggregateInputType;
    _max?: EnrollmentMaxAggregateInputType;
};
export type EnrollmentGroupByOutputType = {
    userId: string;
    courseId: string;
    enrolled_at: Date;
    has_paid: boolean;
    progress: number;
    completed_at: Date | null;
    _count: EnrollmentCountAggregateOutputType | null;
    _avg: EnrollmentAvgAggregateOutputType | null;
    _sum: EnrollmentSumAggregateOutputType | null;
    _min: EnrollmentMinAggregateOutputType | null;
    _max: EnrollmentMaxAggregateOutputType | null;
};
type GetEnrollmentGroupByPayload<T extends EnrollmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EnrollmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EnrollmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EnrollmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EnrollmentGroupByOutputType[P]>;
}>>;
export type EnrollmentWhereInput = {
    AND?: Prisma.EnrollmentWhereInput | Prisma.EnrollmentWhereInput[];
    OR?: Prisma.EnrollmentWhereInput[];
    NOT?: Prisma.EnrollmentWhereInput | Prisma.EnrollmentWhereInput[];
    userId?: Prisma.StringFilter<"Enrollment"> | string;
    courseId?: Prisma.StringFilter<"Enrollment"> | string;
    enrolled_at?: Prisma.DateTimeFilter<"Enrollment"> | Date | string;
    has_paid?: Prisma.BoolFilter<"Enrollment"> | boolean;
    progress?: Prisma.IntFilter<"Enrollment"> | number;
    completed_at?: Prisma.DateTimeNullableFilter<"Enrollment"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
};
export type EnrollmentOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    enrolled_at?: Prisma.SortOrder;
    has_paid?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    course?: Prisma.CourseOrderByWithRelationInput;
};
export type EnrollmentWhereUniqueInput = Prisma.AtLeast<{
    userId_courseId?: Prisma.EnrollmentUserIdCourseIdCompoundUniqueInput;
    AND?: Prisma.EnrollmentWhereInput | Prisma.EnrollmentWhereInput[];
    OR?: Prisma.EnrollmentWhereInput[];
    NOT?: Prisma.EnrollmentWhereInput | Prisma.EnrollmentWhereInput[];
    userId?: Prisma.StringFilter<"Enrollment"> | string;
    courseId?: Prisma.StringFilter<"Enrollment"> | string;
    enrolled_at?: Prisma.DateTimeFilter<"Enrollment"> | Date | string;
    has_paid?: Prisma.BoolFilter<"Enrollment"> | boolean;
    progress?: Prisma.IntFilter<"Enrollment"> | number;
    completed_at?: Prisma.DateTimeNullableFilter<"Enrollment"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
}, "userId_courseId">;
export type EnrollmentOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    enrolled_at?: Prisma.SortOrder;
    has_paid?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.EnrollmentCountOrderByAggregateInput;
    _avg?: Prisma.EnrollmentAvgOrderByAggregateInput;
    _max?: Prisma.EnrollmentMaxOrderByAggregateInput;
    _min?: Prisma.EnrollmentMinOrderByAggregateInput;
    _sum?: Prisma.EnrollmentSumOrderByAggregateInput;
};
export type EnrollmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.EnrollmentScalarWhereWithAggregatesInput | Prisma.EnrollmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.EnrollmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EnrollmentScalarWhereWithAggregatesInput | Prisma.EnrollmentScalarWhereWithAggregatesInput[];
    userId?: Prisma.StringWithAggregatesFilter<"Enrollment"> | string;
    courseId?: Prisma.StringWithAggregatesFilter<"Enrollment"> | string;
    enrolled_at?: Prisma.DateTimeWithAggregatesFilter<"Enrollment"> | Date | string;
    has_paid?: Prisma.BoolWithAggregatesFilter<"Enrollment"> | boolean;
    progress?: Prisma.IntWithAggregatesFilter<"Enrollment"> | number;
    completed_at?: Prisma.DateTimeNullableWithAggregatesFilter<"Enrollment"> | Date | string | null;
};
export type EnrollmentCreateInput = {
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutEnrollmentsInput;
    course: Prisma.CourseCreateNestedOneWithoutEnrollmentsInput;
};
export type EnrollmentUncheckedCreateInput = {
    userId: string;
    courseId: string;
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
};
export type EnrollmentUpdateInput = {
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutEnrollmentsNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutEnrollmentsNestedInput;
};
export type EnrollmentUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentCreateManyInput = {
    userId: string;
    courseId: string;
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
};
export type EnrollmentUpdateManyMutationInput = {
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentListRelationFilter = {
    every?: Prisma.EnrollmentWhereInput;
    some?: Prisma.EnrollmentWhereInput;
    none?: Prisma.EnrollmentWhereInput;
};
export type EnrollmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EnrollmentUserIdCourseIdCompoundUniqueInput = {
    userId: string;
    courseId: string;
};
export type EnrollmentCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    enrolled_at?: Prisma.SortOrder;
    has_paid?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrder;
};
export type EnrollmentAvgOrderByAggregateInput = {
    progress?: Prisma.SortOrder;
};
export type EnrollmentMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    enrolled_at?: Prisma.SortOrder;
    has_paid?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrder;
};
export type EnrollmentMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    enrolled_at?: Prisma.SortOrder;
    has_paid?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrder;
};
export type EnrollmentSumOrderByAggregateInput = {
    progress?: Prisma.SortOrder;
};
export type EnrollmentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutUserInput, Prisma.EnrollmentUncheckedCreateWithoutUserInput> | Prisma.EnrollmentCreateWithoutUserInput[] | Prisma.EnrollmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutUserInput | Prisma.EnrollmentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.EnrollmentCreateManyUserInputEnvelope;
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
};
export type EnrollmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutUserInput, Prisma.EnrollmentUncheckedCreateWithoutUserInput> | Prisma.EnrollmentCreateWithoutUserInput[] | Prisma.EnrollmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutUserInput | Prisma.EnrollmentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.EnrollmentCreateManyUserInputEnvelope;
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
};
export type EnrollmentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutUserInput, Prisma.EnrollmentUncheckedCreateWithoutUserInput> | Prisma.EnrollmentCreateWithoutUserInput[] | Prisma.EnrollmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutUserInput | Prisma.EnrollmentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.EnrollmentUpsertWithWhereUniqueWithoutUserInput | Prisma.EnrollmentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.EnrollmentCreateManyUserInputEnvelope;
    set?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    disconnect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    delete?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    update?: Prisma.EnrollmentUpdateWithWhereUniqueWithoutUserInput | Prisma.EnrollmentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.EnrollmentUpdateManyWithWhereWithoutUserInput | Prisma.EnrollmentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.EnrollmentScalarWhereInput | Prisma.EnrollmentScalarWhereInput[];
};
export type EnrollmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutUserInput, Prisma.EnrollmentUncheckedCreateWithoutUserInput> | Prisma.EnrollmentCreateWithoutUserInput[] | Prisma.EnrollmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutUserInput | Prisma.EnrollmentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.EnrollmentUpsertWithWhereUniqueWithoutUserInput | Prisma.EnrollmentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.EnrollmentCreateManyUserInputEnvelope;
    set?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    disconnect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    delete?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    update?: Prisma.EnrollmentUpdateWithWhereUniqueWithoutUserInput | Prisma.EnrollmentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.EnrollmentUpdateManyWithWhereWithoutUserInput | Prisma.EnrollmentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.EnrollmentScalarWhereInput | Prisma.EnrollmentScalarWhereInput[];
};
export type EnrollmentCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutCourseInput, Prisma.EnrollmentUncheckedCreateWithoutCourseInput> | Prisma.EnrollmentCreateWithoutCourseInput[] | Prisma.EnrollmentUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutCourseInput | Prisma.EnrollmentCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.EnrollmentCreateManyCourseInputEnvelope;
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
};
export type EnrollmentUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutCourseInput, Prisma.EnrollmentUncheckedCreateWithoutCourseInput> | Prisma.EnrollmentCreateWithoutCourseInput[] | Prisma.EnrollmentUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutCourseInput | Prisma.EnrollmentCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.EnrollmentCreateManyCourseInputEnvelope;
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
};
export type EnrollmentUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutCourseInput, Prisma.EnrollmentUncheckedCreateWithoutCourseInput> | Prisma.EnrollmentCreateWithoutCourseInput[] | Prisma.EnrollmentUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutCourseInput | Prisma.EnrollmentCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.EnrollmentUpsertWithWhereUniqueWithoutCourseInput | Prisma.EnrollmentUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.EnrollmentCreateManyCourseInputEnvelope;
    set?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    disconnect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    delete?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    update?: Prisma.EnrollmentUpdateWithWhereUniqueWithoutCourseInput | Prisma.EnrollmentUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.EnrollmentUpdateManyWithWhereWithoutCourseInput | Prisma.EnrollmentUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.EnrollmentScalarWhereInput | Prisma.EnrollmentScalarWhereInput[];
};
export type EnrollmentUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.EnrollmentCreateWithoutCourseInput, Prisma.EnrollmentUncheckedCreateWithoutCourseInput> | Prisma.EnrollmentCreateWithoutCourseInput[] | Prisma.EnrollmentUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.EnrollmentCreateOrConnectWithoutCourseInput | Prisma.EnrollmentCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.EnrollmentUpsertWithWhereUniqueWithoutCourseInput | Prisma.EnrollmentUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.EnrollmentCreateManyCourseInputEnvelope;
    set?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    disconnect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    delete?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    connect?: Prisma.EnrollmentWhereUniqueInput | Prisma.EnrollmentWhereUniqueInput[];
    update?: Prisma.EnrollmentUpdateWithWhereUniqueWithoutCourseInput | Prisma.EnrollmentUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.EnrollmentUpdateManyWithWhereWithoutCourseInput | Prisma.EnrollmentUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.EnrollmentScalarWhereInput | Prisma.EnrollmentScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnrollmentCreateWithoutUserInput = {
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
    course: Prisma.CourseCreateNestedOneWithoutEnrollmentsInput;
};
export type EnrollmentUncheckedCreateWithoutUserInput = {
    courseId: string;
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
};
export type EnrollmentCreateOrConnectWithoutUserInput = {
    where: Prisma.EnrollmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.EnrollmentCreateWithoutUserInput, Prisma.EnrollmentUncheckedCreateWithoutUserInput>;
};
export type EnrollmentCreateManyUserInputEnvelope = {
    data: Prisma.EnrollmentCreateManyUserInput | Prisma.EnrollmentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type EnrollmentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.EnrollmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.EnrollmentUpdateWithoutUserInput, Prisma.EnrollmentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.EnrollmentCreateWithoutUserInput, Prisma.EnrollmentUncheckedCreateWithoutUserInput>;
};
export type EnrollmentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.EnrollmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.EnrollmentUpdateWithoutUserInput, Prisma.EnrollmentUncheckedUpdateWithoutUserInput>;
};
export type EnrollmentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.EnrollmentScalarWhereInput;
    data: Prisma.XOR<Prisma.EnrollmentUpdateManyMutationInput, Prisma.EnrollmentUncheckedUpdateManyWithoutUserInput>;
};
export type EnrollmentScalarWhereInput = {
    AND?: Prisma.EnrollmentScalarWhereInput | Prisma.EnrollmentScalarWhereInput[];
    OR?: Prisma.EnrollmentScalarWhereInput[];
    NOT?: Prisma.EnrollmentScalarWhereInput | Prisma.EnrollmentScalarWhereInput[];
    userId?: Prisma.StringFilter<"Enrollment"> | string;
    courseId?: Prisma.StringFilter<"Enrollment"> | string;
    enrolled_at?: Prisma.DateTimeFilter<"Enrollment"> | Date | string;
    has_paid?: Prisma.BoolFilter<"Enrollment"> | boolean;
    progress?: Prisma.IntFilter<"Enrollment"> | number;
    completed_at?: Prisma.DateTimeNullableFilter<"Enrollment"> | Date | string | null;
};
export type EnrollmentCreateWithoutCourseInput = {
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutEnrollmentsInput;
};
export type EnrollmentUncheckedCreateWithoutCourseInput = {
    userId: string;
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
};
export type EnrollmentCreateOrConnectWithoutCourseInput = {
    where: Prisma.EnrollmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.EnrollmentCreateWithoutCourseInput, Prisma.EnrollmentUncheckedCreateWithoutCourseInput>;
};
export type EnrollmentCreateManyCourseInputEnvelope = {
    data: Prisma.EnrollmentCreateManyCourseInput | Prisma.EnrollmentCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type EnrollmentUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.EnrollmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.EnrollmentUpdateWithoutCourseInput, Prisma.EnrollmentUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.EnrollmentCreateWithoutCourseInput, Prisma.EnrollmentUncheckedCreateWithoutCourseInput>;
};
export type EnrollmentUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.EnrollmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.EnrollmentUpdateWithoutCourseInput, Prisma.EnrollmentUncheckedUpdateWithoutCourseInput>;
};
export type EnrollmentUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.EnrollmentScalarWhereInput;
    data: Prisma.XOR<Prisma.EnrollmentUpdateManyMutationInput, Prisma.EnrollmentUncheckedUpdateManyWithoutCourseInput>;
};
export type EnrollmentCreateManyUserInput = {
    courseId: string;
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
};
export type EnrollmentUpdateWithoutUserInput = {
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    course?: Prisma.CourseUpdateOneRequiredWithoutEnrollmentsNestedInput;
};
export type EnrollmentUncheckedUpdateWithoutUserInput = {
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentUncheckedUpdateManyWithoutUserInput = {
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentCreateManyCourseInput = {
    userId: string;
    enrolled_at?: Date | string;
    has_paid?: boolean;
    progress?: number;
    completed_at?: Date | string | null;
};
export type EnrollmentUpdateWithoutCourseInput = {
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutEnrollmentsNestedInput;
};
export type EnrollmentUncheckedUpdateWithoutCourseInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentUncheckedUpdateManyWithoutCourseInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    enrolled_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    has_paid?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type EnrollmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    courseId?: boolean;
    enrolled_at?: boolean;
    has_paid?: boolean;
    progress?: boolean;
    completed_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["enrollment"]>;
export type EnrollmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    courseId?: boolean;
    enrolled_at?: boolean;
    has_paid?: boolean;
    progress?: boolean;
    completed_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["enrollment"]>;
export type EnrollmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    courseId?: boolean;
    enrolled_at?: boolean;
    has_paid?: boolean;
    progress?: boolean;
    completed_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["enrollment"]>;
export type EnrollmentSelectScalar = {
    userId?: boolean;
    courseId?: boolean;
    enrolled_at?: boolean;
    has_paid?: boolean;
    progress?: boolean;
    completed_at?: boolean;
};
export type EnrollmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "courseId" | "enrolled_at" | "has_paid" | "progress" | "completed_at", ExtArgs["result"]["enrollment"]>;
export type EnrollmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
};
export type EnrollmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
};
export type EnrollmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
};
export type $EnrollmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Enrollment";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        course: Prisma.$CoursePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        courseId: string;
        enrolled_at: Date;
        has_paid: boolean;
        progress: number;
        completed_at: Date | null;
    }, ExtArgs["result"]["enrollment"]>;
    composites: {};
};
export type EnrollmentGetPayload<S extends boolean | null | undefined | EnrollmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload, S>;
export type EnrollmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EnrollmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EnrollmentCountAggregateInputType | true;
};
export interface EnrollmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Enrollment'];
        meta: {
            name: 'Enrollment';
        };
    };
    findUnique<T extends EnrollmentFindUniqueArgs>(args: Prisma.SelectSubset<T, EnrollmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EnrollmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EnrollmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EnrollmentFindFirstArgs>(args?: Prisma.SelectSubset<T, EnrollmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EnrollmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EnrollmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EnrollmentFindManyArgs>(args?: Prisma.SelectSubset<T, EnrollmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EnrollmentCreateArgs>(args: Prisma.SelectSubset<T, EnrollmentCreateArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EnrollmentCreateManyArgs>(args?: Prisma.SelectSubset<T, EnrollmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EnrollmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EnrollmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EnrollmentDeleteArgs>(args: Prisma.SelectSubset<T, EnrollmentDeleteArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EnrollmentUpdateArgs>(args: Prisma.SelectSubset<T, EnrollmentUpdateArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EnrollmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, EnrollmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EnrollmentUpdateManyArgs>(args: Prisma.SelectSubset<T, EnrollmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EnrollmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EnrollmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EnrollmentUpsertArgs>(args: Prisma.SelectSubset<T, EnrollmentUpsertArgs<ExtArgs>>): Prisma.Prisma__EnrollmentClient<runtime.Types.Result.GetResult<Prisma.$EnrollmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EnrollmentCountArgs>(args?: Prisma.Subset<T, EnrollmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EnrollmentCountAggregateOutputType> : number>;
    aggregate<T extends EnrollmentAggregateArgs>(args: Prisma.Subset<T, EnrollmentAggregateArgs>): Prisma.PrismaPromise<GetEnrollmentAggregateType<T>>;
    groupBy<T extends EnrollmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EnrollmentGroupByArgs['orderBy'];
    } : {
        orderBy?: EnrollmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EnrollmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnrollmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EnrollmentFieldRefs;
}
export interface Prisma__EnrollmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    course<T extends Prisma.CourseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EnrollmentFieldRefs {
    readonly userId: Prisma.FieldRef<"Enrollment", 'String'>;
    readonly courseId: Prisma.FieldRef<"Enrollment", 'String'>;
    readonly enrolled_at: Prisma.FieldRef<"Enrollment", 'DateTime'>;
    readonly has_paid: Prisma.FieldRef<"Enrollment", 'Boolean'>;
    readonly progress: Prisma.FieldRef<"Enrollment", 'Int'>;
    readonly completed_at: Prisma.FieldRef<"Enrollment", 'DateTime'>;
}
export type EnrollmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    where: Prisma.EnrollmentWhereUniqueInput;
};
export type EnrollmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    where: Prisma.EnrollmentWhereUniqueInput;
};
export type EnrollmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EnrollmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EnrollmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EnrollmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EnrollmentCreateInput, Prisma.EnrollmentUncheckedCreateInput>;
};
export type EnrollmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EnrollmentCreateManyInput | Prisma.EnrollmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EnrollmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    data: Prisma.EnrollmentCreateManyInput | Prisma.EnrollmentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EnrollmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EnrollmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EnrollmentUpdateInput, Prisma.EnrollmentUncheckedUpdateInput>;
    where: Prisma.EnrollmentWhereUniqueInput;
};
export type EnrollmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EnrollmentUpdateManyMutationInput, Prisma.EnrollmentUncheckedUpdateManyInput>;
    where?: Prisma.EnrollmentWhereInput;
    limit?: number;
};
export type EnrollmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EnrollmentUpdateManyMutationInput, Prisma.EnrollmentUncheckedUpdateManyInput>;
    where?: Prisma.EnrollmentWhereInput;
    limit?: number;
    include?: Prisma.EnrollmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EnrollmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    where: Prisma.EnrollmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.EnrollmentCreateInput, Prisma.EnrollmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EnrollmentUpdateInput, Prisma.EnrollmentUncheckedUpdateInput>;
};
export type EnrollmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
    where: Prisma.EnrollmentWhereUniqueInput;
};
export type EnrollmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EnrollmentWhereInput;
    limit?: number;
};
export type EnrollmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EnrollmentSelect<ExtArgs> | null;
    omit?: Prisma.EnrollmentOmit<ExtArgs> | null;
    include?: Prisma.EnrollmentInclude<ExtArgs> | null;
};
export {};
