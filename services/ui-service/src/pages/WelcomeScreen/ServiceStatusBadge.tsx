// ServiceStatusBadge.tsx

import React from "react";

interface ServiceStatusBadgeProps {
  serviceName: string;
  isHealthy: boolean;
}

const ServiceStatusBadge: React.FC<ServiceStatusBadgeProps> = ({ 
  serviceName, 
  isHealthy 
}) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
    <div className={`w-2 h-2 rounded-full ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
    <span className="text-xs font-mono">{serviceName}</span>
  </div>
);

export default ServiceStatusBadge;