from fastapi_mail import FastMail, MessageSchema 
from fastapi import BackgroundTasks

# Assuming you have set up FastAPI Mail configuration somewhere in your project
async def send_email_notification(recipients: list[str], subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype="html"
    )

    # Send email asynchronously
    fm = FastMail(your_email_config)
    await fm.send_message(message)
