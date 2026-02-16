import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import styles from "./ProductsAdmin.module.css";


export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Produtos Cadastrados</h2>
        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/create-product")}
        >
          + Novo Produto
        </button>
      </div>

      <div className={styles.tableWrapper}>
        {products.length === 0 ? (
          <div className={styles.empty}>Nenhum produto cadastrado.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>R$ {product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() =>
                          navigate(`/admin/edit-product/${product.id}`)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(product.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
