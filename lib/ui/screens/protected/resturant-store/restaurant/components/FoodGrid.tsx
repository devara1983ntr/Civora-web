import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import FoodCategorySkeleton from "@/lib/ui/useable-components/custom-skeletons/food-items.skeleton";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import { useTranslations } from "next-intl";
import { toSlug } from "@/lib/utils/methods";
import { ICategory, IFood } from "@/lib/utils/interfaces";
import { MutableRefObject } from "react";

interface FoodGridProps {
    loading: boolean;
    deals: ICategory[];
    categoryRefs: MutableRefObject<Record<string, HTMLElement | null>>;
    handleRestaurantClick: (food: IFood) => void;
    isModalOpen: { value: boolean; id: string };
    handleUpdateIsModalOpen: (value: boolean, id: string) => void;
    direction: string;
    CURRENCY_SYMBOL: string;
}

const FoodGrid = ({
    loading,
    deals,
    categoryRefs,
    handleRestaurantClick,
    isModalOpen,
    handleUpdateIsModalOpen,
    direction,
    CURRENCY_SYMBOL
}: FoodGridProps) => {
    const t = useTranslations();

    return (
      <PaddingContainer className="pb-10">
        {loading ? (
          <FoodCategorySkeleton />
        ) : (
          deals.map((category: ICategory, catIndex: number) => {
            const categorySlug = toSlug(category.title);

            return (
              <div
                key={catIndex}
                className="mb-4 p-3"
                id={categorySlug}
                data-category-id={categorySlug}
                ref={(el) => {
                  categoryRefs.current[categorySlug] = el;
                }}
              >
                <h2 className="mb-4 font-inter text-gray-900 dark:text-gray-100 font-bold text-2xl sm:text-xl leading-snug tracking-tight">
                  {category.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {category.foods.map((meal: IFood, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="flex gap-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 p-3 relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => handleRestaurantClick(meal)}
                    >
                      {/* Text Content */}
                      <div className="flex-grow text-left md:text-left space-y-2">
                        <div className="flex flex-col lg:flex-row justify-between flex-wrap">
                          <h3 className="text-gray-900 dark:text-gray-100  text-lg font-semibold font-inter">
                            {meal.title}
                          </h3>
                          {meal.isOutOfStock && (
                            <span className="text-red-500">
                              {t("out_of_stock_label")}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-sm dark:text-gray-400 line-clamp-2 hover:line-clamp-none">
                          {meal.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <span className="text-secondary-color dark:text-sky-400 text-lg font-semibold">
                            {CURRENCY_SYMBOL} {meal.variations[0].price}
                          </span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
                        <Image
                          alt={meal.title}
                          className="w-full h-full rounded-md object-cover mx-auto md:mx-0"
                          src={meal.image}
                          width={112}
                          height={112}
                        />
                      </div>

                      {/* Add Button */}
                      <div
                        className={`${direction === "rtl" ? "left-2" : "right-2"} absolute top-2`}
                      >
                        <button
                          className="bg-secondary-color rounded-full shadow-md w-6 h-6 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent onClick
                            handleRestaurantClick(meal);
                          }}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faPlus} color="white" />
                        </button>
                      </div>

                      {/* create a modal that will be show that this restaurant is closed do want to see menu or want to close if click on the see menu then will move to the next page other wise modal will be closed */}
                      <CustomDialog
                        className="max-w-[300px]"
                        visible={
                          isModalOpen.value &&
                          isModalOpen.id === meal?._id?.toString()
                        }
                        onHide={() =>
                          handleUpdateIsModalOpen(false, meal?._id?.toString())
                        }
                      >
                        <div className="text-center pb-10 pt-10">
                          <p className="text-lg font-bold pb-3 dark:text-gray-100">
                            {t("restaurant_is_closed")}
                          </p>
                          <p className="text-sm dark:text-gray-300">
                            {t("cannot_order_food_item_now")}
                            <br></br> {t("please_try_again_later")}
                          </p>
                        </div>
                      </CustomDialog>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        {!loading && deals.length == 0 && (
          <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
            <EmptySearch />
          </div>
        )}
      </PaddingContainer>
    );
};

export default FoodGrid;
