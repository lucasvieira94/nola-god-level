FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1 \ 
    PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", 0.0.0.0:8000]"]