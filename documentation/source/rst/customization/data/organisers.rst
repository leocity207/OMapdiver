├── organisers.json
└── organisers
	└── individual_file.json

organisers.json
======================

File Structure
--------------

The ``organisers.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"organisers": [
			"String: Id of the organisers to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"id": "String M: organiser id",
		"label": "String M: organiser label",
	}