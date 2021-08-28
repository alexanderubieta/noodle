# Noodle v2.8

A discord bot I created for my friends to use.

%countdown -
Gives a live countdown for specified events.
Usage: 
%countdown event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00(if time is needed)

%reminder -
Sends a daily reminder message at 11:00 AM CDT for a user defined reminder and pings users based on a specified role (limited to one ping per role for reminders occuring at the same time).
Usage: 
%reminder reminder-name-seperated-by-dashes date/time repition(once/daily) rolename id link/description(optional)

%uptime -
Displays how many minutes Noodle has been online.
Usage: 
%uptime

%purge -
Clears the daily reminder of with the same name given when it is supposed to occur next.
Usage: 
General
%purge reminder-name-seperated-by-dashes
To reset the list names to be purged
%purge reset 


Changelog:
v2.8
added activity status w/ event tracking, combined pings for reminders that occur at the same time, added one time reminders, tweaked reminders to specify any channel to send them in

v2.0-2.3
added reminders, uptime, purge

v1.0
initial - event support
