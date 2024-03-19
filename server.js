const express = require('express');
const app = express();

const { Datastore } = require('@google-cloud/datastore');
const bodyParser = require('body-parser');

const datastore = new Datastore();

const MEMBER = "Members";
const BOOK = "Books";
const routerMembers = express.Router();
const routerBooks = express.Router();

app.use(bodyParser.json());
app.enable('trust proxy');

function fromDatastore(item) {
    item.id = item[Datastore.KEY].id;
    return item;
}

/* ------------- Begin Model Functions ------------- */

// Get all members
async function get_members(req) {
    var count_q = datastore.createQuery(MEMBER);
    var q = datastore.createQuery(MEMBER);
    var results = {};

    await datastore.runQuery(count_q).then ( (members) => {
        results.count = members[0].map(fromDatastore).length;
    });

    return datastore.runQuery(q).then((entities) => {
        results.members = entities[0].map(fromDatastore);

        for (member of results.members) {
            member.self = req.protocol + "://" + req.get("host") + "/members/" + member.id
        }

        return results;
    });
}

// Get a member
function get_member(id) {
    const key = datastore.key([MEMBER, parseInt(id, 10)]);
    return datastore.get(key).then((entity) => {
        if (entity[0] === undefined || entity[0] === null) {
            return entity;
        } else {
            return entity.map(fromDatastore);
        }
    });
}

// Create a member
function post_member(name, email, address) {
    var key = datastore.key(MEMBER);
    const new_member = { "name": name, "email": email, "address": address, "owned_books": [], "borrowed_books": []};
    return datastore.save({ "key": key, "data": new_member }).then(() => { return key });
    }

// Edit a member with PATCH
function patch_member(id, name, email, address, owned_books, borrowed_books) {
    const key = datastore.key([MEMBER, parseInt(id, 10)]);
    const member = { "name": name, "email": email, "address": address, "owned_books": owned_books, "borrowed_books": borrowed_books };
    return datastore.save({ "key": key, "data": member });
}

// Get all books
async function get_books(req) {
    var q = datastore.createQuery(BOOK).limit(5);
    var count_q = datastore.createQuery(BOOK);
    var results = {};
    
    await datastore.runQuery(count_q).then ( (books) => {
        results.count = books[0].map(fromDatastore).length;
    });

    if(Object.keys(req.query).includes("cursor")){
        q = q.start(req.query.cursor);
    }
	return datastore.runQuery(q).then( (entities) => {
        results.books = entities[0].map(fromDatastore);
        for (book of results.books) {
            book.self = req.protocol + "://" + req.get("host") + "/books/" + book.id
        }
        if(entities[1].moreResults !== Datastore.NO_MORE_RESULTS ){
            results.next = req.protocol + "://" + req.get("host") + "/books?cursor=" + entities[1].endCursor;
        }
        return results;
	});
}

// Get a book
function get_book(id) {
    const key = datastore.key([BOOK, parseInt(id, 10)]);
    return datastore.get(key).then((entity) => {
        if (entity[0] === undefined || entity[0] === null) {
            return entity;
        } else {
            return entity.map(fromDatastore);
        }
    });
}

// Create a book
function post_book(title, author, pub_date) {
    var key = datastore.key(BOOK);
    const new_book = { "title": title, "author": author, "pub_date": pub_date, "owner": null, "borrower": null };
    return datastore.save({ "key": key, "data": new_book }).then(() => { return key });
    }

// Edit a book with PATCH
function patch_book(id, title, author, pub_date, owner, borrower) {
    const key = datastore.key([BOOK, parseInt(id, 10)]);
    const book = { "title": title, "author": author, "pub_date": pub_date, "owner": owner, "borrower": borrower };
    return datastore.save({ "key": key, "data": book });
}

// Assign book to member's owned_books
function put_book(req, member_id, name, email, address, owned_books, borrowed_books, book_id, title) {
    const key = datastore.key([MEMBER, parseInt(member_id, 10)]);
    const new_book = {
        "title": title,
        "self": req.protocol + "://" + req.get("host") + "/books/" + book_id
    }
    owned_books.push(new_book)
    const member = { "name": name, "email": email, "address": address, "owned_books": owned_books, "borrowed_books": borrowed_books };
    return datastore.save({ "key": key, "data": member });
}

