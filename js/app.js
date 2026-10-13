const API_ENDPOINT = "https://4gp706cgwg.execute-api.us-east-1.amazonaws.com/leads";

const form = document.querySelector("#lead-form");
const statusMessage = document.querySelector("#form-status");

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`.trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (name.length < 2) {
    setStatus("Escribe un nombre valido.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    setStatus("Escribe un email valido.", "error");
    return;
  }

  if (!API_ENDPOINT) {
    setStatus("Falta configurar el endpoint de API Gateway en js/app.js.", "error");
    return;
  }

  setStatus("Enviando solicitud...");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "No se pudo enviar el formulario.");
    }

    form.reset();
    setStatus("Solicitud enviada. Revisa DynamoDB y SNS para confirmar.", "ok");
  } catch (error) {
    setStatus(error.message || "Ha ocurrido un error.", "error");
  }
});
