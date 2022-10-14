import { useEffect, useState } from "react";
import ChatService from "../Services/ChatService";

export const ListWeatherForecast = () => {
  const serviceChat = ChatService;

  const [weatherForecasts, setWeatherForecasts] = useState([]);

  useEffect(() => {
    serviceChat
      .getAll()
      .then(({ data }) => {
        console.log(data);
        if (data != null && data != undefined) setWeatherForecasts(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div>ListWeatherForecast</div>
      {weatherForecasts.map((item, index) => {
        return (
          <div key={index}>
            <div>date: {item.date}</div>
            <div>temperatureC: {item.temperatureC}</div>
            <div>{item.temperatureF}</div>
            <div>{item.summary}</div>
          </div>
        );
      })}
    </>
  );
};
