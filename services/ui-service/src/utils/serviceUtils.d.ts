export declare const getServiceStatusColor: (isHealthy: boolean) => "bg-green-500" | "bg-red-500";
export declare const formatResponseTime: (ms?: number) => string;
export declare const DEFAULT_SERVICES: {
    name: string;
    healthEndpoint: string;
}[];
