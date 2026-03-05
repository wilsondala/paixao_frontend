import { useEffect, useRef } from "react";
import styles from "./TermsModal.module.css";

export default function TermsModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    // trava scroll do body
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
      <div className={styles.card} onMouseDown={stop} ref={dialogRef} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Termo de Compra</h2>
            <p className={styles.subtitle}>Paixão Angola — Condições Gerais</p>
          </div>

          <button className={styles.closeIcon} onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3>1. Objetivo</h3>
            <p>
              Este Termo estabelece as condições de compra de produtos vendidos pela Paixão Angola (“Loja”),
              incluindo pedidos, pagamentos, entregas, trocas, devoluções e suporte.
            </p>
          </section>

          <section className={styles.section}>
            <h3>2. Cadastro e conta</h3>
            <ul>
              <li>Ao comprar, você pode criar uma conta ou finalizar como visitante (se disponível).</li>
              <li>Você é responsável pela veracidade dos dados informados (nome, contacto, endereço e e-mail).</li>
              <li>A Loja pode bloquear pedidos em caso de suspeita de fraude ou dados inconsistentes.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>3. Produtos e disponibilidade</h3>
            <ul>
              <li>As imagens são ilustrativas. Podem existir variações de cor/embalagem conforme lote e fornecedor.</li>
              <li>Os preços e estoque podem ser alterados sem aviso prévio, respeitando o pedido já confirmado.</li>
              <li>Se um item ficar indisponível após a compra, a Loja poderá oferecer: troca por item similar ou reembolso.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>4. Preços e pagamento</h3>
            <ul>
              <li>Os valores exibidos no site seguem a moeda e a política informada na plataforma.</li>
              <li>O pedido é confirmado após aprovação do pagamento (quando aplicável).</li>
              <li>Em caso de estorno/chargeback, a Loja poderá suspender o envio e abrir verificação do pedido.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>5. Entrega</h3>
            <ul>
              <li>O prazo de entrega é estimado e pode variar por região, disponibilidade e logística.</li>
              <li>O cliente deve garantir que haverá alguém para receber no endereço informado.</li>
              <li>Endereço incorreto/incompleto pode gerar atraso e custos adicionais de reenvio.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>6. Trocas e devoluções</h3>
            <ul>
              <li>Solicitações devem ser feitas dentro do prazo informado na página “Trocas e Devoluções”.</li>
              <li>Produtos com sinais de uso, sem embalagem original ou com avarias por mau uso podem ser recusados.</li>
              <li>Em caso de defeito, a Loja poderá solicitar fotos/vídeo para análise antes de aprovar a troca.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>7. Cancelamento e reembolso</h3>
            <ul>
              <li>Pedidos podem ser cancelados antes do envio. Após o envio, seguem as regras de devolução.</li>
              <li>Reembolsos são processados conforme o método de pagamento e prazos operacionais.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>8. Atendimento e suporte</h3>
            <p>
              Atendimento online via WhatsApp/Instagram/E-mail, conforme horários informados no rodapé do site.
            </p>
          </section>

          <section className={styles.section}>
            <h3>9. Privacidade</h3>
            <p>
              Os dados fornecidos são usados para processar pedidos, entrega e suporte, conforme a página de Privacidade.
            </p>
          </section>

          <section className={styles.section}>
            <h3>10. Disposições finais</h3>
            <ul>
              <li>Ao concluir uma compra, você declara que leu e concorda com estes Termos.</li>
              <li>A Loja pode atualizar estes Termos. A versão vigente é a publicada no site.</li>
            </ul>
          </section>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}