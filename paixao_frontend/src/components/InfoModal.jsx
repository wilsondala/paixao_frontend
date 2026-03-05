import { useEffect } from "react";
import styles from "./InfoModal.module.css";

export default function InfoModal({ open, title, subtitle, children, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onMouseDown={onClose} role="presentation">
      <div className={styles.card} onMouseDown={stop} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>

          <button className={styles.closeIcon} onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className={styles.content}>{children}</div>

        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}