├── stop_patterns.json
└── stop_patterns
	└── individual_file.json

stop_patterns.json
======================

File Structure
--------------

The ``stop_patterns.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"stop_patterns": [
			"String: Id of the stop_patterns to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"id" : "String M: key to find the service type",
		"label" : "String M: label of the service",
		"level": "Int M: ordering level of the service",
		"variant": "list<String> M: list of key variant that are equivalent to this service but designant slightly different path",
		"color" : "String M: main color of the service",
		"icon" : "String M: icon of the service"
	}