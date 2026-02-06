import { Skeleton } from "primereact/skeleton";
import Image from "next/image";
import Loader from "@/app/(localized)/mapview/[slug]/components/Loader";
import { HeartSvg } from "@/lib/utils/assets/svg";

interface RestaurantBannerProps {
    loading: boolean;
    restaurantInfo: any;
    addFavoriteLoading: boolean;
    handleFavoriteClick: () => void;
    direction: string;
    isLiked: boolean;
}

const RestaurantBanner = ({
    loading,
    restaurantInfo,
    addFavoriteLoading,
    handleFavoriteClick,
    direction,
    isLiked
}: RestaurantBannerProps) => {
    return (
      <div className="relative">
        {loading ? (
          <Skeleton width="100%" height="18rem" borderRadius="0" />
        ) : (
          <div className="relative">
            <Image
              src={restaurantInfo.image}
              alt="McDonald's banner with a burger and fries"
              width={1200}
              height={300}
              className="w-full h-72 object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}

        {!loading && (
          <div
            className={`${direction === "rtl" ? "right-0 md:right-20" : "left-0 md:left-20"} absolute bottom-0  p-4`}
          >
            <div className="flex flex-col items-start">
              <Image
                src={restaurantInfo.logo}
                alt={`${restaurantInfo.name} logo`}
                width={50}
                height={50}
                className="w-12 h-12 mb-2 object-cover"
              />

              <div className="text-white space-y-2">
                <h1 className="font-inter font-extrabold text-[32px] leading-[100%] sm:text-[40px] md:text-[48px]">
                  {restaurantInfo.name}
                </h1>
                <p className="font-inter font-medium text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px] md:text-[24px] md:leading-[32px]">
                  {restaurantInfo.address}
                </p>
              </div>
            </div>
          </div>
        )}
        <button
          disabled={addFavoriteLoading}
          onClick={handleFavoriteClick}
          className={`absolute top-4 ${direction === "rtl" ? "left-4 md:left-4" : "right-4 md:right-4"} md:bottom-4 md:top-auto rounded-full bg-white dark:bg-gray-700 h-8 w-8 flex justify-center items-center transform transition-transform duration-300 hover:scale-110 active:scale-95`}
        >
          {addFavoriteLoading ? (
            <Loader style={{ width: "1.5rem", height: "1.5rem" }} />
          ) : (
            <HeartSvg filled={isLiked} />
          )}
        </button>
      </div>
    );
};

export default RestaurantBanner;
