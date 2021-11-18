type EnvironmentTypes = "dev" | "debug" | "prod";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_USERNAME: string;
            CHANNEL_NAME: string;
            OAUTH_TOKEN: `oauth:${string}`;
            ENVIRONMENT: EnvironmentTypes;
        }
    }
}
