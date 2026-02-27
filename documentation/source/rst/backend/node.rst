Node Server
============

Node server is also implemented as a replacement when OATPP cannot be used, for now this solution is not fully supported as OATPP is prefered

Server Structure
----------------
the Node server comes with 2 services:
  - static file serving
  - network data serving

Configuration
-------------
Currently the configuration is done throught the file inside the ``node`` folder called ``conig.cjs``

Deployment
----------
You can clone this repository. and simply execute the node server via the npm command.
You will need to place all the specific website files inside resource_config. for this look at the ``customization`` section