import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = (configuredBaseURL || "http://127.0.0.1:8000/api/v1").replace(
  /\/+$/,
  "",
);
const token = import.meta.env.VITE_API_TOKEN;

export const API = axios.create({
  baseURL,
  timeout: 120_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ detail?: unknown }>(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string" && detail.trim()) return detail;
    if (error.code === "ECONNABORTED") {
      return "A API demorou para responder. Tente novamente.";
    }
    if (!error.response) {
      return "Não foi possível conectar à API. Verifique se o backend está em execução.";
    }
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}
