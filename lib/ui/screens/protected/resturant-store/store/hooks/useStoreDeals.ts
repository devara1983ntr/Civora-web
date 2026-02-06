import { useMemo } from "react";
import { ICategory, IFood, ISubCategory } from "@/lib/utils/interfaces";

export const useStoreDeals = (
    allDeals: ICategory[] = [],
    filter: string,
    subcategoriesData: any,
    popularSubCategoriesList: any,
    t: any
) => {
    return useMemo(() => {
        const subCategories = subcategoriesData?.subCategories;
        if (!allDeals || !subCategories) return [];

        const allDealCategories =
          allDeals
            .map((category: ICategory, index: number) => {
              const subCats = subCategories.filter(
                (sc: ISubCategory) => sc.parentCategoryId === category._id
              );

              const groupedFoods: Record<string, IFood[]> = {};

              category.foods.forEach((food) => {
                const subCatId = food.subCategory || "uncategorized";
                if (!groupedFoods[subCatId]) groupedFoods[subCatId] = [];
                groupedFoods[subCatId].push({
                  ...food,
                  title: food.title,
                });
              });

              const subCategoryGroups = subCats
                .map((subCat: ISubCategory) => {
                  const foods = groupedFoods[subCat._id] || [];

                  return foods.length > 0
                    ? {
                        _id: subCat._id,
                        title: subCat.title,
                        foods,
                      }
                    : null;
                })
                .filter(Boolean) as {
                _id: string;
                title: string;
                foods: IFood[];
              }[];

              if (groupedFoods["uncategorized"]?.length > 0) {
                subCategoryGroups.push({
                  _id: "uncategorized",
                  title: t("StoresPage.Uncategorized"),
                  foods: groupedFoods["uncategorized"],
                });
              }

              if (subCategoryGroups.length === 0) return null;

              return {
                ...category,
                index,
                subCategories: subCategoryGroups,
              };
            })
            .filter(Boolean) || [];

        // 🔥 Add "Popular Items" category
        const popularItems = popularSubCategoriesList?.popularItems || [];

        if (popularItems.length > 0) {
          const popularFoods: IFood[] = [];

          for (const popular of popularItems) {
            for (const category of allDealCategories) {
              for (const subCat of category.subCategories) {
                const match = subCat.foods.find((food: IFood) => food._id === popular.id);
                if (match && !popularFoods.find((f) => f._id === match._id)) {
                  popularFoods.push(match);
                }
              }
            }
          }

          if (popularFoods.length > 0) {
            allDealCategories.unshift({
              _id: "popular-items",
              title: t("StoresPage.popitems"),
              foods: [],
              subCategories: [
                {
                  _id: "popular-items-sub",
                  foods: popularFoods,
                },
              ],
            });
          }
        }

        return allDealCategories;
      }, [
        allDeals,
        filter,
        subcategoriesData?.subCategories,
        popularSubCategoriesList?.popularItems,
        t
      ]);
};
