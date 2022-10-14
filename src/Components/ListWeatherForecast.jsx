import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useMemo, useState } from "react";
import ChatService from "../Services/ChatService";

export const ListWeatherForecast = () => {
  const serviceChat = ChatService;

  const [weatherForecasts, setWeatherForecasts] = useState([]);
  const [msgConexion, setMsgConexion] = useState("Desconectado");
  const [mensajes, setMensajes] = useState([]);
  const [nameButton, setNameButton] = useState("Conectar");
  const [usuario, setUsuario] = useState();
  const [usuarioUse, setUsuarioUse] = useState(false);
  const [sendButton, setSendButton] = useState(true);
  const [sala, setSala] = useState("Sala1");
  const [mensaje, setMensaje] = useState("");
  const [counter, setCounter] = useState();

  const conexion = useMemo(
    () =>
      new HubConnectionBuilder()
        .withUrl("https://localhost:7218/chatHub")
        .build(),
    []
  );

  const onChangeTxt = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "usuario") {
      setUsuario(value);
    }
    if (name === "mensaje") {
      setMensaje(value);
    }
    if (name === "sala") {
      setSala(value);
    }
  };

  const enviar = (event) => {
    event.preventDefault();
    if (conexion.state !== HubConnectionState.Connected) {
      return;
    }
    conexion
      .invoke("EnviarMensaje", { usuario, contenido: mensaje, sala })
      .catch(function (error) {
        console.error(error);
      });

    setMensaje("");
  };

  const conectar = (event) => {
    event.preventDefault();
    if (conexion.state === HubConnectionState.Disconnected) {
      conexion
        .start()
        .then(() => {
          setMsgConexion("Conectado");
          setNameButton("Desconectar");
          setUsuarioUse(true);
          setSendButton(false);
          conexion
            .invoke("EnviarMensaje", { usuario, contenido: "", sala })
            .catch(function (error) {
              console.error(error);
            });

          conexion.stream("Counter").subscribe({
            next: (item) => {
              setCounter(item);
            },
            complete: (item) => {
              setCounter("Se termino el tiempo");
            },
            error: (error) => {
              console.error(error);
            },
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    } else if (conexion.state === HubConnectionState.Connected) {
      conexion.stop();
      setMsgConexion("Desconectado");
      setNameButton("Conectar");
      setUsuarioUse(false);
    }
  };

  useEffect(() => {
    let msg = [];
    conexion.on("RecibirMensaje", (mensaje) => {
      var mensajeF = mensaje.usuario + "-" + mensaje.contenido;
      msg.push(mensajeF);
      setMensajes([...msg]);
    });
  }, []);

  useEffect(() => {
    serviceChat
      .getAll()
      .then(({ data }) => {
        console.log(data);
        // if (data != null && data != undefined) setWeatherForecasts(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">{msgConexion}</div>
        <div className="row">
          <label className="col-2">Sala</label>
          <select
            className="col-4"
            id="sala"
            name="sala"
            value={sala}
            onChange={onChangeTxt}
          >
            <option value="Sala1">Sala1</option>
            <option value="Sala2">Sala2</option>
            <option value="Sala3">Sala3</option>
          </select>
        </div>
        <div className="row">
          <label className="col-2">Usuario</label>
          <input
            className="col-4"
            type="text"
            id="txtUsuario"
            name="usuario"
            value={usuario}
            onChange={onChangeTxt}
            disabled={usuarioUse}
          />
        </div>
        <div className="row">
          <label className="col-2">Mensaje</label>
          <input
            className="col-4"
            type="text"
            id="txtMensaje"
            name="mensaje"
            value={mensaje}
            onChange={onChangeTxt}
          />
        </div>
        <div className="row">
          <input
            type="button"
            id="btnConectar"
            value={nameButton}
            onClick={conectar}
          />
        </div>
        <div className="row">
          <input
            type="button"
            id="btnEnviar"
            value="Enviar"
            onClick={enviar}
            disabled={sendButton}
          />
        </div>
        <div className="row">
          Tiempo en Chat:
          <label id="lblDuracion"> {counter} </label>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <hr />
        </div>
      </div>
      <div className="row">
        <ul id="lstMensajes">
          {mensajes !== undefined
            ? mensajes.map((msg, index) => {
                return <li key={index + msg}> {msg} </li>;
              })
            : null}
        </ul>
      </div>
      <div>ListWeatherForecast</div>
      {weatherForecasts.map((item, index) => {
        return (
          <div key={index}>
            date: {item.date}
            temperatureC: {item.temperatureC}
            {item.temperatureF}
            {item.summary}
          </div>
        );
      })}
    </>
  );
};
