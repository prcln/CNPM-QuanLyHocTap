import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";

import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// API doc
const swaggerFilePath =
    process.env.SWAGGER_PATH ||
    path.resolve(__dirname, "../../docs/api_doc_openapi.yaml");

let swaggerDocument = {};
try {
    if (fs.existsSync(swaggerFilePath)) {
        swaggerDocument = yaml.parse(fs.readFileSync(swaggerFilePath, "utf8"));
    } else {
        console.warn(`Swagger documentation file not found at: ${swaggerFilePath}`);
    }
} catch (error) {
    console.error(`Failed to load Swagger document from ${swaggerFilePath}:`, error);
}

app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

export default app;