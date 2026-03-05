import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";
import styles from "./Footer.module.css";

import TermsModal from "./TermsModal";
import InfoModal from "./InfoModal";

export default function Footer() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <footer className={styles.footer}>
      {/* faixa links */}
      <div className={styles.linksBar}>
        <div className={styles.linksInner}>
          {/* ✅ Modais */}
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setShippingOpen(true)}
          >
            Envios
          </button>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setPaymentOpen(true)}
          >
            Pagamento
          </button>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setReturnsOpen(true)}
          >
            Trocas e Devoluções
          </button>

          {/* Links normais */}
          <Link to="/sobre-nos">Sobre Nós</Link>
          <Link to="/products">Produtos</Link>

          {/* ✅ Modais */}
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setPrivacyOpen(true)}
          >
            Privacidade
          </button>

          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setTermsOpen(true)}
          >
            Termo de Compra
          </button>
        </div>
      </div>

      {/* bloco principal */}
      <div className={styles.main}>
        <div className={styles.container}>
          {/* EMPRESA */}
          <div className={styles.column}>
            <h3>Paixão Angola</h3>
            <p>
              Experiência premium do início ao fim: qualidade, confiança e entrega
              segura.
            </p>

            <div className={styles.miniBadgeRow}>
              <span className={styles.miniBadge}>Entrega segura</span>
              <span className={styles.miniBadge}>Qualidade premium</span>
              <span className={styles.miniBadge}>Compra protegida</span>
            </div>
          </div>

          {/* CONTATO */}
          <div className={styles.column}>
            <h4>Contato</h4>

            <div className={styles.iconItem}>
              <Mail size={18} />
              <span>contato@paixaoangola.com</span>
            </div>

            <div className={styles.iconItem}>
              <Phone size={18} />
              <span>+244 912 345 678</span>
            </div>
          </div>

          {/* SOCIAL */}
          <div className={styles.column}>
            <h4>Redes Sociais</h4>

            <div className={styles.socials}>
              <a
                href="https://instagram.com/paixao.angola2024"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.notice}>
          ⏱ Atendimento online (WhatsApp/Instagram) • Seg–Sex 10:00 às 16:00
        </div>

        <div className={styles.bottom}>
          © {new Date().getFullYear()} Paixão Angola. Todos os direitos reservados.
        </div>
      </div>

      {/* ✅ Termo de Compra */}
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* ✅ Privacidade */}
      <InfoModal
        open={privacyOpen}
        title="Política de Privacidade"
        subtitle="Paixão Angola — Como usamos e protegemos seus dados"
        onClose={() => setPrivacyOpen(false)}
      >
        <h3>1. Dados coletados</h3>
        <ul>
          <li>Dados de cadastro e compra: nome, e-mail, telefone, endereço e informações do pedido.</li>
          <li>Dados de navegação: páginas acessadas, dispositivo e cookies (quando aplicável).</li>
        </ul>

        <h3>2. Finalidade</h3>
        <ul>
          <li>Processar pedidos, pagamentos, entrega e suporte.</li>
          <li>Prevenir fraudes e melhorar sua experiência no site.</li>
          <li>Enviar comunicações (ex: promoções) quando você autorizar.</li>
        </ul>

        <h3>3. Compartilhamento</h3>
        <p>
          Podemos compartilhar dados com parceiros estritamente necessários para operar a loja
          (pagamentos, transportadoras e atendimento), sempre com medidas de segurança.
        </p>

        <h3>4. Segurança</h3>
        <p>
          Adotamos práticas de segurança para proteger seus dados, porém nenhum sistema é 100% inviolável.
        </p>

        <h3>5. Seus direitos</h3>
        <ul>
          <li>Solicitar acesso, correção ou exclusão dos seus dados (quando aplicável).</li>
          <li>Cancelar comunicações promocionais a qualquer momento.</li>
        </ul>

        <h3>6. Contato</h3>
        <p>Em caso de dúvidas, fale conosco pelo e-mail: contato@paixaoangola.com</p>
      </InfoModal>

      {/* ✅ Trocas e Devoluções */}
      <InfoModal
        open={returnsOpen}
        title="Trocas e Devoluções"
        subtitle="Paixão Angola — Regras e prazos"
        onClose={() => setReturnsOpen(false)}
      >
        <h3>1. Como solicitar</h3>
        <ul>
          <li>Entre em contato informando número do pedido.</li>
          <li>Envie fotos/vídeo quando houver defeito/avaria para análise.</li>
        </ul>

        <h3>2. Condições</h3>
        <ul>
          <li>Produto sem sinais de uso, com embalagem original e itens completos (quando aplicável).</li>
          <li>Itens com mau uso podem ser recusados.</li>
        </ul>

        <h3>3. Reembolso / troca</h3>
        <ul>
          <li>Após aprovação, o reembolso segue o método de pagamento e prazos operacionais.</li>
          <li>Em trocas, o envio do novo item depende de disponibilidade em estoque.</li>
        </ul>

        <h3>4. Endereço e reenvio</h3>
        <p>
          Endereço incorreto pode gerar custos adicionais de reenvio. Confirme seus dados antes de finalizar a compra.
        </p>
      </InfoModal>

      {/* ✅ Envios */}
      <InfoModal
        open={shippingOpen}
        title="Envios"
        subtitle="Paixão Angola — Entrega e prazos"
        onClose={() => setShippingOpen(false)}
      >
        <h3>1. Prazos</h3>
        <ul>
          <li>O prazo é estimado e pode variar por região, disponibilidade e logística.</li>
          <li>Datas promocionais podem impactar o tempo de separação/expedição.</li>
        </ul>

        <h3>2. Endereço</h3>
        <ul>
          <li>Confira o endereço antes de finalizar. Informações incorretas podem gerar atraso e reenvio.</li>
          <li>É necessário ter alguém para receber no local informado.</li>
        </ul>

        <h3>3. Acompanhamento</h3>
        <p>
          Quando disponível, o código de rastreio será enviado para o seu e-mail/contato cadastrado.
        </p>

        <h3>4. Tentativas de entrega</h3>
        <p>
          Caso não haja ninguém para receber, podem ocorrer novas tentativas ou devolução, conforme a transportadora.
        </p>
      </InfoModal>

      {/* ✅ Pagamento */}
      <InfoModal
        open={paymentOpen}
        title="Pagamento"
        subtitle="Paixão Angola — Métodos e confirmação"
        onClose={() => setPaymentOpen(false)}
      >
        <h3>1. Métodos</h3>
        <p>
          Os métodos disponíveis são exibidos no checkout. Alguns podem variar conforme região e disponibilidade do provedor.
        </p>

        <h3>2. Confirmação</h3>
        <ul>
          <li>O pedido é confirmado após aprovação do pagamento (quando aplicável).</li>
          <li>Em pagamentos pendentes, o pedido pode ficar “aguardando confirmação”.</li>
        </ul>

        <h3>3. Segurança</h3>
        <p>
          Para sua segurança, alguns pedidos podem passar por verificação antifraude antes de serem enviados.
        </p>

        <h3>4. Estorno</h3>
        <p>
          Estornos/reembolsos seguem o método de pagamento e prazos operacionais do provedor/banco.
        </p>
      </InfoModal>
    </footer>
  );
}