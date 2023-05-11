import json
import logging
import os
import tornado.ioloop

from tornado.web import RequestHandler
from tornado.options import options

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
        
class GetCalendar(RequestHandler):
    '''
    カレンダー取得
    '''
    
    def initialize(self):
        logging.info("GetCalendar [initialize]")
        
    def get(self):
        logging.info("GetCalendar [get]")
        data=[
            {
                "title":"All Day Event",
                "start":"2018-06-01"
            },
            {
                "title":"Long Event",
                "start":"2018-06-07",
                "end":"2018-06-10"
            },
            {
                "id":"999",
                "title":"Repeating Event",
                "start":"2018-06-09T16:00:00-05:00"
            },
            {
                "id":"999",
                "title":"Repeating Event",
                "start":"2018-06-16T16:00:00-05:00"
            },
            {
                "title":"Conference",
                "start":"2018-06-11",
                "end":"2018-06-13"
            },
            {
                "title":"Meeting",
                "start":"2018-06-12T10:30:00-05:00",
                "end":"2018-06-12T12:30:00-05:00"
            },
            {
                "title":"Lunch",
                "start":"2018-06-12T12:00:00-05:00"
            },
            {
                "title":"Meeting",
                "start":"2018-06-12T14:30:00-05:00"
            },
            {
                "title":"Happy Hour",
                "start":"2018-06-12T17:30:00-05:00"
            },
            {
                "title":"Dinner",
                "start":"2018-06-12T20:00:00"
            },
            {
                "title":"Birthday Party",
                "start":"2018-06-13T07:00:00-05:00"
            },
            {
                "title":"Click for Google",
                "url":"http://google.com/",
                "start":"2018-06-28"
            }
        ]
        
        self.write(json.dumps(data))
        
app=tornado.web.Application([
    (r"/",MainHandler),
    (r"/getCalendar",GetCalendar),
],
    template_path=os.path.join(os.getcwd(),"templates"),
    static_path=os.path.join(os.getcwd(),"static"),                            
)

if__name__=="__main__": options.parse_command_line()
app.listen(8080)
logging.info("server started")
tornado.ioloop.IOLoop.instance().start()