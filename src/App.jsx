// App.jsx
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const URL =
  'https://todolist-fc903-default-rtdb.europe-west1.firebasedatabase.app/books';

function App() {
  const [books, setBooks] = useState([]);

  const fetchItems = () => {
    fetch(`${URL}.json`)
      .then(response => response.json())
      .then(data => {
        if (!data) {
          setBooks([]);
          return;
        }

        const booksWithIds = Object.entries(data).map(([id, book]) => ({
          id,
          ...book
        }));

        setBooks(booksWithIds);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addBook = (newBook) => {
    fetch(`${URL}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    })
      .then(() => fetchItems())
      .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`${URL}/${id}.json`, {
      method: 'DELETE'
    })
      .then(() => fetchItems())
      .catch(err => console.error(err));
  };

const colDefs = [
  { field: 'title', sortable: true, filter: true, flex: 2, minWidth: 150 },
  { field: 'author', sortable: true, filter: true, flex: 1.5, minWidth: 120 },
  { field: 'year', sortable: true, filter: true, flex: 0.8, minWidth: 80 },
  { field: 'isbn', sortable: true, filter: true, flex: 1.5, minWidth: 140 },
  { field: 'price', sortable: true, filter: true, flex: 1, minWidth: 90 },
  {
    headerName: '',
    field: 'id',
    cellRenderer: params => (
      <IconButton
        onClick={() => deleteBook(params.value)}
        size="small"
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    )
  }
];

  return (
    <>
    <div
    style={{
        marginTop: 10,
        marginBottom: 10
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      </div>
      <div
      style={{
        margin: 'auto',
        backgroundColor: 'blue',
        width: 100,
        borderRadius: 10
        
        
      }}>
      <AddBook addBook={addBook} />
      </div>

<div
  className="ag-theme-quartz"
  style={{
    marginTop: 10,
    height: 1000,
    width: 1500,
    maxWidth: '100%',
  }}
>
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
        />
      </div>
    </>
  );
}

export default App;