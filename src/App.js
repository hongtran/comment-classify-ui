import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ImagePage from './pages/ImagePage.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Define more routes as needed */}
        {/* <Route path="/your-path" element={<YourComponent />} /> */}
        <Route path="/image/:id" element={<ImagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// The Home component is a simple file upload form that allows users to upload an image file to the server.
// The server then saves the image to the file system and returns the list of images that have been uploaded.
// The list of images is then rendered in the UI.
function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  // get and render the list of images
  const [images, setImages] = useState([]);
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/images/');
      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:8000/upload/', formData);
      setImages([...images, response.data]);
      // reset form after upload success
      setSelectedFile(null);

    } catch (error) {
      console.error(error);
    }
  };
  const [loadingIds, setLoadingIds] = useState([]);
  const getDescrible = async (id) => {
    // add loading icon here
    setLoadingIds(prev => [...prev, id]); // Start loading
    try {
      const response = await axios.get(`http://localhost:8000/describle/${id}`);
      // update describle to current image
      const newImages = images.map(image => {
        if (image.id === id) {
          return {
            ...image,
            describle: response.data.describle
          };
        }
        return image;
      });
      setImages(newImages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id)); // Stop loading
    }
  };

  return (
    <div className='container'>
      <div className='upload-form'>
        <h1>Upload a image</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <div className='Image'>{selectedFile && <img style={{width: '200px'}} src={URL.createObjectURL(selectedFile)} alt="uploaded" />}</div>
      </div>
      <div className='list-image'>
        <h1>List images</h1>
        <ul>
          {images.map((image, index) => (
            <li className='image-tag' key={index}>
              <a href={`/image/${image.id}`}><img style={{width: '200px'}} src={`http://localhost:8000/static/${image.filename}`} alt={image} /></a>
              <div>
                <p>{image.describle}</p>
              </div>
              {loadingIds.includes(image.id) ? (
                <p>Loading...</p>
              ) :
              (!image.describle && <button className='btn-describle' onClick={() => getDescrible(image.id)}>Get Describle By AI</button>)
              }
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}