// Assign owner attribute of book
function put_owner_book(req, book_id, title, author, pub_date, borrower, member_id, name) {
    const key = datastore.key([BOOK, parseInt(book_id, 10)]);

    const owner = {
        "name": name,
        "self": req.protocol + "://" + req.get("host") + "/members/" + member_id
    }

    const book = { "title": title, "author": author, "pub_date": pub_date, "owner": owner, "borrower": borrower };
    return datastore.save({ "key": key, "data": book });
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

// Get all members
routerMembers.get('/', function (req, res) {
    const members = get_members(req)
        .then((members) => {
        res.status(200).json(members);
    });
});

// Get a member
routerMembers.get('/:id', function (req, res) {
    get_member(req.params.id)
        .then(member => {
            if (member[0] === undefined || member[0] === null) {
                res.status(404).json({ 'Error': 'No member with this id exists' });
            } else {
                res.status(200).json({ 
                    'id': parseInt(member[0].id),
                    'name': member[0].name,
                    'email': member[0].email,
                    'address': member[0].address,
                    'owned_books': member[0].owned_books,
                    'borrowed_books': member[0].borrowed_books,
                    'self': req.protocol + "://" + req.get("host") + "/members/" + req.params.id
                });
            }
        });
});

// Create a member
routerMembers.post('/', function (req, res) {
    var propCheck = true

    const numProp = Object.keys(req.body).length;
    if (numProp !== 3) {
        propCheck = false
    }

    const reqProp = ["name", "email", "address"];
    for (const [key, value] of Object.entries(req.body)) {
        if (reqProp.includes(key) == false) {
            propCheck = false
        }
    }

    if (propCheck == false) {
        res.status(400).json({ 'Error': 'The request object is missing at least one of the required attributes or has extraneous attributes' })
    } else {
        post_member(req.body.name, req.body.email, req.body.address)
        .then(key => { 
            res.status(201).json({ 
                'id': parseInt(key.id),
                'name': req.body.name,
                'email': req.body.email,
                'address': req.body.address,
                'owned_books': [],
                'borrowed_books': [],
                'self': req.protocol + "://" + req.get("host") + "/members/" + key.id
            });
        });
    }
});

// Edit a member with PATCH
routerMembers.patch('/:id', function (req, res) {
    numProp = Object.keys(req.body).length;
    if (numProp > 3) {
        res.status(400).json({ 'Error': 'The request object has extraneous attributes' });
        return
    }

    var nameProp = false
    var emailProp = false
    var addressProp = false
    for (const [key, value] of Object.entries(req.body)) {
        if (key == "name") {
            nameProp = true
        }
        if (key == "email") {
            emailProp = true
        }
        if (key == "address") {
            addressProp = true
        }
    }

    get_member(req.params.id)
        .then((member) => {
            if (member[0] === undefined || member[0] === null) {
                res.status(404).json({ 'Error': 'No member with this id exists' });
                return
            } else {
                var name = member[0].name
                var email = member[0].email
                var address = member[0].address
                if (nameProp == true) {
                    name = req.body.name
                }
                if (emailProp == true) {
                    email = req.body.email
                }
                if (addressProp == true) {
                    address = req.body.address
                }

                patch_member(req.params.id, name, email, address, member[0].owned_books, member[0].borrowed_books)
                .then(res.status(200).json({
                    'id': req.params.id,
                    'name': name,
                    'email': email,
                    'address': address,
                    'owned_books': member[0].owned_books,
                    'borrowed_books': member[0].borrowed_books,
                    'self': req.protocol + "://" + req.get("host") + "/members/" + req.params.id
                }))
            }
        })
});

// Get all books
routerBooks.get('/', function (req, res) {
    const books = get_books(req)
        .then((books) => {
        res.status(200).json(books);
    });
});

// Get a book
routerBooks.get('/:id', function (req, res) {
    get_book(req.params.id)
        .then(book => {
            if (book[0] === undefined || book[0] === null) {
                res.status(404).json({ 'Error': 'No book with this id exists' });
            } else {
                res.status(200).json({ 
                    'id': parseInt(book[0].id),
                    'title': book[0].title,
                    'author': book[0].author,
                    'pub_date': book[0].pub_date,
                    'owner': book[0].owner,
                    'borrower': book[0].borrower,
                    'self': req.protocol + "://" + req.get("host") + "/books/" + req.params.id
                });
            }
        });
});

// Create a book
routerBooks.post('/', function (req, res) {
    var propCheck = true

    const numProp = Object.keys(req.body).length;
    if (numProp !== 3) {
        propCheck = false
    }

    const reqProp = ["title", "author", "pub_date"];
    for (const [key, value] of Object.entries(req.body)) {
        if (reqProp.includes(key) == false) {
            propCheck = false
        }
    }

    if (propCheck == false) {
        res.status(400).json({ 'Error': 'The request object is missing at least one of the required attributes or has extraneous attributes' })
    } else {
        post_book(req.body.title, req.body.author, req.body.pub_date)
        .then(key => { 
            res.status(201).json({ 
                'id': parseInt(key.id),
                'title': req.body.title,
                'author': req.body.author,
                'pub_date': req.body.pub_date,
                'owner': null,
                'borrower': null,
                'self': req.protocol + "://" + req.get("host") + "/books/" + key.id
            });
        });
    }
});

// Edit a book with PATCH
routerBooks.patch('/:id', function (req, res) {
    numProp = Object.keys(req.body).length;
    if (numProp > 3) {
        res.status(400).json({ 'Error': 'The request object has extraneous attributes' });
        return
    }

    var titleProp = false
    var authorProp = false
    var pubProp = false
    for (const [key, value] of Object.entries(req.body)) {
        if (key == "title") {
            titleProp = true
        }
        if (key == "author") {
            authorProp = true
        }
        if (key == "pub_date") {
            pubProp = true
        }
    }

    get_book(req.params.id)
        .then((book) => {
            if (book[0] === undefined || book[0] === null) {
                res.status(404).json({ 'Error': 'No book with this id exists' });
                return
            } else {
                var title = book[0].title
                var author = book[0].author
                var pub_date = book[0].pub_date
                if (titleProp == true) {
                    title = req.body.title
                }
                if (authorProp == true) {
                    author = req.body.author
                }
                if (pubProp == true) {
                    pub_date = req.body.pub_date
                }

                patch_book(req.params.id, title, author, pub_date, book[0].owner, book[0].borrower)
                .then(res.status(200).json({
                    'id': req.params.id,
                    'title': title,
                    'author': author,
                    'pub_date': pub_date,
                    'owner': book[0].owner,
                    'borrower': book[0].borrower,
                    'self': req.protocol + "://" + req.get("host") + "/books/" + req.params.id
                }))
            }
        })
});

// Assign owner to a book
routerMembers.put('/:member_id/books/:book_id', function (req, res) {
    get_member(req.params.member_id)
        .then(member => {
            if (member[0] === undefined || member[0] === null) {
                res.status(404).json({ 'Error': 'No member/book with this id exists' });
                return
            } else {
                get_book(req.params.book_id)
                    .then(book => {
                        if (book[0] === undefined || book[0] === null) {
                            res.status(404).json({ 'Error': 'No member/book with this id exists' });
                            return
                        } else {
                            if (book[0].owner !== null) {
                                res.status(403).json({ 'Error': 'The book is already owned by another member' });
                                return
                            } else {
                                put_book(req, req.params.member_id, member[0].name, member[0].email, member[0].address, member[0].owned_books, member[0].borrowed_books, req.params.book_id, book[0].title)
                                put_owner_book(req, req.params.book_id, book[0].title, book[0].author, book[0].pub_date, book[0].borrower, req.params.member_id, member[0].name)
                                    .then(res.status(200).json({
                                        'id': req.params.book_id,
                                        'title': book[0].title,
                                        'author': book[0].author,
                                        'owner': member[0].name,
                                        'self': req.protocol + "://" + req.get("host") + "/books/" + req.params.book_id
                                    }));
                            }
                        }
                    });
            }
        });
});

/* ------------- End Controller Functions ------------- */

app.use('/members', routerMembers);
app.use('/books', routerBooks);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});