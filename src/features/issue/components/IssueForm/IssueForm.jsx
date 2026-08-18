import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import styles from "./IssueForm.module.css";

import BackButton from "../BackButton/BackButton";

import IssueBasicInfo from "./IssueBasicInfo";
import IssueDetailSection from "./IssueDetailSection";
import IssueScheduleSection from "./IssueScheduleSection";
import IssueFileSection from "./IssueFileSection";

import {
  createIssue,
  getIssue,
  updateIssue,
} from "../../../../api/issueApi";

import {
  getCycles,
} from "../../../../api/cycleApi";

import {
  getWorkspaceMembers,
} from "../../../../api/memberApi";


const DEFAULT_CONDITIONS = [
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
];


const DEFAULT_FILES = [
  {
    name:
      "Global_Launch_Copy_x4.xlsx",
    size:
      "23.4 KB",
    url: null,
    isMock: true,
  },
  {
    name:
      "Global_Launch_Copy_x4.xlsx",
    size:
      "23.4 KB",
    url: null,
    isMock: true,
  },
  {
    name:
      "Global_Launch_Copy_x4.xlsx",
    size:
      "23.4 KB",
    url: null,
    isMock: true,
  },
  {
    name:
      "Global_Launch_Copy_x4.xlsx",
    size:
      "23.4 KB",
    url: null,
    isMock: true,
  },
];


const PRIORITY_MAP = {
  low:
    "LOW",

  normal:
    "NORMAL",

  high:
    "HIGH",

  urgent:
    "URGENT",
};


const PRIORITY_REVERSE_MAP = {
  LOW:
    "low",

  NORMAL:
    "normal",

  HIGH:
    "high",

  URGENT:
    "urgent",
};


const formatFileSize = (
  size
) => {
  if (
    size === null ||
    size === undefined
  ) {
    return "-";
  }


  if (size < 1024) {
    return `${size} B`;
  }


  if (
    size <
    1024 * 1024
  ) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }


  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};


