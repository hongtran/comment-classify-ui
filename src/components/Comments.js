
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Comment({image}) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };
    const handleSubmit = async () => {
        setLoading(true);
        const commentPayload = {
            content: input,
            image_id: image.id
        };
        try {
            const response = await axios.post('http://localhost:8000/comments/', { ...commentPayload });
            // update comments
            setComments([...comments, response.data]);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };
    // list of comments
    const [comments, setComments] = useState([]);
    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/comments/${image.id}`);
            setInput('');
            setComments(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        // checl if image.id is available
        if (image.id)
            fetchComments();
    }, [image.id]);


    return (
        <div className='comment'>
            <h2>Add your comment</h2>
            <div className='form'>
                <input type="text" value={input} onChange={handleInputChange} />
                <button onClick={handleSubmit} disabled={loading}>Submit</button>
            </div>
            {comments.map((comment, index) => (
                <div key={index} className='comment-item'>
                    <p>{comment.content}</p>
                    {comment.classify && <span className='tag'>{comment.classify}</span>}
                </div>
            ))}
        </div>
    );
}

export default Comment;
