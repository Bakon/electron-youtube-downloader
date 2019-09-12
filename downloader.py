from __future__ import unicode_literals
from sys import argv

import os
import youtube_dl

class Logger(object):
  def debug(self, msg):
    pass

  def warning(self, msg):
    print(msg)

  def error(self, msg):
    print(msg)

def progress_checker(download):
  if download['status'] == 'finished':
    print('Done downloading: \n  ' + download['filename'])

file = '../' + argv[1]
download_options = {
  'format': 'best',
  'outtmpl': '%(title)s.%(ext)s',
  'nocheckcertificate': True,
  'logger': Logger(),
  'progress_hooks': [progress_checker],
}

if not os.path.exists('Music'):
  os.mkdir('Music')
  
os.chdir('Music')

# Initializes the youtubeDL class as 'dl'
with youtube_dl.YoutubeDL(download_options) as dl:
  with open(file, 'r') as file_in:
    for song_url in file_in:
      song = dl.download([song_url])
    data = file_in.read().splitlines(True)
  with open(file, 'w') as file_out:
    file_out.writelines(data[1:])

