import { ServiceHealth } from "../types/serviceTypes";
export declare const useServiceHealth: (services: {
    name: string;
    healthEndpoint: string;
}[]) => ServiceHealth[];
