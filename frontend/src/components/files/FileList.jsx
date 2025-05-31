import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Button from "../base/Button";
import Card from "../base/Card";
import Loader from "../base/Loader";
import Input from "../base/Input";
import Notification from "../base/Notification";
import { useNotification } from "../../context/NotificationContext";

function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification, notification } = useNotification();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get("http://localhost:3001/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data.files || []);
    } catch (error) {
      showNotification("Erro ao carregar arquivos.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showNotification("Selecione um arquivo PDF para enviar.");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      showNotification("Apenas arquivos PDF são permitidos.");
      return;
    }
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);
      await axiosInstance.post("http://localhost:3001/files", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showNotification("Arquivo enviado com sucesso.");
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      showNotification("Erro ao enviar arquivo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Tem certeza que deseja deletar este arquivo?")) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.delete(`http://localhost:3001/files/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Arquivo deletado com sucesso.");
      fetchFiles();
    } catch (error) {
      showNotification("Erro ao deletar arquivo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Arquivos</h2>
      <form onSubmit={handleUpload}>
        <label htmlFor="fileUpload">Selecione um arquivo PDF:</label>
        <Input
          id="fileUpload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Enviar PDF"}
        </Button>
      </form>
      {loading ? (
        <Loader />
      ) : (
        <ul>
          {files.length === 0 ? (
            <li>Nenhum arquivo encontrado.</li>
          ) : (
            files.map((file) => (
              <li key={file}>
                {file}
                <Button
                  style={{
                    background: "#9d714b",
                    marginLeft: 8,
                    padding: "4px 12px",
                  }}
                  onClick={() => handleDelete(file)}
                >
                  Deletar
                </Button>
              </li>
            ))
          )}
        </ul>
      )}
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default FileList;
