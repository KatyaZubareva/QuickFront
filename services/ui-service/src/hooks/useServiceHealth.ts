// useServiceHealth.ts

import { useEffect, useState } from "react";
import { ServiceHealth } from "../types/serviceTypes";

export const useServiceHealth = (services: { name: string; healthEndpoint: string }[]) => {
  const [healthStatus, setHealthStatus] = useState<ServiceHealth[]>([]);

  useEffect(() => {
    const checkHealth = async () => {
      const statusPromises = services.map(async (service) => {
        try {
          const start = Date.now();
          const response = await fetch(service.healthEndpoint);
          const end = Date.now();
          
          return {
            name: service.name,
            isHealthy: response.ok,
            responseTime: end - start
          };
        } catch (_error) {
          return {
            name: service.name,
            isHealthy: false
          };
        }
      });

      const results = await Promise.all(statusPromises);
      setHealthStatus(results);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    
    return () => clearInterval(interval);
  }, [services]);

  return healthStatus;
};