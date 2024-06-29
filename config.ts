interface Config {
  sheetIndex: number;
  outputPath: string;
}

const config: Config = {
  sheetIndex: 0,
  outputPath: "dist/errors.ts",
};

function loadConfig(): void {
  const envSheetIndex = process.env.SHEET_INDEX;
  const envOutputPath = process.env.OUTPUT_PATH;

  if (envSheetIndex) {
    config.sheetIndex = parseInt(envSheetIndex, 10);
  }

  if (envOutputPath) {
    config.outputPath = envOutputPath;
  }
}

loadConfig();

export { config };
