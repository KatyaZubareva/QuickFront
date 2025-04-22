import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const WelcomeScreen = lazy(() => import("./pages/WelcomeScreen/WelcomeScreen"));
const ProjectSetup = lazy(() => import("./pages/ProjectSetup/ProjectSetup"));
const DownloadStep = lazy(() => import("./components/features/DownloadStep/DownloadStep"));
const GitHubCallback = lazy(() => import("./components/github/GitHubCallback"));

export function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center w-screen h-screen bg-gray-900">Loading...</div>}>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/setup" element={<ProjectSetup />} />
          <Route 
            path="/download" 
            element={
              <DownloadStep 
                selectedFramework={null}
                selectedVersion={null}
                selectedFeatures={[]}
                selectedTemplate={null}
                projectName=""
                projectDescription=""
              />
            } 
          />
          <Route path="/github-callback" element={<GitHubCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;