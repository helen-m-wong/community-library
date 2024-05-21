require('dotenv').config();

const express = require('express');
const app = express();
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();
const bodyParser = require('body-parser');

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const MEMBER = "Members";
const BOOK = "Books";
const routerMembers = express.Router();
const routerBooks = express.Router();
const cors = require('cors');

app.use(cors());
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
async function get_all_books(req) {
    var count_q = datastore.createQuery(BOOK);
    var q = datastore.createQuery(BOOK);
    var results = {};

    await datastore.runQuery(count_q).then ( (books) => {
        results.count = books[0].map(fromDatastore).length;
    });

    return datastore.runQuery(q).then((entities) => {
        results.books = entities[0].map(fromDatastore);

        for (book of results.books) {
            book.self = req.protocol + "://" + req.get("host") + "/books/" + book.id
        }

        return results;
    });
}

// Get all books paginated
async function get_books(req) {
    var q = datastore.createQuery(BOOK).limit(10);
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
function own_book(req, member_id, name, email, address, owned_books, borrowed_books, book_id, title, author) {
    const key = datastore.key([MEMBER, parseInt(member_id, 10)]);
    const new_book = {
        "id": book_id,
        "title": title,
        "author": author,
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
        "id": member_id,
        "name": name,
        "self": req.protocol + "://" + req.get("host") + "/members/" + member_id
    }

    const book = { "title": title, "author": author, "pub_date": pub_date, "owner": owner, "borrower": borrower };
    return datastore.save({ "key": key, "data": book });
}

// Assign book to member's borrowed_books
function borrow_book(req, member_id, name, email, address, owned_books, borrowed_books, book_id, title, author) {
    const key = datastore.key([MEMBER, parseInt(member_id, 10)]);
    const borrow_book = {
        "id": book_id,
        "title": title,
        "author": author,
        "self": req.protocol + "://" + req.get("host") + "/books/" + book_id
    }
    borrowed_books.push(borrow_book)
    const member = { "name": name, "email": email, "address": address, "owned_books": owned_books, "borrowed_books": borrowed_books };
    return datastore.save({ "key": key, "data": member });
}

// Assign borrower attribute of book
function put_borrower_book(req, book_id, title, author, pub_date, owner, member_id, name) {
    const key = datastore.key([BOOK, parseInt(book_id, 10)]);

    const borrower = {
        "id": member_id,
        "name": name,
        "self": req.protocol + "://" + req.get("host") + "/members/" + member_id
    }

    const book = { "title": title, "author": author, "pub_date": pub_date, "owner": owner, "borrower": borrower };
    return datastore.save({ "key": key, "data": book });
}

// Remove book from member's borrowed list
function remove_book(member_id, name, email, address, owned_books, borrowed_books, book_id) {
    const key = datastore.key([MEMBER, parseInt(member_id, 10)]);
    for ( var i = 0; i < borrowed_books.length; i++ ) {
        if ( borrowed_books[i].id == book_id ) {
            borrowed_books.splice(i, 1);
        }
    }
    const member = { "name": name, "email": email, "address": address, "owned_books": owned_books, "borrowed_books": borrowed_books };
    return datastore.save({ "key": key, "data": member });
}

// Unassign member as borrower for book
function remove_borrower(book_id, title, author, pub_date, owner) {
    const key = datastore.key([BOOK, parseInt(book_id, 10)]);
    const book = { "title": title, "author": author, "pub_date": pub_date, "owner": owner, "borrower": null };
    return datastore.save({ "key": key, "data": book });
}

// Delete a book
function delete_book(id) {
    const key = datastore.key([BOOK, parseInt(id, 10)]);
    return datastore.delete(key);
}

// Remove book from member's owned list
function remove_owned_book(member_id, name, email, address, owned_books, borrowed_books, book_id) {
    const key = datastore.key([MEMBER, parseInt(member_id, 10)]);
    for ( var i = 0; i < owned_books.length; i++ ) {
        if ( owned_books[i].id == book_id ) {
            owned_books.splice(i, 1);
        }
    }
    const member = { "name": name, "email": email, "address": address, "owned_books": owned_books, "borrowed_books": borrowed_books };
    return datastore.save({ "key": key, "data": member });
}

// Delete a member
function delete_member(id) {
    const key = datastore.key([MEMBER, parseInt(id, 10)]);
    return datastore.delete(key);
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
routerBooks.get('/all', function (req, res) {
    const books = get_all_books(req)
        .then((books) => {
        res.status(200).json(books);
    });
});

// Get all books paginated
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
                                own_book(req, req.params.member_id, member[0].name, member[0].email, member[0].address, member[0].owned_books, member[0].borrowed_books, req.params.book_id, book[0].title, book[0].author)
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

// Borrow a book
routerBooks.put('/:book_id/members/:member_id', function (req, res) {
    get_book(req.params.book_id)
        .then(book => {
            if (book[0] === undefined || book[0] === null) {
                res.status(404).json({ 'Error': 'No member/book with this id exists' });
                return
            } else {
                get_member(req.params.member_id)
                    .then(member => {
                        if (member[0] === undefined || member[0] === null) {
                            res.status(404).json({ 'Error': 'No member/book with this id exists' });
                            return
                        } else {
                            if (book[0].borrower !== null) {
                                if (book[0].borrower.name == member[0].name) {
                                    res.status(403).json({ 'Error': 'You are already borrowing this book' });
                                    return
                                } else {
                                    res.status(403).json({ 'Error': 'The book is being borrowed by another member' });
                                    return
                                }
                            } else {
                                borrow_book(req, req.params.member_id, member[0].name, member[0].email, member[0].address, member[0].owned_books, member[0].borrowed_books, req.params.book_id, book[0].title, book[0].author)
                                put_borrower_book(req, req.params.book_id, book[0].title, book[0].author, book[0].pub_date, book[0].owner, req.params.member_id, member[0].name)
                                    .then(res.status(200).json({
                                        'id': req.params.book_id,
                                        'title': book[0].title,
                                        'author': book[0].author,
                                        'borrower': member[0].name,
                                        'self': req.protocol + "://" + req.get("host") + "/books/" + req.params.book_id
                                    }));
                            }
                        }
                    });
            }
        });
});

// Return a book
routerMembers.delete('/:member_id/books/:book_id', function (req, res) {
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
                    } else if (book[0].borrower == null || book[0].borrower.name !== member[0].name) {
                        res.status(403).json({ 'Error': 'Book is not currently borrowed by you'})
                    } else {
                        remove_book(req.params.member_id, member[0].name, member[0].email, member[0].address, member[0].owned_books, member[0].borrowed_books, req.params.book_id)
                        remove_borrower(req.params.book_id, book[0].title, book[0].author, book[0].pub_date, book[0].owner)
                            .then(res.status(204).end())
                    }
                });
        }
    });
});

