module.exports = {
	logging: false, // true or false, turn logging on/off
	db: { // database connectivity
		url: 'mongodb://myurl.com/database,' // mongodb url
		options: {
			useNewUrlParser: true	// any other mongo db options here
		}
	},
	secrets: {
		jwt: process.env.JWT || 'bubblegum' // secret to use for signing JWT
	},
	ldap: {
		domain: 'WORK', // ldap domain information
		domaincontroller: 'ldap://myurl.com:389' // ldap domain
	},
	client: {
		url: 'http://myurl.com', // client machine url (front-end react app)
		port: '80' // client port
	},
	logger: {
		holidays: '/weekend/archive/holidays' // directory for archiving uploaded holiday files Note: Windows needs double slashes(\\).
	}
};