import styles from "./IssueForm.module.css";


function IssueBasicInfo({
  title,
  setTitle,
  priority,
  setPriority,
}) {
  return (
    <section
      className={`${styles.section} ${styles.basicSection}`}
    >
      <h2>
        이슈 기본 정보
      </h2>


      <label
        className={
          styles.fieldLabel
        }
      >
        이슈 제목

        <span
          className={
            styles.requiredDot
          }
        />
      </label>


      <input
        type="text"
        className={
          styles.titleInput
        }
        value={title}
        onChange={(event) =>
          setTitle(
            event.target.value
          )
        }
      />


      <span
        className={
          styles.priorityTitle
        }
      >
        우선순위
      </span>


      <div
        className={
          styles.priorityBox
        }
      >
        <label
          className={
            styles.priorityOption
          }
        >
          <input
            type="radio"
            name="priority"
            value="low"
            checked={
              priority === "low"
            }
            onChange={() =>
              setPriority("low")
            }
          />

          <span
            className={
              styles.customRadio
            }
          />

          <span>
            낮음
          </span>
        </label>


        <label
          className={
            styles.priorityOption
          }
        >
          <input
            type="radio"
            name="priority"
            value="normal"
            checked={
              priority === "normal"
            }
            onChange={() =>
              setPriority("normal")
            }
          />

          <span
            className={
              styles.customRadio
            }
          />

          <span>
            보통
          </span>
        </label>


        <label
          className={
            styles.priorityOption
          }
        >
          <input
            type="radio"
            name="priority"
            value="high"
            checked={
              priority === "high"
            }
            onChange={() =>
              setPriority("high")
            }
          />

          <span
            className={
              styles.customRadio
            }
          />

          <span>
            높음
          </span>
        </label>


        <label
          className={`${styles.priorityOption} ${styles.urgentOption}`}
        >
          <input
            type="radio"
            name="priority"
            value="urgent"
            checked={
              priority === "urgent"
            }
            onChange={() =>
              setPriority("urgent")
            }
          />

          <span
            className={
              styles.customRadio
            }
          />

          <span>
            긴급
          </span>
        </label>
      </div>
    </section>
  );
}


export default IssueBasicInfo;