function IssueForm({
  mode = "create",
}) {
  const navigate =
    useNavigate();


  const {
    issueId,
  } = useParams();


  const isEdit =
    mode === "edit";


  /* =========================
      기본 정보
  ========================= */

  const [
    title,
    setTitle,
  ] = useState(
    "앱 출시 전 프로모션 랜딩페이지 최종 연동 및 콘텐츠 검수"
  );


  const [
    priority,
    setPriority,
  ] = useState(
    isEdit
      ? "normal"
      : ""
  );


  const [
    description,
    setDescription,
  ] = useState(
    `글로벌 커머스 앱 리뉴얼 출시와 함께 공개될 프로모션 랜딩페이지의 최종 연동 및 콘텐츠 검수가 필요합니다.

현재 디자인팀에서 랜딩페이지 최종 시안을 전달했으며, 프론트엔드 구현도 대부분 완료된 상태입니다.
다만 마케팅팀에서 전달한 국가별 캠페인 카피와 실제 구현된 문구 일부가 일치하지 않고,
CTA 버튼 클릭 시 앱 설치 페이지로 연결되는 딥링크도 일부 환경에서 정상적으로 동작하지 않는 문제가 확인되었습니다.

출시 일정에 맞추기 위해 한국·영국 버전의 캠페인 문구를 최종 확정하고, 랜딩페이지에 반영된 텍스트 및 이미지 에셋을 검수해야 합니다. 또한 모바일 환경에서 CTA 버튼과 앱스토어 연결이 정상적으로 작동하는지 개발팀과 함께 확인해주세요.

수정 사항이 모두 반영되면 마케팅팀의 최종 승인을 받은 뒤 프로덕션 환경에 배포합니다.`
  );


  /* =========================
      완료 조건
  ========================= */

  const [
    conditions,
    setConditions,
  ] = useState(
    DEFAULT_CONDITIONS
  );


  /* =========================
      담당자
  ========================= */

  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    memberLoading,
    setMemberLoading,
  ] = useState(false);


  const [
    assigneeOpen,
    setAssigneeOpen,
  ] = useState(false);


  const [
    assigneeName,
    setAssigneeName,
  ] = useState("");


  const [
    assigneeId,
    setAssigneeId,
  ] = useState(null);


  /* =========================
      일정
  ========================= */

  const [
    dueDate,
    setDueDate,
  ] = useState(
    "2026-08-06"
  );


  /* =========================
      Cycle
  ========================= */

  const [
    cycles,
    setCycles,
  ] = useState([]);


  const [
    cycle,
    setCycle,
  ] = useState("");


  const [
    cycleId,
    setCycleId,
  ] = useState(null);


  const [
    cycleOpen,
    setCycleOpen,
  ] = useState(false);


  const [
    cycleLoading,
    setCycleLoading,
  ] = useState(false);


  /* =========================
      파일
  ========================= */

  const [
    files,
    setFiles,
  ] = useState(
    DEFAULT_FILES
  );


  /* ==================================================
     실제 워크스페이스 멤버 조회

     GET
     /api/v1/workspaces/{workspaceId}/members?status=ACTIVE
  ================================================== */

  useEffect(() => {
    const fetchMembers =
      async () => {
        const workspaceId =
          localStorage.getItem(
            "workspaceId"
          );


        if (!workspaceId) {
          console.warn(
            "workspaceId가 없습니다."
          );

          return;
        }


        try {
          setMemberLoading(
            true
          );


          const response =
            await getWorkspaceMembers(
              workspaceId,
              {
                status:
                  "ACTIVE",
              }
            );


          console.log(
            "워크스페이스 멤버 조회 성공:",
            response
          );


          const memberList =
            Array.isArray(
              response?.data
                ?.members
            )
              ? response.data.members
              : [];


          setMembers(
            memberList
          );
        } catch (error) {
          console.error(
            "워크스페이스 멤버 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          setMembers([]);
        } finally {
          setMemberLoading(
            false
          );
        }
      };


    fetchMembers();
  }, []);


  /* ==================================================
     실제 Cycle 조회

     GET
     /api/v1/projects/{projectId}/cycles
  ================================================== */

  useEffect(() => {
    const fetchCycles =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (!projectId) {
          console.warn(
            "projectId가 없습니다."
          );

          return;
        }


        try {
          setCycleLoading(
            true
          );


          const response =
            await getCycles(
              projectId
            );


          console.log(
            "이슈 생성용 사이클 조회 성공:",
            response
          );


          const cycleList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          setCycles(
            cycleList
          );
        } catch (error) {
          console.error(
            "이슈 생성용 사이클 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          setCycles([]);
        } finally {
          setCycleLoading(
            false
          );
        }
      };


    fetchCycles();
  }, []);


  /* ==================================================
     수정 화면 기존 이슈 조회
  ================================================== */

  useEffect(() => {
    if (
      !isEdit ||
      !issueId
    ) {
      return;
    }


    const fetchIssue =
      async () => {
        try {
          const response =
            await getIssue(
              issueId
            );


          console.log(
            "수정용 이슈 조회 성공:",
            response
          );


          const issueData =
            response.data;


          setTitle(
            issueData.title ||
              ""
          );


          setPriority(
            PRIORITY_REVERSE_MAP[
              issueData.priority
            ] || ""
          );


          setDescription(
            issueData.description ||
              ""
          );


          setCycle(
            issueData.cycleName ||
              ""
          );


          setCycleId(
            issueData.cycleId ??
              null
          );


          setAssigneeName(
            issueData.assignee
              ?.name ||
              ""
          );


          /*
            현재 상세 조회 응답 구조가
            assigneeMemberId를 제공하면 우선 사용.

            기존 응답 구조에서 memberId가 있다면
            그것도 대응.
          */

          setAssigneeId(
            issueData.assigneeMemberId ??
              issueData.assignee
                ?.memberId ??
              null
          );


          setDueDate(
            issueData.dueDate ||
              ""
          );


          setConditions(
            (
              issueData.checklist ||
              []
            ).map(
              (item) => ({
                itemId:
                  item.itemId,

                content:
                  item.content,

                isDone:
                  item.isDone,
              })
            )
          );


          setFiles(
            (
              issueData.attachments ||
              []
            ).map(
              (file) => ({
                id:
                  file.attachmentId,

                name:
                  file.fileName,

                size:
                  formatFileSize(
                    file.fileSize
                  ),

                url:
                  file.fileUrl,

                isMock:
                  false,
              })
            )
          );
        } catch (error) {
          console.error(
            "수정용 이슈 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );
        }
      };


    fetchIssue();
  }, [
    isEdit,
    issueId,
  ]);


  /* ==================================================
     담당자 선택
  ================================================== */

  const handleAssigneeSelect =
    (
      member
    ) => {
      /*
        워크스페이스 멤버 조회 API에서
        내려오는 실제 식별자 memberId 사용
      */

      setAssigneeName(
        member.name ||
          ""
      );


      setAssigneeId(
        member.memberId
      );


      setAssigneeOpen(
        false
      );


      console.log(
        "선택한 담당자:",
        member
      );
  };


  const handleAssigneeInputChange =
    (
      value
    ) => {
      setAssigneeName(
        value
      );


      /*
        사용자가 선택 후 이름을 직접 수정하면
        기존 ID와 이름이 불일치할 수 있으므로
        실제 assigneeId 초기화.
      */

      setAssigneeId(
        null
      );


      setAssigneeOpen(
        true
      );
    };


  /* ==================================================
     입력된 이름 기준 담당자 검색
  ================================================== */

  const filteredMembers =
    members.filter(
      (member) => {
        const keyword =
          assigneeName
            .trim()
            .toLowerCase();


        if (!keyword) {
          return true;
        }


        const name =
          (
            member.name ||
            ""
          ).toLowerCase();


        const companyName =
          (
            member.companyName ||
            ""
          ).toLowerCase();


        const teamName =
          (
            member.teamName ||
            ""
          ).toLowerCase();


        return (
          name.includes(
            keyword
          ) ||
          companyName.includes(
            keyword
          ) ||
          teamName.includes(
            keyword
          )
        );
      }
    );


  /* ==================================================
     완료 조건
  ================================================== */

  const handleAddCondition =
    () => {
      setConditions(
        (prev) => [
          ...prev,

          {
            itemId:
              null,

            content:
              "",

            isDone:
              false,
          },
        ]
      );
    };


  const handleConditionChange =
    (
      conditionIndex,
      value
    ) => {
      setConditions(
        (prev) =>
          prev.map(
            (
              condition,
              index
            ) =>
              index ===
              conditionIndex
                ? {
                    ...condition,

                    content:
                      value,
                  }
                : condition
          )
      );
    };


  const handleRemoveCondition =
    (
      removeIndex
    ) => {
      setConditions(
        (prev) =>
          prev.filter(
            (
              _,
              index
            ) =>
              index !==
              removeIndex
          )
      );
    };


  /* ==================================================
     실제 Cycle 선택
  ================================================== */

  const handleCycleSelect =
    (
      selectedCycle
    ) => {
      if (!selectedCycle) {
        setCycle("");
        setCycleId(null);
        setCycleOpen(false);

        return;
      }


      setCycle(
        selectedCycle.name
      );


      setCycleId(
        selectedCycle.cycleId
      );


      setCycleOpen(
        false
      );


      console.log(
        "선택한 사이클:",
        selectedCycle
      );
    };


  const getCycleOptions =
    () => {
      return cycles;
    };


  /* ==================================================
     생성 / 수정
  ================================================== */

  const handleSubmit =
    async () => {
      if (
        !title.trim()
      ) {
        console.warn(
          "제목을 입력해주세요."
        );

        return;
      }


      if (!priority) {
        console.warn(
          "우선순위를 선택해주세요."
        );

        return;
      }


      if (
        !description.trim()
      ) {
        console.warn(
          "설명을 입력해주세요."
        );

        return;
      }


      if (!cycleId) {
        console.warn(
          "사이클을 선택해주세요."
        );

        return;
      }


      if (!assigneeId) {
        console.warn(
          "담당자를 목록에서 선택해주세요."
        );

        return;
      }


      const attachments =
        files
          .map(
            (file) =>
              file.url
          )
          .filter(
            Boolean
          );


      /* =========================
          수정
      ========================= */

      if (isEdit) {
        const requestData = {
          cycleId,

          title:
            title.trim(),

          priority:
            PRIORITY_MAP[
              priority
            ],

          description:
            description.trim(),

          checklist:
            conditions
              .filter(
                (
                  condition
                ) =>
                  condition.content.trim()
              )
              .map(
                (
                  condition
                ) => ({
                  itemId:
                    condition.itemId,

                  content:
                    condition.content.trim(),

                  isDone:
                    condition.isDone,
                })
              ),

          assigneeId,

          dueDate,

          attachments,
        };


        console.log(
          "이슈 수정 요청 데이터:",
          requestData
        );


        try {
          const response =
            await updateIssue(
              issueId,
              requestData
            );


          console.log(
            "이슈 수정 성공:",
            response
          );


          navigate(
            `/issue/${issueId}`
          );
        } catch (error) {
          console.error(
            "이슈 수정 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );
        }


        return;
      }


      /* =========================
          생성
      ========================= */

      const requestData = {
        cycleId,

        title:
          title.trim(),

        priority:
          PRIORITY_MAP[
            priority
          ],

        description:
          description.trim(),

        checklist:
          conditions
            .map(
              (
                condition
              ) =>
                condition.content.trim()
            )
            .filter(
              Boolean
            ),

        /*
          실제 멤버 조회 응답의
          memberId가 들어감
        */

        assigneeId,

        dueDate,

        attachments,
      };


      console.log(
        "이슈 생성 요청 데이터:",
        requestData
      );


      try {
        const response =
          await createIssue(
            requestData
          );


        console.log(
          "이슈 생성 성공:",
          response
        );


        const createdIssueId =
          response?.data
            ?.issueId;


        if (
          createdIssueId
        ) {
          navigate(
            `/issue/${createdIssueId}`
          );
        }
      } catch (error) {
        console.error(
          "이슈 생성 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );
      }
    };


  return (
    <main
      className={`${styles.form} ${
        isEdit
          ? styles.editForm
          : ""
      }`}
    >
      {/* =========================
          상단
      ========================= */}

      <header
        className={`${styles.pageHeader} ${
          isEdit
            ? styles.editPageHeader
            : ""
        }`}
      >
        <div
          className={
            styles.backButtonWrap
          }
        >
          <BackButton />
        </div>


        {isEdit ? (
          <>
            <span
              className={
                styles.pageLabel
              }
            >
              이슈
            </span>


            <h1
              className={`${styles.pageTitle} ${styles.editPageTitle}`}
            >
              {title}
            </h1>


            <span
              className={
                styles.editCycleBadge
              }
            >
              {cycle ||
                "Cycle"}
            </span>
          </>
        ) : (
          <>
            <h1
              className={
                styles.pageTitle
              }
            >
              새 이슈 생성
            </h1>


            <p
              className={
                styles.pageDescription
              }
            >
              새로운 이슈를 생성하고
              팀과 함께 해결하세요.
            </p>
          </>
        )}
      </header>


      <IssueBasicInfo
        title={title}
        setTitle={setTitle}
        priority={priority}
        setPriority={setPriority}
      />


      <IssueDetailSection
        description={
          description
        }
        setDescription={
          setDescription
        }
        conditions={
          conditions
        }
        onAddCondition={
          handleAddCondition
        }
        onConditionChange={
          handleConditionChange
        }
        onRemoveCondition={
          handleRemoveCondition
        }
      />


      <IssueScheduleSection
        members={
          filteredMembers
        }
        memberLoading={
          memberLoading
        }
        assigneeName={
          assigneeName
        }
        assigneeId={
          assigneeId
        }
        assigneeOpen={
          assigneeOpen
        }
        setAssigneeOpen={
          setAssigneeOpen
        }
        onAssigneeInputChange={
          handleAssigneeInputChange
        }
        onAssigneeSelect={
          handleAssigneeSelect
        }
        dueDate={
          dueDate
        }
        setDueDate={
          setDueDate
        }
        cycle={
          cycle
        }
        cycleOpen={
          cycleOpen
        }
        setCycleOpen={
          setCycleOpen
        }
        cycleLoading={
          cycleLoading
        }
        onCycleSelect={
          handleCycleSelect
        }
        getCycleOptions={
          getCycleOptions
        }
      />


      <IssueFileSection
        files={
          files
        }
        setFiles={
          setFiles
        }
      />


      {/* =========================
          하단 버튼
      ========================= */}

      <div
        className={
          styles.actions
        }
      >
        <button
          type="button"
          className={
            styles.cancelButton
          }
          onClick={() =>
            navigate(-1)
          }
        >
          취소
        </button>


        <button
          type="button"
          className={`${styles.submitButton} ${
            isEdit
              ? styles.saveButton
              : ""
          }`}
          onClick={
            handleSubmit
          }
        >
          {isEdit
            ? "저장"
            : "이슈 생성"}
        </button>
      </div>
    </main>
  );
}


export default IssueForm;