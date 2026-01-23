"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { useQuery } from "@apollo/client";
import { MenuItem } from "primereact/menuitem";

// Context & Hooks
import useUser from "@/lib/hooks/useUser";
import useRestaurant from "@/lib/hooks/useRestaurant";

// Components
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import FoodItemDetail from "@/lib/ui/useable-components/item-detail";
import FoodCategorySkeleton from "@/lib/ui/useable-components/custom-skeletons/food-items.skeleton";
import { useMutation } from "@apollo/client";
import { ADD_FAVOURITE_RESTAURANT } from "@/lib/api/graphql/mutations/restaurant";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import Confetti from "react-confetti";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";

// API
import {
  GET_CATEGORIES_SUB_CATEGORIES_LIST,
  GET_POPULAR_SUB_CATEGORIES_LIST,
  GET_SUB_CATEGORIES,
} from "@/lib/api/graphql";

// Interface
import {
  ICategory,
  ICategoryDetailsResponse,
  IFood,
} from "@/lib/utils/interfaces";

// Methods
import { toSlug, isWithinOpeningTime } from "@/lib/utils/methods";
import ReviewsModal from "@/lib/ui/useable-components/reviews-modal";
import InfoModal from "@/lib/ui/useable-components/info-modal";
import { ToastContext } from "@/lib/context/global/toast.context";
import { useTranslations } from "next-intl";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

import StoreBanner from "./components/StoreBanner";
import StoreInfo from "./components/StoreInfo";
import MobileCategoryList from "./components/MobileCategoryList";
import StoreMainContent from "./components/StoreMainContent";
import { useStoreDeals } from "./hooks/useStoreDeals";
import { useStoreMenuItems } from "./hooks/useStoreMenuItems";

