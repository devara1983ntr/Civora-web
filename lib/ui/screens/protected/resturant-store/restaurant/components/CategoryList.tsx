import { motion } from "framer-motion";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import CustomIconTextField from "@/lib/ui/useable-components/input-icon-field";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { ICategory } from "@/lib/utils/interfaces";
import { toSlug } from "@/lib/utils/methods";

interface CategoryListProps {
    headerHeight: string;
    showAll: boolean;
    deals: ICategory[];
    visibleItems: number;
    selectedCategory: string;
    handleScroll: (id: string) => void;
    setShowAll: (show: boolean) => void;
    filter: string;
    loading: boolean;
    setFilter: (filter: string) => void;
}

const CategoryList = ({
    headerHeight,
    showAll,
    deals,
    visibleItems,
    selectedCategory,
    handleScroll,
    setShowAll,
    filter,
    loading,
    setFilter
}: CategoryListProps) => {
    const t = useTranslations();

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:top-[60px] top-[95px] sticky z-50 bg-white dark:bg-gray-900 shadow-[0_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_1px_rgba(255,255,255,0.05)]"
      >
        <PaddingContainer height={headerHeight}>
          <div className="p-3 h-full w-full flex flex-col md:flex-row gap-2 items-center justify-between">
            {/* Category List - Full Width on Small Screens, 80% on Larger Screens */}
            <div className="relative w-full md:w-[80%]">
              <div
                className="h-12 w-full overflow-x-auto overflow-y-hidden flex items-center
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <ul className="flex space-x-4 items-center w-max flex-nowrap">
                  {(showAll ? deals : deals.slice(0, visibleItems)).map(
                    (category: ICategory, index: number) => {
                      const _slug = toSlug(category.title);
                      return (
                        <li key={index} className="shrink-0">
                          <button
                            type="button"
                            className={`${
                              selectedCategory === _slug
                                ? "bg-primary-light text-primary-color dark:bg-[#2E3B23] dark:text-[#D2F29E]"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                            onClick={() => handleScroll(toSlug(category.title))}
                          >
                            {category.title}
                          </button>
                        </li>
                      );
                    }
                  )}

                  {!showAll && deals.length > visibleItems && (
                    <li className="shrink-0">
                      <button
                        type="button"
                        className="bg-blue-500 text-white dark:bg-blue-600 rounded-full px-4 py-2 font-medium text-[14px] cursor-pointer"
                        onClick={() => setShowAll(true)}
                      >
                        {t("more_button")}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Search Input - 20% Width on Large Screens, Full Width on Small Screens */}
            <div className="h-full w-full md:w-[20%]">
              {
                <CustomIconTextField
                  value={filter}
                  className="w-full md:h-10 h-9 rounded-full pl-10 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  iconProperties={{
                    icon: faSearch,
                    position: "left",
                    style: { marginTop: "-10px" },
                  }}
                  placeholder={t("search_for_food_items_placeholder")}
                  type="text"
                  name="search"
                  showLabel={false}
                  isLoading={loading}
                  onChange={(e: any) => setFilter(e.target.value)}
                />
              }
            </div>
          </div>
        </PaddingContainer>
      </motion.div>
    );
};

export default CategoryList;
