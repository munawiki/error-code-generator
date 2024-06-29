# Error Code Generator

## Overview

The Error Code Generator is a TypeScript application designed to fetch error definitions from a Google Spreadsheet and generate TypeScript constants and enums that can be used throughout your application to handle errors consistently.

## Features

- Fetches error definitions from a Google Spreadsheet.
- Generates TypeScript constants for error codes, messages, and associated metadata.
- Outputs the generated code to a TypeScript file for integration into projects.

## Prerequisites

- Node.js installed on your machine.
- Access to Google Sheets API with a valid service account.
- A Google Spreadsheet with error definitions. Example spreadsheet can be found at [here](https://docs.google.com/spreadsheets/d/1QD_YViu6ble6kgYecVOd36l7drH-Ha-k1SiGGlNAw1U/edit?usp=sharing).

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory and run `npm install` to install dependencies.

## Usage

To generate the error definitions, run the following command:

```bash
npm run generate
```

This script will access the specified Google Spreadsheet, parse the error definitions, and generate a TypeScript file in the specified output location.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to improve the functionality or documentation of this project.

## License

This project is licensed under the ISC license.
