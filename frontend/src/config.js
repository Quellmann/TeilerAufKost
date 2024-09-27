import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false};export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";