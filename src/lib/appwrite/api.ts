import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import {
    appwriteConfig,
    account,
    avatars,
    databases,
    storage,
} from "@/lib/appwrite/config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl?: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        );

        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function loginUser(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(
            user.email,
            user.password,
        );

        // userId stored as a sessionId
        // purpose of storing is after some time of user log in,
        // when try to fetch useId on reload
        // the appWrite is unable to fetch resulting 401
        localStorage.setItem("sessionId", session.userId);

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)],
        );
        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function logoutUser() {
    try {
        const session = await account.deleteSession("current");
        localStorage.removeItem("sessionId");
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload image to stoage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        // Get file URL
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags into an array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            },
        );
        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file,
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000, // width
            2000, // height
            "top", // gravity
            100, // quality
        );
        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: "success" };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)],
    );
    if (!posts) throw Error;

    return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            { likes: likesArray },
        );

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(userId: string, postId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            { user: userId, post: postId },
        );

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        );

        if (!statusCode) throw Error;

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}
