import type { CarouselProps } from "../../types";

export default function Carousel({ images }: CarouselProps) {
  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <a href={img.link}>
              <img
                src={img.src}
                className="d-block w-100 mx-auto rounded"
                alt={`Slide ${img.id}`}
                style={{
                  maxWidth: "90%",
                  maxHeight: "600px",
                }}
              />
            </a>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
