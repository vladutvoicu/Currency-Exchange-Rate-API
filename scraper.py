import pymongo
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bs4 import BeautifulSoup
import requests
import time
import json
from apscheduler.schedulers.blocking import BlockingScheduler

load_dotenv(".env")
uri = os.getenv("MONGODB_URI")

sched = BlockingScheduler()

client = MongoClient(uri)
db = client["currencyexchangerates"]
collection = db["rates"]

@sched.scheduled_job('cron', day_of_week='mon-sun', hour=12)
def scheduled_job():
    url = "http://www.floatrates.com/daily/EUR.xml"
    result = requests.get(url).text
    doc = BeautifulSoup(result, 'html.parser')
    items = doc.find_all("item")

    update_date = items[0].pubdate.string

    rates_dict = {}
    for index in range(len(items)):
        rates_dict[f"{items[index].targetcurrency.string}"] = float(items[index].exchangerate.string.replace(",",""))

    sorted_list = sorted(rates_dict.items(), key=lambda x: x[1])

    rates_dict = {}
    for i in range(len(sorted_list)):
        rates_dict[f"{sorted_list[i][0]}"] = float("{:.6f}".format(sorted_list[i][1]))

    rates = {}
    for index in range(len(sorted_list)):
        currency = sorted_list[index][0]

        if currency == "CHF":
            rates["EUR"] = rates_dict

        time.sleep(1)
        url = f"http://www.floatrates.com/daily/{currency}.xml"
        result = requests.get(url).text
        doc = BeautifulSoup(result, 'html.parser')
        items = doc.find_all("item")

        rates_dict = {}
        for index in range(len(items)):
            rates_dict[f"{items[index].targetcurrency.string}"] = float(items[index].exchangerate.string.replace(",",""))

        sorted_list = sorted(rates_dict.items(), key=lambda x: x[1])

        rates_dict = {}
        for i in range(len(sorted_list)):
            rates_dict[f"{sorted_list[i][0]}"] = float("{:.6f}".format(sorted_list[i][1]))

        rates[f"{currency}"] = rates_dict

    rates["DATE"] = update_date

    collection.update_one({"_id":0}, {"$set":rates})
        
sched.start()