import { useEffect, useState} from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  // 내용 저장
  const [viewContent , setViewContent] = useState([]);

  // select query문 불러오기.
  useEffect(()=>{
    Axios.get('http://localhost:8000/api/get').then((response)=>{
      setViewContent(response.data);
    })
  },[viewContent])

  // 화면 표시부분
  return (
    <div className="App">
      <h1>Movie Review</h1>
      <div className='movie-container'>
        {viewContent.map(element =>
          <div className="title">
            <h2>{element.title}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;