import {
  useMemo,
  useState,
} from "react";

import styles from "./IssueForm.module.css";

import calendarIcon from "../../../../assets/icons/calendarIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";


const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const WEEK_DAYS = [
  "SUN",
  "MON",
  "TUE",
  "WEN",
  "THU",
  "FRI",
  "SAT",
];


const formatDateValue = (
  year,
  month,
  day
) => {
  const formattedMonth =
    String(
      month + 1
    ).padStart(
      2,
      "0"
    );


  const formattedDay =
    String(
      day
    ).padStart(
      2,
      "0"
    );


  return `${year}-${formattedMonth}-${formattedDay}`;
};


function IssueScheduleSection({
  members,
  memberLoading,
  assigneeName,
  assigneeId,
  assigneeOpen,
  setAssigneeOpen,
  onAssigneeInputChange,
  onAssigneeSelect,

  dueDate,
  setDueDate,

  cycle,
  cycleOpen,
  setCycleOpen,
  cycleLoading,
  onCycleSelect,
  getCycleOptions,
}) {
  const initialDate =
    dueDate
      ? new Date(
          `${dueDate}T00:00:00`
        )
      : new Date();


  const [
    isCalendarOpen,
    setIsCalendarOpen,
  ] = useState(false);


  const [
    calendarYear,
    setCalendarYear,
  ] = useState(
    initialDate.getFullYear()
  );


  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState(
    initialDate.getMonth()
  );


  const getDisplayDate =
    () => {
      if (!dueDate) {
        return "";
      }


      const [
        year,
        month,
        day,
      ] = dueDate.split("-");


      return `~ ${day} / ${month} / ${year}`;
    };


  /* ==================================================
     달력 날짜
  ================================================== */

  const calendarDates =
    useMemo(() => {
      const firstDay =
        new Date(
          calendarYear,
          calendarMonth,
          1
        );


      const lastDay =
        new Date(
          calendarYear,
          calendarMonth + 1,
          0
        );


      const previousMonthLastDay =
        new Date(
          calendarYear,
          calendarMonth,
          0
        );


      const startWeekDay =
        firstDay.getDay();


      const currentMonthLastDate =
        lastDay.getDate();


      const previousMonthLastDate =
        previousMonthLastDay.getDate();


      const dates = [];


      /* 이전 달 */

      for (
        let index =
          startWeekDay - 1;
        index >= 0;
        index -= 1
      ) {
        const day =
          previousMonthLastDate -
          index;


        const previousDate =
          new Date(
            calendarYear,
            calendarMonth - 1,
            day
          );


        dates.push({
          year:
            previousDate.getFullYear(),

          month:
            previousDate.getMonth(),

          day,

          isCurrentMonth:
            false,
        });
      }


      /* 현재 달 */

      for (
        let day = 1;
        day <=
        currentMonthLastDate;
        day += 1
      ) {
        dates.push({
          year:
            calendarYear,

          month:
            calendarMonth,

          day,

          isCurrentMonth:
            true,
        });
      }


      /* 다음 달 */

      let nextDay = 1;


      while (
        dates.length < 42
      ) {
        const nextDate =
          new Date(
            calendarYear,
            calendarMonth + 1,
            nextDay
          );


        dates.push({
          year:
            nextDate.getFullYear(),

          month:
            nextDate.getMonth(),

          day:
            nextDay,

          isCurrentMonth:
            false,
        });


        nextDay += 1;
      }


      return dates;
    }, [
      calendarYear,
      calendarMonth,
    ]);


  /* ==================================================
     이전 달
  ================================================== */

  const handlePreviousMonth =
    () => {
      if (
        calendarMonth === 0
      ) {
        setCalendarYear(
          (prev) =>
            prev - 1
        );


        setCalendarMonth(
          11
        );


        return;
      }


      setCalendarMonth(
        (prev) =>
          prev - 1
      );
    };


  /* ==================================================
     다음 달
  ================================================== */

  const handleNextMonth =
    () => {
      if (
        calendarMonth === 11
      ) {
        setCalendarYear(
          (prev) =>
            prev + 1
        );


        setCalendarMonth(
          0
        );


        return;
      }


      setCalendarMonth(
        (prev) =>
          prev + 1
      );
    };


  /* ==================================================
     날짜 선택
  ================================================== */

  const handleDateSelect =
    (
      date
    ) => {
      const value =
        formatDateValue(
          date.year,
          date.month,
          date.day
        );


      setDueDate(
        value
      );


      setCalendarYear(
        date.year
      );


      setCalendarMonth(
        date.month
      );


      setIsCalendarOpen(
        false
      );
    };


  const isSelectedDate =
    (
      date
    ) => {
      if (!dueDate) {
        return false;
      }


      return (
        dueDate ===
        formatDateValue(
          date.year,
          date.month,
          date.day
        )
      );
    };


  const isHoliday =
    (
      date
    ) => {
      const value =
        formatDateValue(
          date.year,
          date.month,
          date.day
        );


      return (
        value ===
          "2026-08-15" ||
        value ===
          "2026-08-17"
      );
    };


  const cycleOptions =
    getCycleOptions();


  return (
    <section
      className={`${styles.section} ${styles.scheduleSection}`}
    >
      <h2>
        담당 및 일정
      </h2>


      <div
        className={
          styles.scheduleTop
        }
      >
        {/* ==================================================
            담당자
        ================================================== */}

        <div
          className={
            styles.managerField
          }
        >
          <label
            className={
              styles.fieldLabel
            }
          >
            담당자

            <span
              className={
                styles.requiredDot
              }
            />
          </label>


          <div
            className={
              styles.assigneeDropdown
            }
          >
            <input
              type="text"
              value={
                assigneeName
              }
              placeholder={
                memberLoading
                  ? "멤버 불러오는 중..."
                  : "담당자 선택"
              }
              onFocus={() =>
                setAssigneeOpen(
                  true
                )
              }
              onChange={(
                event
              ) =>
                onAssigneeInputChange(
                  event.target.value
                )
              }
              autoComplete="off"
            />


            {assigneeId && (
              <span
                className={
                  styles.assigneeSelectedMark
                }
              >
                ✓
              </span>
            )}


            {assigneeOpen &&
              !memberLoading && (
                <div
                  className={
                    styles.assigneeMenu
                  }
                >
                  {members.length ===
                  0 ? (
                    <div
                      className={
                        styles.assigneeEmpty
                      }
                    >
                      조회된 멤버가 없습니다.
                    </div>
                  ) : (
                    members.map(
                      (
                        member
                      ) => (
                        <button
                          key={
                            member.memberId
                          }
                          type="button"
                          className={
                            styles.assigneeOption
                          }
                          onClick={() =>
                            onAssigneeSelect(
                              member
                            )
                          }
                        >
                          <div
                            className={
                              styles.assigneeOptionText
                            }
                          >
                            <strong>
                              {
                                member.name
                              }
                            </strong>


                            <span>
                              {[
                                member.companyName,
                                member.teamName,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " · "
                                )}
                            </span>
                          </div>


                          <span
                            className={
                              styles.assigneeRole
                            }
                          >
                            {
                              member.role
                            }
                          </span>
                        </button>
                      )
                    )
                  )}
                </div>
              )}
          </div>
        </div>


        {/* ==================================================
            처리 일자
        ================================================== */}

        <div
          className={
            styles.dateColumn
          }
        >
          <label
            className={
              styles.fieldLabel
            }
          >
            처리 일자

            <span
              className={
                styles.requiredDot
              }
            />
          </label>


          <div
            className={
              styles.dateWrapper
            }
          >
            <div
              className={
                styles.dateField
              }
            >
              <span>
                {getDisplayDate()}
              </span>


              <button
                type="button"
                className={
                  styles.calendarButton
                }
                aria-label="처리 일자 선택"
                onClick={() =>
                  setIsCalendarOpen(
                    (prev) =>
                      !prev
                  )
                }
              >
                <img
                  src={
                    calendarIcon
                  }
                  alt=""
                />
              </button>
            </div>


            {/* ==================================================
                커스텀 달력
            ================================================== */}

            {isCalendarOpen && (
              <div
                className={
                  styles.calendarPopup
                }
              >
                <div
                  className={
                    styles.calendarHeader
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.calendarArrow
                    }
                    aria-label="이전 달"
                    onClick={
                      handlePreviousMonth
                    }
                  >
                    ‹
                  </button>


                  <strong
                    className={
                      styles.calendarMonthTitle
                    }
                  >
                    {
                      MONTH_NAMES[
                        calendarMonth
                      ]
                    }{" "}
                    {
                      calendarYear
                    }
                  </strong>


                  <button
                    type="button"
                    className={
                      styles.calendarArrow
                    }
                    aria-label="다음 달"
                    onClick={
                      handleNextMonth
                    }
                  >
                    ›
                  </button>
                </div>


                <div
                  className={
                    styles.calendarDivider
                  }
                />


                <div
                  className={
                    styles.weekHeader
                  }
                >
                  {WEEK_DAYS.map(
                    (
                      weekDay
                    ) => (
                      <span
                        key={
                          weekDay
                        }
                      >
                        {
                          weekDay
                        }
                      </span>
                    )
                  )}
                </div>


                <div
                  className={
                    styles.calendarGrid
                  }
                >
                  {calendarDates.map(
                    (
                      date,
                      index
                    ) => {
                      const selected =
                        isSelectedDate(
                          date
                        );


                      const holiday =
                        isHoliday(
                          date
                        );


                      return (
                        <button
                          key={`${date.year}-${date.month}-${date.day}-${index}`}
                          type="button"
                          className={`${styles.calendarDate} ${
                            !date.isCurrentMonth
                              ? styles.outsideDate
                              : ""
                          } ${
                            holiday
                              ? styles.holidayDate
                              : ""
                          } ${
                            selected
                              ? styles.selectedDate
                              : ""
                          }`}
                          onClick={() =>
                            handleDateSelect(
                              date
                            )
                          }
                        >
                          {
                            date.day
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ==================================================
          Cycle
      ================================================== */}

      <div
        className={
          styles.cycleField
        }
      >
        <label
          className={
            styles.fieldLabel
          }
        >
          Cycle

          <span
            className={
              styles.requiredDot
            }
          />
        </label>


        <div
          className={
            styles.cycleDropdown
          }
        >
          <button
            type="button"
            className={
              styles.cycleSelect
            }
            onClick={() =>
              setCycleOpen(
                (prev) =>
                  !prev
              )
            }
            disabled={
              cycleLoading
            }
          >
            <span
              className={
                cycle
                  ? styles.cycleSelectedText
                  : styles.cyclePlaceholder
              }
            >
              {cycleLoading
                ? "불러오는 중..."
                : cycle ||
                  "선택"}
            </span>


            <img
              src={
                dropdownIcon
              }
              alt=""
              className={`${styles.cycleDropdownIcon} ${
                cycleOpen
                  ? styles.cycleDropdownIconOpen
                  : ""
              }`}
            />
          </button>


          {cycleOpen && (
            <div
              className={
                styles.cycleMenu
              }
            >
              {cycleOptions.length ===
              0 ? (
                <button
                  type="button"
                  className={
                    styles.cycleOption
                  }
                  disabled
                >
                  등록된 사이클이 없습니다.
                </button>
              ) : (
                cycleOptions.map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item.cycleId
                      }
                      type="button"
                      className={
                        styles.cycleOption
                      }
                      onClick={() =>
                        onCycleSelect(
                          item
                        )
                      }
                    >
                      {
                        item.name
                      }
                    </button>
                  )
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


export default IssueScheduleSection;