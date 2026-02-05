const fs = require('fs').promises;
const path = require('path');

async function Load_Data(timetableFile)
{
	const raw = {
			"meta": {
				"routeId": "101",
				"title": "Lausanne-Flon – Echallens – Bercher",
				"validFrom": "2025-12-14",
				"validTo": "2026-12-12"
			},
			"patter":[
				{
					"type" : "USUAL",
					"key" : "weekday",
					"label": "weekday"
				},
				{
					"type" : "Exception",
					"key" : "31.12",
					"label" : "fête de noël"
				}
			],
			"stations": [
				{
					"id": "st1",
					"name": "Lausanne-Flon"
				},
				{
					"id": "st2",
					"name": "Lausanne-Chauderon"
				},
				{
					"id": "st3",
					"name": "Union-Prilly"
				},
				{
					"id": "st4",
					"name": "Echallen"
				},
				{
					"id": "st5",
					"name": "Bercher"
				} 
			],
			"trains": [
				{
					"id": "101.1",
					"label": "101.1",
					"pattern": [
						"weekday"
					],
					"notes": null,
					"schedule": [
						{
							"id": "st1",
							"departure-time": "06:00",
							"note": null
						},
						{
							"id": "st2",
							"arrival-time": "06:58",
							"departure-time": "07:00",
							"note": null
						},
						{
							"id": "st3",
							"arrival-time": "06:58",
							"departure-time": "07:00",
							"note": null
						},
						{
							"id": "st4",
							"arrival-time": "06:58",
							"departure-time": "07:00",
							"note": null
						},
						{
							"id": "st5",
							"arrival-time": "06:58",
							"note": null
						}
					]
				},
				{
					"id": "101.3",
					"label": "101.3",
					"pattern": [
						"weekday",
						"31.12"
					],
					"notes": "circulation partielle",
					"schedule": [
						{
							"id": "st2",
							"departure-time": "07:00",
							"note": null
						},
						{
							"id": "st2",
							"arrival-time": "06:58",
							"departure-time": "07:00",
							"note": "arret sur demande uniquement"
						},
						{
							"id": "st3",
							"arrival-time": "06:58",
							"departure-time": "07:00",
							"note": null
						},
						{
							"id": "st4",
							"arrival-time": "06:58",
							"departure-time": "07:00",
							"note": null
						},
					]
				}
			]
		}
	return data;
}

async function Get(res) {
	try 
	{
		const data = await Load_Data();
		res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: true, data }));
	}
	catch (err)
	{
		console.error('Failed to load timetable:', err);
		res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
		res.end(JSON.stringify({ success: false, error: 'Failed to load timetable' }));
	}
}


module.exports = { Get };