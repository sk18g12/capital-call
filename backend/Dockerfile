FROM python:3.7
ADD . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD python db.py
CMD python app.py