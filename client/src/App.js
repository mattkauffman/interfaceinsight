import axios from "axios";
import panzoom from "panzoom";
import React, { useEffect, useRef, useState } from "react";

import './App.css';  // Importing the CSS file

function App() {
  const defaultUploadButtonText = "Choose File";
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [umlSrc, setUmlSrc] = useState(null);
  const [yamlSrc, setYAMLSrc] = useState(null);
  const [diagramSvg, setDiagramSvg] = useState(null);
  const [fileName, setFileName] = useState(defaultUploadButtonText);
  const [generateDiagram, setGenerateDiagram] = useState(true);
  const [sortSchemas, setSortSchemas] = useState(false);
  const [sortMethods, setSortMethods] = useState(false);
  const imageContainerRef = useRef(null); 

  useEffect(() => {
    // Check if the SVG has been added to the container
    if (diagramSvg && imageContainerRef.current) {
      // Find the SVG element within the container
      const svgElement = imageContainerRef.current.querySelector("svg");
      if (svgElement) {
        // Initialize panzoom on the SVG element
        panzoom(svgElement, {
          bounds: true,
          boundsPadding: 0.1
        });
      }
    }
  }, [diagramSvg]); 
  

  function removeExtension(filename) {
    const lastDotPosition = filename.lastIndexOf('.');
    if (lastDotPosition === -1) return filename; // No extension found
    return filename.substring(0, lastDotPosition);
  }

  function fetchSvgFromServer(filename){
    fetch(`http://localhost:3001/generate-uml/${filename}`)
    .then(response => response.text())
    .then(svgMarkup => {
      setDiagramSvg(svgMarkup);  
    })
    .catch(error => {
        console.error("There was an error fetching the SVG:", error);
    });

  }

  const handleGenerateDiagramCheckboxChange = (e) => {
    setGenerateDiagram(e.target.checked);
  };

  const handleSortSchemasCheckboxChange = (e) => {
    setSortSchemas(e.target.checked);
  };

  const handleSortMethodsCheckboxChange = (e) => {
    setSortMethods(e.target.checked);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "Choose File");
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`http://localhost:3001/api/upload?generateERD=${generateDiagram}&sortMethods=${sortMethods}&sortSchemas=${sortSchemas}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const filename = res.data.filename;
      const sortedFileName = res.data.sortedFileName;
      setImgSrc(`${removeExtension(filename)}.uml`);
      setUmlSrc(`${filename}.uml`);
      setYAMLSrc(`${sortedFileName}`);
      setDiagramSvg(fetchSvgFromServer(`${removeExtension(filename)}.uml`));
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const isUploadDisabled = fileName === defaultUploadButtonText;

  return (
    <div className="App theme-base">
      <h1 className="theme-title">OpenAPI Utilities</h1>
      <label className="theme-button file-input-label">
        <input
          type="file"
          className="file-input"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {fileName}
      </label>
      <ul>
        <li>
          <label>
            <input
              type="checkbox"
              checked={generateDiagram}
              onChange={handleGenerateDiagramCheckboxChange}
            />
            <span>Generate UML ER Diagram</span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={sortSchemas}
              onChange={handleSortSchemasCheckboxChange}
            />
            <span>Sort OpenAPI Schemas (also sorts schema properties and property attributes)</span>
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={sortMethods}
              onChange={handleSortMethodsCheckboxChange}
            />
            <span>Sort OpenAPI Methods</span>
          </label>
        </li>
      </ul>

      <button className="theme-button" onClick={handleUpload} disabled={isUploadDisabled}>Process OpenAPI Document</button>

      {yamlSrc && (sortMethods || sortSchemas) && (
        <p><a className="theme-link" href={`http://localhost:3001/get-yaml/${yamlSrc}`}>Download Sorted OpenAPI Document</a></p>
      )}

      {imgSrc && generateDiagram && (
        <div className="theme-result">
          <h2 className="theme-subtitle">Generated UML Diagram:  <a className="theme-link" href={`http://localhost:3001/get-uml/${umlSrc}`}>Download UML</a> <a download='website.svg' id='thisthing'  className="theme-link" href={`http://localhost:3001/get-svg/${umlSrc}`}>Download SVG</a></h2>
          <div ref={imageContainerRef} className="image-container">
            <div dangerouslySetInnerHTML={{ __html: diagramSvg || '' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
