from matplotlib.pylab import *  # pylab is the easiest approach to any plotting
import time                     # we'll do this rendering i real time
 


array_size = 10 #change this to watever you want. 
ion()                           # interaction mode needs to be turned off
 x = range(array_size)        # we'll create an x-axis from 0 to 2 pi
line, = plot(x,x)               # this is our initial plot, and does nothing
line.axes.set_ylim(-5,5) 
# change as appropriate for the ratio.
starttime = time.time()         # this is our start time
t = 0                           # this is our relative start time
while(t < 10.0):                 # we'll limit ourselves to 5 seconds.
                                # set this to while(True) if you want to loop forever
    t = time.time() - starttime # find out how long the script has been running
    
    y = range(10,0,-1)#-2*sin(x)*sin(t)        # just a function for a standing wave
                                # replace this with any function you want to animate
    p = y if flag else x                          # for instance, y = sin(x-t
    if flag:
    	flag = 0
    else:
    	flag = 1 
    line.set_ydata(p)           # update the plot data
    draw()      # this and the line above is all that is needed. 
    			#maybe have an outside loop to ensure the figure persists. 
    time.sleep(1e-0)