'use strict'

var fs = require("fs")

function readContracts() {
	var result = {}
	const path = __dirname+"/build/contracts"
	var files = fs.readdirSync(path)
	return files.map((file) => {
		return fs.readFileSync(path+"/"+file).toString()
	})
}

module.exports = readContracts()
