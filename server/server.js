const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const fsAsync = require('fs').promises;
const crypto = require('crypto');
const yaml = require('js-yaml');
const plantuml = require('node-plantuml');
const path = require('path');
const processFile = require('./processor');

// Constants
const PORT = 3001;
const UPLOADS_DIR = './uploads';
const THEME_FILE_INCLUDE = '!include ./themes/puml-theme-carbon-grey.puml\n';
const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Initialize Express
const app = express();

// Initialize Middleware
app.use(cors());

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        cb(null, `${Date.now()}${fileExtension}`);
    }
});

const upload = multer({ storage });

// Helper Functions
const generateMarkdownERD = require('./utils/generateMarkdownERD');
const sortYAML = require('./utils/sortYAML');
const getFullPath = (filename) => path.join(__dirname, UPLOADS_DIR, filename);

// API Routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const { generateERD, sortMethods, sortSchemas } = req.query;
        if (!file) return res.status(400).json({ error: 'No file uploaded.' });

        const originalFileName = path.parse(file.originalname).name;
        const data = await fsAsync.readFile(file.path, 'utf-8');

        const result = await processFile(data, originalFileName, { generateERD, sortMethods, sortSchemas });

        res.set({
            'fileName': result.filename,
            'sortedFileName': result.sortedFileName 
        });

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

app.get('/generate-uml/:filename', (req, res) => {
    const { filename } = req.params;
    try {
        const gen = plantuml.generate({ format: 'svg' });
        fs.createReadStream(`uploads/${filename}`).pipe(gen.in);

        let svgData = '';
        gen.out.on('data', chunk => svgData += chunk);
        gen.out.on('end', () => res.send(svgData));

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

app.get('/get-svg/:filename', (req, res) => {
    const { filename } = req.params;
    try {
        const baseName = path.basename(filename, path.extname(filename));
        const svgFileName = `${baseName}.svg`;

        res.set({
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': `attachment; filename=${svgFileName}`
        });

        const gen = plantuml.generate({ format: "svg" });
        fs.createReadStream(`uploads/${filename}`).pipe(gen.in);
        gen.out.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

app.get('/get-uml/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
        const data = await fsAsync.readFile(getFullPath(filename), 'utf-8');
        const modifiedData = data.replace(new RegExp(`^${THEME_FILE_INCLUDE}$`, 'm'), '');

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(modifiedData);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'File not found' });
    }
});

app.get('/get-yaml/:filename', (req, res) => {
    const { filename } = req.params;
    try {
        res.download(getFullPath(filename), filename);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'File not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
