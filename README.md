# InterfaceInsights

This application provides utilities to process OpenAPI specification documents. Users can upload an OpenAPI document to:

1. Generate a UML ER Diagram.
2. Sort OpenAPI schemas and their attributes.
3. Sort OpenAPI methods.

The application is made of a React frontend and a Node.js backend.

## Features

- **Upload OpenAPI Specification**: Users can upload a YAML file representing their OpenAPI spec.
- **Generate UML ER Diagram**: Once uploaded, the application can generate a UML diagram for the provided spec.
- **Sort Specifications**: The application can sort schemas, their properties, property attributes, and methods in the OpenAPI document.
- **Download Utilities**: After processing, users can download the generated UML and SVG representations and the sorted OpenAPI document.
- **Interactive UML Viewer**: The generated UML diagram is displayed interactively, with capabilities to pan and zoom.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repository:

\```bash
git clone https://github.com/your-repo-url/interfaceinsight.git
cd interfaceinsight
\```

2. Install the dependencies:

\```bash
npm install
\```

### Running the Application

To start both the client and the server concurrently:

\```bash
npm start
\```

You can also run them individually:

- For the client:
\```bash
npm run client
\```

- For the server:
\```bash
npm run server
\```

Visit `http://localhost:3000` in your browser to access the application.

## Recommendations

- **Clean Up**: Regularly check and clear the `uploads` directory on the server to avoid running