export default function StoreDetailsScreen() {
  // get the RTL direction
  const direction = document.documentElement.getAttribute("dir") || "ltr";

  const t = useTranslations();
  // Access the UserContext via our custom hook
  const { cart, transformCartWithFoodInfo, updateCart, profile } = useUser();

  // Params
  const { id, slug }: { id: string; slug: string } = useParams();

  // State
  const [showDialog, setShowDialog] = useState<IFood | null>(null);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const [filter] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { CURRENCY_SYMBOL } = useConfig();
  const [subCategoriesForCategories, setSubCategoriesForCategories] = useState<
    ICategoryDetailsResponse[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  // Ref
  const selectedCategoryRefs = useRef<string>("");
  const selectedSubCategoryRefs = useRef<string>("");

  // Hooks
  const { data, loading } = useRestaurant(id, decodeURIComponent(slug));
  const {
    data: categoriesSubCategoriesList,
    loading: categoriesSubCategoriesLoading,
  } = useQuery(GET_CATEGORIES_SUB_CATEGORIES_LIST, {
    variables: {
      storeId: id,
    },
  });
  const { data: popularSubCategoriesList } = useQuery(
    GET_POPULAR_SUB_CATEGORIES_LIST,
    {
      variables: {
        restaurantId: id,
      },
    }
  );

  const { data: subcategoriesData, loading: subcategoriesLoading } =
    useQuery(GET_SUB_CATEGORIES);

  // Transform cart items when restaurant data is loaded
  useEffect(() => {
    if (data?.restaurant && cart.length > 0) {
      const transformedCart = transformCartWithFoodInfo(cart, data.restaurant);
      if (JSON.stringify(transformedCart) !== JSON.stringify(cart)) {
        updateCart(transformedCart);
      }
    }
  }, [data?.restaurant, cart.length, transformCartWithFoodInfo, updateCart]);

  useEffect(() => {
    if (profile?.favourite) {
      const isFavorite = profile.favourite.includes(id);
      setIsLiked(isFavorite);
    }
  }, [profile, id]);

  // Constants
  const allDeals = data?.restaurant?.categories?.filter(
    (cat: ICategory) => cat.foods.length
  );

  // Templates
  const parentItemRenderer = (item: MenuItem) => {
    const _url = item.url?.slice(1);
    const isClicked = _url === selectedCategoryRefs.current;

    return (
      <div
        className="flex align-items-center px-3 py-2 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-800"
        onClick={() => handleScroll(_url ?? "", true)}
      >
        <span
          className={`mx-2 ${item.items && "font-semibold"} text-${
            isClicked ? "primary-color" : "gray-600"
          }
            dark:text-${isClicked ? "primary-color" : "gray-300"}`}
        >
          {item.label}
        </span>
        {/* <span
          className={`mx-2 ${item.items && "font-semibold"} text-${
            isClicked ? "primary-color" : "gray-100"
          }`}
        >
          {item.label}
        </span> */}
      </div>
    );
  };

  // Handle update is modal open if restaurant is not active
  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen]
  );

  const itemRenderer = (item: MenuItem) => {
    const _url = item.url?.slice(1);
    const isClicked = _url === selectedSubCategoryRefs.current;

    return (
      <div
        className="flex align-items-center px-3 py-2 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-800 "
        onClick={() => handleScroll(_url ?? "", true)}
      >
        <span
          className={`mx-2 ${item.items && "font-semibold"} text-${
            isClicked ? "secondary-color" : "gray-600"
          }
          dark:text-${isClicked ? "primary-color" : "gray-300"}`}
        >
          {item.label}
        </span>
      </div>
    );
  };

  const deals = useStoreDeals(
    allDeals,
    filter,
    subcategoriesData,
    popularSubCategoriesList,
    t
  );

  const menuItems = useStoreMenuItems(
    categoriesSubCategoriesList,
    popularSubCategoriesList,
    deals,
    t,
    itemRenderer,
    parentItemRenderer
  );

  // Handlers
  const handleScroll = (id: string, isParent = true, offset: number = 120) => {
    console.log("handleScrollId", id);
    if (isParent) {
      setSelectedCategory(id);
      selectedCategoryRefs.current = id || "";
      // Filter SubCategories
      const sliderSubCategories =
        menuItems?.find(
          (item: ICategoryDetailsResponse) => toSlug(item.label) === id
        )?.items || [];

      setSubCategoriesForCategories(sliderSubCategories);
    } else {
      selectedSubCategoryRefs.current = id || "";
      setSelectedSubCategory(id);
    }
    const element = document.getElementById(id);
    const container = document.body; // Adjust selector

    if (element && container) {
      const headerOffset = offset;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnterCategoryPanel = () => {
    if (!isScrolling) {
      setIsScrolling(true);
    }
  };

  // Function to handle opening the food item modal
  const handleOpenFoodModal = (food: IFood) => {
    if (food.isOutOfStock) return;

    if (
      !restaurantInfo?.isAvailable ||
      !restaurantInfo?.isActive ||
      !isWithinOpeningTime(restaurantInfo?.openingTimes)
    ) {
      handleUpdateIsModalOpen(true, food?._id);
      return;
    }
    // Add restaurant ID to the food item

    setShowDialog({
      ...food,
      restaurant: data?.restaurant?._id,
    });
  };

  // Function to close the food item modal
  const handleCloseFoodModal = () => {
    setShowDialog(null);
  };

  const [addFavorite, { loading: addFavoriteLoading }] = useMutation(
    ADD_FAVOURITE_RESTAURANT,
    {
      onCompleted: () => {
        const wasLiked = isLiked;
        setIsLiked(!isLiked);

        // Only show confetti when adding a favorite (not removing)
        if (!wasLiked) {
          console.log("Favorite added, triggering confetti!");
          setShowConfetti(true);

          // Reset confetti after a longer delay
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }
      },
      onError: (error) => {
        console.error("Error toggling favorite:", error);
      },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    }
  );

  // Constants
  const headerData = {
    name: data?.restaurant?.name ?? "...",
    averageReview: data?.restaurant?.reviewData?.ratings ?? "...",
    averageTotal: data?.restaurant?.reviewData?.total ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    deliveryTime: data?.restaurant?.deliveryTime,
  };
  const { showToast } = useContext(ToastContext);
  const handleFavoriteClick = () => {
    if (!profile) {
      showToast({
        type: "error",
        title: "Login Required",
        message: "Please Login to add favorites",
      });
      return;
    }

    addFavorite({
      variables: {
        id: id,
      },
    });
  };

  const restaurantInfo = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    logo: data?.restaurant?.logo ?? "",
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    isActive: data?.restaurant?.isActive ?? true,
  };

  const restaurantInfoModalProps = {
    deliveryTime: data?.restaurant.deliveryTime ?? "30-45",
    deliveryTax: data?.restaurant.tax ?? "0",
    MinimumOrder: data?.restaurant.minimumOrder ?? "0",
    _id: data?.restaurant._id ?? "",
    name: data?.restaurant?.name ?? "...",
    username: data?.restaurant?.username ?? "N/A",
    phone: data?.restaurant?.phone ?? "N/A",
    address: data?.restaurant?.address ?? "N/A",
    location: data?.restaurant?.location ?? "N/A",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    description: data?.restaurant?.description ?? t("restaurant_modal_label"),
  };

  // Handlers
  // Function to handle the logic for seeing reviews
  const handleSeeReviews = () => {
    setShowReviews(true);
  };

  // Function to handle the logic for seeing more information
  const handleSeeMoreInfo = () => {
    setShowMoreInfo(true);
  };

  // Effect to select the first category on page load
  useEffect(() => {
    if (menuItems?.length > 0 && !selectedCategory) {
      const firstCategorySlug = toSlug(menuItems[0].label);
      setSelectedCategory(firstCategorySlug);
      selectedCategoryRefs.current = firstCategorySlug;
    }
  }, [menuItems]);

  // Effect to update selected category during scrolling
  useEffect(() => {
    const handleScrollUpdate = () => {
      const container = document.body;
      if (!container) return;

      let selected = "";
      deals.forEach((category) => {
        const element = document.getElementById(toSlug(category.title));
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            selected = toSlug(category.title);
          }
        }
      });

      if (selected && selected !== selectedCategoryRefs.current) {
        setSelectedCategory(selected);
        selectedCategoryRefs.current = selected;
      }
    };

    const container = document.body;
    container?.addEventListener("scroll", handleScrollUpdate);

    return () => {
      container?.removeEventListener("scroll", handleScrollUpdate);
    };
  }, [deals]);

  onUseLocalStorage("save", "restaurant", data?.restaurant?._id);
  onUseLocalStorage("save", "restaurant-slug", data?.restaurant?.slug);
  onUseLocalStorage(
    "save",
    "currentShopType",
    data?.restaurant?.shopType === "restaurant" ? "restaurant" : "store"
  );

  return (
    <>
      {/* Reviews Modal  */}
      <ReviewsModal
        restaurantId={id}
        visible={showReviews && !loading}
        onHide={() => setShowReviews(false)}
      />
      {/* See More  Info Modal */}
      <InfoModal
        restaurantInfo={restaurantInfoModalProps}
        // make sure data is not loading because if configuration data is not available it can cause error on google map due to unavailability of api key
        visible={showMoreInfo && !loading}
        onHide={() => setShowMoreInfo(false)}
      />

      {showConfetti && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 10000,
            }}
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={1000}
              gravity={0.3}
            />
          </div>
        </>
      )}

      {/* Banner */}
      <StoreBanner
        loading={loading}
        restaurantInfo={restaurantInfo}
        addFavoriteLoading={addFavoriteLoading}
        handleFavoriteClick={handleFavoriteClick}
        direction={direction}
        isLiked={isLiked}
      />

      {/* Restaurant Info */}
      <StoreInfo
        loading={loading}
        headerData={headerData}
        handleSeeMoreInfo={handleSeeMoreInfo}
        handleSeeReviews={handleSeeReviews}
      />

      {/* Category Section */}
      <MobileCategoryList
        menuItems={menuItems}
        selectedCategory={selectedCategory}
        handleScroll={handleScroll}
        subCategoriesForCategories={subCategoriesForCategories}
        selectedSubCategory={selectedSubCategory}
      />

      {/* Main Section */}
      <PaddingContainer>
        {loading || categoriesSubCategoriesLoading || subcategoriesLoading ? (
          <div className=" w-full">
            <FoodCategorySkeleton />
          </div>
        ) : (
          <StoreMainContent
            isScrolling={isScrolling}
            handleMouseEnterCategoryPanel={handleMouseEnterCategoryPanel}
            menuItems={menuItems}
            deals={deals}
            handleOpenFoodModal={handleOpenFoodModal}
            direction={direction}
            t={t}
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            isModalOpen={isModalOpen}
            handleUpdateIsModalOpen={handleUpdateIsModalOpen}
          />
        )}
        {!loading && deals.length == 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
            <EmptySearch />
          </div>
        )}
      </PaddingContainer>

      {/* Food Item Detail Modal */}
      <Dialog
        visible={!!showDialog}
        contentClassName="dark:bg-gray-800 dark:text-gray-300"
        headerClassName="dark:bg-gray-800 dark:text-gray-300"
        className="mx-3 sm:mx-4 md:mx-0 " // Adds margin on small screens
        onHide={handleCloseFoodModal}
        showHeader={false}
        contentStyle={{
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          padding: "0px",
        }} // Rounds top corners
        style={{ borderRadius: "1rem" }} // Rounds full box including top corners
      >
        {showDialog && (
          <FoodItemDetail
            foodItem={showDialog}
            addons={data?.restaurant?.addons}
            options={data?.restaurant?.options}
            onClose={handleCloseFoodModal}
          />
        )}
      </Dialog>
    </>
  );
}
