const express = require('express');

const { find, findById, insert, update, remove} = require ('./data/db');

const server = express()

// extra functionality we need to be able to read req.body
server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json( "Server runs");
});

server.put('/api/users/:id', (req, res) => {    
    const { id } = req.params;    
    const user = req.body;
    const { name, bio } = user;
    if (!name || !bio) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user.' });
      }
      update(id, user)
      .then(updatedUser => {        
        if (!updatedUser) {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' });
        } else {
          res
            .status(200)
            .json({ message: 'The user information was updated successfully' });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: 'The user information could not be modified.' });
      });
  });



server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    console.log(req.params)
    findById(id)
    .then(data => {
        if (data) {
            res.status(200).json(data)
          } else {
            res.status(404).json({ message: `Error this user ${id} can not be found`})
          }
        })
        .catch(error => {
            // crashes and such
            // res.json the error message and stack
            console.log(error);
          })
})

server.get('/api/users', (req, res) => {
    find()
        .then(users => {

            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({
                message: error.message,
                stack: error.stack,
            })
        })
});

server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    remove(id)
        .then(data => {
            if(data) {
                res.status(202).json(`user with id ${id} got deleted`)
            } else {
                res.status(404).json( `The user with the specified id ${id} does not exist.`)
            }
        })
        .catch(error => {
            console.log(error.message)
        })

});

server.post('/api/users', (req, res) => {

    const {name, bio} = req.body;
    console.log(req.body);

    if(!name || !bio) {
        res
            .status(400)
            .json( "Please provide name and bio for the user.");
    } else {
    insert(req.body)
        .then( users => {
            res.status(201).json(users)
    })
        .catch(error => {
            res.status(500).json("There was an error while saving the user to the database", error);
        })
}
});

const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));