import api from "../Api";

class ChatService {
  async getAll() {
    return await api.get("WeatherForecast");
  }
}

export default new ChatService();
