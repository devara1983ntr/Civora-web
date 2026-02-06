import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
import { ICategoryV2, ISubCategoryV2, IFood } from "@/lib/utils/interfaces";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import { toSlug } from "@/lib/utils/methods";

interface StoreMainContentProps {
    isScrolling: boolean;
    handleMouseEnterCategoryPanel: () => void;
    menuItems: any[]; // PanelMenu model accepts MenuItem[] but we pass complex object sometimes
    deals: ICategoryV2[];
    handleOpenFoodModal: (food: IFood) => void;
    direction: string;
    t: any;
    CURRENCY_SYMBOL: string;
    isModalOpen: { value: boolean; id: string };
    handleUpdateIsModalOpen: (value: boolean, id: string) => void;
}

const StoreMainContent = ({
    isScrolling,
    handleMouseEnterCategoryPanel,
    menuItems,
    deals,
    handleOpenFoodModal,
    direction,
    t,
    CURRENCY_SYMBOL,
    isModalOpen,
    handleUpdateIsModalOpen
}: StoreMainContentProps) => {

    return (
          <div className="flex flex-col md:flex-row w-full">
            <div className="hidden md:block md:w-1/5 p-3 h-screen z-10  sticky top-14 left-0">
              <div className="h-full overflow-hidden group">
                <div
                  className={`h-full overflow-y-auto transition-all duration-300 ${
                    isScrolling
                      ? "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600"
                      : "overflow-hidden"
                  }`}
                  onScroll={handleMouseEnterCategoryPanel}
                >
                  <PanelMenu
                    model={menuItems as MenuItem[]}
                    className="w-full"
                    expandIcon={<span></span>}
                    collapseIcon={<span></span>}
                  />
                </div>
              </div>
            </div>
            {/* right  panel(foods) */}
            <div className="w-full md:w-4/5 p-3 h-full overflow-y-auto">
              {deals.map((category: ICategoryV2, catIndex: number) => (
                <div
                  key={catIndex}
                  className="mb-4"
                  id={toSlug(category.title)}
                >
                  <h2 className="mb-2 font-inter text-gray-900 font-bold text-2xl sm:text-xl leading-snug tracking-tight dark:text-gray-200">
                    {category.title}
                  </h2>

                  {category.subCategories.map(
                    (subCategory: ISubCategoryV2, subCatIndex: number) => (
                      <div
                        key={subCatIndex}
                        className="mb-4"
                        id={toSlug(subCategory.title)}
                      >
                        {subCategory.title !== "Uncategorized" && (
                          <h3 className="mb-2 font-inter text-gray-600 font-semibold text-lg sm:text-base leading-snug tracking-normal dark:text-gray-400">
                            {subCategory.title}
                          </h3>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start ">
                          {subCategory.foods.map((meal: IFood, mealIndex) => (
                            <div
                              key={mealIndex}
                              className={`flex items-center gap-4 rounded-lg border shadow-sm p-3 relative transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer
                       ${meal.isOutOfStock ? "bg-gray-200 dark:bg-gray-950 border-gray-400 dark:border-gray-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"}
                     `}
                              onClick={() => handleOpenFoodModal(meal)}
                            >
                              {/* Text Content */}
                              <div className="flex-grow text-left md:text-left space-y-2 ">
                                <div className="flex flex-col lg:flex-row justify-between flex-wrap">
                                  <h3 className="text-gray-900 text-lg font-semibold font-inter dark:text-gray-200">
                                    {meal.title}
                                  </h3>
                                  {meal.isOutOfStock && (
                                    <span className="text-red-500">
                                      {t("out_of_stock_label")}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-gray-500 text-sm dark:text-gray-400 line-clamp-2 hover:line-clamp-none ${direction === "rtl" ? "text-right" : "text-left"}`}
                                >
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
                                  width={100}
                                  height={100}
                                />
                              </div>

                              {/* Add Button */}
                              <div
                                className={`${direction === "rtl" ? "left-2" : "right-2"} absolute top-2`}
                              >
                                <button
                                  className={`rounded-full shadow-md w-6 h-6 flex items-center justify-center ${
                                    meal.isOutOfStock
                                      ? "bg-gray-400 dark:bg-gray-600"
                                      : "bg-secondary-color dark:bg-sky-600"
                                  }`}
                                  onClick={() => handleOpenFoodModal(meal)}
                                  type="button"
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    color="white"
                                  />
                                </button>
                              </div>

                              {/* create a modal that will be show that this restaurant is closed do want to see menu or want to close if click on the see menu then will move to the next page other wise modal will be closed */}
                              <CustomDialog
                                className="max-w-[300px] dark:bg-gray-900 dark:text-gray-300 "
                                visible={
                                  isModalOpen.value &&
                                  isModalOpen.id === meal?._id?.toString()
                                }
                                onHide={() =>
                                  handleUpdateIsModalOpen(
                                    false,
                                    meal?._id?.toString()
                                  )
                                }
                              >
                                <div className="text-center pb-10 pt-10">
                                  <p className="text-lg font-bold pb-3 text-gray-900 dark:text-gray-200">
                                    {t("restaurant_is_closed")}
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-400">
                                    {t("cannot_order_food_item_now")}
                                    <br></br>
                                    {t("please_try_again_later")}
                                  </p>
                                </div>
                              </CustomDialog>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
    );
};

export default StoreMainContent;
