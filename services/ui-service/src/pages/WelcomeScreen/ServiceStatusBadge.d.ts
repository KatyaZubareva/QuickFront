import React from "react";
interface ServiceStatusBadgeProps {
    serviceName: string;
    isHealthy: boolean;
}
declare const ServiceStatusBadge: React.FC<ServiceStatusBadgeProps>;
export default ServiceStatusBadge;
