from __future__ import unicode_literals

import os, sys, json
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
    print(download['filename'][:-4])

def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

songs_array = read_in()

download_options = {
  'format': 'best',
  'outtmpl': '%(title)s.%(ext)s',
  'nocheckcertificate': True,
  'logger': Logger(),
  'progress_hooks': [progress_checker],
}

os.chdir(sys.argv[1])
print(sys.argv[1])

# Makes new instance of the youtubeDL class as 'downloader'
with youtube_dl.YoutubeDL(download_options) as downloader:
  for songs_object in songs_array:
    print(songs_object['id'])
    downloader.download([songs_object['id']])