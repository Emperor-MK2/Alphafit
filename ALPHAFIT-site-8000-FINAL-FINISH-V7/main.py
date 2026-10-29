from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# ВСТАВЬ СЮДА ПОЛНЫЙ URL ИЗ EspoCRM → Administration → Lead Capture.
# Не публикуй этот URL: он содержит секретный ключ.
ESPOCRM_LEAD_CAPTURE_URL = (
    "http://localhost:8080/api/v1/LeadCapture/81a4648976ebc9083d2f6f65f2f4eeb2"
)


@app.post("/api/lead")
async def create_lead(
    name: str = Form(...),
    phone: str = Form(...),
    message: str = Form(""),
):
    print("Новая заявка:", name, phone, message)

    # Разделяем полное имя на имя и фамилию.
    parts = name.strip().split(maxsplit=1)
    first_name = parts[0] if parts else ""
    last_name = parts[1] if len(parts) > 1 else ""

    # Убираем пробелы и скобки из телефона.
    # Знак + сохраняем, если он был введён.
    phone_clean = "".join(
        ch for ch in phone.strip()
        if ch.isdigit() or ch == "+"
    )

    payload = {
        "firstName": first_name,
        "lastName": last_name,
        "phoneNumber": phone_clean,
        "description": message.strip(),
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                ESPOCRM_LEAD_CAPTURE_URL,
                json=payload,
            )

        if response.is_success:
            print("EspoCRM приняла заявку. HTTP:", response.status_code)
            return {"status": "ok", "message": "Заявка принята"}

        # В консоль выводим ответ CRM, чтобы было понятно, что исправлять.
        print("Ошибка EspoCRM:", response.status_code)
        print("Ответ EspoCRM:", response.text)
        return {
            "status": "error",
            "message": "CRM не приняла заявку",
            "crm_status": response.status_code,
        }

    except httpx.RequestError as exc:
        print("Не удалось связаться с EspoCRM:", str(exc))
        return {
            "status": "error",
            "message": "Не удалось связаться с CRM",
        }