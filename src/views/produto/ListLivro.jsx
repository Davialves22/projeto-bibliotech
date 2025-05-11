import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Modal,
  Table,
  Image,
} from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function ListLivro() {
  const [lista, setLista] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState();

  useEffect(() => {
    carregarLista();
  }, []);

  function confirmaRemover(id) {
    setOpenModal(true);
    setIdRemover(id);
  }

  function carregarLista() {
    axios.get("http://localhost:8080/api/livros").then((response) => {
      setLista(response.data);
    });
  }

  async function remover() {
    try {
      await axios.delete("http://localhost:8080/api/livros/" + idRemover);
      console.log("Livro removido com sucesso.");
      carregarLista();
    } catch (error) {
      console.log("Erro ao remover um livro.");
    }
    setOpenModal(false);
  }

  return (
    <div>
      <MenuSistema tela={"livros"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2>Lista de Livros</h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button
              label="Novo"
              circular
              color="orange"
              icon="book"
              floated="right"
              as={Link}
              to="/form-livro"
            />

            <br />
            <br />
            <br />
            <Table textAlign="center" color="orange" celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Título</Table.HeaderCell>
                  <Table.HeaderCell>ISBN</Table.HeaderCell>
                  <Table.HeaderCell>Data de Publicação</Table.HeaderCell>
                  <Table.HeaderCell>Gênero</Table.HeaderCell>
                  <Table.HeaderCell>Preço (R$)</Table.HeaderCell>
                  <Table.HeaderCell>Autor</Table.HeaderCell>
                  <Table.HeaderCell>Imagem</Table.HeaderCell>
                  <Table.HeaderCell>PDF</Table.HeaderCell>
                  <Table.HeaderCell>Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {lista.map((livro) => (
                  <Table.Row key={livro.id}>
                    <Table.Cell>{livro.id}</Table.Cell>
                    <Table.Cell>{livro.titulo}</Table.Cell>
                    <Table.Cell>{livro.isbn}</Table.Cell>
                    <Table.Cell>{livro.dataPublicacao}</Table.Cell>
                    <Table.Cell>{livro.genero}</Table.Cell>
                    <Table.Cell>{livro.preco}</Table.Cell>
                    <Table.Cell>{livro.autor?.nome}</Table.Cell>
                    <Table.Cell>
                      {livro.imagem && (
                        <Image
                          src={`http://localhost:8080/api/livros/${livro.id}/imagem`}
                          size="tiny"
                          rounded
                        />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {livro.pdf && (
                        <a
                          href={`http://localhost:8080/api/livros/${livro.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon name="file pdf" color="red" />
                        </a>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Button circular color="green" icon>
                        <Link
                          to="/form-livro"
                          state={{ id: livro.id }}
                          style={{ color: "white" }}
                        >
                          <Icon name="edit" />
                        </Link>
                      </Button>
                      &nbsp;
                      <Button
                        circular
                        color="red"
                        icon
                        onClick={() => confirmaRemover(livro.id)}
                      >
                        <Icon name="trash" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Container>
      </div>

      <Modal
        basic
        onClose={() => setOpenModal(false)}
        open={openModal}
        size="small"
      >
        <Header icon>
          <Icon name="trash" />
          Tem certeza que deseja remover esse livro?
        </Header>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => setOpenModal(false)}
          >
            <Icon name="remove" /> Não
          </Button>
          <Button color="green" inverted onClick={remover}>
            <Icon name="checkmark" /> Sim
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
