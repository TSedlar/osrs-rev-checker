import os
import sys
import urllib2

import webapp2

file = open(os.path.join(sys.path[0], 'base-url.txt'), 'r')
base_url = file.read()
file.close()

class PingTask(webapp2.RequestHandler):
    def get(self):
        cloud_function = self.request.get('cf')
        try:
            urllib2.urlopen(base_url + cloud_function)
        except BaseException as err:
          print err
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('cloud function pinged')

app = webapp2.WSGIApplication([('/ping-task', PingTask),], debug=True)
