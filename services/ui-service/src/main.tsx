// main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error.error);
      setHasError(true);
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return <div style={{color: "red", padding: "20px"}}>
      <h1>Something went wrong</h1>
      <p>Check the browser console for errors</p>
    </div>;
  }

  return <>{children}</>;
}