// Delete a book
routerBooks.delete('/:id', function (req, res) {
    get_book(req.params.id)
        .then(book => {
            if (book[0] === undefined || book[0] === null) {
                res.status(404).json({ 'Error': 'No book with this id exists' });
                return
            }
            else if (book[0].borrower !== null) {
                res.status(403).json({ 'Error': 'Cannot delete book that is currently being borrowed'});
                return
            } else {
                if (book[0].owner === null) {
                    delete_book(req.params.id).then(res.status(204).end())
                } else {
                    const member_id = book[0].owner.id
                    get_member(member_id)
                        .then(member => {
                            remove_owned_book(member_id, member[0].name, member[0].email, member[0].address, member[0].owned_books, member[0].borrowed_books, req.params.id)
                            delete_book(req.params.id).then(res.status(204).end())
                        })
                }
            }
        });
});

// Delete a member
routerMembers.delete('/:id', function (req, res) {
    get_member(req.params.id)
        .then(member => {
            if (member[0] === undefined || member[0] === null) {
                res.status(404).json({ 'Error': 'No member with this id exists' });
                return
            } 
            else if (member[0].borrowed_books.length == 0 && member[0].owned_books.length == 0) {
                delete_member(req.params.id).then(res.status(204).end())
            }
            else {
                res.status(403).json({ 'Error': "Please return member's borrowed books and delete their owned books from the system first" });
                return
            }
        });
});

// Search books by title or author using Google Books API
app.get('/api/search-books', async (req, res) => {
    const { query } = req.query;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20`;
    if (!query) {
        return res.status(400).json({ 'Error': 'Query parameter is required' });
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data.items)
        res.json(data.items);
    } catch (error) {
        res.status(500).json({ 'Error': 'Failed to fetch books' });
    }
});

/* ------------- End Controller Functions ------------- */

app.use('/members', routerMembers);
app.use('/books', routerBooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});