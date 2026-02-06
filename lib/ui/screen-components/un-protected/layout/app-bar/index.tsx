"use client";

// Core
import { Sidebar } from "primereact/sidebar";
import { useRouter } from "next/navigation";
import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Components
import Cart from "@/lib/ui/useable-components/cart";
import UserAddressComponent from "@/lib/ui/useable-components/address";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";

// Hook
import { useUserAddress } from "@/lib/context/address/address.context";
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useLocation from "@/lib/hooks/useLocation";
import useSetUserCurrentLocation from "@/lib/hooks/useSetUserCurrentLocation";
import useUser from "@/lib/hooks/useUser";
import { useSearchUI } from "@/lib/context/search/search.context";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";

import Logo from "@/lib/utils/assets/svg/Logo";

import { AnimatePresence, motion } from "framer-motion";

// Icons
import {
  CartSvg,
  CircleCrossSvg,
  LocationSvg,
  SearchSvg,
} from "@/lib/utils/assets/svg";
// import AnimatedLogo from "@/lib/assets/gif/logo.gif";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IAppBarProps } from "@/lib/utils/interfaces";
import { ToastContext } from "@/lib/context/global/toast.context";
// Methods
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

// Constnats
import {
  USER_CURRENT_LOCATION_LS_KEY,
} from "@/lib/utils/constants";
import { useTranslations } from "next-intl";

import SearchResults from "./components/SearchResults";
import UserMenu from "./components/UserMenu";
import LogoutConfirmation from "./components/LogoutConfirmation";
import LanguageMenu from "./components/LanguageMenu";

