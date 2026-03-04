import { useState } from "react";
import styles from "./ProductReview.module.css";

export default function ProductReview({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!rating) {
      alert("Selecione uma avaliação em estrelas");
      return;
    }

    onSubmit({
      rating,
      comment,
    });

    setRating(0);
    setComment("");
  };

  return (
    <div className={styles.reviewBox}>
      <h3>Deixe sua avaliação</h3>

      {/* ⭐ ESTRELAS */}
      <div className={styles.stars}>
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            className={star <= (hover || rating) ? styles.active : ""}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>

      {/* 💬 COMENTÁRIO */}
      <textarea
        placeholder="Conte sua experiência com este produto..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Enviar Avaliação
      </button>
    </div>
  );
}