import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
    const isAuthenticated = false;

    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" />
            ) : (
                <>
                    <section className="flex flex-1 flex-col justify-center items-center py-10">
                        <Outlet />
                    </section>

                    <img
                        src="/assets/images/collage.webp"
                        alt="Side Image"
                        className="hidden xl:block h-screen w-1/2 object-cover"
                    />
                </>
            )}
        </>
    );
};

export default AuthLayout;
