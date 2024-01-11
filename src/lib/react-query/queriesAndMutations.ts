import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { createUserAccount, loginUser, logoutUser } from "@/lib/appwrite/api";
import { INewUser } from "@/types";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
};

export const useLoginAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            loginUser(user),
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: logoutUser,
    });
};
