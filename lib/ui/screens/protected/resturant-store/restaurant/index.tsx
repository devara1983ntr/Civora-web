"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { ADD_FAVOURITE_RESTAURANT } from "@/lib/api/graphql/mutations/restaurant";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { useQuery } from "@apollo/client";

// Context & Hooks
import useUser from "@/lib/hooks/useUser";
import useRestaurant from "@/lib/hooks/useRestaurant";

// Components
import Spacer from "@/lib/ui/useable-components/spacer";
import FoodItemDetail from "@/lib/ui/useable-components/item-detail";
import ClearCartModal from "@/lib/ui/useable-components/clear-cart-modal";
import Confetti from "react-confetti";
import { useConfig } from "@/lib/context/configuration/configuration.context";

// Interface
import { ICategory, IFood } from "@/lib/utils/interfaces";

// Methods
import { toSlug, isWithinOpeningTime } from "@/lib/utils/methods";
import ReviewsModal from "@/lib/ui/useable-components/reviews-modal";
import InfoModal from "@/lib/ui/useable-components/info-modal";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

// Queries
import { GET_POPULAR_SUB_CATEGORIES_LIST } from "@/lib/api/graphql";
import { Dialog } from "primereact/dialog";
import { useTranslations } from "next-intl";

import RestaurantBanner from "./components/RestaurantBanner";
import RestaurantInfo from "./components/RestaurantInfo";
import CategoryList from "./components/CategoryList";
import FoodGrid from "./components/FoodGrid";
import { useDeals } from "./hooks/useDeals";

