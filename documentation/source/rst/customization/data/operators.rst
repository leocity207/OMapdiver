├── operators.json
└── operators
	└── individual_file.json

operators.json
======================

File Structure
--------------

The ``operators.json`` repertory all the idividual_files inside the folder calendar_pattern.
.. code-block:: json

	{
		"operators": [
			"String: Id of the operators to find inside the folder"
		]
	}

individual_file.json
-------------------------

each individual file represent one calendar patern info.

Structure (M means mendatory, O means optional):

.. code-block:: json

	{
		"id": "String M: operators id",
		"label": "String M: operators label",
	}