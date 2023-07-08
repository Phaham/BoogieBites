import axios from "axios";
import { showAlert } from "./alerts";

export const Contact = async (tourId) => {
  showAlert("success", 'Message sent successfully');
}
