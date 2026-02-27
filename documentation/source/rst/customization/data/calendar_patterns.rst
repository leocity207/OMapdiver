├── calendar_patterns.json
└── calendar_patterns
	└── individual_file.json

calendar_patterns.json
======================

File Structure
--------------

The ``calendar_patterns.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"calendar_patterns": [
			"String: Id of the calendar_patterns to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{	
		"id" : "String M: key to find the pattern inside timetable",
		"label": "String M: displayed name of the pattern",
		"is_exceptional" : "Bool M: if this timetable pattern is exceptional or regular",
		"info": "String O: description or information about the pattern",
		"icon": "String O: icon of the pattern",
	}