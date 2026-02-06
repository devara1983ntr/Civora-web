import { Dialog } from "primereact/dialog";
import CustomButton from "@/lib/ui/useable-components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

interface LogoutConfirmationProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onLogout: () => void;
}

const LogoutConfirmation = ({ visible, setVisible, onLogout }: LogoutConfirmationProps) => {
    const t = useTranslations();

    return (
      <Dialog
        contentClassName="dark:bg-gray-800"
        maskClassName="bg-black/80"
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-[95%] sm:w-[80%] md:w-[60%] lg:w-1/3 rounded-xl px-8 bg-white dark:bg-gray-800 dark:text-white"
        header={
          <div className="w-full flex justify-center">
            <span className="font-inter font-bold text-lg text-gray-800  dark:text-white ">
              {t("Are_you_sure_you_want_to_log_out?")}
            </span>
          </div>
        }
        headerClassName="!justify-center dark:bg-gray-800"
        closable={true}
        dismissableMask
      >
        <div className="flex flex-col items-center text-center space-y-4 dark:bg-gray-800 dark:text-white">
          {/* Action buttons */}
          <div className="flex justify-center gap-3 w-full ">
            <CustomButton
              label={t("cancel_address")}
              className="w-1/2 h-fit bg-transparent dark:text-white text-gray-900 py-2 border border-gray-400 rounded-full text-sm font-medium"
              onClick={() => setVisible(false)}
            />

            <button
              className="w-1/2 h-fit flex items-center justify-center gap-2 bg-primary-color text-white py-2 rounded-full text-sm font-medium"
              onClick={onLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              {t("logoutButton")}
            </button>
          </div>
        </div>
      </Dialog>
    );
};

export default LogoutConfirmation;
