├── networks.json
└── networks
	└── individual_file.json

networks.json
======================

File Structure
--------------

The ``networks.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"netwoks" : [
			{
				"is_local" : "boolean M: to tell if the data of the network should be requested or are locals",
				"id": "String M: identifier of the network",
				"label":"String M: commercial name string of the network",
				"version": "String M: version of the data X.X.X",
				"URL" : "String M: url to fetch data or path to the data"
			}
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"calendar_patterns": [
			"String: id of calendar_patterns" 
		],
		"landmarks" : [
			"String: id of landmarks" 
		],
		"lines": [
			"String: id of lines" 
		],
		"stations": [
			"String: id of the stations" 
		],
		"operator" : [
			"String: id of operators" 
		],
		"organiser" : [
			"String: id of organiser" 
		],
		"stop_patterns" : [
			"String: id of stop patterns" 
		],
		"territories": [
			"String: id of territories" 
		]
	}