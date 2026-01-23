import React from 'react';
import { useTranslations } from "next-intl";
import { ClockSvg } from "@/lib/utils/assets/svg";
import {
  deleteSearchedKeywords,
  getSearchedKeywords,
} from "@/lib/utils/methods";
import MainSection from "@/lib/ui/useable-components/restaurant-main-section";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";
import { useSearchUI } from "@/lib/context/search/search.context";
import { IRestaurant } from "@/lib/utils/interfaces";

interface SearchResultsProps {
    filteredResults: IRestaurant[];
}

const SearchResults = ({ filteredResults }: SearchResultsProps) => {
    const t = useTranslations();
    const {
        filter,
        setFilter,
        setSearchedKeywords,
      } = useSearchUI();

    // filters search results
    let searchedKeywords = getSearchedKeywords();

    // Case 1: Input is empty
    if (filter.length < 1) {
      // Subcase: No search history
      if (searchedKeywords.length === 0) {
        return (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {t("start_typing_to_search_for_restaurants_or_stores")}
          </div>
        );
      }

      // Subcase: Display recent history
      return (
        <div className="p-3">
          <div className="flex flex-row justify-between">
            <span className="text-sm font-normal mb-2 text-gray-500 dark:text-gray-400">
              {t("you_recently_searched")}
            </span>
            <span
              className="text-sm font-normal mb-2 text-secondary-color hover:cursor-pointer dark:text-primary-color"
              onClick={() => {
                deleteSearchedKeywords();
                setSearchedKeywords([]);
              }}
            >
              {t("clear_history_btn")}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {searchedKeywords.map((keyword: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-1 p-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                onClick={() => setFilter(keyword)}
              >
                <ClockSvg width={18} height={18} color="gray" />
                <span className="text-base dark:text-white">{keyword}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Case 2: User searched something
    if (filteredResults.length > 0) {
      return (
        <MainSection
          title={`${t("restaurant_and_stores_title")}: ${filter}`}
          data={filteredResults.slice(0, 3)}
          loading={false}
          error={false}
          search={true}
        />
      );
    }

    // Case 3: No results found for the searched keyword
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
        <EmptySearch />
      </div>
    );
};

export default SearchResults;
