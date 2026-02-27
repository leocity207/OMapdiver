├── stations.json
└── stations
	└── individual_file.json

stations.json
======================

File Structure
--------------

The ``stations.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"stations": [
			"String: Id of the stations to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"id":   "String M: stations id",
		"label": "String M: stations label",
		"url":  "String M: URL to acces the stations data",
		"lines": [
			"String : ligne id of stations passing at this stations"
		],
		"directions": {
			"keys" : "String: direction id of theline in the form Lineid_type_minutes",
			"value": "String: direction destination"
		},
		"have_disabled_equipment": "Boolean O: tells if the stations is accessible for low mobility persones",
		"have_bike_parking" : "Boolean O: tells if the stations has a parking for bikes",
		"have_car_parking" : "Boolean O: tells if the stations has a car parking",
		"have_car_sharing" : "Boolean O: tells if the stations has care sharing",
		"opening_hour": "String O: opening hour of the stations",
		"closing_hour" : "String O: closing hour of the stations"
	}