// src/services/gigachat.service.ts
import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import config from "../config";

interface GigaChatAuthResponse {
  access_token: string;
  expires_at: number;
}

interface GigaChatMessage {
  role: string;
  content: string;
}

interface GigaChatChoice {
  message: GigaChatMessage;
}

interface GigaChatCompletionResponse {
  choices: GigaChatChoice[];
}

// Create an Axios instance with custom HTTPS agent
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // Bypass SSL certificate validation (for development only)
  })
});

class GigaChatService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.authenticate().catch(err => console.error("Initial GigaChat auth failed:", err));
  }

  private async authenticate(): Promise<void> {
    if (!config.GIGACHAT_CLIENT_ID || !config.GIGACHAT_CLIENT_SECRET) {
      throw new Error("GigaChat credentials not configured");
    }

    const authString = `${config.GIGACHAT_CLIENT_ID}:${config.GIGACHAT_CLIENT_SECRET}`;
    const encodedAuth = Buffer.from(authString).toString("base64");

    try {
      const response = await axiosInstance.post<GigaChatAuthResponse>(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        new URLSearchParams({ scope: config.GIGACHAT_SCOPE || "GIGACHAT_API_PERS" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: `Basic ${encodedAuth}`,
            RqUID: this.generateRqUID()
          }
        } as AxiosRequestConfig
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = response.data.expires_at * 1000; // Convert to milliseconds
    } catch (error) {
      console.error("GigaChat authentication error:", error);
      throw error;
    }
  }

  private generateRqUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiresAt - 60000) {
      await this.authenticate();
    }
  }

  async generateText(prompt: string, maxTokens: number = 200): Promise<string> {
    await this.ensureAuthenticated();

    if (!this.accessToken) {
      throw new Error("Not authenticated with GigaChat");
    }

    try {
      const response = await axiosInstance.post<GigaChatCompletionResponse>(
        "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
        {
          model: "GigaChat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: maxTokens
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`
          }
        } as AxiosRequestConfig
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from GigaChat API");
      }

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("GigaChat API error:", error);
      throw error;
    }
  }
}

export const gigaChat = new GigaChatService();