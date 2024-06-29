import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import fs from "fs";
import { logger } from "./logger";

dotenv.config();

function validateEnvVars() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    logger.error("Missing required environment variables");
    throw new Error("Missing required environment variables");
  }

  return { serviceAccountEmail, privateKey, sheetId };
}

const { serviceAccountEmail, privateKey, sheetId } = validateEnvVars();

const creds = new JWT({
  email: serviceAccountEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(sheetId, creds);

async function accessSpreadsheet() {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let tsOutput = `// Auto-generated error definitions\n\n`;

    tsOutput += `enum ErrorType { Validation = "Validation", Network = "Network", Database = "Database", Timeout = "Timeout", HTTP = "HTTP", Authentication = "Authentication", Authorization = "Authorization", Resource = "Resource", Dependency = "Dependency", Configuration = "Configuration" }\n`;
    tsOutput += `enum LogLevel { INFO = "INFO", WARN = "WARN", ERROR = "ERROR" }\n`;
    tsOutput += `enum Component { Frontend = "Frontend", Backend = "Backend", Database = "Database", APIGateway = "API Gateway", Microservice = "Microservice", ThirdPartyService = "Third-party Service" }\n`;
    tsOutput += `enum UserImpact { Low = "Low", Medium = "Medium", High = "High" }\n\n`;

    tsOutput += `export namespace ErrorDefinitions {\n`;

    rows.forEach((row) => {
      const errorCode = row.get("Error Code").replace(/\s+/g, "");
      tsOutput += `  export const ${errorCode} = {\n`;
      tsOutput += `    code: "${row.get("Error Code")}",\n`;
      tsOutput += `    type: ErrorType.${row.get("Error Type")},\n`;
      tsOutput += `    message: "${row.get("Error Message")}",\n`;
      tsOutput += `    httpStatusCode: ${row.get("HTTP Status Code")},\n`;
      tsOutput += `    description: "${row.get("Description")}",\n`;
      tsOutput += `    possibleCauses: "${row.get("Possible Causes")}",\n`;
      tsOutput += `    solution: "${row.get("Solution")}",\n`;
      tsOutput += `    logLevel: LogLevel.${row.get("Log Level")},\n`;
      tsOutput += `    component: Component.${row.get("Component")},\n`;
      tsOutput += `    timestamp: "${row.get("Timestamp")}",\n`;
      tsOutput += `    userImpact: UserImpact.${row.get("User Impact")},\n`;
      tsOutput += `    errorId: "${row.get("Error ID")}"\n`;
      tsOutput += `  };\n\n`;
    });

    tsOutput += `}\n`;

    fs.writeFileSync("errors.ts", tsOutput);
    logger.info(
      "Error definitions successfully generated and saved to errors.ts"
    );
  } catch (error) {
    logger.error("Failed to generate error definitions:", error);
    throw error;
  }
}

accessSpreadsheet();
