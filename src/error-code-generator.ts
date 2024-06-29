import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import fs from "fs";
import { logger } from "./logger";
import { config } from "./config";

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
    const typesSheet = doc.sheetsByTitle["Types"];
    if (!typesSheet) {
      throw new Error("Types sheet not found in the spreadsheet.");
    }
    const typesRows = await typesSheet.getRows();

    interface EnumTypes {
      "Error Type": Set<string>;
      "Log Level": Set<string>;
      Component: Set<string>;
      "User Impact": Set<string>;
    }

    interface SpreadsheetRow
      extends GoogleSpreadsheetRow<Record<string, any>> {}

    let enumsOutput = "";
    const enumTypes: EnumTypes = {
      "Error Type": new Set<string>(),
      "Log Level": new Set<string>(),
      Component: new Set<string>(),
      "User Impact": new Set<string>(),
    };

    typesRows.forEach((row: SpreadsheetRow) => {
      Object.keys(enumTypes).forEach((key) => {
        const value = row.get(key);
        if (typeof value === "string") {
          enumTypes[key as keyof EnumTypes].add(value);
        }
      });
    });

    Object.keys(enumTypes).forEach((type) => {
      enumsOutput += `enum ${type.replace(/\s+/g, "")} { `;
      enumsOutput += Array.from(enumTypes[type as keyof EnumTypes])
        .filter((value) => value.trim() !== "")
        .map((value) => {
          const enumName = value.replace(/[\s-]+/g, "");
          return `${enumName} = "${value}"`;
        })
        .join(", ");
      enumsOutput += " }\n";
    });

    const sheet = doc.sheetsByIndex[config.sheetIndex || 0];
    if (!sheet) {
      throw new Error("Main data sheet not found in the spreadsheet.");
    }
    const rows = await sheet.getRows();

    let tsOutput = `// Auto-generated error definitions\n\n`;
    tsOutput += enumsOutput;

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

    fs.writeFileSync(config.outputPath || "dist/errors.ts", tsOutput);
    logger.info(
      "Error definitions successfully generated and saved to errors.ts"
    );
  } catch (error) {
    logger.error("Failed to generate error definitions:", error);
    throw error;
  }
}

accessSpreadsheet();
