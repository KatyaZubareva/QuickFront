// src/components/DownloadStep.tsx
import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { useNavigate } from "react-router-dom";

interface DownloadStepProps {
  selectedFramework?: string | null;
  selectedVersion?: string | null;
  selectedFeatures?: string[];
  selectedTemplate?: string | null;
  projectName: string;
  projectDescription?: string;
  onBack?: () => void;
}

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const DownloadStep: React.FC<DownloadStepProps> = ({
  selectedFramework,
  selectedVersion,
  selectedFeatures,
  selectedTemplate,
  projectName,
  projectDescription,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL || "http://localhost:3002";
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const navigate = useNavigate();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPushingToGitHub, setIsPushingToGitHub] = useState(false);
  const [gitHubStatus, setGitHubStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gitHubUsername, setGitHubUsername] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Verify GitHub token on mount
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (token) {
      verifyGitHubToken(token);
    }
  }, []);

  // Check for authentication errors from callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      setError(`GitHub authentication failed: ${errorParam}`);
      // Clear the error from URL
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  // Generate download link when dependencies change
  useEffect(() => {
    if (!selectedFramework) {
      setError("Сначала выберите фреймворк");
      return;
    }

    try {
      const config = {
        projectName: projectName || "my-project",
        projectDescription: projectDescription || "",
        framework: selectedFramework,
        version: selectedVersion || "",
        features: selectedFeatures || [],
        template: selectedTemplate || ""
      };

      const encodedParams = btoa(JSON.stringify(config));
      setDownloadLink(`${API_URL}/download?params=${encodedParams}`);
      setError(null);
    } catch (err) {
      setError("Не удалось создать ссылку для скачивания");
      console.error("Ошибка кодировки:", err);
    }
  }, [selectedFramework, selectedVersion, selectedFeatures, selectedTemplate, projectName, projectDescription, API_URL]);

  const verifyGitHubToken = async (token: string) => {
    try {
      const octokit = new Octokit({ auth: token });
      const { data } = await octokit.rest.users.getAuthenticated();
      setIsAuthenticated(true);
      setGitHubUsername(data.login);
      return true;
    } catch (_error) {
      localStorage.removeItem("github_token");
      setIsAuthenticated(false);
      return false;
    }
  };

  const handleGitHubLogin = () => {
    // Clear any existing token first
    localStorage.removeItem("github_token");
    setIsAuthenticated(false);
    
    const redirectUri = encodeURIComponent(`${window.location.origin}/github-callback`);
    const scope = encodeURIComponent("repo");
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const downloadZip = async () => {
    if (!downloadLink) {
      setError("Ссылка для скачивания не готова");
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(downloadLink);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Сервер ответил ${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Получен пустой файл");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName || "project"}.zip`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (_err) {
      console.error("Загрузка не удалась:", _err);
      setError(_err instanceof Error ? _err.message : "Не удалось загрузить проект");
    } finally {
      setIsDownloading(false);
    }
  };

  const pushToGitHub = async () => {
    if (!projectName.trim()) {
      setError("Пожалуйста введите название проекта");
      return;
    }

    setIsPushingToGitHub(true);
    setError(null);
    setGitHubStatus("Создание репозитория...");

    try {
      const token = localStorage.getItem("github_token");
      if (!token || !(await verifyGitHubToken(token))) {
        throw new Error("Сначала выполните аутентификацию на GitHub");
      }

      // 1. Generate project first
      setGitHubStatus("Генерация проекта...");
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          projectDescription,
          framework: selectedFramework,
          version: selectedVersion,
          features: selectedFeatures,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) throw new Error("Генерация проекта не удалась");
      const projectData = await response.json();

      // 2. Push to GitHub via GitHub service (port 3002)
      setGitHubStatus("Загрузка в GitHub...");
      const uploadResponse = await fetch(`${GITHUB_API_URL}/api/repos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName,
          projectDescription,
          files: projectData.files
        }),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Загрузка GitHub не удалась");
      }

      const { repoUrl } = await uploadResponse.json();
      setGitHubStatus("Готово! Перенаправляем на GitHub...");
      setTimeout(() => {
        window.open(repoUrl, "_blank");
      }, 1500);
    } catch (_err) {
      console.error("Ошибка отправки на GitHub:", _err);
      setGitHubStatus("Ошибка");
      setError(_err instanceof Error ? _err.message : "Не удалось отправить на GitHub");
    } finally {
      setIsPushingToGitHub(false);
    }
  };

  const copyToClipboard = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      alert("📋 Ссылка скопирована в буфер обмена!");
    }
  };

  return (
    <div className="text-center p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-4">Ваш проект готов!</h2>
      <p className="text-sm text-center text-gray-400 mb-6">
        Загрузите свой проект в виде ZIP-файла или отправьте его напрямую на GitHub.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {gitHubStatus && (
        <div className="mb-4 p-3 bg-blue-900/50 text-blue-200 rounded-lg text-sm">
          {gitHubStatus}
        </div>
      )}

      <div className="relative w-full mb-6">
        <input
          type="text"
          value={downloadLink}
          readOnly
          className="px-4 py-3 pr-12 border border-gray-600 rounded-lg w-full text-sm text-gray-300 bg-gray-800 focus:outline-none focus:border-purple-500"
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg text-gray-400 hover:text-white transition"
          onClick={copyToClipboard}
          title="Копировать ссылку"
        >
          📋
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <button
          className={`px-6 py-3 rounded-lg font-semibold w-full max-w-xs transition-all flex items-center justify-center gap-2 ${
            isDownloading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={downloadZip}
          disabled={isDownloading || !downloadLink}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            "Скачать ZIP"
          )}
        </button>

        {!isAuthenticated ? (
          <button
            onClick={handleGitHubLogin}
            className="px-6 py-3 rounded-lg font-semibold w-full max-w-xs bg-gray-800 hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            <GitHubIcon />
            Загрузить на GitHub
          </button>
        ) : (
          <button
            onClick={pushToGitHub}
            className={`px-6 py-3 rounded-lg font-semibold w-full max-w-xs transition-all flex items-center justify-center gap-2 ${
              isPushingToGitHub
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isPushingToGitHub || !projectName}
          >
            {isPushingToGitHub ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Загрузка...
              </>
            ) : (
              <>
                <GitHubIcon />
                Загрузить на GitHub
              </>
            )}
          </button>
        )}

        {isAuthenticated && (
          <div className="mt-4 text-sm text-gray-400">
            Connected as <span className="text-blue-400">{gitHubUsername}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadStep;