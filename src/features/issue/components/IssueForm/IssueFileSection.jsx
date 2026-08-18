import {
  useRef,
  useState,
} from "react";

import styles from "./IssueForm.module.css";

import {
  uploadIssueFiles,
  downloadIssueFile,
} from "../../../../api/issueApi";

import uploadIcon from "../../../../assets/icons/uploadIcon.svg";
import documentIcon2 from "../../../../assets/icons/documentIcon2.svg";
import closeIcon from "../../../../assets/icons/closeIcon.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";


const formatFileSize = (size) => {
  if (
    size === null ||
    size === undefined
  ) {
    return "-";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};


function IssueFileSection({
  files,
  setFiles,
}) {
  const fileInputRef =
    useRef(null);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);


  /* =========================
      파일 선택 창
  ========================= */

  const handleUploadBoxClick = () => {
    if (isUploading) {
      return;
    }

    fileInputRef.current?.click();
  };


  /* =========================
      실제 S3 업로드
  ========================= */

  const handleUploadFiles = async (
    selectedFiles
  ) => {
    const uploadFiles =
      Array.from(
        selectedFiles
      );

    if (
      uploadFiles.length === 0
    ) {
      return;
    }

    if (
      uploadFiles.length > 5
    ) {
      console.warn(
        "한 번에 최대 5개의 파일만 업로드할 수 있습니다."
      );

      return;
    }

    const realFiles =
      files.filter(
        (file) =>
          !file.isMock
      );

    if (
      realFiles.length +
        uploadFiles.length >
      5
    ) {
      console.warn(
        "첨부파일은 최대 5개까지 업로드할 수 있습니다."
      );

      return;
    }

    try {
      setIsUploading(true);

      const response =
        await uploadIssueFiles(
          uploadFiles
        );

      console.log(
        "S3 파일 업로드 성공:",
        response
      );

      const uploadedFiles =
        (response.data || []).map(
          (file) => ({
            name: file.fileName,

            size:
              formatFileSize(
                file.fileSize
              ),

            url: file.fileUrl,

            isMock: false,
          })
        );

      setFiles((prev) => {
        const existingRealFiles =
          prev.filter(
            (file) =>
              !file.isMock
          );

        return [
          ...existingRealFiles,
          ...uploadedFiles,
        ];
      });
    } catch (error) {
      console.error(
        "S3 파일 업로드 실패:",
        error
      );

      console.error(
        "서버 응답:",
        error.response?.data
      );
    } finally {
      setIsUploading(false);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    }
  };


  /* =========================
      파일 선택
  ========================= */

  const handleFileChange = (
    event
  ) => {
    handleUploadFiles(
      event.target.files
    );
  };


  /* =========================
      Drag & Drop
  ========================= */

  const handleDragOver = (
    event
  ) => {
    event.preventDefault();
  };


  const handleDrop = (
    event
  ) => {
    event.preventDefault();

    handleUploadFiles(
      event.dataTransfer.files
    );
  };


  /* =========================
      파일 다운로드
  ========================= */

  const handleDownloadFile = async (
    file
  ) => {
    console.log(
      "파일 클릭:",
      file
    );

    if (!file.url) {
      console.warn(
        "파일 URL이 없습니다."
      );

      return;
    }

    try {
      const url =
        new URL(file.url);

      const storedKey =
        decodeURIComponent(
          url.pathname
            .split("/")
            .pop()
        );

      console.log(
        "다운로드 storedKey:",
        storedKey
      );

      const response =
        await downloadIssueFile(
          storedKey
        );

      const blobUrl =
        window.URL.createObjectURL(
          response.data
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        blobUrl;

      link.download =
        file.name;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );

      console.log(
        "첨부파일 다운로드 성공:",
        file.name
      );
    } catch (error) {
      console.error(
        "첨부파일 다운로드 실패:",
        error
      );

      console.error(
        "서버 응답:",
        error.response?.data
      );
    }
  };


  /* =========================
      파일 삭제
  ========================= */

  const handleRemoveFile = (
    removeIndex
  ) => {
    setFiles((prev) =>
      prev.filter(
        (_, index) =>
          index !== removeIndex
      )
    );
  };


  return (
    <section
      className={`${styles.section} ${styles.fileSection}`}
    >
      <h2>
        파일 및 참고 자료
      </h2>


      {/* 파일 검색 */}

      <div
        className={
          styles.fileSearch
        }
      >
        <img
          src={searchIcon}
          alt=""
        />

        <input
          type="text"
          placeholder="데스크톱 내 파일명 검색"
        />
      </div>


      <span
        className={
          styles.fileUploadLabel
        }
      >
        파일 첨부
      </span>


      {/* 실제 file input */}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{
          display: "none",
        }}
        onChange={
          handleFileChange
        }
      />


      <div
        className={
          styles.fileArea
        }
      >
        {/* 업로드 박스 */}

        <button
          type="button"
          className={
            styles.uploadBox
          }
          onClick={
            handleUploadBoxClick
          }
          onDragOver={
            handleDragOver
          }
          onDrop={
            handleDrop
          }
          disabled={
            isUploading
          }
        >
          <img
            src={uploadIcon}
            alt=""
            className={
              styles.uploadIcon
            }
          />

          <span>
            {isUploading
              ? "파일 업로드 중..."
              : "파일을 드래그하거나 클릭해서 업로드"}
          </span>
        </button>


        {/* 파일 목록 */}

        <div
          className={
            styles.fileList
          }
        >
          {files.map(
            (
              file,
              index
            ) => (
              <div
                key={`${file.name}-${index}`}
                className={
                  styles.fileItem
                }
              >
                <div
                  className={
                    styles.fileNameWrap
                  }
                >
                  <img
                    src={
                      documentIcon2
                    }
                    alt=""
                  />

                  <button
                    type="button"
                    className={
                      styles.fileNameButton
                    }
                    onClick={() =>
                      handleDownloadFile(
                        file
                      )
                    }
                  >
                    {file.name}
                  </button>
                </div>


                <div
                  className={
                    styles.fileRight
                  }
                >
                  <span
                    className={
                      styles.fileSize
                    }
                  >
                    {file.size}
                  </span>

                  <button
                    type="button"
                    className={
                      styles.fileRemoveButton
                    }
                    aria-label="파일 삭제"
                    onClick={() =>
                      handleRemoveFile(
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
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}


export default IssueFileSection;