import { Skeleton } from "primereact/skeleton";
import { ClockSvg, RatingSvg, InfoSvg } from "@/lib/utils/assets/svg";
import ChatSvg from "@/lib/utils/assets/svg/chat";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import { useTranslations } from "next-intl";

interface RestaurantInfoProps {
    loading: boolean;
    headerData: any;
    handleSeeMoreInfo: () => void;
    handleSeeReviews: () => void;
}

const RestaurantInfo = ({
    loading,
    headerData,
    handleSeeMoreInfo,
    handleSeeReviews
}: RestaurantInfoProps) => {
    const t = useTranslations();

    return (
      <div className="bg-gray-50 dark:bg-gray-800 shadow-[0px_1px_3px_rgba(0,0,0,0.1)] p-3 h-[80px] flex justify-between items-center">
        <PaddingContainer>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Time */}
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
              <ClockSvg />
              {loading ? (
                <Skeleton width="1rem" height="1.5rem" />
              ) : (
                `${headerData.deliveryTime} mins`
              )}
            </span>

            {/* Rating */}
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300  font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
              <RatingSvg />
              {loading ? (
                <Skeleton width="1rem" height="1.5rem" />
              ) : (
                headerData.averageReview
              )}
            </span>

            {/* Info Link */}
            <a
              className="flex items-center gap-2 text-secondary-color dark:text-sky-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSeeMoreInfo();
              }}
            >
              <InfoSvg />
              {loading ? (
                <Skeleton width="10rem" height="1.5rem" />
              ) : (
                t("see_more_information")
              )}
            </a>

            {/* Review Link */}
            <a
              className="flex items-center gap-2 text-secondary-color dark:text-sky-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSeeReviews();
              }}
            >
              <ChatSvg />
              {loading ? (
                <Skeleton width="10rem" height="1.5rem" />
              ) : (
                t("see_reviews")
              )}
            </a>
          </div>
        </PaddingContainer>
      </div>
    );
};

export default RestaurantInfo;
