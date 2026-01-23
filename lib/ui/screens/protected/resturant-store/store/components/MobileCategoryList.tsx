import { motion } from "framer-motion";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import { ICategoryDetailsResponse } from "@/lib/utils/interfaces";
import { toSlug } from "@/lib/utils/methods";

interface MobileCategoryListProps {
    menuItems: ICategoryDetailsResponse[];
    selectedCategory: string;
    handleScroll: (id: string, isParent: boolean, offset: number) => void;
    subCategoriesForCategories: ICategoryDetailsResponse[];
    selectedSubCategory: string;
}

const MobileCategoryList = ({
    menuItems,
    selectedCategory,
    handleScroll,
    subCategoriesForCategories,
    selectedSubCategory
}: MobileCategoryListProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:top-[90px] top-[103px]"
        style={{
          position: "sticky",

          zIndex: 50,
          backgroundColor: "white",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <PaddingContainer>
          <div className="p-3  w-full flex flex-col md:hidden gap-2 items-center justify-between">
            {/* Categories */}
            <div
              className="w-full overflow-x-auto overflow-y-hidden flex items-center
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <ul className="flex space-x-4 items-center w-max flex-nowrap">
                {menuItems?.map(
                  (category: ICategoryDetailsResponse, index: number) => {
                    const _slug = toSlug(category.label);

                    return (
                      <li key={index} className="shrink-0">
                        <button
                          className={`bg-${
                            selectedCategory === _slug
                              ? "secondary-color"
                              : "gray-100"
                          } text-${
                            selectedCategory === _slug
                              ? "primary-color"
                              : "gray-600"
                          } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                          onClick={() => handleScroll(_slug, true, 100)}
                        >
                          {category.label}
                        </button>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            {/* Sub-Categories */}
            {subCategoriesForCategories.length > 0 && (
              <div
                className="w-full overflow-x-auto overflow-y-hidden flex items-center
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <ul className="flex space-x-4 items-center w-max flex-nowrap">
                  {subCategoriesForCategories?.map(
                    (sub_category: ICategoryDetailsResponse, index: number) => {
                      const _slug = toSlug(sub_category.label);

                      return (
                        <li key={index} className="shrink-0">
                          <button
                            className={`bg-${
                              selectedSubCategory === _slug
                                ? "secondary-color"
                                : "gray-100"
                            } text-${
                              selectedSubCategory === _slug
                                ? "primary-color"
                                : "gray-600"
                            } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                            onClick={() => handleScroll(_slug, false, 170)}
                          >
                            {sub_category.label}
                          </button>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )}
          </div>
        </PaddingContainer>
      </motion.div>
    );
};

export default MobileCategoryList;
