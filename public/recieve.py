import sys

recieve = sys.stdin.readline()
recieve = recieve + "OK!"

print('Content-type: text/html\n')
print(recieve)