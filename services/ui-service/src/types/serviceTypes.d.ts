export interface ServiceHealth {
    name: string;
    isHealthy: boolean;
    responseTime?: number;
}
export interface MicroserviceConfig {
    name: string;
    healthEndpoint: string;
    version?: string;
}
