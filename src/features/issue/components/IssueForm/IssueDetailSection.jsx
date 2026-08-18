import styles from "./IssueForm.module.css";

import addIcon from "../../../../assets/icons/addIcon.svg";
import closeIcon from "../../../../assets/icons/closeIcon.svg";


function IssueDetailSection({
  description,
  setDescription,
  conditions,
  onAddCondition,
  onConditionChange,
  onRemoveCondition,
}) {
  return (
    <section
      className={`${styles.section} ${styles.detailSection}`}
    >
      <h2>
        상세 내용
      </h2>


      <label
        className={
          styles.fieldLabel
        }
      >
        설명

        <span
          className={
            styles.requiredDot
          }
        />
      </label>


      <textarea
        className={
          styles.descriptionInput
        }
        value={description}
        onChange={(event) =>
          setDescription(
            event.target.value
          )
        }
      />


      {/* =========================
          완료 조건
      ========================= */}

      <div
        className={
          styles.conditionHeader
        }
      >
        <div
          className={
            styles.conditionTitleWrap
          }
        >
          <span
            className={
              styles.conditionTitle
            }
          >
            완료 조건
          </span>

          <span
            className={
              styles.conditionCount
            }
          >
            {conditions.length}개
          </span>
        </div>


        <button
          type="button"
          className={
            styles.addConditionButton
          }
          onClick={
            onAddCondition
          }
        >
          <img
            src={addIcon}
            alt=""
            className={
              styles.addConditionIcon
            }
          />

          <span>
            항목 추가
          </span>
        </button>
      </div>


      <div
        className={
          styles.conditionList
        }
      >
        {conditions.map(
          (
            condition,
            index
          ) => (
            <div
              key={
                condition.itemId ??
                index
              }
              className={
                styles.conditionItem
              }
            >
              <input
                type="text"
                className={
                  styles.conditionInput
                }
                value={
                  condition.content
                }
                placeholder="완료 조건을 입력하세요."
                onChange={(event) =>
                  onConditionChange(
                    index,
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                className={
                  styles.removeConditionButton
                }
                aria-label="완료 조건 삭제"
                onClick={() =>
                  onRemoveCondition(
                    index
                  )
                }
              >
                <img
                  src={closeIcon}
                  alt=""
                />
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}


export default IssueDetailSection;