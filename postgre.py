import os
import psycopg2

DATABASE_URL = 'postgres://bteurqgnjifirr:8141b84bb364c480b8ab64f567d7b24b735e21e3cd285dcc210fbecf7d7195d3@ec2-176-34-211-0.eu-west-1.compute.amazonaws.com:5432/d4l04oh9cth6jn'

conn = psycopg2.connect(DATABASE_URL, sslmode='require')

cursor = conn.cursor()

file = open('clients.csv')
clients = file.read().split(',')
for client in clients:
    sql_client = client.strip()
    cursor.execute("INSERT INTO BIZ(biz_name) VALUES({})".format('\''+sql_client+'\''))

  

# cursor.fetchone()
  
conn.commit()
cursor.close()
conn.close()