from __future__ import unicode_literals

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

# Todo: make folder & file come from argsv[1] && argv[2]

folder = 'public/assets/videos/'
file = '../../../songs.txt'
download_options = {
  'format': 'best',
  'outtmpl': '%(title)s.%(ext)s',
  'nocheckcertificate': True,
  'logger': Logger(),
  'progress_hooks': [progress_checker],
}

if not os.path.exists(folder):
  os.mkdir(folder)
  
os.chdir(folder)

# Makes new instance of the youtubeDL class as 'downloader'
with youtube_dl.YoutubeDL(download_options) as downloader:
  with open(file, 'r') as file_in:
    for song_url in file_in:
      song = downloader.download([song_url])
    data = file_in.read().splitlines(True)
  with open(file, 'w') as file_out:
    file_out.writelines(data[1:])

