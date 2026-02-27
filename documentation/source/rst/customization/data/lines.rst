├── lines.json
└── lines
	└── individual_file.json

lines.json
======================

File Structure
--------------

The ``lines.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"lines": [
			"String: Id of the lines to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"id": "String M: ligne id",
		"label": "String M: ligne label",
		"url": "String M: URL to acces the line data",
		"color": {
			"keys" : "description of the key",
			"values" : "String M: color in the #XXXXXX format"
		},
		"info_messages": [
			{
				"index": "Int/null M: station index or whole line information",
				"level": "Int M: level of message (0,1,2 are accepted)",
				"message": "String M: information message",
			}
		],
		"icon":"String M: full icon of the line svg format",
		"stations": [
			"String: station at wich the line stop this should be ordered with the timetablePattern" 
		],
		"patterns": [
			{
				"id": "String M: Reference id of the pattern",
				"label": "String M: labbel of the pattern",
				"interval_minutes": "Int M :interval time between two train",
				"departure_minute": "Int M : departure minute of the train",
				"first_departure":"String M: time of the first departure in the day",
				"last_departure":"String M: time of the last departure of the day",
				"stop_pattern": "String M: stop patterne variant of the train",
				"is_reversed" : "boolean M, if we should look at the station in reversed way",
				"info_messages": [
					{
						"index": "Int/null M: station index or whole line information",
						"level": "Int M: level of message (0,1,2 are accepted)",
						"message": "String M: information message",
					}
				],
				"arrival_minutes": [
					"Int/null, minut of arrival at station",
				],
				"departure_minutes": [
					"Int/null, minute of departure at station",
				]
			}
		],
		"timetables": 
		[
			{
				"id": "String M: Service Mission id",
				"label": "String M: Service Mission label",
				"stop_pattern": "String M: stop_pattern pattern key",
				"calendar_pattern": "String M: stop_pattern pattern key",
				"info_messages": [
					{
						"index": "Int/null M: station index or whole line information",
						"level": "Int M: level of message (0,1,2 are accepted)",
						"message": "String M: information message",
					}
				],
				"arrival_minutes": [
					"String/null, minut of arrival at station",
				],
				"departure_minutes": [
					"String/null, minute of departure at station",
				]
			}
		]
	}