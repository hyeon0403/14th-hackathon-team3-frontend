import axiosInstance from "./axios";


/* =========================
   이슈 생성
========================= */

export const createIssue = async (data) => {
  const response = await axiosInstance.post(
    "/api/v1/issues",
    data
  );

  return response.data;
};


/* =========================
   이슈 리스트 조회
========================= */

export const getIssues = async (
  cycleId,
  {
    status,
    priority,
    assigneeId,
    keyword,
    sort = "createdAt,desc",
    page = 0,
    size = 20,
  } = {}
) => {
  const params = new URLSearchParams();


  /*
    status는 복수 지정 가능
  */

  if (Array.isArray(status)) {
    status.forEach((value) => {
      if (value) {
        params.append(
          "status",
          value
        );
      }
    });
  } else if (status) {
    params.append(
      "status",
      status
    );
  }


  if (priority) {
    params.append(
      "priority",
      priority
    );
  }


  if (
    assigneeId !== undefined &&
    assigneeId !== null &&
    assigneeId !== ""
  ) {
    params.append(
      "assigneeId",
      assigneeId
    );
  }


  if (keyword) {
    params.append(
      "keyword",
      keyword
    );
  }


  if (sort) {
    params.append(
      "sort",
      sort
    );
  }


  params.append(
    "page",
    page
  );

  params.append(
    "size",
    size
  );


  const response = await axiosInstance.get(
    `/api/v1/cycles/${cycleId}/issues`,
    {
      params,
    }
  );


  return response.data;
};


/* =========================
   이슈 상세 조회
========================= */

export const getIssue = async (issueId) => {
  const response = await axiosInstance.get(
    `/api/v1/issues/${issueId}`
  );

  return response.data;
};


/* =========================
   이슈 수정
========================= */

export const updateIssue = async (
  issueId,
  data
) => {
  const response = await axiosInstance.put(
    `/api/v1/issues/${issueId}`,
    data
  );

  return response.data;
};


/* =========================
   이슈 상태 변경
========================= */

export const updateIssueStatus = async (
  issueId,
  data
) => {
  const response = await axiosInstance.put(
    `/api/v1/issues/${issueId}/status`,
    data
  );

  return response.data;
};


/* =========================
   완료 조건 체크 변경
========================= */

export const updateChecklistItem = async (
  issueId,
  itemId,
  data
) => {
  const response = await axiosInstance.put(
    `/api/v1/issues/${issueId}/checklist/${itemId}`,
    data
  );

  return response.data;
};


/* =========================
   이슈 삭제
========================= */

export const deleteIssue = async (issueId) => {
  const response = await axiosInstance.delete(
    `/api/v1/issues/${issueId}`
  );

  return response.data;
};


/* =========================
   S3 파일 업로드
========================= */

export const uploadIssueFiles = async (files) => {
  const formData = new FormData();


  files.forEach((file) => {
    formData.append(
      "files",
      file
    );
  });


  const response = await axiosInstance.post(
    "/api/v1/issues/file",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );


  return response.data;
};


/* =========================
   첨부파일 다운로드
========================= */

export const downloadIssueFile = async (
  storedKey
) => {
  const response = await axiosInstance.get(
    `/api/v1/issues/files/${storedKey}`,
    {
      responseType:
        "blob",
    }
  );

  return response;
};