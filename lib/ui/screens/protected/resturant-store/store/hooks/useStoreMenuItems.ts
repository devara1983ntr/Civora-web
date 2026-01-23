import { useMemo } from "react";
import { ICategoryDetailsResponse, ICategoryV2 } from "@/lib/utils/interfaces";
import { MenuItem } from "primereact/menuitem";

export const useStoreMenuItems = (
    categoriesSubCategoriesList: any,
    popularSubCategoriesList: any,
    deals: ICategoryV2[],
    t: any,
    itemRenderer: (item: MenuItem) => React.ReactNode,
    parentItemRenderer: (item: MenuItem) => React.ReactNode
) => {
    return useMemo(() => {
        const baseItems =
          categoriesSubCategoriesList?.fetchCategoryDetailsByStoreId?.map(
            (item: ICategoryDetailsResponse) => ({
              id: item.id,
              label: item.label,
              url: item.url,
              template: parentItemRenderer,
              items:
                item.items?.map((subItem) => ({
                  id: subItem.id,
                  label: subItem.label,
                  url: subItem.url,
                  template: itemRenderer,
                })) || [],
            })
          ) || [];

        const popularItems = popularSubCategoriesList?.popularItems || [];

        // If popularItems exist, map them to menu format by matching with 'deals'
        if (popularItems.length > 0 && deals.length > 0) {
          const matchedPopularFoods: {
            id: string;
            label: string;
            url?: string;
            template?: any;
          }[] = [];

          popularItems.forEach((popularItem: { id: string }) => {
            // Loop through all deals -> subCategories -> foods
            for (const dealCategory of deals) {
              for (const subCat of dealCategory.subCategories) {
                const matchedFood = subCat.foods.find(
                  (food) => food._id === popularItem.id
                );
                if (matchedFood) {
                  matchedPopularFoods.push({
                    id: matchedFood._id,
                    label: matchedFood.title,
                    template: itemRenderer,
                  });
                  break;
                }
              }
            }
          });

          if (matchedPopularFoods.length > 0) {
            baseItems.unshift({
              id: "popular-items",
              label: t("StoresPage.popitems"),
              title: t("StoresPage.popitems"),

              url: "#popular-items",
              template: parentItemRenderer,
              items: matchedPopularFoods,
            });
          }
        }

        return baseItems;
      }, [
        categoriesSubCategoriesList?.fetchCategoryDetailsByStoreId,
        popularSubCategoriesList?.popularItems,
        deals,
        itemRenderer,
        parentItemRenderer,
        t
      ]);
};
