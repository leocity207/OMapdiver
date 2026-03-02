├── landmarks.json
└── landmarks
	└── individual_file.json

landmarks.json
======================

File Structure
--------------

The ``landmarks.json`` repertory all the idividual_files inside the folder calendar_pattern.

.. code-block:: json

	{
		"landmarks":[
			"String: Id of the landmark to find inside the folder"
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
	}