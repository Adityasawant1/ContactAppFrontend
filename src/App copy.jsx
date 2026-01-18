import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/file";

const FileUploadDemo = () => {
  const [files, setFiles] = useState(null);
  const [progress, setProgress] = useState({ status: null, percent: 0 });

  /* ================= UPLOAD ================= */
  const uploadFiles = async () => {
    if (!files) return alert("Please choose file(s)");

    const formData = new FormData();
    Array.from(files).forEach((file) =>
      formData.append("files", file)
    );

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: ({ loaded, total }) => {
          const percent = Math.round((loaded * 100) / total);
          setProgress({ status: "uploading", percent });
        },
      });

      setFiles(null);
      setProgress({ status: "done", percent: 100 });
    } catch (err) {
      console.error(err);
      setProgress({ status: "error", percent: 0 });
    }
  };

  /* ================= DOWNLOAD ================= */
  const downloadFiles = async (filename) => {
    try {
      const res = await axios.get(`${API_URL}/download/${filename}`, {
        responseType: "blob",
        onDownloadProgress: ({ loaded, total }) => {
          const percent = Math.round((loaded * 100) / total);
          setProgress({ status: "downloading", percent });
        },
      });

      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = res.headers["file-name"] || filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress({ status: "done", percent: 100 });
    } catch (err) {
      console.error(err);
      setProgress({ status: "error", percent: 0 });
    }
  };

  return (
    <div className="App">
      <h1>Upload Files</h1>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
      />

      <br />

      <button onClick={uploadFiles}>Upload</button>
      <button onClick={() => downloadFiles("youtubefree.mp4")}>
        Download
      </button>

      {progress.status && (
        <>
          <p>
            {progress.status.toUpperCase()} : {progress.percent}%
          </p>
          <progress max="100" value={progress.percent}></progress>
        </>
      )}
    </div>
  );
};

export default FileUploadDemo;
