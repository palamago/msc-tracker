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
from collections import deque

def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def get_last_row():
    with open('data/tracking.csv', 'r') as f:
        try:
            lastrow = deque(csv.reader(f), 1)[0]
        except IndexError:  # empty file
            lastrow = None
        return lastrow

##### IMAGES

global lastRow 
lastRow = get_last_row()

global md5Obj
def getImages():
	global lastRow
	global md5Obj

	changePopa = False
	changeProa = False

	#First run
	if lastRow is None :
		urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web1.jpg", "images/proa-temp.jpg")
		urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web2.jpg", "images/popa-temp.jpg")
		copyfile("images/proa-temp.jpg", "images/proa/"+ts+".jpg")
		copyfile("images/popa-temp.jpg", "images/popa/"+ts+".jpg")
		changeProa = True
		changePopa = True
	else:
		urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web1.jpg", "images/proa-temp.jpg")
		urllib.urlretrieve("https://www.msccruceros.es/maps/MSCORCHESTRA/web2.jpg", "images/popa-temp.jpg")

		md5Obj = {'proa':md5("images/proa-temp.jpg"),'popa':md5("images/popa-temp.jpg")}

		#compare && copy
		if md5Obj['proa'] != lastRow[5]:
			copyfile("images/proa-temp.jpg", "images/proa/"+ts+".jpg")
			changeProa = True

		if md5Obj['popa'] != lastRow[6]:
			copyfile("images/popa-temp.jpg", "images/popa/"+ts+".jpg")
			changePopa = True

	
	return changePopa or changeProa

def getLastImage(side):
	return max(glob.iglob('images/'+side+'/*.jpg'), key=os.path.getctime)

##### COORDINATES
global coordinatesObj
def getCoordinates():
	global lastRow
	global coordinatesObj

	html_doc = urllib.urlopen('https://www.msccruceros.es/es-es/Barcos-De-Crucero/MSC-Orchestra.aspx').read()
	soup = BeautifulSoup(html_doc, 'html.parser')
	coordinates = soup.find_all("span", class_="coord")
	coordinatesObj = {'lat':coordinates[0].get_text(),'lng':coordinates[1].get_text()}

	if lastRow is None :
		return True
	else:
		return (lastRow[1]!=coordinatesObj['lat'] or lastRow[2]!=coordinatesObj['lng'])

def saveCSV():
	global coordinatesObj

	with open('data/tracking.csv','a') as f:
		writer=csv.writer(f)
		writer.writerow([ts,coordinatesObj['lat'],coordinatesObj['lng'],getLastImage('proa'),getLastImage('popa'),md5Obj['proa'],md5Obj['popa']])

###RUN! 
ct = time.time()
ts = datetime.datetime.fromtimestamp(ct).strftime('%Y-%m-%d_%H-%M-%S')

changeCoords = getCoordinates()

changeImages = getImages()

if (changeImages or changeCoords):
	saveCSV()


sys.exit()