const AppTopbar = ({ handleModalToggle }: IAppBarProps) => {
  // State for cart sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] =
    useState(false);
  const t = useTranslations();

  const [position, setPosition] = useState<"left" | "right">("right");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dir = document.documentElement.getAttribute("dir") || "ltr";
      setPosition(dir === "rtl" ? "left" : "right");
    }
  }, []);
  // Hooks
  const router = useRouter();
  const { GOOGLE_MAPS_KEY, CURRENCY_SYMBOL } = useConfig();
  const {
    cartCount,
    calculateSubtotal,
    profile,
    loadingProfile,
    fetchProfile,
  } = useUser();
  const { userAddress, setUserAddress } = useUserAddress();
  const { getCurrentLocation } = useLocation();
  const { onSetUserLocation } = useSetUserCurrentLocation();
  const {
    authToken,
    setIsAuthModalVisible,
    setActivePanel,
    setAuthToken,
    refetchProfileData,
    setRefetchProfileData,
  } = useAuth();
  const { queryData = [] } = useNearByRestaurantsPreview(true, 1, 100);

  const {
    isSearchFocused,
    setIsSearchFocused,
    filter,
    setFilter,
    setSearchedData,
  } = useSearchUI();

  // Format subtotal for display
  const formattedSubtotal =
    cartCount > 0
      ? `${CURRENCY_SYMBOL}${calculateSubtotal()}`
      : `${CURRENCY_SYMBOL}0`;

  // Handlers
  const onInit = () => {
    const current_location_ls = onUseLocalStorage(
      "get",
      USER_CURRENT_LOCATION_LS_KEY
    );
    const user_current_location = current_location_ls
      ? JSON.parse(current_location_ls)
      : null;

    if (user_current_location) {
      setUserAddress(user_current_location);
      return;
    }

    const selectedAddress = profile?.addresses.find(
      (address) => address.selected
    );
    // ✅ If there's a selected address, use that
    if (selectedAddress) {
      setUserAddress(selectedAddress);
    } else {
      // Otherwise, get current location if profile is loaded and maps key exists
      if (!loadingProfile && GOOGLE_MAPS_KEY) {
        getCurrentLocation(onSetUserLocation);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  const onHandleAddressModelVisibility = () => {
    if (authToken) {
      setIsUserAddressModalOpen(true);
    } else {
      setIsAuthModalVisible(true);
    }
  };

  const { showToast } = useContext(ToastContext);
  const onLogout = () => {
    router.replace("/");
    setActivePanel(0);
    setAuthToken("");
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    //Give Toast Alert You Logout Successfully
    showToast({
      type: "success",
      title: t("logoutSuccessToastTitle"),
      message: t("logoutSuccessToastMessage"),
    });
    setLogoutConfirmationVisible(false);
  };

  // Logo click handler
  const logoClickHandler = () => {
    if (isLogin) {
      router.push("/");
    } else {
      router.push("/");
    }
  };

  //Language DropDoDowm
  // const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // const handleLanguageChange = (lang: string) => {
  //   localStorage.setItem("language", lang);
  //   setShowLanguageDropdown(false);
  //   showToast({
  //     type: "success",
  //     title: "Language Changed",
  //     message: `Language switched to ${lang.toUpperCase()}`,
  //   });
  // };

  // UseEffects
  useEffect(() => {
    onInit();
  }, [GOOGLE_MAPS_KEY, profile]);

  useEffect(() => {
    if (refetchProfileData) {
      fetchProfile(); // this one is not working when a refetch is required, kindly check this whoever is working on this module
      onInit();
      setRefetchProfileData(false);
    }
  }, [refetchProfileData]);

  const filteredResults = useMemo(() => {
    if (!filter.trim()) return [];
    if (!queryData || !Array.isArray(queryData) || queryData.length === 0)
      return [];

    const searchText = filter.toLowerCase();
    return queryData.filter(({ name, address = "", cuisines = [] }) => {
      return (
        name.toLowerCase().includes(searchText) ||
        address.toLowerCase().includes(searchText) ||
        cuisines.join(" ").toLowerCase().includes(searchText)
      );
    });
  }, [filter, queryData]);

  //Language Dropdown UseEffect
  useEffect(() => {
    const closeDropdown = () => {
      // setShowLanguageDropdown(false);
    };
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  // Update searchedData in context whenever filter changes
  useEffect(() => {
    setSearchedData(filteredResults);
  }, [filter]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setFilter(e.target.value);
  };

  function fittedAddress(address: String | undefined) {
    if (address) {
      let adr = address.slice(0, 16);
      if (address.length > 16) {
        adr = adr + "...";
      }
      return adr;
    }
    return "";
  }

  return (
    <>
      <nav
        className={`w-screen shadow-sm dark:shadow-gray-600 z-50 bg-white dark:bg-gray-900 layout-top-bar ${isSearchFocused ? "sticky top-0" : ""}`}
      >
        <div className="w-full">
          <PaddingContainer>
            <div className="flex items-center justify-between w-full h-20 sm:h-16 flex-wrap md:flex-nowrap">
              {/* Left Section */}
              <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
                {!isSearchFocused && (
                  <div
                    onClick={logoClickHandler}
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    <Logo fillColor="#000000" darkmode="#FFFFFFFF" />
                  </div>
                )}
                {!isSearchFocused && (
                  <div
                    className={`flex items-center ${isSearchFocused && "hidden"} hidden lg:flex`}
                    onClick={onHandleAddressModelVisibility}
                  >
                    {/* Show on large screens only */}
                    <div className="hidden md:block p-[4px] m-2 rounded-full">
                      <LocationSvg width={22} height={22} />
                    </div>

                    <span className="hidden md:inline text-xs sm:text-sm md:text-base text-primary-color font-inter font-normal leading-6 tracking-normal mr-2 truncate">
                      {fittedAddress(userAddress?.deliveryAddress)}
                    </span>

                    <div className="hidden sm:flex items-center">
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        width={12}
                        hanging={12}
                        className="text-primary-color"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Center Section */}
              <div
                className={`flex-grow transition-all duration-500 ease-in-out ${isSearchFocused ? "max-w-full" : "max-w-md"} px-2`}
              >
                <div className="relative w-[14rem] sm:w-full">
                  <input
                    id="search-input"
                    value={filter}
                    onChange={handleSearchInputChange}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder={t("SearchBarPlaceholder")}
                    className={`
                w-full px-4 py-2 pr-10 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary-color
                ${!isSearchFocused ? "hidden" : "block"} sm:block
                dark:bg-gray-800 dark:text-white
              `}
                  />

                  {isSearchFocused && (
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 items-center justify-center cursor-pointer hidden sm:flex"
                      onClick={() => setFilter("")}
                    >
                      <CircleCrossSvg color="black" width={16} height={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                {!isSearchFocused && (
                  <div className="sm:hidden flex justify-end items-center w-full">
                    <div
                      className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => setIsSearchFocused(true)}
                    >
                      <SearchSvg width={16} height={16} />
                    </div>
                  </div>
                )}
                <UserMenu
                  handleModalToggle={handleModalToggle}
                  setLogoutConfirmationVisible={setLogoutConfirmationVisible}
                />
                <LanguageMenu isSearchFocused={isSearchFocused} />
                {/* Cart Button */}
                <div className="p-1 cursor-pointer">
                  {cartCount > 0 && !isSearchFocused && (
                    <div
                      className="hidden lg:flex items-center justify-between bg-primary-color rounded-lg px-4 py-3 w-64 cursor-pointer"
                      onClick={() => {
                        if (!authToken) {
                          setIsAuthModalVisible(true); // ⬅️ Show login/signup modal
                        } else {
                          setIsCartOpen(true); // ⬅️ Open cart drawer
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-white text-primary-color rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-[12px]">
                          {cartCount}
                        </div>
                        <span className="ml-2 text-white text-[14px] font-semibold sm:text-[14px]">
                          {t("show_items_btn")}
                        </span>
                      </div>
                      <span className="text-white text-[14px] sm:text-[16px]">
                        {formattedSubtotal}
                      </span>
                    </div>
                  )}
                  {isSearchFocused ? (
                    <div
                      className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 dark:bg-gray-700 relative cursor-pointer"
                      onClick={() => {
                        setIsSearchFocused(false);
                        setFilter("");
                      }}
                    >
                      <CircleCrossSvg color="black" width={24} height={24} />
                    </div>
                  ) : (
                    <div
                      className={`${cartCount > 0 ? "lg:hidden" : ""} flex items-center justify-center rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-500 relative`}
                      onClick={() => setIsCartOpen(true)}
                    >
                      <div className="block sm:hidden">
                        <CartSvg color="black" width={18} height={18} />
                      </div>
                      <div className="hidden sm:block">
                        <CartSvg color="black" width={22} height={22} />
                      </div>
                      {cartCount > 0 && authToken && (
                        <div className="absolute -top-1 -right-1 bg-black text-primary-color text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                          {cartCount}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex items-center justify-center">
              <div className="w-full md:w-7/12 pr-5">
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      key="search-results"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="
                      w-full h-[10%] mt-2 max-h-[60vh] 
                      bg-white dark:bg-gray-800 
                      overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
                      dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700
                      rounded-md
                    "
                    >
                      <SearchResults filteredResults={filteredResults} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!isSearchFocused && (
              <div
                className="my-2 lg:hidden"
                onClick={onHandleAddressModelVisibility}
              >
                <div className="flex gap-4">
                  <LocationSvg width={22} height={22} />
                  <p className="text-[14px] text-primary-color">
                    {userAddress?.deliveryAddress}
                  </p>
                  <div className="sm:flex items-center">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      width={12}
                      hanging={12}
                      color="#94e469"
                    />
                  </div>
                </div>
              </div>
            )}
          </PaddingContainer>
        </div>
      </nav>
      {/* Preventing everything at the background from being clickable when searchbar is open  */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}

      {/* Cart Sidebar */}
      <Sidebar
        position={position} // ✅ dynamic position
        visible={isCartOpen}
        onHide={() => {
          setIsCartOpen(false);
          localStorage.setItem(
            "newOrderInstructions",
            localStorage.getItem("orderInstructions") || ""
          );
          localStorage.removeItem("orderInstructions");
          window.dispatchEvent(new Event("orderInstructionsUpdated"));
        }}
        className={`!ml-0 !p-0 !m-0 w-full md:w-[430px] lg:w-[580px] dark:bg-gray-800`}
      >
        <Cart
          onClose={() => {
            setIsCartOpen(false);
            localStorage.setItem(
              "newOrderInstructions",
              localStorage.getItem("orderInstructions") || ""
            );
            localStorage.removeItem("orderInstructions");
            window.dispatchEvent(new Event("orderInstructionsUpdated"));
          }}
        />
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        visible={logoutConfirmationVisible}
        setVisible={setLogoutConfirmationVisible}
        onLogout={onLogout}
      />

      <UserAddressComponent
        visible={isUserAddressModalOpen}
        onHide={() => setIsUserAddressModalOpen(false)}
      />
    </>
  );
};

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
