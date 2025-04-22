// src/components/github/GitHubCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface ProjectFile {
  path: string;
  content: string;
}

const GitHubCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<string>("Аутентификация с GitHub...");
  const [error, setError] = useState<string | null>(null);

  const getProjectData = (): { name: string; files: ProjectFile[] } => {
    const stateData = location.state?.projectData;
    if (stateData) return stateData;

    const storedData = localStorage.getItem("project_data");
    if (storedData) return JSON.parse(storedData);

    throw new Error("Данные проекта не найдены");
  };

  const uploadProjectToGitHub = async (token: string) => {
    try {
      const { name: projectName, files } = getProjectData();
      setStatus("Подготовка файлов проекта...");

      // Changed to port 3002 for GitHub service
      setStatus("Создание репозитория на GitHub...");
      const repoResponse = await fetch("http://localhost:3002/api/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: projectName || `quickfront-project-${Date.now()}`,
          projectDescription: "Проект создан с помощью QuickFront",
          files,
        }),
      });

      if (!repoResponse.ok) {
        const errorData = await repoResponse.json();
        throw new Error(errorData.message || "Ошибка при создании репозитория");
      }

      const { repoUrl } = await repoResponse.json();
      return repoUrl;
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      throw err;
    }
  };

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          throw new Error(`Ошибка авторизации GitHub: ${error}`);
        }

        if (!code) {
          throw new Error("Код авторизации не получен");
        }

        setStatus("Обмен кода на токен...");
        
        // Changed to port 3002 for GitHub auth callback
        const tokenResponse = await fetch("http://localhost:3002/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.message || "Ошибка аутентификации с GitHub");
        }

        const { token } = await tokenResponse.json();
        localStorage.setItem("github_token", token);

        setStatus("Загрузка проекта на GitHub...");
        const repoUrl = await uploadProjectToGitHub(token);

        navigate("/download", {
          state: {
            success: true,
            repoUrl,
            message: "Проект успешно загружен на GitHub!",
          },
          replace: true,
        });

      } catch (err) {
        console.error("Ошибка GitHub callback:", err);
        setError(err instanceof Error ? err.message : "Ошибка аутентификации GitHub");
        
        navigate("/download", {
          state: {
            error: err instanceof Error ? err.message : "Ошибка аутентификации GitHub",
          },
          replace: true,
        });
      }
    };

    handleGitHubCallback();
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="text-center">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white">{status}</p>
            {status.includes("Загрузка") && (
              <p className="text-gray-400 mt-2">Это может занять некоторое время...</p>
            )}
          </>
        ) : (
          <>
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <p className="text-white">{error}</p>
            <p className="text-gray-400 mt-2">Перенаправление...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;