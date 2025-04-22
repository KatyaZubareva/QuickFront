import React from "react";

interface ProjectDetailsStepProps {
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  projectDescription: string;
  setProjectDescription: React.Dispatch<React.SetStateAction<string>>;
  errors: { projectName?: string; projectDescription?: string };
  clearErrors: () => void;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  errors,
  clearErrors,
}) => {
  return (
    <div>
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Детали проекта
        </h2>
        <p className="text-sm text-gray-500 mb-6">Расскажите нам о вашем проекте</p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block text-lg font-medium text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
            Название проекта
          </label>
          <div className="relative">
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                clearErrors();
              }}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg transition-all
                                      focus:outline-none focus:ring-2 focus:ring-purple-500/50
                                      placeholder-gray-600
                                      ${errors.projectName 
      ? "border-red-500/80 focus:border-red-500" 
      : "border-gray-700 group-hover:border-purple-500/30 focus:border-purple-500"}`}
              placeholder="Мой крутой проект"
            />
            {errors.projectName && (
              <div className="absolute right-3 top-3 text-red-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {errors.projectName && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.projectName}
            </p>
          )}
        </div>

        <div className="group">
          <label className="block text-lg font-medium text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
            Описание проекта
          </label>
          <div className="relative">
            <textarea
              value={projectDescription}
              onChange={(e) => {
                setProjectDescription(e.target.value);
                clearErrors();
              }}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg transition-all
                                      focus:outline-none focus:ring-2 focus:ring-purple-500/50
                                      placeholder-gray-600
                                      ${errors.projectDescription 
      ? "border-red-500/80 focus:border-red-500" 
      : "border-gray-700 group-hover:border-purple-500/30 focus:border-purple-500"}`}
              placeholder="Опишите назначение вашего проекта..."
              rows={4}
            />
            {errors.projectDescription && (
              <div className="absolute right-3 top-3 text-red-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Это описание будет добавлено в README.md файл вашего проекта
          </p>
          {errors.projectDescription && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.projectDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsStep;