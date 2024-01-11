import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
    const { mutate: logout, isSuccess } = useLogout();
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) navigate("/login");
    }, [isSuccess]);

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img
                        src="/assets/images/logo.svg"
                        alt="Logo"
                        width={130}
                        height={325}
                    />
                </Link>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className="shad-button_ghost"
                        onClick={() => logout()}
                    >
                        <img src="/assets/icons/logout.svg" alt="Logout" />
                    </Button>

                    <Link
                        to={`/profile/${user.id}`}
                        className="flex-center gap-3"
                    >
                        <img
                            src={
                                user.imageUrl ||
                                "/assets/images/profile-placeholder.svg"
                            }
                            alt="Profile picture"
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Topbar;
