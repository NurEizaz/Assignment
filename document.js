//const bcrypt = require('bcrypt');

let document;

class Document {
	static async injectDB(conn) {
		document = await conn.db("Week03").collection("Document Server");
	}
	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
	static async register(id, FileName) {
		// TODO: Check if username exists
		const duplicate = await document.findOne({ id: id });
		
		if (duplicate) {
			return { status: "duplicate id" }
		}

		// TODO: Save user to database
		return await users.insertOne({
			id1: id,
			FileName: FileName,
		});
	};

	static async delete(id) {
		return document.deleteOne({id: id})
	}

	static async find(id) {
		return document.findOne({id: id})
	}
}
module.exports = Document;