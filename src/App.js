import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:item, amount:amount})
    axios.post(URL + 'add.php', json, {
      headers: {
        'Content-Type' : 'applications/json'
      }
    })
    .then((response) => {
      setItems(items => [...items,response.data]);
      setItem('');
      setAmount('');
    }).catch (error => {
      alert(error.response.data.error)
    });
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      })
  }

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  },[]);

  return (
    <div className='container'>
      <h3>Ostoslista</h3>
      <form onSubmit={save}>
        <label>Uusi tuote</label>
        <input value={item} placeholder='item' onChange={e => setItem(e.target.value)} />
        <input value={amount} placeholder='amount' onChange={e => setAmount(e.target.value)} />
        <button>Tallenna</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            <span className='description'>{item.description}</span>
            <span className='amount'>{item.amount}</span>
            <a href='#' className='delete' onClick={() => remove(item.id)}>
            Poista</a> 
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
