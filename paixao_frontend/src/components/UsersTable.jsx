import { useEffect, useState } from "react";
import api from "../api/api";
import styles from "./UsersTable.module.css";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await api.get("/admin/users")

      setUsers(response.data.data)   // <- aqui está o ponto
      setTotal(response.data.total)  // se você usa paginação

    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function formatPhone(phone) {
    if (!phone) return "—";
    return phone.replace(
      /(\d{2})(\d{5})(\d{4})/,
      "($1) $2-$3"
    );
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este usuário?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
  }

  async function handleToggleActive(user) {
    await api.patch(`/admin/users/${user.id}/toggle`);
    loadUsers();
  }

  async function handleSaveEdit() {
    await api.put(`/admin/users/${editingUser.id}`, editingUser);
    setEditingUser(null);
    loadUsers();
  }

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className={styles.container}>
      <h2>Lista de Usuários</h2>

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
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{formatPhone(u.phone)}</td>

              <td>
                <span className={u.is_active ? styles.active : styles.inactive}>
                  {u.is_active ? "Ativo" : "Inativo"}
                </span>
              </td>

              <td>
                <span
                  className={
                    u.role === "ADMIN"
                      ? styles.admin
                      : styles.customer
                  }
                >
                  {u.role}
                </span>
              </td>

              <td className={styles.actions}>
                <button onClick={() => setEditingUser(u)}>
                  Editar
                </button>

                <button onClick={() => handleToggleActive(u)}>
                  {u.is_active ? "Desativar" : "Ativar"}
                </button>

                <button
                  className={styles.delete}
                  onClick={() => handleDelete(u.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Edição */}
      {editingUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Editar Usuário</h3>

            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />

            <input
              type="text"
              value={editingUser.phone || ""}
              placeholder="Telefone"
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>

            <div className={styles.modalButtons}>
              <button onClick={handleSaveEdit}>Salvar</button>
              <button onClick={() => setEditingUser(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
