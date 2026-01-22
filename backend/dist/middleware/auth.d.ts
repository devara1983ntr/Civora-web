declare const authMiddleware: ({ req }: any) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
} | {
    user?: undefined;
}>;
export default authMiddleware;
//# sourceMappingURL=auth.d.ts.map