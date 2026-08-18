import { useNavigate } from "react-router-dom";

import styles from "./BackButton.module.css";

import leftArrowIcon from "../../../../assets/icons/leftArrowIcon.svg";


function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={() => navigate(-1)}
    >
      <img
        src={leftArrowIcon}
        alt=""
        className={styles.backIcon}
      />

      <span>
        뒤로
      </span>
    </button>
  );
}


export default BackButton;