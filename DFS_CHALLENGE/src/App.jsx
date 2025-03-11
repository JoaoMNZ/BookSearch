import React from 'react';
import Search from './assets/search.svg?react'
import Book from './assets/book.svg?react'
import Author from './assets/author.svg?react'
import Link from './assets/link.svg?react'
import Left from './assets/left.svg?react'
import Right from './assets/right.svg?react'
import './App.css'

function App() {
  const [input, setInput] = React.useState("");
  const [book, setBook] = React.useState("");
  const [page, dispatch] = React.useReducer(handleClick, 0)
  const [datas, setDatas] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [pagination, setPagination] = React.useState(true);
  console.log(pagination);

  React.useEffect(() => {
    async function handlePagination(){
      try{
        setPagination(true);
        setLoading(true);
        setError(null);
        setDatas(null);
        const response = await fetch(`https://hn.algolia.com/api/v1/search?query=${book}&page=${page}`);
        const json = await response.json();
        if(!response.ok) throw new Error(json.message)
        console.log(json.hits.length);
        if(!json.hits.length) setPagination(false);
        setDatas(json.hits);
      }catch(error){
        setDatas(null)
        setError(error.message);
      }finally{
        setLoading(false);
      }
    }
    book && handlePagination();
  },[page, book])

  function handleClick(currentPage, action){
    switch (action.type) {
      case 'increment':
        return currentPage + 1; 
      case 'decrement':
        return currentPage - 1;
      case 'reset':
        return 0;
      default:
        return currentPage;
    }
  }

  async function handleSubmit(event){
    event.preventDefault();
    setBook(input);
    setInput("");
    dispatch({type: 'reset'})
  }

  return (
    <>
      <main className='container'>
        <h1 className='title'>Library</h1>
        <p className='subtitle'>Find books based on their name.</p>
        <form onSubmit={handleSubmit} className='form'>
          <input className='input' placeholder='The name of the book' type="text" id='book' name='book' value={input} onChange={({target}) => setInput(target.value)}/>
          {loading ? <button className='button' disabled>{<Search/>}</button> : <button className='button'>{<Search/>}</button>}
          {error && <p className='error'>{error}</p>}
        </form>
      </main>
      {datas && 
      <section className='container'>
        <ul className='cardContainer'>
          {datas && datas.map((data) => 
          <li key={data.objectID} className='card animeLeft'>
            <p className='cardText'><Author/> {data.author}</p> 
            <p className='cardText'><Book/> {data.title}</p> 
            <a target='_blank' href={data.url} className='cardText'><Link/> View this book</a>
          </li>)}
        </ul>
        <div className='pagination'>
            {page === 0 ? <button disabled onClick={() => dispatch({type: 'decrement'})} className='paginationItem'><Left/></button>
            : <button onClick={() => dispatch({type: 'decrement'})} className='paginationItem'><Left/></button>}
            <div className='paginationItem'>{page}</div>
            {pagination ? <button onClick={() => dispatch({type: 'increment'})} className='paginationItem'><Right/></button>
            : <button disabled onClick={() => dispatch({type: 'increment'})} className='paginationItem'><Right/></button>}
        </div>
      </section>}
    </>
  );
};

export default App
