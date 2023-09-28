# InterfaceInsights

This project provides utilities for manipulating and visualizing OpenAPI documents. It comes with a server that offers API endpoints for uploading and processing OpenAPI files, as well as a CLI tool for processing OpenAPI files directly from the command line.

## Features

- Upload OpenAPI documents to the server.
- Generate Entity Relationship Diagrams (ERD) from OpenAPI documents.
- Sort methods and schemas in OpenAPI documents.
- Process OpenAPI files directly from the command line without starting the server.

## Setup

1. Clone this repository:
```bash
git clone https://github.com/mattkauffman/interfaceinsight.git
```

2. Install the required dependencies:
```bash
npm install
```

## Usage

### Server

To start the server:
```bash
cd server
npm run start
```

The server will start and listen on `http://localhost:3001/`.

### Client

To start the client:
```bash
cd client
npm run start
```

The client will start and listen on `http://localhost:3000/`.

### Both

You can start both client and server with a single command from the root directory
```bash
npm run start
```

**API Endpoints**:

- `POST /api/upload`: Upload and process an OpenAPI file.
- `GET /generate-uml/:filename`: Generate UML from a given filename.
- `GET /get-svg/:filename`: Get SVG representation of UML for a given filename.
- `GET /get-uml/:filename`: Get UML file.
- `GET /get-yaml/:filename`: Download the YAML file.

### CLI

To use the CLI tool:
```bash
npm run cli -- upload --file=path_to_openapi_file.yaml
```

You can also use additional options:
```bash
npm run cli -- upload --file=path_to_file.yaml --generateERD=true --sortMethods=true --sortSchemas=true
```

## Dependencies

- `express`: For the server and API endpoints.
- `cors`: To handle CORS for the server.
- `multer`: For handling file uploads.
- `fs` and `fs.promises`: For file system operations.
- `crypto`: To generate random file names.
- `js-yaml`: For parsing YAML files.
- `node-plantuml`: For generating UML.
- `path`: For file path operations.
- `yargs`: For building the CLI.
- `axios`: For making HTTP requests from the CLI.

