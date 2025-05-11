import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Icon,
  Segment,
  Header,
  Image,
  Embed,
} from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormLivro = ({ livroId }) => {
  const [titulo, setTitulo] = useState("");
  const [isbn, setIsbn] = useState("");
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [genero, setGenero] = useState("");
  const [preco, setPreco] = useState("");
  const [autorId, setAutorId] = useState("");
  const [autores, setAutores] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/autor")
      .then((response) => {
        setAutores(
          response.data.map((autor) => ({
            key: autor.id,
            value: autor.id,
            text: autor.nome,
          }))
        );
      })
      .catch((error) => console.error("Erro ao carregar autores", error));

    if (livroId) {
      axios
        .get(`http://localhost:8080/api/livros/${livroId}`)
        .then((response) => {
          const livro = response.data;
          setTitulo(livro.titulo);
          setIsbn(livro.isbn);
          setDataPublicacao(livro.dataPublicacao);
          setGenero(livro.genero);
          setPreco(livro.preco);
          setAutorId(livro.autor.id);

          // Previews se imagem/pdf existirem
          if (livro.temImagem) {
            setImagemPreview(
              `http://localhost:8080/api/livros/${livroId}/imagem`
            );
          }
          if (livro.temPdf) {
            setPdfPreview(`http://localhost:8080/api/livros/${livroId}/pdf`);
          }
        })
        .catch((error) => console.error("Erro ao carregar livro", error));
    }
  }, [livroId]);

  const salvar = () => {
    const formData = new FormData();
    formData.append("isbn", isbn);
    formData.append("titulo", titulo);
    formData.append("dataPublicacao", dataPublicacao);
    formData.append("genero", genero);
    formData.append("preco", preco);
    formData.append("autorId", autorId);

    if (imagem) formData.append("imagem", imagem);
    if (pdf) formData.append("pdf", pdf);

    const url = livroId
      ? `http://localhost:8080/api/livros/${livroId}`
      : "http://localhost:8080/api/livros/cadastrar";

    const method = livroId ? axios.put : axios.post;

    method(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        navigate("/livros");
      })
      .catch((error) => console.error("Erro ao salvar livro", error));
  };

  return (
    <Container style={{ marginTop: "2em" }}>
      <Segment padded="very">
        <Header as="h2" icon textAlign="center">
          <Icon name="book" />
          {livroId ? "Editar Livro" : "Cadastrar Novo Livro"}
        </Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <Form.Input
              label="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Data de Publicação"
              type="date"
              value={dataPublicacao}
              onChange={(e) => setDataPublicacao(e.target.value)}
              required
            />
            <Form.Input
              label="Preço"
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Select
            label="Gênero"
            options={[
              { key: "FICCAO", text: "Ficção", value: "FICCAO" },
              { key: "ROMANCE", text: "Romance", value: "ROMANCE" },
              { key: "DRAMA", text: "Drama", value: "DRAMA" },
              { key: "COMEDIA", text: "Comédia", value: "COMEDIA" },
              { key: "TERROR", text: "Terror", value: "TERROR" },
              {
                key: "DOCUMENTARIO",
                text: "Documentário",
                value: "DOCUMENTARIO",
              },
              { key: "BIOGRAFIA", text: "Biografia", value: "BIOGRAFIA" },
            ]}
            value={genero}
            onChange={(e, { value }) => setGenero(value)}
            required
          />
          <Form.Select
            label="Autor"
            options={autores}
            value={autorId}
            onChange={(e, { value }) => setAutorId(value)}
            required
          />
          <Form.Input
            label="Imagem do Livro"
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
          />
          {imagemPreview && (
            <Segment>
              <Header size="tiny">Imagem Atual:</Header>
              <Image src={imagemPreview} size="small" bordered />
            </Segment>
          )}
          <Form.Input
            label="Arquivo PDF"
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
          {pdfPreview && (
            <Segment>
              <Header size="tiny">PDF Atual:</Header>
              <a href={pdfPreview} target="_blank" rel="noopener noreferrer">
                Visualizar PDF
              </a>
            </Segment>
          )}
          <Button color="blue" icon labelPosition="left" onClick={salvar}>
            <Icon name="save" />
            {livroId ? "Salvar Alterações" : "Cadastrar Livro"}
          </Button>
          <Button
            icon
            labelPosition="left"
            onClick={() => navigate("/list-livro")}
            style={{ marginLeft: "1em" }}
          >
            <Icon name="arrow left" />
            Voltar
          </Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default FormLivro;
