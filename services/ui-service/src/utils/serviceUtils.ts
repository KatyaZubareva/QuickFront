// serviceUtils.ts

export const getServiceStatusColor = (isHealthy: boolean) => {
  return isHealthy ? "bg-green-500" : "bg-red-500";
};

export const formatResponseTime = (ms?: number) => {
  if (!ms) return "N/A";
  return `${ms}ms`;
};

export const DEFAULT_SERVICES = [
  {
    name: "API",
    healthEndpoint: "/api/health"
  },
  {
    name: "Auth",
    healthEndpoint: "/auth/health"
  },
  {
    name: "Config",
    healthEndpoint: "/config/health"
  }
];