// Auto-generated error definitions

enum ErrorType {
  Validation = "Validation",
  Network = "Network",
  Database = "Database",
  Timeout = "Timeout",
  HTTP = "HTTP",
  Authentication = "Authentication",
  Authorization = "Authorization",
  Resource = "Resource",
  Dependency = "Dependency",
  Configuration = "Configuration",
}
enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}
enum Component {
  Frontend = "Frontend",
  Backend = "Backend",
  Database = "Database",
  APIGateway = "API Gateway",
  Microservice = "Microservice",
  ThirdPartyService = "Third-party Service",
}
enum UserImpact {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export namespace ErrorDefinitions {
  export const ERR001 = {
    code: "ERR001",
    type: ErrorType.Validation,
    message: "Invalid input",
    httpStatusCode: 400,
    description: "The input format is incorrect",
    possibleCauses: "User entered invalid data",
    solution: "Validate input before submission",
    logLevel: LogLevel.ERROR,
    component: Component.Frontend,
    timestamp: "2024-06-29 12:34:56",
    userImpact: UserImpact.Medium,
    errorId: "b1e35f4e-6ae3-44bb-8e58-709e6472b3fa",
  };

  export const ERR002 = {
    code: "ERR002",
    type: ErrorType.Network,
    message: "Network request failed",
    httpStatusCode: 503,
    description: "Server unreachable",
    possibleCauses: "Network issues, server down",
    solution: "Check network, ensure server is running",
    logLevel: LogLevel.WARN,
    component: Component.Frontend,
    timestamp: "2024-06-29 12:35:00",
    userImpact: UserImpact.High,
    errorId: "c2d46e7e-5fbf-4a72-9538-6b40c06c8af6",
  };

  export const ERR003 = {
    code: "ERR003",
    type: ErrorType.Database,
    message: "DB connection error",
    httpStatusCode: 500,
    description: "Failed to connect to database",
    possibleCauses: "Database server down, incorrect credentials",
    solution: "Verify database server status and credentials",
    logLevel: LogLevel.ERROR,
    component: Component.Backend,
    timestamp: "2024-06-29 12:36:10",
    userImpact: UserImpact.High,
    errorId: "e3e58f4e-3b4a-487b-9e57-83d6673d8f6b",
  };

  export const ERR004 = {
    code: "ERR004",
    type: ErrorType.Timeout,
    message: "Request timed out",
    httpStatusCode: 408,
    description: "Server response time exceeded",
    possibleCauses: "Server overload, network latency",
    solution: "Optimize server, increase timeout setting",
    logLevel: LogLevel.WARN,
    component: Component.Backend,
    timestamp: "2024-06-29 12:37:45",
    userImpact: UserImpact.Medium,
    errorId: "d4f69f6e-1d5c-43d8-8e58-792e6574d7a2",
  };

  export const ERR005 = {
    code: "ERR005",
    type: ErrorType.HTTP,
    message: "Unauthorized access",
    httpStatusCode: 401,
    description: "User lacks necessary permissions",
    possibleCauses: "Invalid credentials, access rights",
    solution: "Verify user credentials and permissions",
    logLevel: LogLevel.ERROR,
    component: Component.Backend,
    timestamp: "2024-06-29 12:38:22",
    userImpact: UserImpact.High,
    errorId: "a5e70e7e-6c4d-4b58-8e67-809e6578d6e3",
  };
}
