from __future__ import unicode_literals
from sys import argv

import os
import ffmpeg
import youtube_dl

class MyLogger(object):
  def debug(self, msg):
    pass

  def warning(self, msg):
    print(msg)

  def error(self, msg):
    print(msg)

def my_hook(download):
  if download['status'] == 'finished':
    print('Done downloading: ' + download['filename'])

download_options = {
  'format': 'best',
  'outtmpl': '%(title)s.%(ext)s',
  'nocheckcertificate': True,
  'logger': MyLogger(),
  'progress_hooks': [my_hook],
}

if not os.path.exists('Muziek'):
  os.mkdir('Muziek')
else:
  os.chdir('Muziek')

# Initializes the youtubeDL class as 'dl'
with youtube_dl.YoutubeDL(download_options) as dl:
  with open('../' + argv[1], 'r') as file:
    for song_url in file:
      song = dl.download([song_url])
          
