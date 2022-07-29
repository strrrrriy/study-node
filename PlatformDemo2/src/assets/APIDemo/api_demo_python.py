# -*- coding: utf-8 -*-
import datetime
import requests
import hashlib
import hmac
import base64

BODY  = {
  "Domain": "MES",
  "UserName": "admin",
  "Password": "MES",
  "ProductArea": "WareHouseTest"
}

NOW = datetime.datetime.utcnow()

NOW_Format = NOW.strftime('%a, %d %b %Y %H:%M:%S GMT')

print(NOW_Format)

HASH_TEXT = 'date:'+ NOW_Format + '\r\nsource:API Platform\r\n'

print(HASH_TEXT)

SECRET_KEY = 'Asykh5N/BkKDHCP5uSraJ9GVMWaeZkGgcsula///8gA='


message = bytes(HASH_TEXT,encoding='utf-8')
secret = base64.b64decode(SECRET_KEY)

hash = hmac.new(secret, message, hashlib.sha256)

# to lowercase hexits
hash.hexdigest()

# to base64
x = base64.b64encode(hash.digest())

print(hash.hexdigest())

x2 = x.decode('utf-8')

print(x)
print(x2)

#POST
STRING = 'hmac id= ' + '"CAdk6/waqEy1IvAlW2yyNA==" ,' + 'algorithm = "hmac-sha256", ' + ' headers = "date source",'  + ' signature = "' + x2 +'"'

r = requests.post("http://10.54.12.97:9996/mes/l2/SetupControl/api/SetupControl/GetProductFamilies", 
                  data = BODY, 
                  
                  headers={"Authorization": STRING,
                           "Date": NOW_Format,
                           "source": 'API Platform'
                           
                           })
print(r.content)

#GET
response = requests.get(url='http://10.54.12.97:9996/mes/l2/SetupControl/api/Meta/Get', 
                        headers={"Authorization": STRING,
                                 "Date": NOW_Format,
                                 "source": 'API Platform'
                           })
