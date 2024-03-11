// generate image component including image and describle
const Image = ({image}) => {
  return (
    <div className="image-detail">
      <img style={{width: '200px'}} src={`http://localhost:8000/static/${image.filename}`} alt={image.id} />
      <p>{image.describle}</p>
    </div>
  );
};

export default Image;
