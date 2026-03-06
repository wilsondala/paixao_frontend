import { useEffect, useMemo, useState } from "react";
import styles from "./AdminNewsletter.module.css";
import {
  getNewsletterStats,
  listNewsletterSubscribers,
} from "../services/newsletterAdminService";
import api from "../api/api";

export default function AdminNewsletter() {
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // ✅ CAMPANHA
  const [campSubject, setCampSubject] = useState("🔥 Novidades Paixão Angola");
  const [campTitle, setCampTitle] = useState("Lançamentos e Promoções");
  const [campMessage, setCampMessage] = useState("");
  const [campUrl, setCampUrl] = useState("");
  const [campCta, setCampCta] = useState("Ver produtos");
  const [sending, setSending] = useState(false);

  const limit = 50;
  const [page, setPage] = useState(0);
  const offset = useMemo(() => page * limit, [page, limit]);

  const load = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const s = await getNewsletterStats();
      setTotal(s?.total || 0);

      const res = await listNewsletterSubscribers({ q, limit, offset });
      setItems(res?.items || []);
    } catch (e) {
      setMsg(
        "Não foi possível carregar a newsletter. Verifique se você está logado como admin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = async (e) => {
    e.preventDefault();
    setPage(0);
    await load();
  };

  const downloadCsv = async () => {
    setMsg(null);

    try {
      const token = localStorage.getItem("token");

      // api.defaults.baseURL já é .../api/v1
      const res = await fetch(
        `${api.defaults.baseURL}/admin/newsletter/export.csv`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error("download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "newsletter_subscribers.csv";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      setMsg("Falha ao exportar CSV.");
    }
  };

  // ✅ ENVIAR CAMPANHA (para todos)
  const sendCampaign = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!campSubject.trim() || !campTitle.trim() || !campMessage.trim()) {
      setMsg("Preencha assunto, título e mensagem da campanha.");
      return;
    }

    setSending(true);

    try {
      const { data } = await api.post("/admin/newsletter/campaign", {
        subject: campSubject.trim(),
        title: campTitle.trim(),
        message: campMessage.trim(),
        cta_text: (campCta || "").trim() || "Ver produtos",
        cta_url: (campUrl || "").trim() || null,
      });

      setMsg(data?.message || "Campanha colocada na fila com sucesso!");
      setCampMessage("");
      setCampUrl("");
    } catch (err) {
      setMsg(
        err?.response?.data?.detail ||
          "Falha ao enviar campanha. Confirme se você está logado como admin."
      );
    } finally {
      setSending(false);
    }
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Newsletter</h1>
          <p className={styles.subtitle}>
            Total de inscritos: <b>{total}</b>
          </p>
        </div>

        <button
          className={styles.exportBtn}
          onClick={downloadCsv}
          disabled={loading}
          type="button"
        >
          Exportar CSV
        </button>
      </div>

      {/* ✅ NOVA ÁREA: ENVIAR CAMPANHA */}
      <div className={styles.campaignCard}>
        <h2 className={styles.campaignTitle}>Enviar campanha para inscritos</h2>

        <form className={styles.campaignForm} onSubmit={sendCampaign}>
          <input
            className={styles.input}
            value={campSubject}
            onChange={(e) => setCampSubject(e.target.value)}
            placeholder="Assunto do e-mail"
          />

          <input
            className={styles.input}
            value={campTitle}
            onChange={(e) => setCampTitle(e.target.value)}
            placeholder="Título no e-mail"
          />

          <textarea
            className={styles.textarea}
            value={campMessage}
            onChange={(e) => setCampMessage(e.target.value)}
            placeholder="Mensagem (ex: promoção, lançamento, novidades...)"
            rows={5}
          />

          <div className={styles.row2}>
            <input
              className={styles.input}
              value={campCta}
              onChange={(e) => setCampCta(e.target.value)}
              placeholder="Texto do botão (opcional)"
            />
            <input
              className={styles.input}
              value={campUrl}
              onChange={(e) => setCampUrl(e.target.value)}
              placeholder="Link do botão (opcional)"
            />
          </div>

          <button
            className={styles.sendBtn}
            disabled={sending || loading}
            type="submit"
          >
            {sending ? "ENVIANDO..." : "ENVIAR CAMPANHA"}
          </button>
        </form>
      </div>

      {/* ✅ BUSCA */}
      <form className={styles.search} onSubmit={onSearch}>
        <input
          className={styles.input}
          placeholder="Buscar por nome ou e-mail..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={styles.btn} disabled={loading} type="submit">
          {loading ? "Carregando..." : "Buscar"}
        </button>
      </form>

      {msg && <div className={styles.msg}>{msg}</div>}

      {/* ✅ TABELA */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="3" className={styles.empty}>
                  {loading ? "Carregando..." : "Nenhum inscrito encontrado."}
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id}>
                  <td>{r.name || "—"}</td>
                  <td className={styles.email}>{r.email}</td>
                  <td>
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ PAGINAÇÃO */}
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || loading}
          type="button"
        >
          Anterior
        </button>

        <span className={styles.pageInfo}>
          Página <b>{page + 1}</b> de <b>{pages}</b>
        </span>

        <button
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
          disabled={page + 1 >= pages || loading}
          type="button"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}