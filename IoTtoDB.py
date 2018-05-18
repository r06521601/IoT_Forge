import pymysql
import urllib.request
import json
import time

import threading

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


def iot_to_db():
	conn = pymysql.connect(host="", user="", passwd="", db="")
	myCursor = conn.cursor()
	localtime = time.time() 
	h= urllib.request.urlopen('')

	data = json.load(h)
	btc = data["humidity"]

	num = float(btc)

	s = "INSERT INTO iott(name,v) VALUE("
	s = s+str(localtime)+","
	s = s+str(num)+");"
	print(s)
	myCursor.execute(s)
		
	conn.commit()
	conn.close()

set_interval(iot_to_db,2.5)	


