import { environment as productionEnvironment } from "./environment.prod.js";

const localEnvironment = {
  production: false,
  apiBaseUrl: "http://localhost:8080",
  googleClientId:
    "334608535320-g2i7n6l0llr6e5004lla02vl3cmji7t2.apps.googleusercontent.com",
};

export const environment = import.meta.env.PROD
  ? productionEnvironment
  : localEnvironment;
