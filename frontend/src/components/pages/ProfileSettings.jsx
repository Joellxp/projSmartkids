import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext"; // CORRIGIDO

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function ProfileSettings() {
  const [form, setForm] = useState({ fullName: "", username: "", password: "", currentPassword: "" });
  const [photo, setPhoto] = useState(""); // nome do arquivo no backend
  const [preview, setPreview] = useState(""); // url local para preview
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const fileInput = useRef();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await axios.get("/profile", { withCredentials: true });
        setForm(f => ({ ...f, fullName: res.data.fullName, username: res.data.username }));
        setPhoto(res.data.photo);
      } catch {
        showNotification("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [showNotification]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showNotification("Arquivo deve ser uma imagem.");
    if (file.size > 2 * 1024 * 1024) return showNotification("Imagem deve ter até 2MB.");
    setPreview(URL.createObjectURL(file));
    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    const data = new FormData();
    data.append("photo", file);
    try {
      const res = await axios.patch("/profile/photo", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPhoto(res.data.photo);
      sessionStorage.setItem("photo", res.data.photo);
      showNotification("Foto atualizada!");
    } catch (err) {
      showNotification(err?.response?.data?.error || "Erro ao enviar foto.");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.fullName.trim()) return showNotification("Nome obrigatório.");
    if (!validateEmail(form.username)) return showNotification("Email inválido.");
    if (form.password && form.password.length < 4) return showNotification("Senha deve ter pelo menos 4 caracteres.");
    if (form.password && !form.currentPassword) return showNotification("Informe a senha atual para alterar a senha.");

    setLoading(true);
    try {
      await axios.patch("/profile", form, { withCredentials: true });
      showNotification("Perfil atualizado!");
      setForm(f => ({ ...f, password: "", currentPassword: "" }));
      sessionStorage.setItem("fullName", form.fullName);
      sessionStorage.setItem("username", form.username);
    } catch (err) {
      showNotification(err?.response?.data?.error || "Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Configurações de Perfil</h2>
      <div>
        <label>Foto de perfil:</label><br />
        <img
          src={preview || (photo ? `/uploads/${photo}` : "")}
          alt="Foto de perfil"
          style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
        /><br />
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        <button type="button" onClick={() => fileInput.current.click()}>Alterar foto</button>
      </div>
      <label htmlFor="fullName">Nome completo:</label>
      <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} />
      <label htmlFor="username">Email:</label>
      <input id="username" name="username" value={form.username} onChange={handleChange} />
      <label htmlFor="password">Nova senha:</label>
      <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
      <label htmlFor="currentPassword">Senha atual (obrigatória para trocar senha):</label>
      <input id="currentPassword" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
      <button type="submit" disabled={loading}>Salvar</button>
    </form>
  );
}