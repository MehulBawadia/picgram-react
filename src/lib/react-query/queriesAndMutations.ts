import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import {
    createPost,
    createUserAccount,
    getRecentPosts,
    loginUser,
    logoutUser,
} from "@/lib/appwrite/api";
import { INewPost, INewUser } from "@/types";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

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

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    });
};
