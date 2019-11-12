# Structure
- Shared   
Any shared static methods and constants that can be exposed to external safely.

- App   
The main view of web app. It should only using their platform service to communicate with their platform resources.

- platforms   
Each folder was represented a backend platform. 

- platforms/services   
Base common services like site resolvers.

- platforms/web   
Base Backend Web server.

- WIP: platforms/electron   
Base runtime wrapper for electron.
