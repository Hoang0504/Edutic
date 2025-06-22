import classNames from "classnames/bind";
import styles from "./FullPageLoading.module.scss";

const cx = classNames.bind(styles);

function FullPageLoading() {
  return (
    <div className="flex justify-center items-center h-60 text-gray-600">
      <div className={`mr-2 ${cx("loader")}`}></div>
      <span>Đang tải dữ liệu...</span>
    </div>
  );
}

export default FullPageLoading;
