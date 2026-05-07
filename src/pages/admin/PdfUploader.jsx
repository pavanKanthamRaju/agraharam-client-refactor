import React, { useState } from "react";
import {uploadPdf } from "../../api/dashboardsApi";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate PDF
    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("pdf", file);

      const response = await  uploadPdf(formData );

      setMessage("Upload successful ✅");
      console.log("Response:", response.data);

    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.error || "Upload failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    textAlign: "center",
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "8px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    cursor: "pointer",
  },
};

export default PdfUploader;
