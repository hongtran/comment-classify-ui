import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from '../components/Image';
import Comments from '../components/Comments';

function ImagePage() {
    let { id } = useParams();
    // load image by id
    const [image, setImage] = useState({});
    const fetchImage = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/images/${id}`);
            setImage(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchImage();
    }, [id]);
  return (
    <div className='image-page'>
        <h2>Comments with classify tag</h2>
        <Image image={image} />
        {image && <Comments image={image} />}
    </div>
  )
}

export default ImagePage;
