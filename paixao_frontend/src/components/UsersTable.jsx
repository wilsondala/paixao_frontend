import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import styles from "./UsersTable.module.css";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const [total, setTotal] = useState(0);
  const limit = 20;
  const [page, setPage] = useState(0);
  const skip = useMemo(() => page * limit, [page]);

  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadUsers({ resetPage = false } = {}) {
    try {
      setLoading(true);
      setMsg(null);

      const finalSkip = resetPage ? 0 : skip;
      const params = new URLSearchParams();
      params.set("skip", String(finalSkip));
      params.set("limit", String(limit));
      if (q) params.set("q", q);

      const { data } = await api.get(`/admin/users?${params.toString()}`);

      // ✅ novo formato: { total, items }
      setUsers(data.items || []);
      setTotal(data.total || 0);

      if (resetPage) setPage(0);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
      setMsg("Não foi possível carregar usuários. Verifique se você está logado como admin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function formatPhone(phone) {
    if (!phone) return "—";
    const digits = String(phone).replace(/\D/g, "");
    if (digits.length < 10) return digits;
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return digits.replace(/(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  }

  function normalizeRole(role) {
    // garante que role fique no padrão do backend (minúsculo)
    return String(role || "").trim().toLowerCase();
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este usuário?")) return;

    try {
      setMsg(null);
      await api.delete(`/admin/users/${id}`);
      setMsg("Usuário excluído com sucesso.");
      await loadUsers();
    } catch (err) {
      console.error(err);
      setMsg("Falha ao excluir usuário.");
    }
  }

  async function handleToggleActive(user) {
    try {
      setMsg(null);

      if (user.is_active) {
        await api.patch(`/admin/users/${user.id}/deactivate`);
        setMsg("Usuário desativado.");
      } else {
        await api.patch(`/admin/users/${user.id}/activate`);
        setMsg("Usuário ativado.");
      }

      await loadUsers();
    } catch (err) {
      console.error(err);
      setMsg("Falha ao alterar status do usuário.");
    }
  }

  async function handleSaveEdit() {
    if (!editingUser) return;

    try {
      setSaving(true);
      setMsg(null);

      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone || null,
        role: normalizeRole(editingUser.role),
      };

      await api.put(`/admin/users/${editingUser.id}`, payload);
      setEditingUser(null);
      setMsg("Usuário atualizado com sucesso.");
      await loadUsers();
    } catch (err) {
      console.error(err);
      setMsg("Falha ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className={styles.container}>
      {/* Busca */}
      <div className={styles.topbar}>
        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            placeholder="Buscar por nome ou e-mail..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className={styles.searchBtn}
            onClick={() => loadUsers({ resetPage: true })}
            disabled={loading}
            type="button"
          >
            Buscar
          </button>
        </div>
      </div>

      {msg && <div className={styles.msg}>{msg}</div>}

      {loading ? (
        <p className={styles.loading}>Carregando usuários...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Role</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.empty}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const role = normalizeRole(u.role);

                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td className={styles.email}>{u.email}</td>
                      <td>{formatPhone(u.phone)}</td>

                      <td>
                        <span className={u.is_active ? styles.active : styles.inactive}>
                          {u.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td>
                        <span className={role === "admin" ? styles.admin : styles.customer}>
                          {role}
                        </span>
                      </td>

                      <td className={styles.actions}>
                        <button className={styles.btn} onClick={() => setEditingUser({ ...u, role })} type="button">
                          Editar
                        </button>

                        <button className={styles.btn} onClick={() => handleToggleActive(u)} type="button">
                          {u.is_active ? "Desativar" : "Ativar"}
                        </button>

                        <button className={`${styles.btn} ${styles.delete}`} onClick={() => handleDelete(u.id)} type="button">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
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

      {/* Modal de Edição */}
      {editingUser && (
        <div className={styles.modal} onClick={() => setEditingUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Editar Usuário</h3>

            <label className={styles.label}>Nome</label>
            <input
              className={styles.modalInput}
              type="text"
              value={editingUser.name || ""}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />

            <label className={styles.label}>E-mail</label>
            <input
              className={styles.modalInput}
              type="email"
              value={editingUser.email || ""}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />

            <label className={styles.label}>Telefone</label>
            <input
              className={styles.modalInput}
              type="text"
              value={editingUser.phone || ""}
              placeholder="Ex: 11999999999"
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <label className={styles.label}>Role</label>
            <select
              className={styles.modalSelect}
              value={normalizeRole(editingUser.role)}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="customer">customer</option>
              <option value="admin">admin</option>
            </select>

            <div className={styles.modalButtons}>
              <button className={styles.primaryBtn} onClick={handleSaveEdit} disabled={saving} type="button">
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button className={styles.secondaryBtn} onClick={() => setEditingUser(null)} type="button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}