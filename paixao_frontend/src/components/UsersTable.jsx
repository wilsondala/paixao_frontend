import { useEffect, useState } from "react";
import api from "../api/api";
import styles from "./UsersTable.module.css";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const response = await api.get("/admin/users", {
          params: {
            skip: (page - 1) * limit,
            limit,
          },
        });

        let filtered = response.data;

        // Filtro por Role
        if (roleFilter !== "all") {
          filtered = filtered.filter((u) => u.role === roleFilter);
        }

        // Busca global
        if (search) {
          filtered = filtered.filter(
            (u) =>
              u.name.toLowerCase().includes(search.toLowerCase()) ||
              u.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Ordenação
        filtered.sort((a, b) => {
          const aField = a[sortField].toString().toLowerCase();
          const bField = b[sortField].toString().toLowerCase();
          if (aField < bField) return sortOrder === "asc" ? -1 : 1;
          if (aField > bField) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        setUsers(filtered);
        setTotalUsers(filtered.length);
      } catch (err) {
        console.error("Erro ao carregar usuários", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [page, search, sortField, sortOrder, limit, roleFilter]);

  const totalPages = Math.ceil(totalUsers / limit);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <p className={styles.loading}>Carregando usuários...</p>;

  return (
    <div className={styles.container}>
      <h2>Lista de Usuários</h2>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          className={styles.search}
          type="text"
          placeholder="Buscar por nome ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="ADMIN">ADMIN</option>
          <option value="customer">CUSTOMER</option>
        </select>
        <select
          className={styles.select}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>

      {/* Tabela */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("name")}>
              Nome {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("email")}>
              Email {sortField === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("role")}>
              Role {sortField === "role" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={u.role === "ADMIN" ? styles.admin : styles.customer}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Anterior
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
