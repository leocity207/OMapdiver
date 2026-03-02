├── territories.json
└── territories
	└── individual_file.json

territories.json
======================

File Structure
--------------

The ``territories.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"territories": [
			"String: Id of the territories to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"id": "String M: territory id",
		"label": "String M: territory label",
	}