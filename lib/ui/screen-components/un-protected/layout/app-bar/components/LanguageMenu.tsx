import { Menu } from "primereact/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { useRef, useTransition } from "react";
import { useLocale } from "next-intl";
import { languageTypes } from "@/lib/utils/constants";
import { setUserLocale } from "@/lib/utils/methods/locale";
import { TLocale } from "@/lib/utils/types/locale";

interface LanguageMenuProps {
    isSearchFocused: boolean;
}

const LanguageMenu = ({ isSearchFocused }: LanguageMenuProps) => {
    const { theme, toggleTheme } = useTheme();
    const languageMenuRef = useRef<Menu>(null);
    const currentLocale = useLocale();
    const [, startTransition] = useTransition();

    function onLocaleChange(value: string) {
        const locale = value as TLocale;
        startTransition(() => {
          setUserLocale(locale);
        });
    }

    const model = languageTypes.map((lang) => ({
        label: lang.value.toUpperCase(),
        template(item: any) {
          return (
            <div
              className={`hover:bg-primary-color ${currentLocale === lang.code ? "bg-primary-color" : ""} p-2 cursor-pointer`}
              onClick={() => onLocaleChange(lang.code)}
            >
              {item.label}
            </div>
          );
        },
        command: () => {
          onLocaleChange(lang.code);
        },
    }));

    if (isSearchFocused) return null;

    return (
        <div
            className="relative flex items-center gap-x-2"
            title="Languages"
        >
            <div
                onClick={toggleTheme}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                {theme === "dark" ? "🌙" : "☀️"}
            </div>{" "}
            <button
                onClick={(e) => languageMenuRef.current?.toggle(e)}
                className="flex items-center justify-center"
            >
                {" "}
                <FontAwesomeIcon
                    icon={faGlobe}
                    width={24}
                    height={24}
                    className="text-gray-700 dark:text-gray-400"
                />{" "}
            </button>{" "}
            <Menu
                // className="dark:bg-gray-800 dark:text-white mt-5"
                model={model}
                popup
                ref={languageMenuRef}
                id="language_menu_popup"
                popupAlignment="left"
                className="
                      dark:bg-gray-800 dark:text-white mt-5
        [&_.p-menu-list]:max-h-72
        [&_.p-menu-list]:overflow-y-auto
        [&_.p-menu-list]:scrollbar-thin
        shadow-lg
      "
            />
        </div>
    );
};

export default LanguageMenu;
