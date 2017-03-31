import urllib
import sys
import hashlib
import io
import os.path
import datetime
import time
import csv
import glob
from bs4 import BeautifulSoup
from shutil import copyfile

def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

##### IMAGES

def getImages(coordinates):
	print 'getImages'
	urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web1.jpg", "images/proa-temp.jpg")
	urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web2.jpg", "images/popa-temp.jpg")

	#First run
	if os.path.isfile("images/proa-last.jpg")==False :
		urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web1.jpg", "images/proa-last.jpg")
		urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web2.jpg", "images/popa-last.jpg")
		copyfile("images/proa-last.jpg", "images/proa/"+ts+".jpg")
		copyfile("images/popa-last.jpg", "images/popa/"+ts+".jpg")
		saveCSV(coordinates)

	#compare && copy
	if md5("images/proa-temp.jpg") != md5("images/proa-last.jpg"):
		copyfile("images/proa-temp.jpg", "images/proa-last.jpg")
		copyfile("images/proa-last.jpg", "images/proa/"+ts+".jpg")

	if md5("images/popa-temp.jpg") != md5("images/popa-last.jpg"):
		copyfile("images/popa-temp.jpg", "images/popa-last.jpg")
		copyfile("images/popa-last.jpg", "images/popa/"+ts+".jpg")
		saveCSV(coordinates)

def getLastImage(side):
	return max(glob.iglob('images/'+side+'/*.jpg'), key=os.path.getctime)

##### COORDINATES
def getCoordinates():
	print 'getCoordinates'
	html_doc = urllib.urlopen('https://www.msccruceros.es/es-es/Barcos-De-Crucero/MSC-Orchestra.aspx').read()
	soup = BeautifulSoup(html_doc, 'html.parser')
	coordinates = soup.find_all("span", class_="coord")
	return {'lat':coordinates[0].get_text(),'lng':coordinates[1].get_text()}

def saveCSV(coords):
	print '* saveCSV'
	with open('data/tracking.csv','a') as f:
		writer=csv.writer(f)
		writer.writerow([ts,coords['lat'],coords['lng'],getLastImage('proa'),getLastImage('popa')])

###RUN! 
ct = time.time()
ts = datetime.datetime.fromtimestamp(ct).strftime('%Y-%m-%d_%H-%M-%S')
print 'Inicia: '+ts
coord = getCoordinates()
print coord
getImages(coord)

print 'fin'
print '---------'

sys.exit()