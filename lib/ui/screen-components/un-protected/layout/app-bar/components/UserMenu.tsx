import { Menu } from "primereact/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "@/lib/ui/useable-components/theme-button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useUser from "@/lib/hooks/useUser";
import { useAuth } from "@/lib/context/auth/auth.context";
import { useSearchUI } from "@/lib/context/search/search.context";

interface UserMenuProps {
    handleModalToggle: () => void;
    setLogoutConfirmationVisible: (visible: boolean) => void;
}

const UserMenu = ({ handleModalToggle, setLogoutConfirmationVisible }: UserMenuProps) => {
    const t = useTranslations();
    const router = useRouter();
    const { authToken } = useAuth();
    const { profile, cartCount } = useUser();
    const { isSearchFocused } = useSearchUI();
    const menuRef = useRef<Menu>(null);

    if (!authToken && !isSearchFocused) {
        return (
            <button
                className="w-auto min-w-[64px] h-fit py-2 md:py-3 px-4 bg-primary-color rounded text-sm lg:text-[16px] md:text-md flex items-center justify-center"
                onClick={handleModalToggle}
            >
                <span className="text-white font-semibold text-xs md:text-[16px] whitespace-nowrap">
                    {t("login_label")}
                </span>
            </button>
        );
    }

    if (!authToken) return null;

    return (
        <div
            className={`flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837] ${isSearchFocused && "hidden"}`}
            onClick={(event) => menuRef.current?.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
        >
            <div className="h-6 w-6 md:w-8 md:h-8 rounded-full bg-primary-color flex items-center justify-center text-white font-semibold select-none uppercase">
                {profile?.name
                    ?.trim()
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("") || "U"}
            </div>

            {cartCount == 0 && (
                <span className="hidden xl:inline hover:cursor-pointer dark:text-white">
                    {profile?.name || ""}
                </span>
            )}

            <FontAwesomeIcon
                icon={faChevronDown}
                width={12}
                hanging={12}
                className="text-primary-color"
            />
            <Menu
                className="
                     dark:bg-gray-800
                     dark:text-white

                     "
                model={[
                    {
                        label: t("ProfileSection.profile_label"),
                        template(item) {
                            return (
                                <div
                                    className="text-gray-600 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600  p-2 cursor-pointer"
                                    onClick={() => router.push("/profile")}
                                >
                                    {item.label}
                                </div>
                            );
                        },
                    },
                    {
                        label: t("ProfileSection.gethelp"),
                        template(item) {
                            return (
                                <div
                                    className="text-gray-500 hover:bg-gray-300  dark:text-white dark:hover:bg-gray-600 p-2  cursor-pointer"
                                    onClick={() => router.push("/profile/getHelp")}
                                >
                                    {item.label}
                                </div>
                            );
                        },
                    },
                    {
                        label: "Theme",
                        template() {
                            return (
                                <div className="p-2">
                                    <ThemeToggle />
                                </div>
                            );
                        },
                    },
                    {
                        label: t("ProfileSection.logout_appbar"),
                        template(item) {
                            return (
                                <div
                                    className="text-gray-500 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600 p-2  cursor-pointer"
                                    onClick={() =>
                                        setLogoutConfirmationVisible(true)
                                    }
                                >
                                    {item.label}
                                </div>
                            );
                        },
                    },
                ]}
                popup
                ref={menuRef}
                id="popup_menu_right"
                popupAlignment="right"
            />
        </div>
    );
};

export default UserMenu;
