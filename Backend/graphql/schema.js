const {buildSchema} = require('graphql');

module.exports = buildSchema(`
	type Post {
		_id : ID!
		title : String!
		imageUrl : String!
		content : String!
		creator : User!
		createAt : String!
		updateAt : String!
	}

	type User {
		_id : ID!
		name : String!
		email : String!
		password : String 
		status : Int!
		post: [Post!]!
	}	

	input userInputData{
		email : String!
		name : String!
		password : String!
	}   

	type rootQuery{
		hello : String!
	}

	type rootMutation {
		createUser(userInputData : userInputData!) : User!
	}
	schema {
		query : rootQuery
		mutation : rootMutation
	}
`);