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


download_options = {
  'format': 'best',
  'outtmpl': '%(title)s.%(ext)s',
  'nocheckcertificate': True,
  'logger': Logger(),
  'progress_hooks': [progress_checker],
}


if os.path.exists('Music'):
  os.chdir('Music')
else:
  os.mkdir('Music')

# Initializes the youtubeDL class as 'dl'
with youtube_dl.YoutubeDL(download_options) as dl:
  with open('../' + argv[1], 'r') as file:
    for song_url in file:
      song = dl.download([song_url])


