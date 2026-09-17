import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";

const app = express();

app.use(cors());
app.use(express.json());

// API doc
const swaggerDocument = yaml.parse(
    fs.readFileSync("../docs/api_doc_openapi.yaml", "utf8")
);

app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

export default app;