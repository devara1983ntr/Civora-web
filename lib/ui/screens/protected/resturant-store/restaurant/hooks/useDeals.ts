import { useMemo } from "react";
import { ICategory, IFood } from "@/lib/utils/interfaces";

export const useDeals = (
    allDeals: ICategory[] = [],
    filter: string,
    popularDealsIds: string[] = []
) => {
    return useMemo(() => {
        const filteredDeals =
          (allDeals || [])
            .filter((c: ICategory) => {
              if (filter.trim() === "") return true;

              const categoryMatches = c.title
                .toLowerCase()
                .includes(filter.toLowerCase());
              const foodsMatch = c.foods.some((food: IFood) =>
                food.title.toLowerCase().includes(filter.toLowerCase())
              );

              return categoryMatches || foodsMatch;
            })
            .map((c: ICategory, index: number) => ({
              ...c,
              index,
              foods: c.foods.filter((food) => {
                // If filter is empty, include all foods
                if (filter.trim() === "") return true;

                // Include food if title or description matches filter
                return (
                  food.title.toLowerCase().includes(filter.toLowerCase()) ||
                  (food.description &&
                    food.description.toLowerCase().includes(filter.toLowerCase()))
                );
              }),
            }))
            .filter((c: ICategory) => c.foods.length > 0) || [];

        // Flatten all foods from all categories
        const allFoods = filteredDeals.flatMap((cat: ICategory) => cat.foods);

        // Filter foods that are in popularDealsIds
        const popularFoods = allFoods.filter((food: IFood) =>
          popularDealsIds?.includes(food._id)
        );

        // Create a "Popular Deals" category if there are matching foods
        const popularDealsCategory: ICategory | null = popularFoods.length
          ? {
              _id: "popular-deals",
              title: "Popular Deals",
              foods: popularFoods,
              // index can be used for custom ordering if needed
            }
          : null;

        // Add the new category at the top
        return popularDealsCategory
          ? [popularDealsCategory, ...filteredDeals]
          : filteredDeals;
      }, [allDeals, filter, popularDealsIds]);
};
