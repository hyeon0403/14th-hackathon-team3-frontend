import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MainLayout from "../../../../components/MainLayout/MainLayout";
import IssueBoard from "../../components/IssueBoard/IssueBoard";

import styles from "./IssueListPage.module.css";

import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";

import {
  getCycles,
} from "../../../../api/cycleApi";

import {
  getIssues,
} from "../../../../api/issueApi";


function IssueListPage() {
  const [
    dateSort,
    setDateSort,
  ] = useState("최신순");

  const [
    prioritySort,
    setPrioritySort,
  ] = useState("높은순");

  const [
    activeSortField,
    setActiveSortField,
  ] = useState("date");

  const [
    dateOpen,
    setDateOpen,
  ] = useState(false);

  const [
    priorityOpen,
    setPriorityOpen,
  ] = useState(false);

  const [
    keyword,
    setKeyword,
  ] = useState("");

  const [
    cycle,
    setCycle,
  ] = useState(null);

  const [
    issues,
    setIssues,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const dateOptions =
    useMemo(() => {
      const options = [
        "최신순",
        "등록순",
      ];

      return [
        dateSort,
        ...options.filter(
          (option) =>
            option !==
            dateSort
        ),
      ];
    }, [
      dateSort,
    ]);


  const priorityOptions =
    useMemo(() => {
      const options = [
        "높은순",
        "낮은순",
      ];

      return [
        prioritySort,
        ...options.filter(
          (option) =>
            option !==
            prioritySort
        ),
      ];
    }, [
      prioritySort,
    ]);


  /* =========================
     현재 프로젝트의
     실제 사이클 찾기
  ========================= */

  useEffect(() => {
    const fetchCycle =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (!projectId) {
          setErrorMessage(
            "선택된 프로젝트가 없습니다."
          );

          setLoading(false);

          return;
        }


        try {
          const response =
            await getCycles(
              projectId
            );


          const cycles =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          if (
            cycles.length === 0
          ) {
            setErrorMessage(
              "등록된 사이클이 없습니다."
            );

            setLoading(false);

            return;
          }


          /*
            진행 중 사이클 우선
            없으면 첫 번째 사이클
          */

          const currentCycle =
            cycles.find(
              (item) =>
                item.status ===
                "IN_PROGRESS"
            ) ||
            cycles[0];


          setCycle(
            currentCycle
          );
        } catch (error) {
          console.error(
            "사이클 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          setErrorMessage(
            error.response?.data
              ?.message ||
              "사이클을 불러오지 못했습니다."
          );

          setLoading(false);
        }
      };


    fetchCycle();
  }, []);


  /* =========================
     이슈 리스트 조회
  ========================= */

  useEffect(() => {
    if (!cycle?.cycleId) {
      return;
    }


    const fetchIssues =
      async () => {
        try {
          setLoading(true);

          setErrorMessage("");


          let sort =
            "createdAt,desc";


          if (
            activeSortField ===
            "date"
          ) {
            sort =
              dateSort ===
              "최신순"
                ? "createdAt,desc"
                : "createdAt,asc";
          }


          if (
            activeSortField ===
            "priority"
          ) {
            sort =
              prioritySort ===
              "높은순"
                ? "priority,desc"
                : "priority,asc";
          }


          const response =
            await getIssues(
              cycle.cycleId,
              {
                keyword:
                  keyword.trim() ||
                  undefined,

                sort,

                page: 0,

                size: 100,
              }
            );


          console.log(
            "이슈 리스트 조회 성공:",
            response
          );


          const issueList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          setIssues(
            issueList
          );
        } catch (error) {
          console.error(
            "이슈 리스트 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          if (
            responseData?.code ===
            "404CYCLE"
          ) {
            setErrorMessage(
              "존재하지 않는 사이클입니다."
            );
          } else {
            setErrorMessage(
              responseData?.message ||
                "이슈 목록을 불러오지 못했습니다."
            );
          }


          setIssues([]);
        } finally {
          setLoading(false);
        }
      };


    fetchIssues();
  }, [
    cycle?.cycleId,
    keyword,
    dateSort,
    prioritySort,
    activeSortField,
  ]);


  /* =========================
     등록일 정렬
  ========================= */

  const handleDateSelect = (
    option
  ) => {
    setDateSort(
      option
    );

    setActiveSortField(
      "date"
    );

    setDateOpen(
      false
    );
  };


  /* =========================
     우선순위 정렬
  ========================= */

  const handlePrioritySelect = (
    option
  ) => {
    setPrioritySort(
      option
    );

    setActiveSortField(
      "priority"
    );

    setPriorityOpen(
      false
    );
  };


  return (
    <MainLayout>
      <main
        className={
          styles.page
        }
      >
        {/* =========================
            상단 제목
        ========================= */}

        <div
          className={
            styles.header
          }
        >
          <div
            className={
              styles.titleRow
            }
          >
            <h1>
              이슈
            </h1>


            <span
              className={
                styles.cycleBadge
              }
            >
              {cycle?.name ||
                "-"}
            </span>
          </div>


          <p>
            사이클 내 모든 이슈를 확인하고 관리하세요.
          </p>
        </div>


        {/* =========================
            정렬 / 검색
        ========================= */}

        <div
          className={
            styles.toolbar
          }
        >
          <div
            className={
              styles.sort
            }
          >
            {/* 등록일 정렬 */}

            <div
              className={
                styles.sortGroup
              }
            >
              <button
                type="button"
                className={
                  styles.sortButton
                }
                onClick={() => {
                  setDateOpen(
                    (prev) =>
                      !prev
                  );

                  setPriorityOpen(
                    false
                  );
                }}
              >
                <span>
                  등록일{" "}
                  {dateSort}
                </span>

                <img
                  src={
                    dropdownIcon
                  }
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    dateOpen
                      ? styles.dropdownOpen
                      : ""
                  }`}
                />
              </button>


              {dateOpen && (
                <div
                  className={
                    styles.dropdownMenu
                  }
                >
                  {dateOptions.map(
                    (option) => (
                      <button
                        key={
                          option
                        }
                        type="button"
                        className={`${styles.dropdownOption} ${
                          option ===
                          dateSort
                            ? styles.selectedOption
                            : ""
                        }`}
                        onClick={() =>
                          handleDateSelect(
                            option
                          )
                        }
                      >
                        {
                          option
                        }
                      </button>
                    )
                  )}
                </div>
              )}
            </div>


            {/* 우선순위 정렬 */}

            <div
              className={
                styles.sortGroup
              }
            >
              <button
                type="button"
                className={
                  styles.sortButton
                }
                onClick={() => {
                  setPriorityOpen(
                    (prev) =>
                      !prev
                  );

                  setDateOpen(
                    false
                  );
                }}
              >
                <span>
                  우선순위{" "}
                  {prioritySort}
                </span>

                <img
                  src={
                    dropdownIcon
                  }
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    priorityOpen
                      ? styles.dropdownOpen
                      : ""
                  }`}
                />
              </button>


              {priorityOpen && (
                <div
                  className={
                    styles.dropdownMenu
                  }
                >
                  {priorityOptions.map(
                    (option) => (
                      <button
                        key={
                          option
                        }
                        type="button"
                        className={`${styles.dropdownOption} ${
                          option ===
                          prioritySort
                            ? styles.selectedOption
                            : ""
                        }`}
                        onClick={() =>
                          handlePrioritySelect(
                            option
                          )
                        }
                      >
                        {
                          option
                        }
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>


          {/* 검색 */}

          <div
            className={
              styles.rightToolbar
            }
          >
            <div
              className={
                styles.searchBox
              }
            >
              <img
                src={
                  searchIcon
                }
                alt=""
                className={
                  styles.searchIcon
                }
              />

              <input
                type="text"
                aria-label="이슈 검색"
                value={
                  keyword
                }
                onChange={(
                  event
                ) =>
                  setKeyword(
                    event.target
                      .value
                  )
                }
              />
            </div>


            <button
              type="button"
              className={
                styles.createButton
              }
            >
              프로젝트 생성
            </button>
          </div>
        </div>


        {/* =========================
            상태
        ========================= */}

        {loading && (
          <p>
            이슈를 불러오는 중입니다.
          </p>
        )}


        {!loading &&
          errorMessage && (
          <p>
            {errorMessage}
          </p>
        )}


        {/* =========================
            이슈 보드
        ========================= */}

        {!loading &&
          !errorMessage && (
          <IssueBoard
            issues={
              issues
            }
          />
        )}
      </main>
    </MainLayout>
  );
}


export default IssueListPage;