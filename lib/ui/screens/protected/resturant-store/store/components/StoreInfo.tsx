import { Skeleton } from "primereact/skeleton";
import { ClockSvg, RatingSvg, InfoSvg } from "@/lib/utils/assets/svg";
import ChatSvg from "@/lib/utils/assets/svg/chat";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import { useTranslations } from "next-intl";

interface StoreInfoProps {
    loading: boolean;
    headerData: any;
    handleSeeMoreInfo: () => void;
    handleSeeReviews: () => void;
}

const StoreInfo = ({
    loading,
    headerData,
    handleSeeMoreInfo,
    handleSeeReviews
}: StoreInfoProps) => {
    const t = useTranslations();

    return (
      <div className="bg-gray-50 dark:bg-gray-800 shadow-[0px_1px_3px_rgba(0,0,0,0.1)]  p-3 md:h-[80px] h-fit flex justify-between items-center">
        <PaddingContainer>
          <div className="p-3  h-full w-full flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="w-full md:w-[80%]">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Time */}
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
                  <ClockSvg className="dark:fill-gray-300" />
                  {loading ? (
                    <Skeleton width="2rem" height="1.5rem" />
                  ) : (
                    headerData.deliveryTime
                  )}
                  <span>mins</span>
                </span>

                {/* Rating */}
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
                  <RatingSvg className="dark:fill-gray-300" />
                  {loading ? (
                    <Skeleton width="2rem" height="1.5rem" />
                  ) : (
                    headerData.averageReview
                  )}
                </span>

                {/* Info Link */}
                <a
                  className="flex items-center gap-2 text-secondary-color dark:text-blue-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
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
                    t("StoresPage.SeeStoreinfo")
                  )}
                </a>
                {/* Review Link */}
                <a
                  className="flex items-center gap-2 text-secondary-color dark:text-blue-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSeeReviews();
                  }}
                >
                  <ChatSvg className="dark:fill-blue-400" />
                  {loading ? (
                    <Skeleton width="10rem" height="1.5rem" />
                  ) : (
                    t("StoresPage.storereviews")
                  )}
                </a>
              </div>
            </div>
          </div>
        </PaddingContainer>
      </div>
    );
};

export default StoreInfo;
