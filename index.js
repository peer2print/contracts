'use strict'

const fs = require("fs")
const path = require("path")

function readContracts() {
	var result = {}
	const dir = path.join(path.join(__dirname, "build"), "contracts")
	const files = fs.readdirSync(dir)
	files.forEach((file) => {
		result[file] = require(path.join(dir, file))
	})
	return result
}

module.exports = readContracts()