export default function RestaurantDetailsScreen() {
  // Access the UserContext via our custom hook
  const {
    cart,
    transformCartWithFoodInfo,
    updateCart,
    restaurant: cartRestaurant,
    clearCart,
  } = useUser();

  // Params from route
  const { id, slug }: { id: string; slug: string } = useParams();

  // Refs
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const selectedCategoryRef = useRef<string>("");

  // get the RTL direction
  const direction = document.documentElement.getAttribute("dir") || "ltr";

  // State
  const [filter, setFilter] = useState("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<IFood | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState<boolean>(false);
  const [pendingRestaurantAction, setPendingRestaurantAction] =
    useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { CURRENCY_SYMBOL } = useConfig();
  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  // Get user profile from context
  const { profile } = useUser();

  // Fetch restaurant data
  const { data, loading } = useRestaurant(id, decodeURIComponent(slug));

  // fetch popular deals id
  const { data: popularSubCategoriesList } = useQuery(
    GET_POPULAR_SUB_CATEGORIES_LIST,
    {
      variables: {
        restaurantId: id,
      },
    }
  );
  // Transform cart items when restaurant data is loaded - only once when dependencies change
  useEffect(() => {
    if (data?.restaurant && cart.length > 0) {
      const transformedCart = transformCartWithFoodInfo(cart, data.restaurant);
      if (JSON.stringify(transformedCart) !== JSON.stringify(cart)) {
        updateCart(transformedCart);
      }
    }
  }, [data?.restaurant, cart?.length, transformCartWithFoodInfo, updateCart]);

  // Filter food categories based on search term
  const allDeals = data?.restaurant?.categories?.filter(
    (cat: ICategory) => cat.foods.length
  );

  // Check if restaurant is favorited when profile is loaded
  useEffect(() => {
    if (profile?.favourite) {
      const isFavorite = profile.favourite.includes(id);
      setIsLiked(isFavorite);
    }
  }, [profile, id]);

  // Handle update is modal open if restaurant is not active
  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen]
  );

  const popularDealsIds = popularSubCategoriesList?.popularItems?.map(
    (item: any) => item.id
  );

  const deals = useDeals(allDeals, filter, popularDealsIds);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (deals.length > 0 && !selectedCategory) {
      setSelectedCategory(toSlug(deals[0]?.title)); // first category selected by default
    }
  }, [deals, selectedCategory]);

  const [addFavorite, { loading: addFavoriteLoading }] = useMutation(
    ADD_FAVOURITE_RESTAURANT,
    {
      onCompleted: () => {
        const wasLiked = isLiked;
        setIsLiked(!isLiked);

        // Only show confetti when adding a favorite (not removing)
        if (!wasLiked) {
          setShowConfetti(true);

          // Reset confetti after a longer delay
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000); // Increased from 3000ms to 5000ms
        }
      },
      onError: (error) => {
        console.error("Error adding favorite:", error);
        setIsLiked((prev) => !prev); // Revert the like state on error
      },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    }
  );

  const t = useTranslations();
  const handleFavoriteClick = () => {
    if (!profile) {
      // // Handle case where user is not logged in
      return;
    }

    addFavorite({
      variables: {
        id: id,
      },
    });
  };

  // Restaurant info
  const headerData = {
    name: data?.restaurant?.name ?? "...",
    averageReview: data?.restaurant?.reviewData?.ratings ?? "...",
    averageTotal: data?.restaurant?.reviewData?.total ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    deals: deals,
    deliveryTime: data?.restaurant?.deliveryTime,
  };

  const restaurantInfo = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    logo: data?.restaurant?.logo ?? "",
    deals: deals,
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    isActive: data?.restaurant?.isActive ?? true,
  };

  const restaurantInfoModalProps = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    username: data?.restaurant?.username ?? "N/A",
    phone: data?.restaurant?.phone ?? "N/A",
    address: data?.restaurant?.address ?? "N/A",
    location: data?.restaurant?.location ?? "N/A",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    description: data?.restaurant?.description ?? t("restaurant_modal_label"),
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    deliveryTax: data?.restaurant?.deliveryTax ?? 0,
    MinimumOrder: data?.restaurant?.MinimumOrder ?? 0,
  };

  // States
  const [visibleItems, setVisibleItems] = useState(10); // Default visible items
  const [showAll, setShowAll] = useState(false);
  const [headerHeight, setHeaderHeight] = useState("64px"); // Default for desktop
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

  // Function to handle clicking on a restaurant
  const handleRestaurantClick = (food: IFood) => {
    if (food.isOutOfStock) return;
    if (
      !restaurantInfo?.isAvailable ||
      !restaurantInfo?.isActive ||
      !isWithinOpeningTime(restaurantInfo?.openingTimes)
    ) {
      // Store the action we want to perform after cart confirmation
      handleUpdateIsModalOpen(true, food?._id);
      return;
    }
    // Check if there's a different restaurant in the cart
    if (cartRestaurant && id !== cartRestaurant) {
      // Store the action we want to perform after cart confirmation
      setPendingRestaurantAction({
        type: "foodModal",
        payload: food,
      });
      // Show clear cart confirmation
      setShowClearCartModal(true);
    } else {
      // No conflict, open food modal directly
      handleOpenFoodModal(food);
    }
  };

  // Function to handle clear cart confirmation
  const handleClearCartConfirm = async () => {
    await clearCart();

    // Execute the pending action
    if (pendingRestaurantAction) {
      if (pendingRestaurantAction.type === "foodModal") {
        handleOpenFoodModal(pendingRestaurantAction.payload);
      }
      // Reset the pending action
      setPendingRestaurantAction(null);
    }

    onUseLocalStorage("save", "restaurant", data?.restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", data?.restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      data?.restaurant?.shopType === "restaurant" ? "restaurant" : "store"
    );

    // Hide the modal
    setShowClearCartModal(false);
  };

  // Handlers
  const handleScroll = (id: string) => {
    setSelectedCategory(id);
    selectedCategoryRef.current = id;
    const element = document.getElementById(id);
    const container = document.body;

    if (element && container) {
      const headerOffset = 120;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Function to handle opening the food item modal
  const handleOpenFoodModal = (food: IFood) => {
    // Add restaurant ID to the food item
    setSelectedFood({
      ...food,
      restaurant: restaurantInfo._id,
    });
    setShowDialog(true);
    console.log("Food ModAL dETAISL", food);
  };

  // Function to close the food item modal
  const handleCloseFoodModal = () => {
    setShowDialog(false);
    setSelectedFood(null);
  };

  // Function to handle the logic for seeing reviews
  const handleSeeReviews = () => {
    setShowReviews(true);
  };

  // Function to handle the logic for seeing more information
  const handleSeeMoreInfo = () => {
    setShowMoreInfo(true);
  };

  // Function to show all categories
  useEffect(() => {
    // Adjust visible items based on screen width
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(3); // Small screens
      } else if (width < 1024) {
        setVisibleItems(4); // Medium screens
      } else {
        setVisibleItems(5); // Large screens
      }
    };

    const updateHeight = () => {
      if (window.innerWidth >= 1024)
        setHeaderHeight("64px"); // lg (desktop)
      else if (window.innerWidth >= 768)
        setHeaderHeight("80px"); // md (tablet)
      else if (window.innerWidth >= 640)
        setHeaderHeight("100px"); // sm (larger phones)
      else setHeaderHeight("120px"); // xs (small phones)
    };

    updateHeight();
    updateVisibleItems();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Highlight categories on scroll observer
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

      if (selected && selected !== selectedCategoryRef.current) {
        setSelectedCategory(selected);
        selectedCategoryRef.current = selected;
      }
    };

    const container = document.body;
    container?.addEventListener("scroll", handleScrollUpdate);

    return () => {
      container?.removeEventListener("scroll", handleScrollUpdate);
    };
  }, [deals]);

  return (
    <>
      {/* Reviews Modal */}
      <ReviewsModal
        restaurantId={id}
        visible={showReviews && !loading}
        onHide={() => setShowReviews(false)}
      />

      {/* See More Info Modal */}
      <InfoModal
        restaurantInfo={restaurantInfoModalProps}
        // make sure data is not loading because if configuration data is not available it can cause error on google map due to unavailability of api key
        visible={showMoreInfo && !loading}
        onHide={() => setShowMoreInfo(false)}
      />

      {/* Clear Cart Modal */}
      <ClearCartModal
        isVisible={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        onConfirm={handleClearCartConfirm}
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
              zIndex: 10000, // Increased z-index
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
          {/* Backdrop overlay to ensure confetti is visible on all backgrounds */}
        </>
      )}

      {/* Banner */}
      <RestaurantBanner
        loading={loading}
        restaurantInfo={restaurantInfo}
        addFavoriteLoading={addFavoriteLoading}
        handleFavoriteClick={handleFavoriteClick}
        direction={direction}
        isLiked={isLiked}
      />
      {/* Restaurant Info */}
      <RestaurantInfo
        loading={loading}
        headerData={headerData}
        handleSeeMoreInfo={handleSeeMoreInfo}
        handleSeeReviews={handleSeeReviews}
      />

      {/* Category Section */}
      <CategoryList
        headerHeight={headerHeight}
        showAll={showAll}
        deals={deals}
        visibleItems={visibleItems}
        selectedCategory={selectedCategory}
        handleScroll={handleScroll}
        setShowAll={setShowAll}
        filter={filter}
        loading={loading}
        setFilter={setFilter}
      />

      <Spacer height="20px" />

      {/* Food Categories and Items */}
      <FoodGrid
        loading={loading}
        deals={deals}
        categoryRefs={categoryRefs}
        handleRestaurantClick={handleRestaurantClick}
        isModalOpen={isModalOpen}
        handleUpdateIsModalOpen={handleUpdateIsModalOpen}
        direction={direction}
        CURRENCY_SYMBOL={CURRENCY_SYMBOL}
      />

      {/* Food Item Detail Modal */}
      <Dialog
        contentClassName="dark:bg-gray-800 dark:text-gray-300"
        headerClassName="dark:bg-gray-800 dark:text-gray-300"
        visible={!!showDialog}
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
        {selectedFood && (
          <FoodItemDetail
            foodItem={selectedFood}
            addons={data?.restaurant?.addons}
            options={data?.restaurant?.options}
            restaurant={data?.restaurant}
            onClose={handleCloseFoodModal}
          />
        )}
      </Dialog>
    </>
  );
}
